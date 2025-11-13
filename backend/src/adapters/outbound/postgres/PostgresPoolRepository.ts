import { Pool as DbPool } from 'pg';
import { PoolRepository } from '../../../core/ports/PoolRepository';
import { Pool, PoolMember } from '../../../core/domain/Pool';
import { v4 as uuidv4 } from 'uuid';

export class PostgresPoolRepository implements PoolRepository {
  constructor(private db: DbPool) {}

  async create(pool: Omit<Pool, 'id' | 'createdAt'>): Promise<Pool> {
    const id = uuidv4();
    await this.db.query('INSERT INTO pools (id, year) VALUES ($1, $2)', [id, pool.year]);
    const result = await this.db.query('SELECT * FROM pools WHERE id = $1', [id]);
    return this.mapRowToPool(result.rows[0]);
  }

  async addMember(member: PoolMember): Promise<void> {
    await this.db.query(
      'INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after) VALUES ($1, $2, $3, $4)',
      [member.poolId, member.shipId, member.cbBefore, member.cbAfter]
    );
  }

  async findMembersByPoolId(poolId: string): Promise<PoolMember[]> {
    const result = await this.db.query(
      'SELECT * FROM pool_members WHERE pool_id = $1',
      [poolId]
    );
    return result.rows.map(this.mapRowToPoolMember);
  }

  async findByYear(year: number): Promise<Pool[]> {
    const result = await this.db.query('SELECT * FROM pools WHERE year = $1', [year]);
    return result.rows.map(this.mapRowToPool);
  }

  private mapRowToPool(row: any): Pool {
    return {
      id: row.id,
      year: row.year,
      createdAt: new Date(row.created_at),
    };
  }

  private mapRowToPoolMember(row: any): PoolMember {
    return {
      poolId: row.pool_id,
      shipId: row.ship_id,
      cbBefore: parseFloat(row.cb_before),
      cbAfter: parseFloat(row.cb_after),
    };
  }
}

