import React, { useState } from 'react';
import { Icon } from './UIComponents';
import { translations } from '../i18n/fraudTranslations';

export const SecurityActionsModal = ({ event, onClose, onResolve, lang = 'dz' }: any) => {
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const t = translations[lang] || translations.en;

    const act = (action: string) => {
        setLoading(true);
        setTimeout(() => { onResolve(event.id, action); setLoading(false); onClose(); }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden animate-pop-in shadow-2xl">
                <div className="bg-red-500 p-4 text-white flex justify-between items-center">
                    <span className="font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                        <Icon name="warning" /> Fraud Alert
                    </span>
                    <button onClick={onClose}><Icon name="close" /></button>
                </div>
                
                <div className="p-6 text-center">
                    <div className="mb-4 relative inline-block">
                         <svg className="w-24 h-24 -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="#fecaca" strokeWidth="6" fill="none"/>
                            <circle cx="48" cy="48" r="40" stroke="#ef4444" strokeWidth="6" fill="none"
                                strokeDasharray={251} strokeDashoffset={251 - (251 * event.score)} 
                                className="transition-all duration-1000"/>
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold">{Math.round(event.score * 100)}%</span>
                            <span className="text-[10px] uppercase text-slate-400">{t.riskScore}</span>
                         </div>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-1">{event.transactionDetails.amount.toLocaleString()} DZD</h2>
                    <p className="text-sm text-slate-500 mb-6">{event.transactionDetails.merchant} ({event.transactionDetails.location})</p>

                    <div className="bg-red-50 rounded-xl p-3 mb-6 text-left border border-red-100">
                        <p className="text-[10px] font-bold text-red-800 mb-2 uppercase">{t.reasons}</p>
                        {event.reasons.map((r: string, i: number) => (
                            <div key={i} className="text-xs text-red-600 flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"/> {r}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => act('BLOCK')} disabled={loading}
                            className="bg-red-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-200">
                            {loading ? 'Processing...' : t.block}
                        </button>
                        <button onClick={() => act('FREEZE')} disabled={loading}
                            className="bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-sm">
                            {t.freeze}
                        </button>
                    </div>
                    <button onClick={() => act('IGNORE')} className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{t.ignore}</button>
                </div>
            </div>
        </div>
    );
};