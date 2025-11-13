import { useState } from 'react';
import { usePooling } from '../../core/application/usePooling';
import { HttpApiClient } from '../infrastructure/HttpApiClient';

const apiClient = new HttpApiClient();

export function PoolingTab() {
  const [year, setYear] = useState(2024);
  const [shipIds, setShipIds] = useState<string[]>(['SHIP001', 'SHIP002']);
  const [newShipId, setNewShipId] = useState('');
  const { adjustedCbs, loading, error, createPool } = usePooling(apiClient, year, shipIds);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const addShip = () => {
    if (newShipId && !shipIds.includes(newShipId)) {
      setShipIds([...shipIds, newShipId]);
      setNewShipId('');
    }
  };

  const removeShip = (shipId: string) => {
    setShipIds(shipIds.filter((id) => id !== shipId));
  };

  const handleCreatePool = async () => {
    try {
      setActionError(null);
      setActionSuccess(null);
      const result = await createPool();
      setActionSuccess(
        `Pool created successfully! Total CB: ${result.totalCbBefore.toFixed(2)} → ${result.totalCbAfter.toFixed(2)}`
      );
    } catch (err: any) {
      setActionError(err.message || 'Failed to create pool');
    }
  };

  const totalCb = adjustedCbs.reduce((sum, cb) => sum + cb.adjustedCbGco2eq, 0);
  const canCreatePool = totalCb >= 0 && adjustedCbs.length > 0;

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pooling</h2>

      <div className="mb-4 flex gap-4">
        <div>
          <label className="block mb-1">Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1">Add Ship ID:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newShipId}
              onChange={(e) => setNewShipId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addShip()}
              placeholder="Enter Ship ID"
              className="border rounded px-3 py-2 flex-1"
            />
            <button
              onClick={addShip}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Pool Summary</h3>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Adjusted CB</p>
            <p className={`text-2xl font-bold ${totalCb >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalCb.toFixed(2)} gCO₂e
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className={`text-xl font-bold ${canCreatePool ? 'text-green-600' : 'text-red-600'}`}>
              {canCreatePool ? '✅ Valid Pool' : '❌ Invalid Pool'}
            </p>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{actionError}</div>
      )}
      {actionSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{actionSuccess}</div>
      )}

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Pool Members</h3>
        <div className="space-y-2">
          {shipIds.map((shipId) => {
            const cb = adjustedCbs.find((c) => c.shipId === shipId);
            return (
              <div key={shipId} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <span className="font-semibold">{shipId}</span>
                  {cb && (
                    <span className={`ml-4 ${cb.adjustedCbGco2eq >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      CB: {cb.adjustedCbGco2eq.toFixed(2)} gCO₂e
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeShip(shipId)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleCreatePool}
        disabled={!canCreatePool}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Create Pool
      </button>
    </div>
  );
}

