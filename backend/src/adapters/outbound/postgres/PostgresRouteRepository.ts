import { Pool } from 'pg';
import { RouteRepository } from '../../../core/ports/RouteRepository';
import { Route } from '../../../core/domain/Route';
import { v4 as uuidv4 } from 'uuid';

export class PostgresRouteRepository implements RouteRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<Route[]> {
    const result = await this.db.query('SELECT * FROM routes ORDER BY year, route_id');
    return result.rows.map(this.mapRowToRoute);
  }

  async findById(id: string): Promise<Route | null> {
    const result = await this.db.query('SELECT * FROM routes WHERE id = $1', [id]);
    return result.rows.length > 0 ? this.mapRowToRoute(result.rows[0]) : null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const result = await this.db.query('SELECT * FROM routes WHERE route_id = $1', [routeId]);
    return result.rows.length > 0 ? this.mapRowToRoute(result.rows[0]) : null;
  }

  async findByYear(year: number): Promise<Route[]> {
    const result = await this.db.query('SELECT * FROM routes WHERE year = $1', [year]);
    return result.rows.map(this.mapRowToRoute);
  }

  async findByVesselType(vesselType: string): Promise<Route[]> {
    const result = await this.db.query('SELECT * FROM routes WHERE vessel_type = $1', [vesselType]);
    return result.rows.map(this.mapRowToRoute);
  }

  async findByFuelType(fuelType: string): Promise<Route[]> {
    const result = await this.db.query('SELECT * FROM routes WHERE fuel_type = $1', [fuelType]);
    return result.rows.map(this.mapRowToRoute);
  }

  async setBaseline(routeId: string): Promise<Route> {
    const route = await this.findByRouteId(routeId);
    if (!route) {
      throw new Error(`Route with routeId ${routeId} not found`);
    }

    // Unset all other baselines for the same year
    await this.db.query(
      'UPDATE routes SET is_baseline = FALSE WHERE year = $1 AND id != $2',
      [route.year, route.id]
    );

    // Set this route as baseline
    await this.db.query('UPDATE routes SET is_baseline = TRUE WHERE id = $1', [route.id]);

    return (await this.findById(route.id))!;
  }

  async findBaseline(): Promise<Route | null> {
    const result = await this.db.query('SELECT * FROM routes WHERE is_baseline = TRUE LIMIT 1');
    return result.rows.length > 0 ? this.mapRowToRoute(result.rows[0]) : null;
  }

  async create(route: Omit<Route, 'id'>): Promise<Route> {
    const id = uuidv4();
    await this.db.query(
      `INSERT INTO routes (id, route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, total_emissions, is_baseline, ship_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        id,
        route.routeId,
        route.vesselType,
        route.fuelType,
        route.year,
        route.ghgIntensity,
        route.fuelConsumption,
        route.distance,
        route.totalEmissions,
        route.isBaseline,
        route.shipId || null,
      ]
    );
    return (await this.findById(id))!;
  }

  async update(id: string, route: Partial<Route>): Promise<Route> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (route.routeId !== undefined) {
      updates.push(`route_id = $${paramIndex++}`);
      values.push(route.routeId);
    }
    if (route.vesselType !== undefined) {
      updates.push(`vessel_type = $${paramIndex++}`);
      values.push(route.vesselType);
    }
    if (route.fuelType !== undefined) {
      updates.push(`fuel_type = $${paramIndex++}`);
      values.push(route.fuelType);
    }
    if (route.year !== undefined) {
      updates.push(`year = $${paramIndex++}`);
      values.push(route.year);
    }
    if (route.ghgIntensity !== undefined) {
      updates.push(`ghg_intensity = $${paramIndex++}`);
      values.push(route.ghgIntensity);
    }
    if (route.fuelConsumption !== undefined) {
      updates.push(`fuel_consumption = $${paramIndex++}`);
      values.push(route.fuelConsumption);
    }
    if (route.distance !== undefined) {
      updates.push(`distance = $${paramIndex++}`);
      values.push(route.distance);
    }
    if (route.totalEmissions !== undefined) {
      updates.push(`total_emissions = $${paramIndex++}`);
      values.push(route.totalEmissions);
    }
    if (route.isBaseline !== undefined) {
      updates.push(`is_baseline = $${paramIndex++}`);
      values.push(route.isBaseline);
    }
    if (route.shipId !== undefined) {
      updates.push(`ship_id = $${paramIndex++}`);
      values.push(route.shipId);
    }

    if (updates.length === 0) {
      return (await this.findById(id))!;
    }

    values.push(id);
    await this.db.query(
      `UPDATE routes SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    return (await this.findById(id))!;
  }

  private mapRowToRoute(row: any): Route {
    return {
      id: row.id,
      routeId: row.route_id,
      vesselType: row.vessel_type,
      fuelType: row.fuel_type,
      year: row.year,
      ghgIntensity: parseFloat(row.ghg_intensity),
      fuelConsumption: parseFloat(row.fuel_consumption),
      distance: parseFloat(row.distance),
      totalEmissions: parseFloat(row.total_emissions),
      isBaseline: row.is_baseline,
      shipId: row.ship_id,
    };
  }
}

