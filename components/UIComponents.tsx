import React from 'react';

export const Icon = ({ name, className = "", onClick }: { name: string; className?: string; onClick?: () => void }) => (
  <span
    className={`material-symbols-rounded select-none transition-all duration-300 ${className}`}
    onClick={onClick}
    style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
  >
    {name}
  </span>
);

export const Button = ({ children, variant = 'primary', onClick, className = '', disabled = false, delay = '' }: any) => {
  const base = `w-full py-4 px-6 rounded-2xl font-bold tracking-wide transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group shadow-sm animate-pop-in ${delay}`;

  const variants = {
    primary: "bg-blue-600 text-white shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.5)] hover:translate-y-[-2px]",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 float-3d",
    outline: "border border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 bg-transparent",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant as keyof typeof variants]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
    >
      {/* Subtle shine effect for primary buttons */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

export const Input = ({ label, type = "text", value, onChange, placeholder, icon, className = "", delay = "" }: any) => (
  <div className={`space-y-2 ${className} animate-pop-in ${delay}`}>
    {label && <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">{label}</label>}
    <div className="relative group perspective-1000">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10"><Icon name={icon} /></div>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl py-4 ${icon ? 'pl-12' : 'pl-5'} pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm group-hover:shadow-md transform transition-transform duration-300 group-hover:-translate-y-0.5`}
      />
    </div>
  </div>
);

export const Card = ({ children, className = '', noPadding = false, delay = '' }: any) => (
  <div className={`glass-panel rounded-3xl ${noPadding ? '' : 'p-6'} ${className} relative overflow-hidden animate-pop-in ${delay} hover:shadow-xl transition-shadow duration-500`}>
    {children}
  </div>
);

export const BottomNav = ({ activeTab, onTabChange, showVoiceAssist, isListening, onVoiceClick }: { activeTab: string, onTabChange: (t: any) => void, showVoiceAssist?: boolean, isListening?: boolean, onVoiceClick?: () => void }) => {
  const tabs = [
    { id: 'HOME', icon: 'wallet', label: 'Wallet' },
    { id: 'SEND_MONEY', icon: 'send', label: 'Send' },
    { id: 'LOANS', icon: 'credit_score', label: 'Loans' },
    { id: 'MAP', icon: 'map', label: 'Map' },
    { id: 'AI_ASSISTANT', icon: 'smart_toy', label: 'AI' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[360px] z-50 perspective-1000">
      <div className="glass-panel rounded-full px-2 py-2 flex justify-between items-center shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] border border-white/60 bg-white/30 backdrop-blur-xl relative">

        {tabs.slice(0, 2).map((tab) => (
          <NavButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onClick={() => onTabChange(tab.id)} />
        ))}

        {/* Central Voice Assist Button */}
        {showVoiceAssist ? (
          <div className="relative -top-6 group">
            {isListening && (
              <>
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20 duration-1000"></div>
                <div className="absolute -inset-4 border border-red-200 rounded-full animate-[spin_4s_linear_infinite] opacity-100 transition-opacity"></div>
              </>
            )}
            <button
              className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${isListening ? 'from-red-500 to-red-600' : 'from-blue-500 to-blue-600'} text-white shadow-lg shadow-blue-500/40 flex items-center justify-center transform transition-transform duration-300 hover:scale-110 active:scale-95 border-4 border-white/20 backdrop-blur-md`}
              onClick={onVoiceClick}
            >
              <Icon name={isListening ? "mic_off" : "mic"} className={`text-3xl ${isListening ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        ) : (
          <NavButton tab={tabs[2]} isActive={activeTab === tabs[2].id} onClick={() => onTabChange(tabs[2].id)} />
        )}

        {tabs.slice(showVoiceAssist ? 2 : 3).map((tab) => (
          <NavButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onClick={() => onTabChange(tab.id)} />
        ))}

      </div>
    </div>
  );
};

const NavButton = ({ tab, isActive, onClick }: any) => (
  <button
    onClick={onClick}
    className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 group ${isActive ? 'bg-white text-blue-600 shadow-md scale-110' : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'}`}
  >
    <Icon name={tab.icon} className={`transition-transform duration-300 ${isActive ? "text-[24px]" : "text-[22px] group-hover:scale-110"}`} />
    {isActive && (
      <span className="absolute -bottom-8 text-[10px] font-bold text-slate-600 tracking-wide animate-pop-in bg-white/80 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm border border-white/50">
        {tab.label}
      </span>
    )}
  </button>
);