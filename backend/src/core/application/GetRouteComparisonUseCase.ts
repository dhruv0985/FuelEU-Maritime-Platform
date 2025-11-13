import { RouteRepository } from '../ports/RouteRepository';
import { compareRouteToBaseline, RouteComparison } from '../domain/RouteComparison';

export class GetRouteComparisonUseCase {
  constructor(private routeRepository: RouteRepository) {}

  async execute(): Promise<RouteComparison[]> {
    const baseline = await this.routeRepository.findBaseline();
    if (!baseline) {
      throw new Error('No baseline route found');
    }

    const allRoutes = await this.routeRepository.findAll();
    const comparisons: RouteComparison[] = [];

    for (const route of allRoutes) {
      if (route.id !== baseline.id) {
        comparisons.push(compareRouteToBaseline(route, baseline));
      }
    }

    return comparisons;
  }
}

