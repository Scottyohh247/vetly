import Anthropic from '@anthropic-ai/sdk';
import { VehicleMotData } from './mock-data';

export interface MotAnalysisResult {
  verdict: 'BUY' | 'CAUTION' | 'WALK_AWAY';
  confidenceScore: number;
  summary: string;
  keyFindings: string[];
  redFlags: string[];
  greenFlags: string[];
  suggestedQuestions: string[];
  priceAdjustment: string;
  note?: string;
}

function isPlaceholderValue(value: string | undefined): boolean {
  return !value || value.trim() === '' || value.includes('your_');
}

function hasValidAnthropicKey(): boolean {
  return !isPlaceholderValue(process.env.ANTHROPIC_API_KEY);
}

function analyzeFallback(motData: VehicleMotData): MotAnalysisResult {
  const tests = motData.motTests.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let verdict: MotAnalysisResult['verdict'] = 'BUY';
  const redFlags: string[] = [];
  const greenFlags: string[] = [];
  const suggestedQuestions: string[] = [];

  const miles = tests.map((test) => test.mileage);
  for (let i = 1; i < miles.length; i += 1) {
    if (miles[i] < miles[i - 1]) {
      redFlags.push('Mileage appears to rollback between MOT checks.');
      verdict = 'WALK_AWAY';
      suggestedQuestions.push('Why does the mileage drop between MOT tests?');
      break;
    }
  }

  const dangerousCount = motData.motTests.reduce((count, test) => count + test.dangerousDefects.length, 0);
  if (dangerousCount > 0) {
    redFlags.push('Dangerous defects were recorded in the MOT history.');
    verdict = 'WALK_AWAY';
    suggestedQuestions.push('Has the vehicle been inspected for dangerous defects since the last MOT?');
  }

  const majorCount = motData.motTests.reduce((count, test) => count + test.majorDefects.length, 0);
  if (verdict !== 'WALK_AWAY' && majorCount > 0) {
    redFlags.push('Major defects were found in previous MOTs.');
    verdict = 'CAUTION';
    suggestedQuestions.push('Have the major issues listed on the MOT been repaired properly?');
  }

  const rustWarnings = motData.motTests.flatMap((test) =>
    [...test.advisories, ...test.minorDefects, ...test.majorDefects].filter((item) =>
      /sill|subframe|chassis|jacking point|corroded|rust/i.test(item.text)
    )
  );
  if (rustWarnings.length > 0) {
    redFlags.push('Rust or corrosion concerns appear in the MOT history.');
    if (verdict !== 'WALK_AWAY') verdict = 'CAUTION';
    suggestedQuestions.push('Can you show evidence that rust has been professionally assessed and repaired?');
  }

  if (verdict === 'BUY') {
    greenFlags.push('No major or dangerous defects found in the recorded MOT history.');
    greenFlags.push('All sample MOTs are present and mostly passing.');
  }

  if (redFlags.length === 0 && greenFlags.length === 0) {
    greenFlags.push('The MOT history appears clean for the sample data.');
  }

  const priceAdjustment =
    verdict === 'BUY'
      ? 'Market value appears reasonable; no large deductions indicated by MOT history.'
      : verdict === 'CAUTION'
      ? 'Consider a moderate price reduction to cover potential repairs and inspections.'
      : 'Significant price reduction advised or avoid purchase until issues are resolved.';

  return {
    verdict,
    confidenceScore: verdict === 'BUY' ? 82 : verdict === 'CAUTION' ? 66 : 48,
    summary:
      verdict === 'BUY'
        ? 'The MOT history shows mostly normal wear and no immediate deal-breakers in the available records.'
        : verdict === 'CAUTION'
        ? 'There are some concerns in the MOT history worth verifying before purchase.'
        : 'The history contains serious red flags that suggest you should walk away unless everything is fixed.',
    keyFindings: [...new Set([...redFlags, ...greenFlags])],
    redFlags,
    greenFlags,
    suggestedQuestions,
    priceAdjustment,
    note: 'Analysis is generated locally because Anthropic is not configured or the API key is unavailable.',
  };
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert UK vehicle inspector with 20+ years of experience evaluating used vehicles based on MOT history. Your role is to analyze MOT records and provide clear, actionable verdicts for buyers considering a purchase.

CRITICAL ISSUES TO DETECT:
1. **Mileage Rollback/Clocking**: Any test showing lower mileage than the previous test is a major red flag. Always flag this - it's fraud.
2. **Structural Rust Progression**: Track sill, subframe, chassis mounting, jacking point corrosion across years. Flag escalation from "corroded but rigidity not significantly reduced" to "significantly reducing structural strength".
3. **Recurring Failures**: Same fault category failing year after year shows chronic neglect.
4. **Dangerous Defects**: Any "Do Not Drive" defects ever appearing are serious. Multiple failures suggest systematic abuse.
5. **Cover-up Evidence**: Sudden "underseal" advisory, "repair covered in underseal" phrasing suggests repair attempts to hide corrosion.
6. **Missing MOTs/Gaps**: Unexplained gaps > 13 months are concerning (roadworthiness question).
7. **Emissions Failures**: Modern vehicles failing emissions = engine problems.
8. **Chronic Neglect**: 10+ defects in a single fail suggests general disregard for maintenance.

VERDICT RULES:
- **BUY**: Clean history or only minor, isolated issues. Mostly passes, normal wear for age/mileage.
- **CAUTION**: Some concerns (recurring minor issues, one major defect, above-average defects) but potentially fixable. Recommend inspection.
- **WALK_AWAY**: Clocking, structural rust progression, recurring dangerous defects, evidence of cover-ups, or systemic abuse pattern.

TONE: Trustworthy, expert, direct. Don't be overly cautious—minor advisories on an old vehicle are normal. But be clear about genuine risks.

Return ONLY valid JSON, no markdown, no extra text.`;

export async function analyseMotHistory(motData: VehicleMotData): Promise<MotAnalysisResult> {
  if (!hasValidAnthropicKey()) {
    return analyzeFallback(motData);
  }

  const motSummary = formatMotDataForAnalysis(motData);

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze this vehicle's MOT history and provide a structured JSON response:\n\n${motSummary}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    let result: MotAnalysisResult;
    try {
      result = JSON.parse(content.text);
    } catch (error) {
      console.error('Failed to parse Claude response:', content.text);
      return analyzeFallback(motData);
    }

    validateAnalysisResult(result);
    return result;
  } catch (error) {
    console.error('Anthropic analysis failed, falling back to local analysis:', error);
    return analyzeFallback(motData);
  }
}

function formatMotDataForAnalysis(motData: VehicleMotData): string {
  const tests = motData.motTests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let summary = `**Vehicle**: ${motData.make} ${motData.model} (${motData.registrationNumber})\n`;
  summary += `**Fuel Type**: ${motData.fuelType}\n`;
  summary += `**MOT Tests**: ${tests.length}\n\n`;

  summary += '**MOT History (most recent first)**:\n';

  tests.forEach((test, index) => {
    const mileage = test.mileage.toLocaleString();
    summary += `\n${index + 1}. ${test.date} - Mileage: ${mileage} - Result: ${test.result}\n`;

    if (test.advisories.length > 0) {
      summary += '   Advisories:\n';
      test.advisories.forEach((item) => {
        summary += `   - ${item.text}\n`;
      });
    }

    if (test.minorDefects.length > 0) {
      summary += '   Minor Defects:\n';
      test.minorDefects.forEach((item) => {
        summary += `   - ${item.text}\n`;
      });
    }

    if (test.majorDefects.length > 0) {
      summary += '   Major Defects:\n';
      test.majorDefects.forEach((item) => {
        summary += `   - ${item.text}\n`;
      });
    }

    if (test.dangerousDefects.length > 0) {
      summary += '   Dangerous Defects:\n';
      test.dangerousDefects.forEach((item) => {
        summary += `   - ${item.text}\n`;
      });
    }
  });

  return summary;
}

function validateAnalysisResult(result: unknown): asserts result is MotAnalysisResult {
  if (typeof result !== 'object' || result === null) {
    throw new Error('Analysis result must be an object');
  }

  const obj = result as Record<string, unknown>;

  if (!['BUY', 'CAUTION', 'WALK_AWAY'].includes(obj.verdict as string)) {
    throw new Error('Invalid verdict');
  }

  if (typeof obj.confidenceScore !== 'number' || obj.confidenceScore < 0 || obj.confidenceScore > 100) {
    throw new Error('Invalid confidence score');
  }

  if (typeof obj.summary !== 'string') {
    throw new Error('Invalid summary');
  }

  if (!Array.isArray(obj.keyFindings) || !obj.keyFindings.every((item) => typeof item === 'string')) {
    throw new Error('Invalid keyFindings');
  }

  if (!Array.isArray(obj.redFlags) || !obj.redFlags.every((item) => typeof item === 'string')) {
    throw new Error('Invalid redFlags');
  }

  if (!Array.isArray(obj.greenFlags) || !obj.greenFlags.every((item) => typeof item === 'string')) {
    throw new Error('Invalid greenFlags');
  }

  if (!Array.isArray(obj.suggestedQuestions) || !obj.suggestedQuestions.every((item) => typeof item === 'string')) {
    throw new Error('Invalid suggestedQuestions');
  }

  if (typeof obj.priceAdjustment !== 'string') {
    throw new Error('Invalid priceAdjustment');
  }
}
