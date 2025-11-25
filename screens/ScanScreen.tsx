import React, { useState, useEffect } from 'react';
import { Icon, Button } from '../components/UIComponents';
import { useLanguage } from '../context/LanguageContext';

export const ScanScreen = ({ onBack }: { onBack: () => void }) => {
    const { t, isRTL } = useLanguage();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const tim = setTimeout(() => setScanned(true), 3000);
        return () => clearTimeout(tim);
    }, []);

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
            {!scanned ? (
                <>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-30"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-64 h-64 border-2 border-blue-500 relative animate-pulse shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                            {/* Corner visuals agnostic to RTL */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-400"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-400"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-400"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-400"></div>
                            <div className="absolute top-1/2 w-full h-0.5 bg-red-500 shadow-[0_0_10px_red] animate-[scan_2s_infinite]"></div>
                        </div>
                        <p className="text-white font-mono mt-8 bg-black/50 px-4 py-2 rounded-full backdrop-blur text-sm">
                            {t('alignQr')}
                        </p>
                    </div>
                    {/* Back Button Position */}
                    <button 
                        onClick={onBack} 
                        className={`absolute top-8 ${isRTL ? 'right-6' : 'left-6'} text-white p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition`}
                    >
                        <Icon name="close" />
                    </button>
                </>
            ) : (
                 <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-xl animate-pop-in">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg mb-6">
                        <Icon name="check" className="text-white text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t('merchantDetected')}</h3>
                    <p className="text-slate-300 mb-8" dir="ltr">Uno Hypermarket - 4,500 DZD</p>
                    <div className="w-full space-y-4">
                        <Button onClick={onBack}>{t('confirm')}</Button>
                        <Button variant="secondary" onClick={onBack}>{t('cancel')}</Button>
                    </div>
                 </div>
            )}
        </div>
    );
};