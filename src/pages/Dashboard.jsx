import React from 'react';
import { useData } from '../context/DataContext';
import { format, isToday } from 'date-fns';
import { IndianRupee, ShoppingBag, TrendingUp, DollarSign, Package } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
    <div className={`p-4 rounded-full mr-4 ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { data, loading } = useData();

  if (loading) return <div className="p-8 text-center">Loading data...</div>;

  const todayOrders = data.orders.filter(o => isToday(new Date(o.date)));
  
  const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const todaysOrderCount = todayOrders.length;
  
  const totalSales = data.orders.reduce((sum, order) => sum + order.total, 0);
  const totalInvestment = data.investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const totalProfit = totalSales - totalInvestment;

  const totalItemsSold = data.orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-baky-dark">Dashboard Overview</h2>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Today's Sales" 
          value={`₹${todaySales}`} 
          icon={IndianRupee} 
          color="bg-green-100 text-green-600"
        />
        <StatCard 
          title="Today's Orders" 
          value={todaysOrderCount} 
          icon={ShoppingBag} 
          color="bg-blue-100 text-blue-600"
        />
        <StatCard 
          title="Total Items Sold" 
          value={totalItemsSold} 
          icon={Package} 
          color="bg-purple-100 text-purple-600"
        />
        <StatCard 
          title="Total Investment" 
          value={`₹${totalInvestment}`} 
          icon={DollarSign} 
          color="bg-orange-100 text-orange-600"
        />
        <StatCard 
          title="Total Profit" 
          value={`₹${totalProfit}`} 
          icon={TrendingUp} 
          color={totalProfit >= 0 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}
        />
      </div>
    </div>
  );
};

export default Dashboard;
