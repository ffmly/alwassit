import React, { useState } from 'react';
import { Icon, Button, Card } from '../components/UIComponents';
import { assessLoanRisk } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

export const LoanScreen = ({ user, tier }: any) => {
    const { t, isRTL } = useLanguage();
    const [amount, setAmount] = useState(10000);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleApply = async () => {
        setAnalyzing(true);
        // Simulate async
        setTimeout(() => {
            setResult({ authorized: true, reason: "Excellent History" });
            setAnalyzing(false);
        }, 1500);
    };

    return (
        <div className="pt-4 space-y-6 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
             <div className="mb-4 animate-pop-in">
                <h2 className="text-2xl font-display font-bold text-slate-900">{t('microLoans')}</h2>
                <p className="text-slate-500 text-sm">{t('liquidityNeed')}</p>
            </div>

            <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-none shadow-blue-500/30 shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-blue-100 text-sm font-bold uppercase tracking-wider">{t('approvedLimit')}</p>
                        <h3 className="text-3xl font-bold mt-1" dir="ltr">{tier.maxLoan.toLocaleString()} {t('currency')}</h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold border border-white/20`}>
                        {tier.name} {t('level')}
                    </div>
                </div>
                <div className="flex gap-2 text-xs text-blue-100 bg-black/10 p-2 rounded-lg">
                    <Icon name="info" className="text-sm" />
                    <span>{t('trustScoreBased')} ({user.creditScore})</span>
                </div>
            </Card>

            {!result ? (
                <div className="space-y-6 animate-pop-in delay-100">
                    <div className="glass-panel p-6 rounded-2xl">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 block">{t('wantBorrow')}</label>
                        <div className="text-4xl font-bold text-slate-900 text-center mb-6" dir="ltr">{amount.toLocaleString()} <span className="text-lg text-slate-400">{t('currency')}</span></div>
                        <input 
                            type="range" min="1000" max={tier.maxLoan} step="1000" 
                            value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                         <div className="flex justify-between text-xs text-slate-400 mt-2 font-bold" dir="ltr">
                            <span>1,000</span>
                            <span>{tier.maxLoan.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-panel p-4 rounded-xl text-center">
                            <span className="block text-xs text-slate-500 font-bold uppercase">{t('duration')}</span>
                            <span className="block text-xl font-bold text-slate-800 mt-1">3 M</span>
                        </div>
                        <div className="glass-panel p-4 rounded-xl text-center">
                            <span className="block text-xs text-slate-500 font-bold uppercase">{t('fee')}</span>
                            <span className="block text-xl font-bold text-slate-800 mt-1">1.5%</span>
                        </div>
                    </div>

                    <Button onClick={handleApply} disabled={analyzing} className={analyzing ? 'animate-pulse' : ''}>
                        {analyzing ? t('analyzing') : t('applyNow')}
                    </Button>
                </div>
            ) : (
                <div className="glass-panel p-6 rounded-2xl text-center space-y-4 animate-pop-in border-t-4 border-green-500">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-2">
                        <Icon name="check_circle" className="text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{t('loanApproved')}</h3>
                    <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-100 rtl:text-right">
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-500 text-sm">{t('amount')}</span>
                            <span className="font-bold text-slate-900" dir="ltr">{amount.toLocaleString()} {t('currency')}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-slate-500 text-sm">{t('disbursement')}</span>
                            <span className="font-bold text-emerald-600">{t('instant')}</span>
                        </div>
                    </div>
                    <Button onClick={() => setResult(null)}>{t('done')}</Button>
                </div>
            )}
        </div>
    );
};