import { useState, useEffect } from 'react';
import type { ApiClient } from '../ports/ApiClient';
import type { Route } from '../domain/Route';

export function useRoutes(apiClient: ApiClient, filters?: { vesselType?: string; fuelType?: string; year?: number }) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getRoutes(filters);
        setRoutes(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [apiClient, filters?.vesselType, filters?.fuelType, filters?.year]);

  const setBaseline = async (routeId: string) => {
    try {
      const updated = await apiClient.setBaseline(routeId);
      setRoutes((prev) => prev.map((r) => (r.id === updated.id ? updated : { ...r, isBaseline: false })));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  return { routes, loading, error, setBaseline };
}

