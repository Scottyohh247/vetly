export interface DefectItem {
  id: string;
  text: string;
  type: 'ADVISORY' | 'MINOR' | 'MAJOR' | 'DANGEROUS';
}

export interface MotTest {
  date: string; // ISO date string
  mileage: number;
  result: 'PASS' | 'FAIL';
  advisories: DefectItem[];
  minorDefects: DefectItem[];
  majorDefects: DefectItem[];
  dangerousDefects: DefectItem[];
}

export interface VehicleMotData {
  registrationNumber: string;
  make: string;
  model: string;
  fuelType: string;
  primaryColour: string;
  motTests: MotTest[];
}

export const MOCK_MOT_DATA: { [key: string]: VehicleMotData } = {
  'AB12CDE': {
    registrationNumber: 'AB12CDE',
    make: 'Renault',
    model: 'Trafic',
    fuelType: 'Diesel',
    primaryColour: 'White',
    motTests: [
      {
        date: '2024-09-15',
        mileage: 125400,
        result: 'PASS',
        advisories: [
          { id: 'a1', text: 'Rear fog lamp(s) not working', type: 'ADVISORY' },
        ],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2023-09-10',
        mileage: 118900,
        result: 'PASS',
        advisories: [
          { id: 'a2', text: 'Windscreen wipers - metal arm slightly corroded', type: 'ADVISORY' },
        ],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2022-08-22',
        mileage: 112000,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2021-08-18',
        mileage: 105300,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2020-07-29',
        mileage: 98700,
        result: 'PASS',
        advisories: [
          { id: 'a3', text: 'Engine oil level low', type: 'ADVISORY' },
        ],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2019-07-15',
        mileage: 91200,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2018-06-28',
        mileage: 84500,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2017-05-14',
        mileage: 77900,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
    ],
  },
  'CD34EFG': {
    registrationNumber: 'CD34EFG',
    make: 'Vauxhall',
    model: 'Vivaro',
    fuelType: 'Diesel',
    primaryColour: 'Silver',
    motTests: [
      {
        date: '2024-10-20',
        mileage: 145600,
        result: 'FAIL',
        advisories: [],
        minorDefects: [
          { id: 'm1', text: 'Nearside sill corroded but not resulting in loss of rigidity', type: 'MINOR' },
        ],
        majorDefects: [
          { id: 'mj1', text: 'Brake pad thickness below 1.5mm on nearside front wheel', type: 'MAJOR' },
        ],
        dangerousDefects: [],
      },
      {
        date: '2023-10-12',
        mileage: 95200,
        result: 'PASS',
        advisories: [
          { id: 'a4', text: 'Nearside sill corroded but rigidity not significantly reduced', type: 'ADVISORY' },
          { id: 'a5', text: 'Structural rust visible on rear wheel arch', type: 'ADVISORY' },
        ],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2022-10-05',
        mileage: 58300,
        result: 'PASS',
        advisories: [
          { id: 'a6', text: 'Minor surface rust on nearside sill', type: 'ADVISORY' },
        ],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2021-09-18',
        mileage: 52100,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
    ],
  },
  'EF56GHI': {
    registrationNumber: 'EF56GHI',
    make: 'Mercedes-Benz',
    model: 'Vito',
    fuelType: 'Diesel',
    primaryColour: 'Black',
    motTests: [
      {
        date: '2024-11-10',
        mileage: 98500,
        result: 'FAIL',
        advisories: [],
        minorDefects: [],
        majorDefects: [
          { id: 'mj2', text: 'Brake pads worn to 1.2mm', type: 'MAJOR' },
          { id: 'mj3', text: 'Offside front suspension arm excessively worn', type: 'MAJOR' },
        ],
        dangerousDefects: [
          { id: 'd1', text: 'Nearside front lower suspension arm ball joint likely to detach', type: 'DANGEROUS' },
          { id: 'd2', text: 'Brake hydraulic line corroded and leaking', type: 'DANGEROUS' },
        ],
      },
      {
        date: '2023-11-08',
        mileage: 96800,
        result: 'FAIL',
        advisories: [],
        minorDefects: [],
        majorDefects: [
          { id: 'mj4', text: 'Brake pad thickness below 1.5mm', type: 'MAJOR' },
        ],
        dangerousDefects: [
          { id: 'd3', text: 'Nearside brake pipe corroded and cracked', type: 'DANGEROUS' },
        ],
      },
      {
        date: '2022-10-20',
        mileage: 95100,
        result: 'FAIL',
        advisories: [],
        minorDefects: [],
        majorDefects: [
          { id: 'mj5', text: 'Brake pads worn excessively', type: 'MAJOR' },
          { id: 'mj6', text: 'Front lower suspension arm ball joint excessively worn', type: 'MAJOR' },
          { id: 'mj7', text: 'Engine oil pressure warning light illuminated', type: 'MAJOR' },
        ],
        dangerousDefects: [
          { id: 'd4', text: 'Nearside rear lower suspension arm ball joint likely to detach', type: 'DANGEROUS' },
        ],
      },
      {
        date: '2021-09-15',
        mileage: 94500,
        result: 'PASS',
        advisories: [
          { id: 'a7', text: 'Brake pad approaching minimum thickness', type: 'ADVISORY' },
          { id: 'a8', text: 'Suspension components showing signs of wear', type: 'ADVISORY' },
        ],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
    ],
  },
  'GH78IJK': {
    registrationNumber: 'GH78IJK',
    make: 'Ford',
    model: 'Transit',
    fuelType: 'Diesel',
    primaryColour: 'White',
    motTests: [
      {
        date: '2024-09-02',
        mileage: 180000,
        result: 'FAIL',
        advisories: [
          { id: 'g1', text: 'Brake pipes corroded', type: 'ADVISORY' },
          { id: 'g2', text: 'Rear tyre wear approaching limit', type: 'ADVISORY' },
        ],
        minorDefects: [
          { id: 'g3', text: 'Front position lamp not working', type: 'MINOR' },
        ],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2023-08-30',
        mileage: 170200,
        result: 'PASS',
        advisories: [
          { id: 'g4', text: 'Nearside hydraulic pipe surface corrosion', type: 'ADVISORY' },
          { id: 'g5', text: 'Tyre wear slightly uneven', type: 'ADVISORY' },
        ],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2022-08-24',
        mileage: 160100,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2021-08-19',
        mileage: 150300,
        result: 'PASS',
        advisories: [
          { id: 'g6', text: 'Tyre tread depth low on one rear tyre', type: 'ADVISORY' },
        ],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2020-07-22',
        mileage: 139800,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2019-07-18',
        mileage: 129500,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2018-06-21',
        mileage: 118000,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2017-05-14',
        mileage: 106300,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
    ],
  },
  'IJ90KLM': {
    registrationNumber: 'IJ90KLM',
    make: 'BMW',
    model: '3 Series',
    fuelType: 'Petrol',
    primaryColour: 'Blue',
    motTests: [
      {
        date: '2024-07-12',
        mileage: 94800,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2023-06-10',
        mileage: 92000,
        result: 'FAIL',
        advisories: [],
        minorDefects: [
          { id: 'i1', text: 'Nearside position lamp not working', type: 'MINOR' },
        ],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2022-06-05',
        mileage: 89500,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2021-05-30',
        mileage: 87000,
        result: 'FAIL',
        advisories: [],
        minorDefects: [
          { id: 'i2', text: 'Offside position lamp not working', type: 'MINOR' },
        ],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2020-05-20',
        mileage: 84000,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2019-04-22',
        mileage: 80000,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
    ],
  },
  'KL12MNO': {
    registrationNumber: 'KL12MNO',
    make: 'Honda',
    model: 'CBF600',
    fuelType: 'Petrol',
    primaryColour: 'Red',
    motTests: [
      {
        date: '2024-05-10',
        mileage: 45000,
        result: 'PASS',
        advisories: [
          { id: 'k1', text: 'Chain tension and lubrication require attention', type: 'ADVISORY' },
        ],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2023-05-08',
        mileage: 43000,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2022-05-06',
        mileage: 41000,
        result: 'FAIL',
        advisories: [],
        minorDefects: [
          { id: 'k2', text: 'Rear tyre below legal tread depth', type: 'MINOR' },
        ],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2021-05-03',
        mileage: 39000,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2020-05-05',
        mileage: 36500,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2019-05-01',
        mileage: 34000,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2018-04-28',
        mileage: 32000,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
    ],
  },
  'MN34OPQ': {
    registrationNumber: 'MN34OPQ',
    make: 'Vauxhall',
    model: 'Astra',
    fuelType: 'Petrol',
    primaryColour: 'Grey',
    motTests: [
      {
        date: '2024-09-18',
        mileage: 140200,
        result: 'FAIL',
        advisories: [
          { id: 'm1', text: 'Nearside sill corrosion visible across two panels', type: 'ADVISORY' },
        ],
        minorDefects: [],
        majorDefects: [
          { id: 'm2', text: 'Brake pads worn to 1.3mm on nearside rear', type: 'MAJOR' },
        ],
        dangerousDefects: [
          { id: 'm3', text: 'Tyre cord exposed on offside rear tyre', type: 'DANGEROUS' },
        ],
      },
      {
        date: '2023-09-12',
        mileage: 132000,
        result: 'FAIL',
        advisories: [
          { id: 'm4', text: 'Nearside sill corrosion reducing stiffness', type: 'ADVISORY' },
        ],
        minorDefects: [],
        majorDefects: [
          { id: 'm5', text: 'Offside rear brake pad thickness below 1.5mm', type: 'MAJOR' },
        ],
        dangerousDefects: [],
      },
      {
        date: '2022-09-15',
        mileage: 125500,
        result: 'PASS',
        advisories: [
          { id: 'm6', text: 'Nearside ball joint showing wear', type: 'ADVISORY' },
          { id: 'm7', text: 'Nearside sill corrosion visible', type: 'ADVISORY' },
        ],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2021-09-10',
        mileage: 118100,
        result: 'FAIL',
        advisories: [
          { id: 'm8', text: 'Nearside sill corrosion visible', type: 'ADVISORY' },
        ],
        minorDefects: [],
        majorDefects: [
          { id: 'm9', text: 'Nearside front lower suspension ball joint worn', type: 'MAJOR' },
        ],
        dangerousDefects: [
          { id: 'm10', text: 'Brake pads worn to 1.4mm on offside front wheel', type: 'DANGEROUS' },
        ],
      },
      {
        date: '2020-09-05',
        mileage: 111400,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
      {
        date: '2019-08-28',
        mileage: 103900,
        result: 'PASS',
        advisories: [],
        minorDefects: [],
        majorDefects: [],
        dangerousDefects: [],
      },
    ],
  },
};
