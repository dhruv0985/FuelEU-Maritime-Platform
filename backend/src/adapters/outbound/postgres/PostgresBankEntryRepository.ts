import { Pool } from 'pg';
import { BankEntryRepository } from '../../../core/ports/BankEntryRepository';
import { BankEntry } from '../../../core/domain/BankEntry';
import { v4 as uuidv4 } from 'uuid';

export class PostgresBankEntryRepository implements BankEntryRepository {
  constructor(private db: Pool) {}

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    const result = await this.db.query(
      'SELECT * FROM bank_entries WHERE ship_id = $1 AND year = $2 ORDER BY created_at',
      [shipId, year]
    );
    return result.rows.map(this.mapRowToBankEntry);
  }

  async getTotalBanked(shipId: string, year: number): Promise<number> {
    const result = await this.db.query(
      'SELECT COALESCE(SUM(amount_gco2eq), 0) as total FROM bank_entries WHERE ship_id = $1 AND year = $2',
      [shipId, year]
    );
    return parseFloat(result.rows[0]?.total || '0');
  }

  async create(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry> {
    const id = uuidv4();
    await this.db.query(
      'INSERT INTO bank_entries (id, ship_id, year, amount_gco2eq) VALUES ($1, $2, $3, $4)',
      [id, entry.shipId, entry.year, entry.amountGco2eq]
    );
    const result = await this.db.query('SELECT * FROM bank_entries WHERE id = $1', [id]);
    return this.mapRowToBankEntry(result.rows[0]);
  }

  async update(id: string, entry: Partial<BankEntry>): Promise<BankEntry> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (entry.shipId !== undefined) {
      updates.push(`ship_id = $${paramIndex++}`);
      values.push(entry.shipId);
    }
    if (entry.year !== undefined) {
      updates.push(`year = $${paramIndex++}`);
      values.push(entry.year);
    }
    if (entry.amountGco2eq !== undefined) {
      updates.push(`amount_gco2eq = $${paramIndex++}`);
      values.push(entry.amountGco2eq);
    }

    if (updates.length > 0) {
      values.push(id);
      await this.db.query(
        `UPDATE bank_entries SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
        values
      );
    }

    const result = await this.db.query('SELECT * FROM bank_entries WHERE id = $1', [id]);
    return this.mapRowToBankEntry(result.rows[0]);
  }

  private mapRowToBankEntry(row: any): BankEntry {
    return {
      id: row.id,
      shipId: row.ship_id,
      year: row.year,
      amountGco2eq: parseFloat(row.amount_gco2eq),
      createdAt: new Date(row.created_at),
    };
  }
}

