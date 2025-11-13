import { Route } from '../domain/Route';

export interface RouteRepository {
  findAll(): Promise<Route[]>;
  findById(id: string): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findByYear(year: number): Promise<Route[]>;
  findByVesselType(vesselType: string): Promise<Route[]>;
  findByFuelType(fuelType: string): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  findBaseline(): Promise<Route | null>;
  create(route: Omit<Route, 'id'>): Promise<Route>;
  update(id: string, route: Partial<Route>): Promise<Route>;
}

