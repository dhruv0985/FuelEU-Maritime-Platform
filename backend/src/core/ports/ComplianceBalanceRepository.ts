import { ComplianceBalance, AdjustedComplianceBalance } from '../domain/ComplianceBalance';

export interface ComplianceBalanceRepository {
  findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
  create(cb: Omit<ComplianceBalance, 'id' | 'createdAt'>): Promise<ComplianceBalance>;
  update(id: string, cb: Partial<ComplianceBalance>): Promise<ComplianceBalance>;
  getAdjustedCb(shipId: string, year: number): Promise<AdjustedComplianceBalance | null>;
}

