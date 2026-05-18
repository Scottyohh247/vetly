'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { checkVehicle, CheckVehicleResponse } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  Save,
  Home,
} from 'lucide-react';
import { VehicleMotData } from '@/lib/mock-data';
import { MotAnalysisResult } from '@/lib/analysis';

export default function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reg = searchParams.get('reg');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [motData, setMotData] = useState<VehicleMotData | null>(null);
  const [analysis, setAnalysis] = useState<MotAnalysisResult | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!reg) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: CheckVehicleResponse = await checkVehicle(reg);

        if (!response.success) {
          setError(response.error || 'Unknown error');
          return;
        }

        if (response.motData) {
          setMotData(response.motData);
        }

        if (response.analysis) {
          setAnalysis(response.analysis);
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reg, router]);

  const handleSaveToShortlist = () => {
    if (!motData || !analysis) return;

    const shortlist = JSON.parse(localStorage.getItem('shortlist') || '[]');
    const entry = {
      reg: motData.registrationNumber,
      make: motData.make,
      model: motData.model,
      verdict: analysis.verdict,
      savedAt: new Date().toISOString(),
    };

    // Check if already saved
    const exists = shortlist.some((item: (typeof entry)) => item.reg === motData.registrationNumber);
    if (!exists) {
      shortlist.push(entry);
      localStorage.setItem('shortlist', JSON.stringify(shortlist));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleCheckAnother = () => {
    router.push('/');
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'BUY':
        return <CheckCircle className="w-12 h-12 text-emerald-500" />;
      case 'CAUTION':
        return <AlertTriangle className="w-12 h-12 text-amber-500" />;
      case 'WALK_AWAY':
        return <XCircle className="w-12 h-12 text-red-500" />;
      default:
        return null;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'BUY':
        return 'success';
      case 'CAUTION':
        return 'warning';
      case 'WALK_AWAY':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/">
            <Button variant="outline" size="sm" className="mb-8">
              ← Back
            </Button>
          </Link>

          <div className="space-y-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/">
            <Button variant="outline" size="sm" className="mb-8">
              ← Back
            </Button>
          </Link>

          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="text-center mt-8">
            <Button onClick={handleCheckAnother} variant="primary">
              Try Another Vehicle
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis || !motData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Data</AlertTitle>
            <AlertDescription>Unable to load vehicle analysis data.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-8">
            <Home className="w-4 h-4 mr-2" />
            Back Home
          </Button>
        </Link>

        {/* Vehicle Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {motData.make} {motData.model}
              </h1>
              <p className="text-slate-400">
                {motData.registrationNumber} • {motData.fuelType}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveToShortlist} variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                {saved ? 'Saved!' : 'Save'}
              </Button>
            </div>
          </div>
        </div>

        {/* Verdict Section */}
        <Card className="bg-slate-900 border-slate-800 mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {getVerdictIcon(analysis.verdict)}
                <div>
                  <CardTitle className="text-white">Our Verdict</CardTitle>
                  <Badge variant={getVerdictColor(analysis.verdict)} className="mt-2">
                    {analysis.verdict}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Confidence</span>
                <span className="text-sm font-medium text-slate-300">{analysis.confidenceScore}%</span>
              </div>
              <Progress value={analysis.confidenceScore} className="h-3" />
            </div>

            {analysis.note && (
              <Alert variant="warning" className="border-amber-500/40">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>General Notice</AlertTitle>
                <AlertDescription>{analysis.note}</AlertDescription>
              </Alert>
            )}

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-100 leading-relaxed">{analysis.summary}</p>
            </div>
          </CardContent>
        </Card>

        {/* Flags and Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Red Flags */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                Red Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.redFlags.length > 0 ? (
                  analysis.redFlags.map((flag, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-200">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{flag}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-400 italic">No major red flags</li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Green Flags */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Green Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.greenFlags.length > 0 ? (
                  analysis.greenFlags.map((flag, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-200">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{flag}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-400 italic">No standout positives</li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Questions to Ask</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.suggestedQuestions.length > 0 ? (
                  analysis.suggestedQuestions.map((q, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-200">
                      <span className="font-semibold text-slate-400 flex-shrink-0">Q:</span>
                      <span>{q}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-400 italic">No specific questions</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Price Adjustment */}
        <Card className="bg-slate-900 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Price Adjustment Guide</CardTitle>
            <CardDescription>Based on MOT history findings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-100 bg-slate-800 rounded-lg p-4 border border-slate-700">
              {analysis.priceAdjustment}
            </p>
          </CardContent>
        </Card>

        {/* Full MOT History */}
        <Card className="bg-slate-900 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Full MOT History</CardTitle>
            <CardDescription>
              {motData.motTests.length} test{motData.motTests.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {motData.motTests
              .slice()
              .reverse()
              .map((test, i) => (
                <Collapsible key={i} className="border border-slate-700 rounded-lg">
                  <CollapsibleTrigger className="w-full px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between">
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-white">{test.date}</span>
                        <Badge
                          variant={test.result === 'PASS' ? 'success' : 'destructive'}
                        >
                          {test.result}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        {test.mileage.toLocaleString()} miles
                      </p>
                    </div>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </CollapsibleTrigger>

                  <CollapsibleContent className="px-4 py-3 border-t border-slate-700 bg-slate-800">
                    <div className="space-y-3 text-sm">
                      {test.advisories.length > 0 && (
                        <div>
                          <p className="font-medium text-slate-300 mb-2">Advisories</p>
                          <ul className="space-y-1 ml-4">
                            {test.advisories.map((item) => (
                              <li key={item.id} className="text-slate-300">
                                • {item.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {test.minorDefects.length > 0 && (
                        <div>
                          <p className="font-medium text-amber-300 mb-2">Minor Defects</p>
                          <ul className="space-y-1 ml-4">
                            {test.minorDefects.map((item) => (
                              <li key={item.id} className="text-amber-100">
                                • {item.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {test.majorDefects.length > 0 && (
                        <div>
                          <p className="font-medium text-orange-300 mb-2">Major Defects</p>
                          <ul className="space-y-1 ml-4">
                            {test.majorDefects.map((item) => (
                              <li key={item.id} className="text-orange-100">
                                • {item.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {test.dangerousDefects.length > 0 && (
                        <div>
                          <p className="font-medium text-red-300 mb-2">Dangerous Defects</p>
                          <ul className="space-y-1 ml-4">
                            {test.dangerousDefects.map((item) => (
                              <li key={item.id} className="text-red-100">
                                • {item.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {!test.advisories.length &&
                        !test.minorDefects.length &&
                        !test.majorDefects.length &&
                        !test.dangerousDefects.length && (
                          <p className="text-slate-400 italic">No defects or advisories</p>
                        )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button onClick={handleCheckAnother} variant="primary" size="lg">
            Check Another Vehicle
          </Button>
          <Link href="/shortlist">
            <Button variant="outline" size="lg">
              View Shortlist
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
