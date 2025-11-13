import { RouteRepository } from '../ports/RouteRepository';
import { Route } from '../domain/Route';

export class GetRoutesUseCase {
  constructor(private routeRepository: RouteRepository) {}

  async execute(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]> {
    let routes = await this.routeRepository.findAll();

    if (filters?.vesselType) {
      routes = routes.filter(r => r.vesselType === filters.vesselType);
    }

    if (filters?.fuelType) {
      routes = routes.filter(r => r.fuelType === filters.fuelType);
    }

    if (filters?.year) {
      routes = routes.filter(r => r.year === filters.year);
    }

    return routes;
  }
}

