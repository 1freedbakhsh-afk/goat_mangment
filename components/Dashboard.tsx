import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Goat, Transaction, BreedingStatus } from '../types';
import { DollarSign, TrendingUp, TrendingDown, Baby, Activity } from 'lucide-react';

interface DashboardProps {
  goats: Goat[];
  transactions: Transaction[];
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

const Dashboard: React.FC<DashboardProps> = ({ goats, transactions }) => {
  const totalGoats = goats.length;
  const pregnantGoats = goats.filter(g => g.status === BreedingStatus.Pregnant).length;
  const kidsCount = goats.filter(g => {
    const dob = new Date(g.dob);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return dob > sixMonthsAgo;
  }).length;
  
  const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = income - expense;

  const breedData = goats.reduce((acc, goat) => {
    const existing = acc.find(b => b.name === goat.breed);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: goat.breed, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const financeData = [
    { name: 'Income', amount: income },
    { name: 'Expenses', amount: expense },
  ];

  const StatCard = ({ label, value, icon: Icon, colorClass, bgClass, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-pro border border-slate-100 hover:shadow-pro-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend === 'up' ? '+12%' : '-5%'}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Farm Overview</h2>
          <p className="text-slate-500 text-sm">Real-time monitoring and insights</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          Last updated: Today, 9:00 AM
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total Herd" 
          value={totalGoats} 
          icon={Activity} 
          colorClass="text-blue-600" 
          bgClass="bg-blue-50"
          trend="up"
        />
        <StatCard 
          label="Pregnant Does" 
          value={pregnantGoats} 
          icon={Baby} 
          colorClass="text-brand-600" 
          bgClass="bg-brand-50"
        />
        <StatCard 
          label="New Kids (<6mo)" 
          value={kidsCount} 
          icon={TrendingUp} 
          colorClass="text-amber-600" 
          bgClass="bg-amber-50"
          trend="up"
        />
        <StatCard 
          label="Net Profit" 
          value={`$${netProfit.toLocaleString()}`} 
          icon={DollarSign} 
          colorClass={netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'} 
          bgClass={netProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50'}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-pro border border-slate-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Financial Performance</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 text-slate-600 focus:ring-0">
              <option>This Month</option>
              <option>Last Quarter</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="amount" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={60}>
                  {financeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Income' ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-pro border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Herd Composition</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {breedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {breedData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="text-slate-600 font-medium">{entry.name}</span>
                </div>
                <span className="text-slate-900 font-bold">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;