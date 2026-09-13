import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import * as api from '../api';
import { format, parseISO } from 'date-fns';
import { Plus, Trash2, Calculator } from 'lucide-react';

export default function Investments() {
  const { data, loadData } = useData();
  const [activeTab, setActiveTab] = useState('general'); // 'general' or 'order'
  
  const [amountStr, setAmountStr] = useState('');
  const [description, setDescription] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');

  // Evaluate simple math expressions like "10+20+30"
  const evaluateAmount = (str) => {
    try {
      // safe eval for basic math only
      if (!str) return 0;
      const sanitized = str.replace(/[^0-9+\-*/.]/g, '');
      if (!sanitized) return 0;
      const result = new Function('return ' + sanitized)();
      return isNaN(result) ? 0 : Number(result);
    } catch (e) {
      return 0;
    }
  };

  const handleCalculate = () => {
    const calculated = evaluateAmount(amountStr);
    setAmountStr(calculated.toString());
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const finalAmount = evaluateAmount(amountStr);
    if (!finalAmount || finalAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    let finalDesc = description;
    if (activeTab === 'order') {
      const order = data.orders.find(o => o.id === selectedOrderId);
      if (!order) {
        alert("Please select an order");
        return;
      }
      finalDesc = `Order Cost: ${order.customerName} (${format(parseISO(order.date), 'dd MMM')}) - ${description}`;
    } else if (!description) {
      alert("Please enter a description");
      return;
    }
    
    await api.createInvestment({
      amount: finalAmount,
      description: finalDesc,
      date: new Date().toISOString(),
      orderId: activeTab === 'order' ? selectedOrderId : null
    });
    
    setAmountStr('');
    setDescription('');
    setSelectedOrderId('');
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this investment?")) {
      await api.deleteInvestment(id);
      loadData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-baky-dark">Investments</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b mb-6">
          <button 
            className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'general' ? 'border-b-2 border-baky-red text-baky-red' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('general')}
          >
            General Investment
          </button>
          <button 
            className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'order' ? 'border-b-2 border-baky-red text-baky-red' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('order')}
          >
            Order Cost
          </button>
        </div>

        <form onSubmit={handleAdd} className="space-y-4">
          {activeTab === 'order' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Order</label>
              <select 
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-baky-red focus:outline-none"
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
              >
                <option value="">-- Choose an Order --</option>
                {data.orders.sort((a,b) => new Date(b.date) - new Date(a.date)).map(order => (
                  <option key={order.id} value={order.id}>
                    {order.customerName} - {format(parseISO(order.date), 'dd MMM yyyy, hh:mm a')} (Total: ₹{order.total})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {activeTab === 'order' ? 'Additional Notes (Optional)' : 'Description'}
              </label>
              <input 
                type="text" 
                placeholder={activeTab === 'order' ? "e.g. Extra packaging" : "e.g. Raw materials"}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-baky-red focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required={activeTab === 'general'}
              />
            </div>
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Supports math e.g. 50+20)</label>
              <div className="relative flex">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <input 
                  type="text" 
                  placeholder="e.g. 100+50"
                  className="w-full pl-8 pr-10 p-3 border rounded-l-md focus:ring-2 focus:ring-baky-red focus:outline-none"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  onBlur={handleCalculate}
                  required
                />
                <button 
                  type="button" 
                  onClick={handleCalculate}
                  className="bg-gray-100 border border-l-0 border-gray-300 px-3 rounded-r-md hover:bg-gray-200 text-gray-600"
                  title="Calculate Total"
                >
                  <Calculator size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="bg-baky-burgundy hover:bg-baky-red text-white px-8 py-3 rounded-md font-medium flex items-center justify-center">
              <Plus size={20} className="mr-2" /> {activeTab === 'order' ? 'Add Order Cost' : 'Add Investment'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b">
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.investments.sort((a,b) => new Date(b.date) - new Date(a.date)).map(inv => (
              <tr key={inv.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-600">{format(parseISO(inv.date), 'dd MMM yyyy')}</td>
                <td className="p-4 font-medium text-gray-800">{inv.description}</td>
                <td className="p-4 font-bold text-orange-600">₹{inv.amount}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(inv.id)} className="text-red-500 hover:text-red-700 p-2">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {data.investments.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">No investments recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
