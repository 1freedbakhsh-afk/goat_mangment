import React from 'react';
import { LayoutDashboard, Users, HeartPulse, DollarSign, Package, X, Sprout } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'goats', label: 'Goat Profiles', icon: Users },
    { id: 'health', label: 'Health & Breeding', icon: HeartPulse },
    { id: 'finance', label: 'Financials', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: Package },
  ];

  return (
    <>
      {/* Mobile Overlay with Blur */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-slate-900 text-white shadow-2xl transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:shadow-none shrink-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg">
              <Sprout size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Capra<span className="text-brand-500">Pro</span></h1>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <Icon size={22} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium text-[15px]">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-slate-900 to-transparent">
          <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-slate-700/50">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">System Status</p>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-emerald-400">All Systems Online</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;