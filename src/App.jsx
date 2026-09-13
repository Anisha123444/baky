import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewOrder from './pages/NewOrder';
import Orders from './pages/Orders';
import Investments from './pages/Investments';
import Profit from './pages/Profit';
import MenuManager from './pages/MenuManager';
import Accounts from './pages/Accounts';
import DataManagement from './pages/DataManagement';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-order" element={<NewOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/profit" element={<Profit />} />
          <Route path="/menu" element={<MenuManager />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/data" element={<DataManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
