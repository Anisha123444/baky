import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import * as api from '../api';
import { Plus, Minus, Trash2 } from 'lucide-react';

export default function NewOrder() {
  const { data, loadData } = useData();
  const [customerName, setCustomerName] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [message, setMessage] = useState('');

  const menuByCategory = useMemo(() => {
    const grouped = {};
    data.categories.forEach(c => grouped[c] = []);
    data.menu.filter(m => m.enabled).forEach(item => {
      if (grouped[item.category]) {
        grouped[item.category].push(item);
      } else {
        grouped[item.category] = [item];
      }
    });
    return grouped;
  }, [data.menu, data.categories]);

  const addItem = (e) => {
    const itemId = e.target.value;
    if (!itemId) return;
    
    const menuItem = data.menu.find(m => m.id === itemId);
    if (!menuItem) return;

    const existing = orderItems.find(i => i.id === itemId);
    if (existing) {
      updateQuantity(itemId, 1);
    } else {
      setOrderItems([...orderItems, { ...menuItem, quantity: 1 }]);
    }
    e.target.value = ''; // reset select
  };

  const updateQuantity = (id, delta) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const newQ = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSave = async () => {
    if (!customerName.trim()) {
      alert("Please enter customer name");
      return;
    }
    if (orderItems.length === 0) {
      alert("Please add at least one item");
      return;
    }

    const newOrder = {
      customerName,
      date: new Date().toISOString(),
      items: orderItems,
      total: orderTotal,
    };

    try {
      await api.createOrder(newOrder);
      setMessage('Order saved successfully');
      setCustomerName('');
      setOrderItems([]);
      loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to save order");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-baky-dark">New Order</h2>

      {message && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md font-medium">
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
          <input 
            type="text" 
            placeholder="Enter customer name (e.g. Rahul)"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-baky-red"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Food Item</label>
          <select 
            onChange={addItem}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-baky-red"
            defaultValue=""
          >
            <option value="" disabled>-- Choose an item --</option>
            {Object.entries(menuByCategory).map(([category, items]) => (
              <optgroup key={category} label={category}>
                {items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} - ₹{item.price}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {orderItems.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-lg mb-4">Order Items</h3>
            <div className="space-y-4">
              {orderItems.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-white border rounded hover:bg-gray-100">
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-white border rounded hover:bg-gray-100">
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="w-24 text-right font-bold text-gray-800">
                    ₹{item.price * item.quantity}
                  </div>
                  
                  <button onClick={() => removeItem(item.id)} className="ml-4 text-red-500 hover:text-red-700 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
          <h3 className="text-xl font-bold mb-4 text-baky-dark">Order Summary</h3>
          <div className="flex justify-between mb-2 text-gray-600">
            <span>Total Quantity:</span>
            <span>{totalQuantity} items</span>
          </div>
          <div className="flex justify-between text-2xl font-bold text-baky-red border-t pt-4 mt-2">
            <span>TOTAL SALE:</span>
            <span>₹{orderTotal}</span>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-baky-burgundy hover:bg-baky-red text-white text-lg font-bold py-4 rounded-md transition-colors"
        >
          SAVE ORDER
        </button>
      </div>
    </div>
  );
}
