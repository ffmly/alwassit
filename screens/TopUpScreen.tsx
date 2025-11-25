import React from 'react';
import { Icon } from '../components/UIComponents';
import { useLanguage } from '../context/LanguageContext';

export const TopUpScreen = ({ onBack }: { onBack: () => void }) => {
    const { t, isRTL } = useLanguage();
    return (
        <div className="pt-4 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
             <div className="flex items-center gap-4 mb-2 animate-pop-in">
                <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full text-slate-600 hover:scale-110 transition-transform"><Icon name="arrow_back" className={isRTL ? 'rotate-180' : ''}/></button>
                <h2 className="text-xl font-display font-bold text-slate-900">{t('digiServices')}</h2>
            </div>
            
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 animate-pop-in delay-100">{t('entertainment')}</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 perspective-1000 px-1">
                        {['Netflix', 'Spotify', 'Disney+', 'Shahid'].map((n, i) => (
                            <div key={n} className={`min-w-[100px] aspect-square glass-panel rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-white/50 border border-slate-100 shadow-sm float-3d animate-pop-in`}>
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shadow-inner"><Icon name="play_circle" className="text-slate-600 text-2xl" /></div>
                                <span className="text-xs font-medium text-slate-700">{n}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 animate-pop-in delay-200">{t('gaming')}</h3>
                    <div className="grid grid-cols-2 gap-4 perspective-1000">
                        {['Free Fire', 'PUBG', 'Steam', 'Valorant'].map((g, i) => (
                            <div key={g} className="glass-panel p-4 rounded-2xl flex items-center gap-3 hover:border-blue-400 transition cursor-pointer bg-white/50 border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    <Icon name="sports_esports" className="text-white" />
                                </div>
                                <span className="font-bold text-sm text-slate-800">{g}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 animate-pop-in delay-300">{t('mobileData')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                         {['Djezzy', 'Mobilis', 'Ooredoo'].map((m) => (
                             <button key={m} className="py-3 rounded-xl bg-white/50 border border-slate-200 hover:bg-blue-600 hover:text-white transition-all font-bold text-sm text-slate-600">
                                {m}
                             </button>
                         ))}
                    </div>
                </div>
            </div>
        </div>
    );
};