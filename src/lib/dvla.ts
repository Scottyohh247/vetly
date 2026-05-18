import { MOCK_MOT_DATA, VehicleMotData } from './mock-data';

function isPlaceholderValue(value: string | undefined): boolean {
  return !value || value.trim() === '' || value.includes('your_');
}

function hasValidDvlaCredentials(): boolean {
  return [
    process.env.DVLA_MOT_API_KEY,
    process.env.DVLA_CLIENT_ID,
    process.env.DVLA_CLIENT_SECRET,
    process.env.DVLA_TOKEN_URL,
  ].every((value) => !isPlaceholderValue(value));
}

export async function getMotHistory(registration: string): Promise<VehicleMotData | null> {
  const cleanReg = registration.toUpperCase().replace(/\s/g, '');
  const mockMode = process.env.USE_MOCK_MOT_DATA === 'true' || !hasValidDvlaCredentials();

  if (mockMode) {
    if (MOCK_MOT_DATA[cleanReg]) {
      return MOCK_MOT_DATA[cleanReg];
    }
    return null;
  }

  try {
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
        return null;
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
  const regRegex = /^[A-Z]{2}\d{2}\s?[A-Z]{3}$/;
  return regRegex.test(reg.toUpperCase());
}
