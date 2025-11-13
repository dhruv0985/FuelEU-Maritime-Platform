import axios from 'axios';
import type { ApiClient } from '../../core/ports/ApiClient';
import type { Route, RouteComparison } from '../../core/domain/Route';
import type { ComplianceBalance, AdjustedComplianceBalance } from '../../core/domain/ComplianceBalance';
import type { BankEntry, BankingResult, ApplyBankingResult } from '../../core/domain/Banking';
import type { PoolCreationResult } from '../../core/domain/Pool';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class HttpApiClient implements ApiClient {
  private client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async getRoutes(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]> {
    const response = await this.client.get<Route[]>('/routes', { params: filters });
    return response.data;
  }

  async setBaseline(routeId: string): Promise<Route> {
    const response = await this.client.post<Route>(`/routes/${routeId}/baseline`);
    return response.data;
  }

  async getRouteComparison(): Promise<RouteComparison[]> {
    const response = await this.client.get<RouteComparison[]>('/routes/comparison');
    return response.data;
  }

  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    const response = await this.client.get<ComplianceBalance>('/compliance/cb', {
      params: { shipId, year },
    });
    return response.data;
  }

  async getAdjustedCb(shipId: string, year: number): Promise<AdjustedComplianceBalance> {
    const response = await this.client.get<AdjustedComplianceBalance>('/compliance/adjusted-cb', {
      params: { shipId, year },
    });
    return response.data;
  }

  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const response = await this.client.get<BankEntry[]>('/banking/records', {
      params: { shipId, year },
    });
    return response.data;
  }

  async bankSurplus(shipId: string, year: number): Promise<BankingResult> {
    const response = await this.client.post<BankingResult>('/banking/bank', { shipId, year });
    return response.data;
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<ApplyBankingResult> {
    const response = await this.client.post<ApplyBankingResult>('/banking/apply', {
      shipId,
      year,
      amount,
    });
    return response.data;
  }

  async createPool(year: number, shipIds: string[]): Promise<PoolCreationResult> {
    const response = await this.client.post<PoolCreationResult>('/pools', { year, shipIds });
    return response.data;
  }
}

