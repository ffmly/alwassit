import React from 'react';
import { useFraud } from '../context/FraudContext';
import { Icon, Button } from '../components/UIComponents';
import { translations } from '../i18n/fraudTranslations';

export const FraudSettingsScreen = ({ onBack, lang = 'dz' }: any) => {
    const { settings, updateSettings, triggerMockEvent } = useFraud();
    // @ts-ignore
    const t = translations[lang] || translations.en;

    return (
        <div className="pt-4 space-y-6 animate-pop-in h-full flex flex-col">
            <div className="flex items-center gap-4 mb-2">
                <button onClick={onBack} className="p-2 bg-white/50 rounded-full hover:scale-110 transition-transform">
                    <Icon name="arrow_back" />
                </button>
                <h2 className="text-xl font-display font-bold text-slate-900">{t.settings}</h2>
            </div>

            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group border border-blue-100">
                <div className="absolute right-0 top-0 opacity-10 -mr-6 -mt-6">
                   <div className="w-32 h-32 bg-blue-600 rounded-full blur-2xl"></div>
                </div>
                
                <label className="text-sm font-bold text-slate-800 mb-4 block uppercase tracking-wider">{t.sensitivity}</label>
                <div className="flex bg-slate-100/80 rounded-xl p-1 mb-2">
                    {['RELAXED', 'STANDARD', 'PARANOID'].map(mode => (
                        <button key={mode} 
                            onClick={() => updateSettings({ sensitivity: mode as any })}
                            className={`flex-1 py-3 text-[10px] font-bold rounded-lg transition-all ${settings.sensitivity === mode ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <div className="bg-white/60 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                    <span className="font-bold text-slate-700 text-sm">Auto-Freeze (Critical)</span>
                    <button onClick={() => updateSettings({ autoFreeze: !settings.autoFreeze })} 
                        className={`w-10 h-6 rounded-full transition-colors ${settings.autoFreeze ? 'bg-blue-600' : 'bg-slate-300'} p-1`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.autoFreeze ? 'translate-x-4' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="mt-auto pb-6">
                <Button variant="danger" onClick={triggerMockEvent} className="border-2 border-dashed border-red-200 bg-red-50 text-red-500">
                    <Icon name="bug_report" /> Simulate Hack Attack
                </Button>
                <p className="text-[10px] text-center text-slate-400 mt-2">Will trigger fraud event simulation (Dev Only)</p>
            </div>
        </div>
    );
};