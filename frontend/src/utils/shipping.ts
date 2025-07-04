type ShippingZone = 'Manila' | 'Luzon' | 'Visayas' | 'Mindanao' | 'Island';

interface RateBracket {
  max: number; 
  fees: Record<ShippingZone, number>;
}

// 1. Shipping rate table
const rateTable: RateBracket[] = [
  { max: 0.5, fees: { Manila: 85, Luzon: 95, Visayas: 100, Mindanao: 105, Island: 115 } },
  { max: 1,   fees: { Manila: 115, Luzon: 165, Visayas: 180, Mindanao: 195, Island: 205 } },
  { max: 3,   fees: { Manila: 155, Luzon: 190, Visayas: 200, Mindanao: 220, Island: 230 } },
  { max: 4,   fees: { Manila: 225, Luzon: 280, Visayas: 300, Mindanao: 330, Island: 340 } },
  { max: 5,   fees: { Manila: 305, Luzon: 370, Visayas: 400, Mindanao: 440, Island: 450 } },
  { max: 6,   fees: { Manila: 455, Luzon: 465, Visayas: 500, Mindanao: 550, Island: 560 } },
];

// 2. Region-to-zone mapper (no region numbers)
function getShippingZone(region: string): ShippingZone {
  const manilaRegions = ['NCR'];
  const luzonRegions = ['Ilocos Region', 'CAR', 'Cagayan Valley', 'Central Luzon', 'CALABARZON', 'MIMAROPA', 'Bicol Region'];
  const visayasRegions = ['Western Visayas', 'Central Visayas', 'Eastern Visayas'];
  const mindanaoRegions = ['Zamboanga Peninsula', 'Northern Mindanao', 'Davao Region', 'SOCCSKSARGEN', 'Caraga', 'BARMM'];

  if (manilaRegions.includes(region)) return 'Manila';
  if (luzonRegions.includes(region)) return 'Luzon';
  if (visayasRegions.includes(region)) return 'Visayas';
  if (mindanaoRegions.includes(region)) return 'Mindanao';
  return 'Island'; // fallback
}

// 3. Main shipping fee calculator (weight only)
export function calculateShippingFee(weightKg: number, region: string): number | null {
  const zone = getShippingZone(region);
  const bracket = rateTable.find(b => weightKg <= b.max);
  return bracket ? bracket.fees[zone] : null; // null if over 6kg
}
