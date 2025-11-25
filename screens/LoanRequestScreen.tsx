// --- START OF FILE src/screens/LoanRequestScreen.tsx ---
import React, { useState } from 'react';
import { useCredit } from '../context/CreditContext';
import { SignaturePadModal } from '../components/SignaturePadModal';
import { Icon, Button } from '../components/UIComponents';
import { useLanguage } from '../context/LanguageContext';
import { CreditAssessment } from '../types';

export const LoanRequestScreen = ({ user, onBack }: any) => {
    const { creditsUsedThisYear, checkEligibility, requestContract, completeLoan } = useCredit();
    const { t, isRTL, language } = useLanguage();
    
    const [amount, setAmount] = useState(10000);
    const [status, setStatus] = useState<'IDLE'|'CHECKING'|'RESULT'|'SIGNING'|'SUCCESS'>('IDLE');
    const [assessment, setAssessment] = useState<CreditAssessment | null>(null);
    const [contractText, setContractText] = useState('');

    const limit = 3; // Max loans per year

    const handleCheck = async () => {
        setStatus('CHECKING');
        const result = await checkEligibility(amount);
        setAssessment(result);
        setStatus('RESULT');
    };

    const handleProceedToSign = () => {
        if (!assessment?.eligible) return;
        // In a real app, 'requestContract' would need language param to generate translated legal text
        const txt = requestContract(amount, language); 
        setContractText(txt);
        setStatus('SIGNING');
    };

    const handleSigned = async (signatureData: string) => {
        setStatus('CHECKING'); // Reuse spinner
        await completeLoan("CTR-MOCK", signatureData);
        setStatus('SUCCESS');
    };

    if (status === 'SUCCESS') {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-pop-in" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-green-200 shadow-lg relative">
                    <Icon name="check" className="text-4xl text-green-600" />
                    <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-2 left-1 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-100"></div>
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">{t('loanApproved')}</h2>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                    {amount.toLocaleString()} <span className="font-bold text-slate-700">{t('currency')}</span> {language === 'ar' ? 'تمت إضافتها إلى رصيدك.' : language === 'fr' ? 'crédités sur votre compte.' : 'has been credited to your account.'}
                </p>
                <Button onClick={onBack}>{t('returnHome')}</Button>
            </div>
        );
    }

    return (
        <div className="pt-4 h-full flex flex-col pb-6 relative" dir={isRTL ? 'rtl' : 'ltr'}>
             <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full text-slate-600 hover:scale-110 transition-transform">
                    <Icon name="arrow_back" className={isRTL ? 'rotate-180' : ''} />
                </button>
                <h2 className="text-xl font-display font-bold text-slate-900">{t('requestLoan')}</h2>
            </div>

            {/* Credit Slots Badge */}
            <div className="flex justify-between items-center bg-blue-50 px-4 py-2 rounded-xl mb-6 border border-blue-100">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{t('availSlots')}</span>
                <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i <= (limit - creditsUsedThisYear) ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                    ))}
                </div>
            </div>

            {/* SLIDER INPUT */}
            <div className="glass-panel p-6 rounded-2xl mb-4">
                 <div className="text-center mb-6">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('amount')}</span>
                     <div className="text-4xl font-display font-bold text-slate-800 mt-2 flex items-baseline justify-center gap-1" dir="ltr">
                         {/* Force Amount Display LTR for numbers */}
                         {amount.toLocaleString()} <span className="text-lg font-medium text-slate-400">{t('currency')}</span>
                     </div>
                 </div>
                 
                 <input 
                    type="range" min="5000" max="100000" step="1000" 
                    value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                    className={`w-full h-2 bg-slate-200 rounded-full accent-blue-600 cursor-pointer appearance-none mb-4 ${isRTL ? 'rotate-180' : ''}`}
                 />
                 <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase" dir="ltr">
                     <span>5,000</span>
                     <span>100,000 {t('currency')}</span>
                 </div>
            </div>

            {/* RESULTS OR ACTIONS */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
                {status === 'IDLE' && (
                    <div className="text-center mt-4">
                        <Button onClick={handleCheck}>
                             {t('analyzeAi')} <Icon name="auto_awesome" />
                        </Button>
                        <p className="text-xs text-slate-400 mt-3 max-w-xs mx-auto opacity-80">
                            Gemini AI™
                        </p>
                    </div>
                )}

                {status === 'CHECKING' && (
                    <div className="flex flex-col items-center justify-center py-8 gap-4 animate-pop-in">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <span className="text-xs font-bold text-blue-600 animate-pulse uppercase tracking-widest">{t('analyzing')}</span>
                    </div>
                )}

                {status === 'RESULT' && assessment && (
                    <div className="animate-slide-up space-y-4">
                        <div className={`p-4 rounded-xl border-l-4 rtl:border-l-0 rtl:border-r-4 ${assessment.eligible ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                             <div className="flex gap-3 items-start">
                                 <Icon name={assessment.eligible ? 'check_circle' : 'block'} className={assessment.eligible ? 'text-green-600' : 'text-red-600'} />
                                 <div>
                                     <h3 className={`font-bold ${assessment.eligible ? 'text-green-800' : 'text-red-800'}`}>
                                         {assessment.eligible ? t('approvalLikely') : t('appFlagged')}
                                     </h3>
                                     <ul className="mt-2 space-y-1">
                                         {assessment.reasons.map((r,i) => (
                                             // Normally translate reasons too, keeping strictly specific for hackathon MVP
                                             <li key={i} className="text-xs opacity-80 list-disc ml-4 rtl:mr-4 rtl:ml-0">{r}</li>
                                         ))}
                                     </ul>
                                 </div>
                             </div>
                        </div>

                        {assessment.eligible && (
                             <>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">{t('newScore')}</span>
                                        <div className="text-lg font-bold text-slate-800" dir="ltr">+{assessment.trustScoreImpact} Pts</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">{t('fee')}</span>
                                        <div className="text-lg font-bold text-slate-800" dir="ltr">1.5%</div>
                                    </div>
                                </div>
                                <Button onClick={handleProceedToSign} className="mt-4 shadow-lg shadow-blue-200">
                                    {t('viewSign')}
                                </Button>
                             </>
                        )}
                        {!assessment.eligible && (
                            <Button variant="secondary" onClick={() => setStatus('IDLE')} className="mt-4">
                                {t('back')}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <SignaturePadModal 
                isOpen={status === 'SIGNING'} 
                onClose={() => setStatus('RESULT')}
                onSign={handleSigned}
                contractText={contractText} // Assume this comes out localized from context
            />
        </div>
    );
};