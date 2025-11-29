import React from 'react';
import { Goat, HealthRecord } from '../types';
import { Activity, Syringe, HeartPulse, Stethoscope, AlertCircle, CalendarCheck, TrendingUp } from 'lucide-react';
import Assistant from './Assistant';
import { Transaction } from '../types';

interface HealthModuleProps {
  goats: Goat[];
  transactions: Transaction[];
}

const HealthModule: React.FC<HealthModuleProps> = ({ goats, transactions }) => {
  // Aggregate all health records
  const allRecords = goats
    .flatMap(g => (g.healthRecords || []).map(r => ({ ...r, goatName: g.name, goatTag: g.tag })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Stats
  const totalSpend = allRecords.reduce((sum, r) => sum + r.cost, 0);
  const vaccinesCount = allRecords.filter(r => r.type === 'Vaccine').length;
  const recentTreatments = allRecords.filter(r => 
    r.type === 'Treatment' && 
    new Date(r.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Main Health Dashboard */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Header */}
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Health & Breeding</h2>
            <p className="text-slate-500 text-sm">Veterinary records and herd wellness</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-pro border border-slate-100 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Syringe size={64} className="text-blue-600" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Vaccinations</p>
            <p className="text-3xl font-bold text-slate-900">{vaccinesCount}</p>
            <div className="mt-2 text-xs text-blue-600 font-medium bg-blue-50 inline-block px-2 py-1 rounded">All time</div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl shadow-pro border border-slate-100 relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity size={64} className="text-red-600" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Active Treatments</p>
            <p className="text-3xl font-bold text-slate-900">{recentTreatments}</p>
            <div className="mt-2 text-xs text-red-600 font-medium bg-red-50 inline-block px-2 py-1 rounded">Last 30 days</div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-pro border border-slate-100 relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <HeartPulse size={64} className="text-emerald-600" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Medical Costs</p>
            <p className="text-3xl font-bold text-slate-900">${totalSpend}</p>
            <div className="mt-2 text-xs text-emerald-600 font-medium bg-emerald-50 inline-block px-2 py-1 rounded">Total spent</div>
          </div>
        </div>

        {/* All Records Table */}
        <div className="bg-white rounded-2xl shadow-pro border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Stethoscope className="text-brand-600" size={20} /> Herd History
            </h3>
          </div>
          
          {/* Responsive Table Wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-slate-50/80 text-slate-500 uppercase text-xs font-bold">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Goat</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allRecords.map((record, idx) => (
                  <tr key={`${record.id}-${record.goatTag}-${idx}`} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{record.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {record.goatName} <span className="text-slate-400 font-normal ml-1">#{record.goatTag}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`
                          px-2.5 py-1 rounded-full text-xs font-bold
                          ${record.type === 'Vaccine' ? 'bg-blue-50 text-blue-700' : ''}
                          ${record.type === 'Deworming' ? 'bg-green-50 text-green-700' : ''}
                          ${record.type === 'Treatment' ? 'bg-red-50 text-red-700' : ''}
                          ${record.type === 'Checkup' ? 'bg-slate-100 text-slate-700' : ''}
                        `}>
                          {record.type}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{record.description}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">${record.cost}</td>
                  </tr>
                ))}
                {allRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      <CalendarCheck size={32} className="mx-auto mb-2 opacity-50" />
                      No health records found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sidebar / Assistant */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100/50 shadow-sm">
          <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            <AlertCircle size={20} className="text-amber-600" /> Action Required
          </h4>
          <ul className="text-sm text-amber-800 space-y-3">
            <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>Routine FAMACHA check due for <strong>Bella</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>CDT Booster stock running low (2 units left).</span>
            </li>
          </ul>
        </div>
        
        {/* Assistant Embedded */}
        <div className="bg-white rounded-2xl shadow-pro border border-slate-100 overflow-hidden h-[600px] flex flex-col">
            <div className="flex-1 overflow-hidden">
                <Assistant goats={goats} transactions={transactions} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default HealthModule;