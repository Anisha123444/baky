import React from 'react';
import { useData } from '../context/DataContext';

export default function Profit() {
  const { data } = useData();

  const totalSales = data.orders.reduce((sum, order) => sum + order.total, 0);
  const totalInvestment = data.investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const totalProfit = totalSales - totalInvestment;
  
  const isLoss = totalProfit < 0;
  
  // Distribute equally only if positive. Wait, the prompt says:
  // "If profit is positive, distribute it equally. If profit is negative, show the loss and do not show it as a positive distribution."
  const individualShare = isLoss ? 0 : totalProfit / 4;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-baky-dark">Profit Dashboard</h2>
        <p className="text-gray-500">Overall business performance and profit distribution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 font-medium">Total Sales</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">₹{totalSales}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <p className="text-sm text-gray-500 font-medium">Total Investment</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">₹{totalInvestment}</h3>
        </div>
        <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${isLoss ? 'border-red-500' : 'border-emerald-500'}`}>
          <p className="text-sm text-gray-500 font-medium">{isLoss ? 'Total Loss' : 'Total Profit'}</p>
          <h3 className={`text-3xl font-bold mt-2 ${isLoss ? 'text-red-600' : 'text-emerald-600'}`}>
            {isLoss ? `-₹${Math.abs(totalProfit)}` : `₹${totalProfit}`}
          </h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 text-baky-dark border-b pb-4">Profit Distribution</h3>
        
        {isLoss ? (
          <div className="text-center p-8 bg-red-50 rounded-lg text-red-600 font-medium text-lg">
            Cannot distribute profit. The business is currently in a loss of ₹{Math.abs(totalProfit)}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.accounts.map(account => (
              <div key={account} className="bg-baky-cream p-6 rounded-xl border border-baky-burgundy/20 text-center">
                <div className="w-12 h-12 bg-baky-burgundy text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  {account.charAt(0)}
                </div>
                <h4 className="font-bold text-gray-800">{account}</h4>
                <p className="text-2xl font-bold text-emerald-600 mt-2">₹{individualShare.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
