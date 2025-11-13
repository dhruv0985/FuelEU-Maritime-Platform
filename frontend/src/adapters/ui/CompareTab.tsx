import { useRouteComparison } from '../../core/application/useRouteComparison';
import { HttpApiClient } from '../infrastructure/HttpApiClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const apiClient = new HttpApiClient();
const TARGET_INTENSITY = 89.3368;

export function CompareTab() {
  const { comparisons, loading, error } = useRouteComparison(apiClient);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const chartData = comparisons.map((comp) => ({
    routeId: comp.route.routeId,
    baseline: comp.baseline.ghgIntensity,
    comparison: comp.route.ghgIntensity,
    target: TARGET_INTENSITY,
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Compare Routes</h2>
      <p className="mb-4 text-gray-600">Target Intensity: {TARGET_INTENSITY} gCO₂e/MJ</p>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="routeId" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="baseline" fill="#8884d8" name="Baseline" />
            <Bar dataKey="comparison" fill="#82ca9d" name="Comparison" />
            <Bar dataKey="target" fill="#ffc658" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Route ID</th>
              <th className="border border-gray-300 px-4 py-2">Baseline GHG Intensity</th>
              <th className="border border-gray-300 px-4 py-2">Comparison GHG Intensity</th>
              <th className="border border-gray-300 px-4 py-2">% Difference</th>
              <th className="border border-gray-300 px-4 py-2">Compliant</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((comp) => (
              <tr key={comp.route.id}>
                <td className="border border-gray-300 px-4 py-2">{comp.route.routeId}</td>
                <td className="border border-gray-300 px-4 py-2">{comp.baseline.ghgIntensity.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{comp.route.ghgIntensity.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {comp.percentDiff > 0 ? '+' : ''}
                  {comp.percentDiff.toFixed(2)}%
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {comp.compliant ? (
                    <span className="text-green-600 font-semibold">✅ Compliant</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ Non-Compliant</span>
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

