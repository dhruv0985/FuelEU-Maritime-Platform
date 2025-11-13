import { useState, useEffect } from 'react';
import type { ApiClient } from '../ports/ApiClient';
import type { RouteComparison } from '../domain/Route';

export function useRouteComparison(apiClient: ApiClient) {
  const [comparisons, setComparisons] = useState<RouteComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparisons = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getRouteComparison();
        setComparisons(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisons();
  }, [apiClient]);

  return { comparisons, loading, error };
}

