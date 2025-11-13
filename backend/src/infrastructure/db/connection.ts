import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/fueleu_maritime',
});

