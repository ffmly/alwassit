// --- START OF FILE screens/DeclarationCenterScreen.tsx ---
import React from 'react';
import { Icon } from '../components/UIComponents';
import { useDeclaration } from '../context/DeclarationContext';
import { declarationTranslations } from '../i18n/declarationTranslations';

export const DeclarationCenterScreen = ({ onNavigate, lang = 'en' }: any) => {
  const { declarations } = useDeclaration();
  // @ts-ignore
  const t = declarationTranslations[lang] || declarationTranslations.en;

  const statusColor = {
      OPEN: 'text-blue-600 bg-blue-50 border-blue-200',
      IN_REVIEW: 'text-amber-600 bg-amber-50 border-amber-200',
      RESOLVED: 'text-green-600 bg-green-50 border-green-200',
      REJECTED: 'text-slate-600 bg-slate-50 border-slate-200'
  };

  return (
    <div className="h-full flex flex-col pt-4">
       <div className="flex items-center justify-between px-2 mb-6">
           <div className="flex items-center gap-3">
              <button onClick={() => onNavigate('HOME')} className="p-2 rounded-full hover:bg-white"><Icon name="arrow_back" /></button>
              <h2 className="font-display font-bold text-xl text-slate-800">{t.centerTitle}</h2>
           </div>
           <button 
             onClick={() => onNavigate('CREATE_DECLARATION')}
             className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-90 transition"
            >
               <Icon name="add" />
           </button>
       </div>

       {/* AI Help Banner */}
       <div className="mx-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-indigo-200 relative overflow-hidden"
            onClick={() => onNavigate('CREATE_DECLARATION')}>
            <div className="relative z-10 flex gap-4 items-center">
               <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                   <Icon name="smart_toy" />
               </div>
               <div>
                   <h4 className="font-bold text-sm">Need Assistance?</h4>
                   <p className="text-[10px] text-white/80">Describe your problem, our AI will help you fill the official forms.</p>
               </div>
            </div>
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
       </div>

       <div className="px-4 pb-2">
           <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-3">Recent Tickets</h3>
       </div>

       <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3 no-scrollbar">
           {declarations.map(dec => (
               <div key={dec.id} className="glass-panel p-4 rounded-2xl border border-white flex gap-3 hover:scale-[1.02] transition-transform cursor-pointer">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${dec.severity === 'CRITICAL' ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon name="assignment" />
                   </div>
                   <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm text-slate-800">{t.cats[dec.category] || dec.category}</h4>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${statusColor[dec.status]}`}>
                                {dec.status}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{dec.aiSummary.slice(0, 60)}...</p>
                        <span className="text-[9px] text-slate-400 mt-2 block">{new Date(dec.timestamp).toLocaleDateString()}</span>
                   </div>
               </div>
           ))}
       </div>
    </div>
  );
};