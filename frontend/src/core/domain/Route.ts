export interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
  shipId?: string;
}

export interface RouteComparison {
  route: Route;
  baseline: Route;
  percentDiff: number;
  compliant: boolean;
}

