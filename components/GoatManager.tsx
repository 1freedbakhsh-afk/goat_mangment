import React, { useState } from 'react';
import { Goat, Gender, BreedingStatus, HealthRecord } from '../types';
import { Plus, Search, Edit2, Trash2, X, Syringe, Activity, Stethoscope, ChevronRight, Filter } from 'lucide-react';

interface GoatManagerProps {
  goats: Goat[];
  onAdd: (goat: Goat) => void;
  onUpdate: (goat: Goat) => void;
  onDelete: (id: string) => void;
}

const GoatManager: React.FC<GoatManagerProps> = ({ goats, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'health'>('details');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentGoat, setCurrentGoat] = useState<Partial<Goat>>({});
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  
  const [newHealthRecord, setNewHealthRecord] = useState<Partial<HealthRecord>>({
    type: 'Checkup',
    date: new Date().toISOString().split('T')[0],
    cost: 0,
    description: '',
    batchNumber: ''
  });

  const handleOpenAdd = () => {
    setCurrentGoat({
      gender: Gender.Female,
      status: BreedingStatus.Open,
      breed: '',
      weightHistory: [],
      healthRecords: []
    });
    setMode('add');
    setActiveTab('details');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goat: Goat) => {
    setCurrentGoat({ ...goat, healthRecords: goat.healthRecords || [] });
    setMode('edit');
    setActiveTab('details');
    setIsModalOpen(true);
  };

  const addHealthRecord = () => {
    if (!newHealthRecord.description) return;
    const record: HealthRecord = {
      id: Date.now().toString(),
      type: newHealthRecord.type as any,
      date: newHealthRecord.date || new Date().toISOString().split('T')[0],
      description: newHealthRecord.description!,
      cost: Number(newHealthRecord.cost) || 0,
      batchNumber: newHealthRecord.batchNumber
    };

    setCurrentGoat(prev => ({
      ...prev,
      healthRecords: [...(prev.healthRecords || []), record]
    }));

    setNewHealthRecord({
      type: 'Checkup',
      date: new Date().toISOString().split('T')[0],
      cost: 0,
      description: '',
      batchNumber: ''
    });
  };

  const removeHealthRecord = (id: string) => {
    setCurrentGoat(prev => ({
      ...prev,
      healthRecords: prev.healthRecords?.filter(r => r.id !== id) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGoat.tag || !currentGoat.name) return;

    if (mode === 'add') {
      const newGoat: Goat = {
        ...currentGoat as Goat,
        id: Math.random().toString(36).substr(2, 9),
        weightHistory: currentGoat.weightHistory || [],
        healthRecords: currentGoat.healthRecords || []
      };
      onAdd(newGoat);
    } else {
      onUpdate(currentGoat as Goat);
    }
    setIsModalOpen(false);
  };

  const filteredGoats = goats.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatusBadge = ({ status }: { status: BreedingStatus }) => {
    const styles = {
      [BreedingStatus.Open]: 'bg-slate-100 text-slate-700',
      [BreedingStatus.Mated]: 'bg-purple-100 text-purple-700',
      [BreedingStatus.Pregnant]: 'bg-amber-100 text-amber-700',
      [BreedingStatus.Lactating]: 'bg-cyan-100 text-cyan-700',
      [BreedingStatus.Dry]: 'bg-stone-100 text-stone-600',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || styles[BreedingStatus.Open]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Goat Profiles</h2>
          <p className="text-slate-500 text-sm">Manage herd registry and details</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
        >
          <Plus size={20} /> <span className="font-medium">Add Goat</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search by name, tag, or breed..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <button className="p-2 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-50">
                <Filter size={18} />
            </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredGoats.map(goat => (
          <div key={goat.id} className="bg-white p-5 rounded-2xl shadow-pro border border-slate-100 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-slate-900">{goat.name}</h3>
                  <StatusBadge status={goat.status} />
                </div>
                <p className="text-sm text-slate-500 font-mono bg-slate-100 inline-block px-1.5 rounded">{goat.tag}</p>
              </div>
              <span className={`p-2 rounded-full ${goat.gender === Gender.Male ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                {goat.gender === Gender.Male ? '♂' : '♀'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-xs text-slate-400 block">Breed</span>
                {goat.breed}
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-xs text-slate-400 block">Age</span>
                {new Date().getFullYear() - new Date(goat.dob).getFullYear()} yrs
              </div>
            </div>

            <div className="flex gap-2 mt-2 pt-4 border-t border-slate-100">
              <button onClick={() => handleOpenEdit(goat)} className="flex-1 py-2 flex items-center justify-center gap-2 text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium transition">
                <Edit2 size={16} /> Edit
              </button>
              <button onClick={() => onDelete(goat.id)} className="flex-1 py-2 flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition">
                <Trash2 size={16} /> Remove
              </button>
            </div>
          </div>
        ))}
        {filteredGoats.length === 0 && (
            <div className="text-center py-10 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                <Search size={32} className="mx-auto mb-3 opacity-50" />
                <p>No goats found matching your search.</p>
            </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-pro border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Identity</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Breed & Gender</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredGoats.map(goat => (
              <tr key={goat.id} className="hover:bg-slate-50/80 transition group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{goat.name}</span>
                    <span className="text-xs font-mono text-slate-500">{goat.tag}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${goat.gender === Gender.Male ? 'bg-blue-500' : 'bg-pink-500'}`}></span>
                    <span className="text-slate-700">{goat.breed}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={goat.status} />
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                   {new Date().getFullYear() - new Date(goat.dob).getFullYear()} years
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEdit(goat)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(goat.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Full Screen / Responsive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
              <h3 className="text-xl font-bold text-slate-900">{mode === 'add' ? 'New Entry' : 'Edit Profile'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-6 border-b border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setActiveTab('details')}
                className={`py-3 mr-8 text-sm font-medium border-b-2 transition-all ${
                  activeTab === 'details' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Basic Details
              </button>
              <button 
                onClick={() => setActiveTab('health')}
                className={`py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === 'health' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Health Records
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              <form id="goat-form" onSubmit={handleSubmit}>
                {activeTab === 'details' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tag ID</label>
                        <input required type="text" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white transition" 
                          value={currentGoat.tag || ''} onChange={e => setCurrentGoat({...currentGoat, tag: e.target.value})} placeholder="e.g. G-101" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Name</label>
                        <input required type="text" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white transition" 
                          value={currentGoat.name || ''} onChange={e => setCurrentGoat({...currentGoat, name: e.target.value})} placeholder="e.g. Bella" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Breed</label>
                        <input required type="text" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white transition" 
                          value={currentGoat.breed || ''} onChange={e => setCurrentGoat({...currentGoat, breed: e.target.value})} placeholder="e.g. Boer" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Date of Birth</label>
                        <input required type="date" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white transition" 
                          value={currentGoat.dob || ''} onChange={e => setCurrentGoat({...currentGoat, dob: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gender</label>
                        <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white transition" 
                          value={currentGoat.gender} onChange={e => setCurrentGoat({...currentGoat, gender: e.target.value as Gender})}>
                          <option value={Gender.Female}>Female</option>
                          <option value={Gender.Male}>Male</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Breeding Status</label>
                        <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white transition" 
                          value={currentGoat.status} onChange={e => setCurrentGoat({...currentGoat, status: e.target.value as BreedingStatus})}>
                          {Object.values(BreedingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                        <p className="text-sm font-bold text-slate-800 mb-3">Pedigree Info</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sire (Father)</label>
                                <input type="text" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white transition" 
                                value={currentGoat.sire || ''} onChange={e => setCurrentGoat({...currentGoat, sire: e.target.value})} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Dam (Mother)</label>
                                <input type="text" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white transition" 
                                value={currentGoat.dam || ''} onChange={e => setCurrentGoat({...currentGoat, dam: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Notes</label>
                        <textarea className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white transition" rows={3}
                          value={currentGoat.notes || ''} onChange={e => setCurrentGoat({...currentGoat, notes: e.target.value})} placeholder="Health issues, distinct markings, etc." />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-brand-50/50 p-5 rounded-xl border border-brand-100">
                      <h4 className="text-sm font-bold text-brand-900 mb-4 flex items-center gap-2">
                        <div className="p-1 bg-brand-200 rounded text-brand-700"><Plus size={14} /></div>
                        New Record
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <select 
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                          value={newHealthRecord.type}
                          onChange={e => setNewHealthRecord({...newHealthRecord, type: e.target.value as any})}
                        >
                          <option value="Checkup">Checkup</option>
                          <option value="Vaccine">Vaccine</option>
                          <option value="Deworming">Deworming</option>
                          <option value="Treatment">Treatment</option>
                        </select>
                        <input 
                          type="date" 
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                          value={newHealthRecord.date}
                          onChange={e => setNewHealthRecord({...newHealthRecord, date: e.target.value})}
                        />
                        <input 
                          type="number" 
                          placeholder="Cost ($)"
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                          value={newHealthRecord.cost || ''}
                          onChange={e => setNewHealthRecord({...newHealthRecord, cost: parseFloat(e.target.value)})}
                        />
                        {newHealthRecord.type === 'Vaccine' ? (
                          <>
                            <input 
                              type="text" 
                              placeholder="Vaccine Name (e.g. CDT)"
                              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                              value={newHealthRecord.description}
                              onChange={e => setNewHealthRecord({...newHealthRecord, description: e.target.value})}
                            />
                            <input 
                              type="text" 
                              placeholder="Batch Number"
                              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                              value={newHealthRecord.batchNumber || ''}
                              onChange={e => setNewHealthRecord({...newHealthRecord, batchNumber: e.target.value})}
                            />
                          </>
                        ) : (
                          <input 
                            type="text" 
                            placeholder="Description (e.g. Annual Physical)"
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                            value={newHealthRecord.description}
                            onChange={e => setNewHealthRecord({...newHealthRecord, description: e.target.value})}
                          />
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={addHealthRecord}
                        className="w-full bg-brand-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 shadow-sm transition"
                      >
                        Add Health Record
                      </button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">History Timeline</h4>
                      {currentGoat.healthRecords && currentGoat.healthRecords.length > 0 ? (
                        <div className="space-y-3">
                            {currentGoat.healthRecords.map((rec) => (
                                <div key={rec.id} className="flex items-center p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                                    <div className={`
                                        p-2 rounded-lg mr-3
                                        ${rec.type === 'Vaccine' ? 'bg-blue-50 text-blue-600' : ''}
                                        ${rec.type === 'Deworming' ? 'bg-green-50 text-green-600' : ''}
                                        ${rec.type === 'Treatment' ? 'bg-red-50 text-red-600' : ''}
                                        ${rec.type === 'Checkup' ? 'bg-slate-100 text-slate-600' : ''}
                                    `}>
                                        {rec.type === 'Vaccine' && <Syringe size={16}/>}
                                        {rec.type === 'Treatment' && <Activity size={16}/>}
                                        {rec.type === 'Checkup' && <Stethoscope size={16}/>}
                                        {rec.type === 'Deworming' && <Plus size={16}/>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <div>
                                              <p className="font-medium text-slate-800 text-sm">
                                                {rec.description}
                                                {rec.batchNumber && <span className="text-slate-500 font-normal ml-2 text-xs">Batch: {rec.batchNumber}</span>}
                                              </p>
                                            </div>
                                            <p className="text-xs font-mono text-slate-500">{rec.date}</p>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <p className="text-xs text-slate-500">{rec.type}</p>
                                            {rec.cost > 0 && <p className="text-xs font-bold text-slate-700">${rec.cost}</p>}
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => removeHealthRecord(rec.id)}
                                        className="ml-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <p className="text-sm text-slate-400 italic">No records found</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition">Cancel</button>
              <button form="goat-form" type="submit" className="px-5 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition active:scale-95">Save Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoatManager;