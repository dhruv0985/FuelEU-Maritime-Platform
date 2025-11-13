import { Route } from './Route';
import { calculatePercentDifference, isCompliant, TARGET_INTENSITY_2025 } from './Route';

export interface RouteComparison {
  route: Route;
  baseline: Route;
  percentDiff: number;
  compliant: boolean;
}

export function compareRouteToBaseline(route: Route, baseline: Route): RouteComparison {
  const percentDiff = calculatePercentDifference(baseline.ghgIntensity, route.ghgIntensity);
  const compliant = isCompliant(route.ghgIntensity, TARGET_INTENSITY_2025);
  
  return {
    route,
    baseline,
    percentDiff,
    compliant,
  };
}

