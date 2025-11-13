import { dbPool } from './connection';

const migrations = [
  `
    CREATE TABLE IF NOT EXISTS routes (
      id VARCHAR(255) PRIMARY KEY,
      route_id VARCHAR(255) UNIQUE NOT NULL,
      vessel_type VARCHAR(100) NOT NULL,
      fuel_type VARCHAR(100) NOT NULL,
      year INTEGER NOT NULL,
      ghg_intensity DECIMAL(10, 4) NOT NULL,
      fuel_consumption DECIMAL(10, 2) NOT NULL,
      distance DECIMAL(10, 2) NOT NULL,
      total_emissions DECIMAL(10, 2) NOT NULL,
      is_baseline BOOLEAN DEFAULT FALSE,
      ship_id VARCHAR(255)
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS ship_compliance (
      id VARCHAR(255) PRIMARY KEY,
      ship_id VARCHAR(255) NOT NULL,
      year INTEGER NOT NULL,
      cb_gco2eq DECIMAL(15, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(ship_id, year)
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS bank_entries (
      id VARCHAR(255) PRIMARY KEY,
      ship_id VARCHAR(255) NOT NULL,
      year INTEGER NOT NULL,
      amount_gco2eq DECIMAL(15, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS pools (
      id VARCHAR(255) PRIMARY KEY,
      year INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS pool_members (
      pool_id VARCHAR(255) NOT NULL,
      ship_id VARCHAR(255) NOT NULL,
      cb_before DECIMAL(15, 2) NOT NULL,
      cb_after DECIMAL(15, 2) NOT NULL,
      PRIMARY KEY (pool_id, ship_id),
      FOREIGN KEY (pool_id) REFERENCES pools(id) ON DELETE CASCADE
    )
  `,
];

async function migrate() {
  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');
    
    for (const migration of migrations) {
      await client.query(migration);
    }
    
    await client.query('COMMIT');
    console.log('Migrations completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await dbPool.end();
  }
}

migrate().catch(console.error);

