import { MOCK_MOT_DATA, VehicleMotData } from './mock-data';

export async function getMotHistory(registration: string): Promise<VehicleMotData | null> {
  const cleanReg = registration.toUpperCase().replace(/\s/g, '');

  // Check if we have mock data
  if (process.env.USE_MOCK_MOT_DATA === 'true' || !process.env.DVLA_MOT_API_KEY) {
    // Return mock data if available
    if (MOCK_MOT_DATA[cleanReg]) {
      return MOCK_MOT_DATA[cleanReg];
    }
    // For other regs in mock mode, return null (vehicle not found)
    return null;
  }

  try {
    // Get OAuth token
    const tokenResponse = await fetch(process.env.DVLA_TOKEN_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.DVLA_CLIENT_ID!,
        client_secret: process.env.DVLA_CLIENT_SECRET!,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get OAuth token: ${tokenResponse.statusText}`);
    }

    const tokenData = (await tokenResponse.json()) as { access_token: string };
    const bearerToken = tokenData.access_token;

    // Fetch MOT history
    const motResponse = await fetch(
      `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${cleanReg}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': process.env.DVLA_MOT_API_KEY!,
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!motResponse.ok) {
      if (motResponse.status === 404) {
        return null; // Vehicle not found
      }
      throw new Error(`Failed to fetch MOT data: ${motResponse.statusText}`);
    }

    const data = (await motResponse.json()) as VehicleMotData;
    return data;
  } catch (error) {
    console.error('Error fetching MOT history:', error);
    throw error;
  }
}

export function validateRegistration(reg: string): boolean {
  // UK registration format: AB12 CDE or AB12CDE
  // 2 letters + 2 digits + (optional space) + 3 letters
  const regRegex = /^[A-Z]{2}\d{2}\s?[A-Z]{3}$/;
  return regRegex.test(reg.toUpperCase());
}
