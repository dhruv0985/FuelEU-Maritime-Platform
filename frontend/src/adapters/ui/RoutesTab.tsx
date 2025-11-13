import { useState } from 'react';
import { useRoutes } from '../../core/application/useRoutes';
import { HttpApiClient } from '../infrastructure/HttpApiClient';

const apiClient = new HttpApiClient();

export function RoutesTab() {
  const [filters, setFilters] = useState<{ vesselType?: string; fuelType?: string; year?: number }>({});
  const { routes, loading, error, setBaseline } = useRoutes(apiClient, filters);

  const handleSetBaseline = async (routeId: string) => {
    try {
      await setBaseline(routeId);
      alert('Baseline set successfully');
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    }
  };

  const uniqueVesselTypes = Array.from(new Set(routes.map((r) => r.vesselType)));
  const uniqueFuelTypes = Array.from(new Set(routes.map((r) => r.fuelType)));
  const uniqueYears = Array.from(new Set(routes.map((r) => r.year))).sort();

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Routes</h2>

      <div className="mb-4 flex gap-4">
        <select
          className="border rounded px-3 py-2"
          value={filters.vesselType || ''}
          onChange={(e) => setFilters({ ...filters, vesselType: e.target.value || undefined })}
        >
          <option value="">All Vessel Types</option>
          {uniqueVesselTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={filters.fuelType || ''}
          onChange={(e) => setFilters({ ...filters, fuelType: e.target.value || undefined })}
        >
          <option value="">All Fuel Types</option>
          {uniqueFuelTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={filters.year || ''}
          onChange={(e) => setFilters({ ...filters, year: e.target.value ? parseInt(e.target.value) : undefined })}
        >
          <option value="">All Years</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Route ID</th>
              <th className="border border-gray-300 px-4 py-2">Vessel Type</th>
              <th className="border border-gray-300 px-4 py-2">Fuel Type</th>
              <th className="border border-gray-300 px-4 py-2">Year</th>
              <th className="border border-gray-300 px-4 py-2">GHG Intensity (gCO₂e/MJ)</th>
              <th className="border border-gray-300 px-4 py-2">Fuel Consumption (t)</th>
              <th className="border border-gray-300 px-4 py-2">Distance (km)</th>
              <th className="border border-gray-300 px-4 py-2">Total Emissions (t)</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.id} className={route.isBaseline ? 'bg-yellow-50' : ''}>
                <td className="border border-gray-300 px-4 py-2">{route.routeId}</td>
                <td className="border border-gray-300 px-4 py-2">{route.vesselType}</td>
                <td className="border border-gray-300 px-4 py-2">{route.fuelType}</td>
                <td className="border border-gray-300 px-4 py-2">{route.year}</td>
                <td className="border border-gray-300 px-4 py-2">{route.ghgIntensity.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{route.fuelConsumption.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{route.distance.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{route.totalEmissions.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {route.isBaseline ? (
                    <span className="text-green-600 font-semibold">Baseline</span>
                  ) : (
                    <button
                      onClick={() => handleSetBaseline(route.routeId)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Set Baseline
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

