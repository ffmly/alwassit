// --- START OF FILE components/UIComponents.tsx ---
import React from 'react';

export const Icon = ({ name, className = "", onClick }: any) => (
  <span className={`material-symbols-rounded select-none ${className}`} onClick={onClick}>
    {name}
  </span>
);

export const Button = ({ children, variant = 'primary', onClick, className = '', disabled = false }: any) => {
  const base = `w-full py-4 px-6 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden`;
  const styles = {
    primary: "bg-blue-600 text-white shadow-lg hover:bg-blue-700 shadow-blue-500/30",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:border-blue-300",
    danger: "bg-red-50 text-red-500 border border-red-100 hover:bg-red-100",
    outline: "border border-slate-300 text-slate-500"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant as keyof typeof styles]} ${className} ${disabled ? 'opacity-50' : ''}`}>
      {children}
    </button>
  );
};

export const Input = ({ label, type = "text", value, onChange, placeholder, icon, delay = "" }: any) => (
  <div className={`space-y-2 animate-pop-in ${delay}`}>
    {label && <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">{label}</label>}
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Icon name={icon} /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full bg-white/80 border border-slate-200 rounded-2xl py-4 ${icon ? 'pl-12' : 'pl-5'} pr-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm`}
      />
    </div>
  </div>
);

export const Card = ({ children, className = '' }: any) => (
  <div className={`glass-panel rounded-3xl p-6 bg-white/50 border border-white shadow-sm ${className}`}>
    {children}
  </div>
);

// --- MODIFIED NAV COMPONENT (REMOVED 'fixed') ---
export const BottomNav = ({ activeTab, onTabChange }: any) => {
  const tabs = [
    { id: 'HOME', icon: 'wallet', label: 'Wallet' },
    { id: 'SEND_MONEY', icon: 'send', label: 'Send' },
    { id: 'AI_ASSISTANT', icon: 'smart_toy', label: 'AI Pilot' }, 
    { id: 'LOANS', icon: 'credit_score', label: 'Loans' },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl rounded-full p-1.5 flex gap-1 shadow-2xl border border-white/10 animate-slide-up mx-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:bg-white/10'}`}
          >
            <Icon name={tab.icon} className={isActive ? "text-2xl" : "text-xl"} />
          </button>
        )
      })}
    </div>
  );
};