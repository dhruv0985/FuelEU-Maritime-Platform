import { dbPool } from './connection';
import { v4 as uuidv4 } from 'uuid';

const routeIds = Array.from({ length: 5 }, () => uuidv4());

const routes = [
  {
    id: routeIds[0],
    route_id: 'R001',
    vessel_type: 'Container',
    fuel_type: 'HFO',
    year: 2024,
    ghg_intensity: 91.0,
    fuel_consumption: 5000,
    distance: 12000,
    total_emissions: 4500,
    is_baseline: true,
    ship_id: 'SHIP001',
  },
  {
    id: routeIds[1],
    route_id: 'R002',
    vessel_type: 'BulkCarrier',
    fuel_type: 'LNG',
    year: 2024,
    ghg_intensity: 88.0,
    fuel_consumption: 4800,
    distance: 11500,
    total_emissions: 4200,
    is_baseline: false,
    ship_id: 'SHIP002',
  },
  {
    id: routeIds[2],
    route_id: 'R003',
    vessel_type: 'Tanker',
    fuel_type: 'MGO',
    year: 2024,
    ghg_intensity: 93.5,
    fuel_consumption: 5100,
    distance: 12500,
    total_emissions: 4700,
    is_baseline: false,
    ship_id: 'SHIP003',
  },
  {
    id: routeIds[3],
    route_id: 'R004',
    vessel_type: 'RoRo',
    fuel_type: 'HFO',
    year: 2025,
    ghg_intensity: 89.2,
    fuel_consumption: 4900,
    distance: 11800,
    total_emissions: 4300,
    is_baseline: false,
    ship_id: 'SHIP004',
  },
  {
    id: routeIds[4],
    route_id: 'R005',
    vessel_type: 'Container',
    fuel_type: 'LNG',
    year: 2025,
    ghg_intensity: 90.5,
    fuel_consumption: 4950,
    distance: 11900,
    total_emissions: 4400,
    is_baseline: false,
    ship_id: 'SHIP005',
  },
];

async function seed() {
  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');
    
    // Clear existing data
    await client.query('DELETE FROM pool_members');
    await client.query('DELETE FROM pools');
    await client.query('DELETE FROM bank_entries');
    await client.query('DELETE FROM ship_compliance');
    await client.query('DELETE FROM routes');
    
    // Insert routes
    for (const route of routes) {
      await client.query(
        `INSERT INTO routes (id, route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, total_emissions, is_baseline, ship_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          route.id,
          route.route_id,
          route.vessel_type,
          route.fuel_type,
          route.year,
          route.ghg_intensity,
          route.fuel_consumption,
          route.distance,
          route.total_emissions,
          route.is_baseline,
          route.ship_id,
        ]
      );
    }
    
    await client.query('COMMIT');
    console.log('Seed data inserted successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await dbPool.end();
  }
}

seed().catch(console.error);

