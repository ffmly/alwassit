import React, { useState, useEffect } from 'react';
import { Icon } from '../components/UIComponents';
import { useLanguage } from '../context/LanguageContext';

export const VerificationScreen = ({ userData, onComplete, onBack }: { userData: any, onComplete: () => void, onBack: () => void }) => {
  const [step, setStep] = useState(1);
  const { t, isRTL } = useLanguage();
  const [analysisText, setAnalysisText] = useState(t('processing'));

  useEffect(() => {
    if (step === 4) {
      setTimeout(() => onComplete(), 3000);
    }
  }, [step]);

  return (
    <div className="h-full flex flex-col pt-4" dir={isRTL ? 'rtl' : 'ltr'}>
       <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full text-slate-600 border border-transparent hover:border-white"><Icon name="arrow_back" className={isRTL ? 'rotate-180' : ''}/></button>
        <h2 className="text-xl font-bold font-display text-slate-900">{t('idVerify')}</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8 perspective-1000">
        {step < 4 && (
            <div className="relative transform-style-3d animate-pop-in">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-2xl blur opacity-75 animate-pulse"></div>
                <div className="relative w-72 h-[400px] bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-slate-500 opacity-10"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                         <div className="w-24 h-24 border-2 border-slate-300/50 rounded-lg flex items-center justify-center mb-4 bg-white/50">
                            <Icon name={step === 3 ? "face" : "badge"} className="text-5xl text-slate-400" />
                         </div>
                         <h3 className="text-xl font-bold text-slate-800 mb-2">{step === 1 ? t('scanFront') : step === 2 ? t('scanBack') : t('scanSelfie')}</h3>
                         <p className="text-xs text-slate-500">{t('alignFrame')}</p>
                    </div>
                </div>
            </div>
        )}

        {step < 4 ? (
            <button 
                onClick={() => setStep(step + 1)}
                className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center group transition-all hover:scale-110 shadow-lg shadow-blue-100 animate-pop-in delay-200"
            >
                <div className="w-16 h-16 bg-blue-600 rounded-full shadow-lg group-hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Icon name="camera" className="text-white" />
                </div>
            </button>
        ) : (
            <div className="flex flex-col items-center animate-pop-in">
                <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-blue-600 font-mono text-sm tracking-wider animate-pulse">{analysisText}</p>
            </div>
        )}
      </div>
    </div>
  );
};