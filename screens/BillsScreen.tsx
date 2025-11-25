import React, { useState } from 'react';
import { Icon, Button, Card } from '../components/UIComponents';
import { useLanguage } from '../context/LanguageContext';

export const BillsScreen = ({ onBack }: { onBack: () => void }) => {
    const { t, isRTL } = useLanguage();
    const [billState, setBillState] = useState<'IDLE' | 'FETCHING' | 'FOUND' | 'PAID'>('IDLE');
    const billers = [
        { name: 'Sonelgaz', icon: 'lightbulb', color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
        { name: 'SEAAL', icon: 'water_drop', color: 'text-blue-600 bg-blue-50 border-blue-100' },
        { name: 'Alg. Telecom', icon: 'router', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
        { name: 'AADL', icon: 'home', color: 'text-purple-600 bg-purple-50 border-purple-100' }
      ];

    return (
        <div className="pt-4 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-4 mb-2 animate-pop-in">
                <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full text-slate-600 hover:scale-110 transition-transform"><Icon name="arrow_back" className={isRTL ? 'rotate-180' : ''}/></button>
                <h2 className="text-xl font-display font-bold text-slate-900">{t('payBills')}</h2>
            </div>
            
            {billState === 'IDLE' && (
                <div className="grid grid-cols-2 gap-4 perspective-1000">
                    {billers.map((b, i) => (
                        <button key={b.name} onClick={() => setBillState('FETCHING')} 
                            className={`glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 transition group bg-white/60 backdrop-blur-md border border-slate-100 float-3d animate-pop-in`}>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${b.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                <Icon name={b.icon} className="text-3xl" />
                            </div>
                            <span className="font-bold text-slate-800">{b.name}</span>
                        </button>
                    ))}
                </div>
            )}
            
            {billState === 'FETCHING' && (
                <div className="flex flex-col items-center justify-center h-64 space-y-6 animate-pop-in">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"></div>
                         <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin reverse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Icon name="cloud_sync" className="text-blue-600 animate-pulse text-3xl" />
                        </div>
                    </div>
                    <p className="font-mono text-blue-600 animate-pulse">{t('secureHandshake')}</p>
                    <button onClick={() => setBillState('FOUND')} className="text-xs underline text-slate-400">Debug: Found</button>
                </div>
            )}

            {billState === 'FOUND' && (
                <Card className="animate-pop-in border-blue-100 bg-white/90 shadow-xl rotate-1">
                     <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashed border-slate-200">
                        <span className="text-slate-500">{t('invoice')} #INV-9923</span>
                        <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded border border-red-100 animate-pulse">{t('unpaid')}</span>
                     </div>
                     <h3 className="text-4xl font-bold text-slate-900 mb-1" dir="ltr">4,500.00 <span className="text-sm text-slate-400">{t('currency')}</span></h3>
                     <p className="text-slate-500 text-sm mb-6">{t('dueDate')}: 25 Oct 2023</p>
                     <Button onClick={() => setBillState('PAID')}>{t('payNow')}</Button>
                </Card>
            )}

            {billState === 'PAID' && (
                 <div className="flex flex-col items-center justify-center h-64 space-y-6 text-center animate-pop-in">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
                        <Icon name="check" className="text-4xl text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{t('paymentConfirmed')}</h3>
                    <Button variant="outline" onClick={onBack}>{t('returnHome')}</Button>
                 </div>
            )}
        </div>
    )
}