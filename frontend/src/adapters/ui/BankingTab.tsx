import { useState } from 'react';
import { useBanking } from '../../core/application/useBanking';
import { HttpApiClient } from '../infrastructure/HttpApiClient';

const apiClient = new HttpApiClient();

export function BankingTab() {
  const [shipId, setShipId] = useState('SHIP001');
  const [year, setYear] = useState(2024);
  const [applyAmount, setApplyAmount] = useState('');
  const { cb, loading, error, bank, apply } = useBanking(apiClient, shipId, year);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleBank = async () => {
    try {
      setActionError(null);
      setActionSuccess(null);
      const result = await bank();
      setActionSuccess(`Banked ${result.banked.toFixed(2)} gCO₂e successfully`);
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  const handleApply = async () => {
    try {
      setActionError(null);
      setActionSuccess(null);
      const amount = parseFloat(applyAmount);
      if (isNaN(amount) || amount <= 0) {
        setActionError('Please enter a valid positive amount');
        return;
      }
      const result = await apply(amount);
      setActionSuccess(`Applied ${result.applied.toFixed(2)} gCO₂e. Remaining: ${result.remainingBanked.toFixed(2)}`);
      setApplyAmount('');
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Banking</h2>

      <div className="mb-4 flex gap-4">
        <div>
          <label className="block mb-1">Ship ID:</label>
          <input
            type="text"
            value={shipId}
            onChange={(e) => setShipId(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border rounded px-3 py-2"
          />
        </div>
      </div>

      {cb && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Compliance Balance</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Current CB</p>
              <p className="text-xl font-bold">{cb.cbGco2eq.toFixed(2)} gCO₂e</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`text-xl font-bold ${cb.cbGco2eq >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {cb.cbGco2eq >= 0 ? 'Surplus' : 'Deficit'}
              </p>
            </div>
          </div>
        </div>
      )}

      {actionError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{actionError}</div>
      )}
      {actionSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{actionSuccess}</div>
      )}

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Bank Surplus</h3>
          <p className="text-sm text-gray-600 mb-2">Bank positive compliance balance for future use</p>
          <button
            onClick={handleBank}
            disabled={!cb || cb.cbGco2eq <= 0}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Bank Surplus
          </button>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Apply Banked Surplus</h3>
          <p className="text-sm text-gray-600 mb-2">Apply banked surplus to cover a deficit</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={applyAmount}
              onChange={(e) => setApplyAmount(e.target.value)}
              placeholder="Amount to apply"
              className="border rounded px-3 py-2 flex-1"
            />
            <button
              onClick={handleApply}
              disabled={!cb || cb.cbGco2eq >= 0}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

