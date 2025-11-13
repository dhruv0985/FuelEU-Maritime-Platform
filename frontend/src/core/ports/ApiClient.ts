import type { Route, RouteComparison } from '../domain/Route';
import type { ComplianceBalance, AdjustedComplianceBalance } from '../domain/ComplianceBalance';
import type { BankEntry, BankingResult, ApplyBankingResult } from '../domain/Banking';
import type { PoolCreationResult } from '../domain/Pool';

export interface ApiClient {
  getRoutes(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getRouteComparison(): Promise<RouteComparison[]>;
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedCb(shipId: string, year: number): Promise<AdjustedComplianceBalance>;
  getBankRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(shipId: string, year: number): Promise<BankingResult>;
  applyBanked(shipId: string, year: number, amount: number): Promise<ApplyBankingResult>;
  createPool(year: number, shipIds: string[]): Promise<PoolCreationResult>;
}

