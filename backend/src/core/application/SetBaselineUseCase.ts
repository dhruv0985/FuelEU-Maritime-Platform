import { RouteRepository } from '../ports/RouteRepository';
import { Route } from '../domain/Route';

export class SetBaselineUseCase {
  constructor(private routeRepository: RouteRepository) {}

  async execute(routeId: string): Promise<Route> {
    const route = await this.routeRepository.findByRouteId(routeId);
    if (!route) {
      throw new Error(`Route with routeId ${routeId} not found`);
    }

    // Unset all other baselines for the same year
    const allRoutes = await this.routeRepository.findAll();
    for (const r of allRoutes) {
      if (r.year === route.year && r.isBaseline && r.id !== route.id) {
        await this.routeRepository.update(r.id, { isBaseline: false });
      }
    }

    return await this.routeRepository.update(route.id, { isBaseline: true });
  }
}

