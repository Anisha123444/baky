import React, { useRef } from 'react';
import { useData } from '../context/DataContext';
import * as api from '../api';
import { Download, Upload, AlertTriangle } from 'lucide-react';

export default function DataManagement() {
  const { data, loadData } = useData();
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `baky_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData.menu && importedData.orders) {
          await api.importData(importedData);
          alert("Data imported successfully!");
          loadData();
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to parse file.");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all bakery data? This will delete all orders and investments!")) {
      await api.resetData();
      alert("Data reset successfully.");
      loadData();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-baky-dark">Data Management</h2>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
        
        {/* Export */}
        <div className="flex items-start">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
            <Download size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Export Data</h3>
            <p className="text-gray-500 mb-4 text-sm">Download a backup of all your orders, investments, menu, and settings.</p>
            <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
              Download JSON Backup
            </button>
          </div>
        </div>

        <hr />

        {/* Import */}
        <div className="flex items-start">
          <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4">
            <Upload size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Import Data</h3>
            <p className="text-gray-500 mb-4 text-sm">Restore your data from a previously saved JSON backup file. This will overwrite current data.</p>
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImport}
            />
            <button 
              onClick={() => fileInputRef.current.click()} 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Select Backup File
            </button>
          </div>
        </div>

        <hr />

        {/* Reset */}
        <div className="flex items-start">
          <div className="p-3 bg-red-100 text-red-600 rounded-full mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-600">Reset Data</h3>
            <p className="text-gray-500 mb-4 text-sm">Completely erase all orders and investments. This action cannot be undone.</p>
            <button onClick={handleReset} className="bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 px-6 py-2 rounded-md font-bold transition-colors">
              Reset Application Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
