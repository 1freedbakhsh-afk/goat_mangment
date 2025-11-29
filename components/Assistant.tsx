import React, { useState, useRef, useEffect } from 'react';
import { askFarmAssistant } from '../services/geminiService';
import { Goat, Transaction } from '../types';
import { Send, Bot, Loader2, Sparkles, User } from 'lucide-react';

interface AssistantProps {
  goats: Goat[];
  transactions: Transaction[];
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const Assistant: React.FC<AssistantProps> = ({ goats, transactions }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! I am your AI Farm Assistant. Ask me about your herd health, breeding schedules, or financial insights.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    // Prepare context
    const context = JSON.stringify({
      totalGoats: goats.length,
      breeds: [...new Set(goats.map(g => g.breed))],
      recentTransactions: transactions.slice(0, 5),
      sickGoats: goats.filter(g => g.healthRecords.some(h => new Date(h.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))),
      pregnantGoats: goats.filter(g => g.status === 'Pregnant').length
    });

    const response = await askFarmAssistant(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <div className="bg-brand-100 p-2 rounded-full text-brand-600">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="text-slate-900 font-bold text-sm">Farm Intelligence</h3>
          <p className="text-slate-500 text-xs">Powered by Gemini 2.5</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${msg.role === 'ai' ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'}
            `}>
              {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
            </div>
            
            <div className={`max-w-[85%] space-y-1`}>
              <div className={`
                p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}
              `}>
                {msg.content.split('\n').map((line, i) => (
                    // Simple logic to bold key terms or list items
                    <p key={i} className={`mb-1 last:mb-0 ${line.startsWith('-') ? 'pl-2' : ''}`}>
                        {line}
                    </p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
                <Bot size={16} />
             </div>
             <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                <Loader2 className="animate-spin text-brand-600" size={18} />
                <span className="text-xs text-slate-400 font-medium">Analyzing farm data...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 relative">
          <input 
            type="text" 
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition text-sm"
            placeholder="Ask about vaccination schedules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1.5 p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 transition shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;