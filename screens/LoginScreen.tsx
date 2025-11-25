import React, { useState } from 'react';
import { Button, Icon } from '../components/UIComponents';
import { useLanguage } from '../context/LanguageContext';

export const LoginScreen = ({ onBack, onLoginSuccess }: { onBack: () => void, onLoginSuccess: () => void }) => {
  const [pin, setPin] = useState('');
  const [showFaceID, setShowFaceID] = useState(false);
  const { t, isRTL } = useLanguage();

  const handlePinEntry = (n: string) => {
    const newPin = pin + n;
    setPin(newPin);
    if (newPin.length === 4) onLoginSuccess();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>

      <button onClick={onBack} className="absolute top-8 left-6 right-auto rtl:right-6 rtl:left-auto text-slate-500 hover:text-slate-800 z-20 transition-colors p-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:scale-110 active:scale-95 duration-200 border border-white/50">
        <Icon name="arrow_back" className={isRTL ? 'rotate-180' : ''} />
      </button>

      <div className="w-24 h-24 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 flex items-center justify-center mb-8 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.15)] animate-pop-in float-3d">
        <Icon name="lock" className="text-blue-600 text-4xl drop-shadow-sm" />
      </div>

      <h1 className="text-3xl font-display font-bold mb-2 text-slate-900 animate-pop-in delay-100">{t('welcomeBack')}</h1>
      <p className="text-slate-500 mb-10 animate-pop-in delay-200 font-medium">{t('authPrompt')}</p>

      <div className="w-full max-w-xs space-y-8 z-10 animate-pop-in delay-300">
        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 border border-slate-300 shadow-inner ${pin.length > i ? 'bg-blue-600 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-110' : 'bg-white/50'}`}></div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-[280px] mx-auto perspective-1000" style={{direction: 'ltr'}}> 
         {/* Numeric pad stays LTR usually */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button
              key={n}
              onClick={() => handlePinEntry(n.toString())}
              className="w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 hover:border-blue-300 flex items-center justify-center text-xl font-bold text-slate-700 transition-all active:scale-90 active:bg-blue-50/50 shadow-[0_4px_0_0_rgba(203,213,225,0.6)] hover:shadow-[0_6px_0_0_rgba(203,213,225,0.6)] active:shadow-none translate-y-0 active:translate-y-1"
            >
              {n}
            </button>
          ))}
          <div className="w-16 h-16"></div>
          <button
            onClick={() => handlePinEntry('0')}
            className="w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 hover:border-blue-300 flex items-center justify-center text-xl font-bold text-slate-700 transition-all active:scale-90 active:bg-blue-50/50 shadow-[0_4px_0_0_rgba(203,213,225,0.6)] hover:shadow-[0_6px_0_0_rgba(203,213,225,0.6)] active:shadow-none translate-y-0 active:translate-y-1"
          >
            0
          </button>
          <button onClick={() => setPin(pin.slice(0, -1))} className="w-16 h-16 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors active:scale-90"><Icon name="backspace" className={isRTL ? 'rotate-180' : ''}/></button>
        </div>

        <Button variant="secondary" className="mt-4 shadow-none border-transparent bg-transparent hover:bg-white/20" onClick={() => setShowFaceID(true)}>
          <Icon name="face" className="text-blue-500" /> {t('faceId')}
        </Button>
      </div>

      {showFaceID && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 bg-slate-100 rounded-full flex items-center justify-center">
              <Icon name="face" className="text-6xl text-slate-700" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{t('verifyFace')}</h3>
          <p className="text-slate-500 mb-8">{t('lookCamera')}</p>
          <Button variant="outline" onClick={() => setShowFaceID(false)}>{t('cancel')}</Button>
          {setTimeout(() => onLoginSuccess(), 2000) && null}
        </div>
      )}
    </div>
  );
};