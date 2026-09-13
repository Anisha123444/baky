import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import * as api from '../api';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function MenuManager() {
  const { data, loadData } = useData();
  const [newItem, setNewItem] = useState({ name: '', price: '', category: data.categories[0] || '' });
  
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.category) return;
    
    await api.createMenuItem({
      name: newItem.name,
      price: Number(newItem.price),
      category: newItem.category,
      enabled: true
    });
    
    setNewItem({ name: '', price: '', category: data.categories[0] || '' });
    loadData();
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Delete this menu item?")) {
      await api.deleteMenuItem(id);
      loadData();
    }
  };

  const toggleEnabled = async (item) => {
    await api.updateMenuItem(item.id, { ...item, enabled: !item.enabled });
    loadData();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-baky-dark">Menu Management</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Add New Menu Item</h3>
        <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="Item Name"
            className="p-3 border rounded-md"
            value={newItem.name}
            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            required
          />
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₹</span>
            <input 
              type="number" 
              placeholder="Price"
              className="w-full pl-8 p-3 border rounded-md"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              required
            />
          </div>
          <select 
            className="p-3 border rounded-md"
            value={newItem.category}
            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            required
          >
            {data.categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" className="bg-baky-burgundy hover:bg-baky-red text-white py-3 rounded-md font-medium flex items-center justify-center">
            <Plus size={20} className="mr-2" /> Add Item
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {data.categories.map(category => {
          const items = data.menu.filter(m => m.category === category);
          if (items.length === 0) return null;

          return (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-baky-burgundy text-white p-4 font-bold text-lg">
                {category}
              </div>
              <table className="w-full text-left">
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className={`border-b ${!item.enabled ? 'bg-gray-50 opacity-60' : ''}`}>
                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4">₹{item.price}</td>
                      <td className="p-4 text-right space-x-3">
                        <button 
                          onClick={() => toggleEnabled(item)}
                          className={`px-3 py-1 rounded text-sm font-medium ${item.enabled ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}
                        >
                          {item.enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
