import React from 'react';
import { Icon } from '../components/UIComponents';
import { useLanguage } from '../context/LanguageContext';

export const CreditScoreScreen = ({ user, tier, onBack }: any) => {
    const { t, isRTL } = useLanguage();
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - ((user.creditScore / 850) * circumference);

    return (
        <div className="pt-4 space-y-6 h-full flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
             <div className="flex items-center gap-4 mb-2 animate-pop-in">
                <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full text-slate-600 hover:scale-110 transition-transform"><Icon name="arrow_back" className={isRTL ? 'rotate-180' : ''}/></button>
                <h2 className="text-xl font-display font-bold text-slate-900">{t('trustScoreTitle')}</h2>
            </div>

            <div className="flex-1 flex flex-col items-center perspective-1000 overflow-y-auto no-scrollbar pb-20">
                <div className="relative w-80 h-80 flex items-center justify-center mb-8 float-3d animate-pop-in mt-4">
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-xl p-4" viewBox="0 0 256 256">
                        <circle cx="128" cy="128" r={radius} stroke="#f1f5f9" strokeWidth="20" fill="none" className="backdrop-blur-sm" />
                         <defs>
                            <linearGradient id={`grad-${tier.name}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                        <circle cx="128" cy="128" r={radius} stroke={`url(#grad-${tier.name})`} strokeWidth="20" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center w-48 h-48 bg-white/50 backdrop-blur-xl rounded-full border border-white/50 shadow-inner">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('score')}</span>
                        <span className="text-6xl font-display font-extrabold text-slate-800 tracking-tighter" dir="ltr">{user.creditScore}</span>
                        <span className={`text-sm font-bold uppercase tracking-widest mt-1 text-slate-600`}>{tier.name}</span>
                        <div className="flex gap-1 mt-3">
                            {Array.from({length: 5}).map((_, i) => (
                                <Icon key={i} name="star" className={`text-[14px] ${i < tier.stars ? 'text-amber-400' : 'text-slate-200'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full space-y-4 animate-pop-in delay-200 px-2">
                    <div className="flex items-center justify-between">
                         <h3 className="font-bold text-slate-900">{t('tierBenefits')}</h3>
                         <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-blue-100 text-blue-600`}>{t('level')} {tier.stars}/5</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <div className={`glass-panel p-4 rounded-2xl flex items-center gap-4 bg-white/60 border-l-4 border-green-500 shadow-sm rtl:border-l-0 rtl:border-r-4`}>
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shadow-sm"><Icon name="payments" /></div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm">{t('benefitLoans')}</h4>
                                <p className="text-xs text-slate-500">{t('approvedLimit')} {tier.maxLoan.toLocaleString()} {t('currency')}</p>
                            </div>
                        </div>
                        <div className={`glass-panel p-4 rounded-2xl flex items-center gap-4 bg-white/60 border-l-4 border-purple-500 shadow-sm rtl:border-l-0 rtl:border-r-4`}>
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm"><Icon name="diamond" /></div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm">{t('benefitConcierge')}</h4>
                            </div>
                        </div>
                         <div className={`glass-panel p-4 rounded-2xl flex items-center gap-4 bg-white/60 border-l-4 border-blue-500 shadow-sm rtl:border-l-0 rtl:border-r-4`}>
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm"><Icon name="savings" /></div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm">{t('benefitFees')}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};