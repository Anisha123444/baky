import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import * as api from '../api';
import { format, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';

export default function Orders() {
  const { data, loadData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await api.deleteOrder(id);
      loadData();
    }
  };

  const filteredOrders = data.orders.filter(order => {
    // Search
    if (searchTerm && !order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter
    if (filter === 'today' && !isToday(parseISO(order.date))) return false;
    if (filter === 'week' && !isThisWeek(parseISO(order.date))) return false;
    if (filter === 'month' && !isThisMonth(parseISO(order.date))) return false;
    
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-baky-dark">Orders</h2>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search customer..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-baky-red focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-baky-red focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b">
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{order.customerName}</td>
                    <td className="p-4 text-gray-600">{format(parseISO(order.date), 'dd MMM yyyy, hh:mm a')}</td>
                    <td className="p-4 text-gray-600">{order.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                    <td className="p-4 font-bold text-baky-dark">₹{order.total}</td>
                    <td className="p-4 text-right space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View details">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDelete(order.id)} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
