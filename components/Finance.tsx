import React, { useState } from 'react';
import { Transaction } from '../types';
import { PlusCircle, ArrowUpRight, ArrowDownRight, Trash2, Calendar, Receipt } from 'lucide-react';

interface FinanceProps {
  transactions: Transaction[];
  onAdd: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

const Finance: React.FC<FinanceProps> = ({ transactions, onAdd, onDelete }) => {
  const [newTrans, setNewTrans] = useState<Partial<Transaction>>({ type: 'Expense', category: 'Feed' });

  const handleAdd = () => {
    if (!newTrans.amount || !newTrans.description) return;
    onAdd({
      ...newTrans as Transaction,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    });
    setNewTrans({ type: 'Expense', category: 'Feed', amount: 0, description: '' });
  };

  const sortedTrans = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Input Form - Sticky on desktop */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-pro border border-slate-100 sticky top-4">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <div className="bg-brand-100 p-2 rounded-lg text-brand-600"><PlusCircle size={20} /></div>
            Record Transaction
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Transaction Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setNewTrans({...newTrans, type: 'Income'})}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                    newTrans.type === 'Income' 
                      ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >Income</button>
                <button 
                  onClick={() => setNewTrans({...newTrans, type: 'Expense'})}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                    newTrans.type === 'Expense' 
                      ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >Expense</button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
              <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white transition" value={newTrans.category} onChange={e => setNewTrans({...newTrans, category: e.target.value})}>
                <option>Feed</option>
                <option>Medicine</option>
                <option>Labor</option>
                <option>Sales</option>
                <option>Equipment</option>
                <option>Maintenance</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold">$</span>
                </div>
                <input type="number" className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white transition font-mono font-medium" 
                  value={newTrans.amount || ''} onChange={e => setNewTrans({...newTrans, amount: parseFloat(e.target.value)})} placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Description</label>
              <input type="text" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white transition" 
                value={newTrans.description || ''} onChange={e => setNewTrans({...newTrans, description: e.target.value})} placeholder="What was this for?" />
            </div>

            <button onClick={handleAdd} className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 active:scale-95">
              Add Record
            </button>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="text-slate-400" size={24}/> Transaction History
        </h3>

        {/* Mobile: Card List */}
        <div className="flex flex-col gap-3 md:hidden">
            {sortedTrans.map(t => (
                <div key={t.id} className="bg-white p-4 rounded-xl shadow-pro border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-full ${t.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {t.type === 'Income' ? <ArrowUpRight size={18}/> : <ArrowDownRight size={18}/>}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-sm">{t.description}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded">{t.category}</span>
                                <span>{t.date}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`font-bold ${t.type === 'Income' ? 'text-green-600' : 'text-slate-900'}`}>
                            ${t.amount.toFixed(2)}
                        </p>
                        <button onClick={() => onDelete(t.id)} className="text-slate-300 p-1 -mr-1 hover:text-red-500">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Desktop: Table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-pro border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedTrans.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${t.type === 'Income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                             {t.type === 'Income' ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
                        </div>
                        <span className="font-medium text-slate-900">{t.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{t.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="opacity-50"/> {t.date}
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${t.type === 'Income' ? 'text-green-600' : 'text-slate-900'}`}>
                    {t.type === 'Expense' ? '-' : '+'}${t.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onDelete(t.id)} className="text-slate-300 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;