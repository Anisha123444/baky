import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import * as api from '../api';
import { Edit2, Check } from 'lucide-react';

export default function Accounts() {
  const { data, loadData } = useData();
  const [editing, setEditing] = useState(false);
  const [accounts, setAccounts] = useState([...data.accounts]);

  const totalSales = data.orders.reduce((sum, order) => sum + order.total, 0);
  const totalInvestment = data.investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const totalProfit = totalSales - totalInvestment;
  const isLoss = totalProfit < 0;
  const individualShare = isLoss ? 0 : totalProfit / 4;

  const handleSave = async () => {
    await api.updateSettings({ accounts });
    setEditing(false);
    loadData();
  };

  const updateAccountName = (index, newName) => {
    const updated = [...accounts];
    updated[index] = newName;
    setAccounts(updated);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-baky-dark">Accounts</h2>
        {editing ? (
          <button onClick={handleSave} className="flex items-center text-white bg-green-600 px-4 py-2 rounded-md hover:bg-green-700">
            <Check size={18} className="mr-2" /> Save Changes
          </button>
        ) : (
          <button onClick={() => setEditing(true)} className="flex items-center text-gray-700 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
            <Edit2 size={18} className="mr-2" /> Edit Names
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6 pb-4 border-b">
          <p className="text-lg font-medium text-gray-600">Total Distributed Profit:</p>
          <p className={`text-3xl font-bold ${isLoss ? 'text-gray-400' : 'text-emerald-600'}`}>
            {isLoss ? '₹0' : `₹${totalProfit}`}
          </p>
        </div>

        <div className="overflow-hidden border rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-medium text-gray-600">Account Name</th>
                <th className="p-4 font-medium text-gray-600 text-right">Current Profit Share</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {accounts.map((acc, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">
                    {editing ? (
                      <input 
                        type="text" 
                        value={acc} 
                        onChange={(e) => updateAccountName(index, e.target.value)}
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-baky-red focus:outline-none"
                      />
                    ) : (
                      <span className="font-bold text-lg text-gray-800">{acc}</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-xl font-bold text-emerald-600">
                      ₹{individualShare.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
