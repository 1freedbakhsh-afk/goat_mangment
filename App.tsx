import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GoatManager from './components/GoatManager';
import Assistant from './components/Assistant';
import Finance from './components/Finance';
import HealthModule from './components/HealthModule';
import { Goat, Transaction, InventoryItem } from './types';
import * as Storage from './services/storageService';
import { Menu, Sprout } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // App State
  const [goats, setGoats] = useState<Goat[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Load Data on Mount
  useEffect(() => {
    setGoats(Storage.getGoats());
    setTransactions(Storage.getTransactions());
    setInventory(Storage.getInventory());
  }, []);

  // Persistence Handlers
  const handleAddGoat = (goat: Goat) => {
    const updated = [...goats, goat];
    setGoats(updated);
    Storage.saveGoats(updated);
  };

  const handleUpdateGoat = (goat: Goat) => {
    const updated = goats.map(g => g.id === goat.id ? goat : g);
    setGoats(updated);
    Storage.saveGoats(updated);
  };

  const handleDeleteGoat = (id: string) => {
    const updated = goats.filter(g => g.id !== id);
    setGoats(updated);
    Storage.saveGoats(updated);
  };

  const handleAddTransaction = (t: Transaction) => {
    const updated = [...transactions, t];
    setTransactions(updated);
    Storage.saveTransactions(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    Storage.saveTransactions(updated);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard goats={goats} transactions={transactions} />;
      case 'goats':
        return (
          <GoatManager 
            goats={goats} 
            onAdd={handleAddGoat} 
            onUpdate={handleUpdateGoat}
            onDelete={handleDeleteGoat}
          />
        );
      case 'health':
        return <HealthModule goats={goats} transactions={transactions} />;
      case 'finance':
        return <Finance transactions={transactions} onAdd={handleAddTransaction} onDelete={handleDeleteTransaction} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
            <Sprout size={48} className="mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-slate-600">Module Under Construction</h3>
            <p className="text-sm">This feature is coming in the next update.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 md:hidden flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
             <div className="bg-brand-600 p-1.5 rounded-lg text-white">
                <Sprout size={18} />
             </div>
             <h1 className="font-bold text-lg text-slate-900 tracking-tight">CapraPro</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
            <Menu size={24} />
          </button>
        </header>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;