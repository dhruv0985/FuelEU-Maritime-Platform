import { useState, useEffect } from 'react';
import type { ApiClient } from '../ports/ApiClient';
import type { AdjustedComplianceBalance } from '../domain/ComplianceBalance';
import type { PoolCreationResult } from '../domain/Pool';

export function usePooling(apiClient: ApiClient, year: number, shipIds: string[]) {
  const [adjustedCbs, setAdjustedCbs] = useState<AdjustedComplianceBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdjustedCbs = async () => {
      if (shipIds.length === 0) {
        setAdjustedCbs([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await Promise.all(
          shipIds.map((shipId) => apiClient.getAdjustedCb(shipId, year))
        );
        setAdjustedCbs(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdjustedCbs();
  }, [apiClient, year, shipIds.join(',')]);

  const createPool = async (): Promise<PoolCreationResult> => {
    try {
      const result = await apiClient.createPool(year, shipIds);
      // Refresh adjusted CBs after pool creation
      const data = await Promise.all(
        shipIds.map((shipId) => apiClient.getAdjustedCb(shipId, year))
      );
      setAdjustedCbs(data);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { adjustedCbs, loading, error, createPool };
}

