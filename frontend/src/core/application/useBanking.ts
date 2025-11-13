import { useState, useEffect } from 'react';
import type { ApiClient } from '../ports/ApiClient';
import type { ComplianceBalance } from '../domain/ComplianceBalance';
import type { BankingResult, ApplyBankingResult } from '../domain/Banking';

export function useBanking(apiClient: ApiClient, shipId: string, year: number) {
  const [cb, setCb] = useState<ComplianceBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCb = async () => {
      if (!shipId || !year) return;
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getComplianceBalance(shipId, year);
        setCb(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCb();
  }, [apiClient, shipId, year]);

  const bank = async (): Promise<BankingResult> => {
    try {
      const result = await apiClient.bankSurplus(shipId, year);
      setCb((prev) => (prev ? { ...prev, cbGco2eq: result.cbAfter } : null));
      return result;
    } catch (err) {
      throw err;
    }
  };

  const apply = async (amount: number): Promise<ApplyBankingResult> => {
    try {
      const result = await apiClient.applyBanked(shipId, year, amount);
      setCb((prev) => (prev ? { ...prev, cbGco2eq: result.cbAfter } : null));
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { cb, loading, error, bank, apply };
}

