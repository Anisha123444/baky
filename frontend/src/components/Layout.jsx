import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ShoppingCart, DollarSign, PieChart, Menu, Users, Database, Menu as MenuIcon, X } from 'lucide-react';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'New Order', path: '/new-order', icon: PlusCircle },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Investments', path: '/investments', icon: DollarSign },
    { name: 'Profit', path: '/profit', icon: PieChart },
    { name: 'Menu', path: '/menu', icon: Menu },
    { name: 'Accounts', path: '/accounts', icon: Users },
    { name: 'Data Management', path: '/data', icon: Database },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-baky-gray">
      {/* Mobile Header */}
      <div className="md:hidden bg-baky-burgundy text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-wider">BAKY</h1>
          <p className="text-xs text-baky-cream opacity-80">Order & Profit Manager</p>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-baky-burgundy text-white shrink-0`}>
        <div className="hidden md:block p-6">
          <h1 className="text-3xl font-bold tracking-wider mb-1">BAKY</h1>
          <p className="text-sm text-baky-cream opacity-80">Bakery Order & Profit Manager</p>
        </div>
        <ul className="flex flex-col py-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 transition-colors ${
                    isActive ? 'bg-baky-red border-l-4 border-white' : 'hover:bg-baky-red/50 border-l-4 border-transparent'
                  }`
                }
              >
                <item.icon className="mr-3" size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
