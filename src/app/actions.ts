'use server';

import { getMotHistory, validateRegistration } from '@/lib/dvla';
import { analyseMotHistory, MotAnalysisResult } from '@/lib/analysis';
import { VehicleMotData } from '@/lib/mock-data';

export interface CheckVehicleResponse {
  success: boolean;
  error?: string;
  motData?: VehicleMotData;
  analysis?: MotAnalysisResult;
}

export async function checkVehicle(registration: string): Promise<CheckVehicleResponse> {
  try {
    // Validate registration format
    if (!validateRegistration(registration)) {
      return {
        success: false,
        error: 'Invalid UK registration format. Please use format like AB12 CDE or AB12CDE',
      };
    }

    // Fetch MOT history
    const motData = await getMotHistory(registration);

    if (!motData) {
      return {
        success: false,
        error: `No MOT data found for registration: ${registration.toUpperCase()}`,
      };
    }

    // Analyze with Claude
    const analysis = await analyseMotHistory(motData);

    return {
      success: true,
      motData,
      analysis,
    };
  } catch (error) {
    console.error('Error checking vehicle:', error);

    if (error instanceof Error) {
      if (error.message.includes('API')) {
        return {
          success: false,
          error: 'API error: Could not fetch data. Please try again later.',
        };
      }
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
