export interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // gCO₂e/MJ
  fuelConsumption: number; // tonnes
  distance: number; // km
  totalEmissions: number; // tonnes
  isBaseline: boolean;
  shipId?: string;
}

export const TARGET_INTENSITY_2025 = 89.3368; // gCO₂e/MJ (2% below 91.16)
export const ENERGY_PER_TONNE = 41000; // MJ/t

export function calculateComplianceBalance(
  ghgIntensity: number,
  fuelConsumption: number,
  targetIntensity: number = TARGET_INTENSITY_2025
): number {
  const energyInScope = fuelConsumption * ENERGY_PER_TONNE;
  return (targetIntensity - ghgIntensity) * energyInScope;
}

export function calculatePercentDifference(baseline: number, comparison: number): number {
  return ((comparison / baseline) - 1) * 100;
}

export function isCompliant(ghgIntensity: number, targetIntensity: number = TARGET_INTENSITY_2025): boolean {
  return ghgIntensity <= targetIntensity;
}

