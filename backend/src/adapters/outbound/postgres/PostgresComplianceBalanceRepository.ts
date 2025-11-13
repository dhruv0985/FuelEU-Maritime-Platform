import { Pool } from 'pg';
import { ComplianceBalanceRepository } from '../../../core/ports/ComplianceBalanceRepository';
import { ComplianceBalance, AdjustedComplianceBalance } from '../../../core/domain/ComplianceBalance';
import { v4 as uuidv4 } from 'uuid';

export class PostgresComplianceBalanceRepository implements ComplianceBalanceRepository {
  constructor(private db: Pool) {}

  async findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const result = await this.db.query(
      'SELECT * FROM ship_compliance WHERE ship_id = $1 AND year = $2',
      [shipId, year]
    );
    return result.rows.length > 0 ? this.mapRowToCb(result.rows[0]) : null;
  }

  async create(cb: Omit<ComplianceBalance, 'id' | 'createdAt'>): Promise<ComplianceBalance> {
    const id = uuidv4();
    await this.db.query(
      'INSERT INTO ship_compliance (id, ship_id, year, cb_gco2eq) VALUES ($1, $2, $3, $4)',
      [id, cb.shipId, cb.year, cb.cbGco2eq]
    );
    return (await this.findByShipAndYear(cb.shipId, cb.year))!;
  }

  async update(id: string, cb: Partial<ComplianceBalance>): Promise<ComplianceBalance> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (cb.shipId !== undefined) {
      updates.push(`ship_id = $${paramIndex++}`);
      values.push(cb.shipId);
    }
    if (cb.year !== undefined) {
      updates.push(`year = $${paramIndex++}`);
      values.push(cb.year);
    }
    if (cb.cbGco2eq !== undefined) {
      updates.push(`cb_gco2eq = $${paramIndex++}`);
      values.push(cb.cbGco2eq);
    }

    if (updates.length > 0) {
      values.push(id);
      await this.db.query(
        `UPDATE ship_compliance SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
        values
      );
    }

    const result = await this.db.query('SELECT * FROM ship_compliance WHERE id = $1', [id]);
    return this.mapRowToCb(result.rows[0]);
  }

  async getAdjustedCb(shipId: string, year: number): Promise<AdjustedComplianceBalance | null> {
    const base = await this.findByShipAndYear(shipId, year);
    if (!base) {
      return null;
    }

    // Get banked amount
    const bankResult = await this.db.query(
      'SELECT COALESCE(SUM(amount_gco2eq), 0) as total FROM bank_entries WHERE ship_id = $1 AND year = $2',
      [shipId, year]
    );
    const totalBanked = parseFloat(bankResult.rows[0]?.total || '0');

    // Get pool adjustment
    const poolResult = await this.db.query(
      `SELECT pm.cb_after - pm.cb_before as adjustment
       FROM pool_members pm
       JOIN pools p ON pm.pool_id = p.id
       WHERE pm.ship_id = $1 AND p.year = $2
       LIMIT 1`,
      [shipId, year]
    );
    const poolAdjustment = poolResult.rows.length > 0
      ? parseFloat(poolResult.rows[0].adjustment)
      : 0;

    const adjustedCbGco2eq = base.cbGco2eq - totalBanked + poolAdjustment;

    return {
      ...base,
      adjustedCbGco2eq,
    };
  }

  private mapRowToCb(row: any): ComplianceBalance {
    return {
      id: row.id,
      shipId: row.ship_id,
      year: row.year,
      cbGco2eq: parseFloat(row.cb_gco2eq),
      createdAt: new Date(row.created_at),
    };
  }
}

