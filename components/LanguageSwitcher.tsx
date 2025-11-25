// --- START OF FILE src/components/LanguageSwitcher.tsx ---
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/translations';

export const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    const flags: Record<Language, string> = {
        en: '🇬🇧',
        fr: '🇫🇷',
        ar: '🇩🇿'
    };

    const labels: Record<Language, string> = {
        en: 'EN',
        fr: 'FR',
        ar: 'عربي'
    };

    const handleToggle = () => {
        const order: Language[] = ['en', 'fr', 'ar'];
        const nextIndex = (order.indexOf(language) + 1) % order.length;
        setLanguage(order[nextIndex]);
    };

    return (
        <button 
            onClick={handleToggle}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 transition-all shadow-sm group active:scale-95 z-50 pointer-events-auto"
        >
            <span className="text-lg filter drop-shadow-sm group-hover:scale-110 transition-transform">{flags[language]}</span>
            <span className={`text-xs font-bold text-slate-800 ${language === 'ar' ? 'font-serif pt-1' : ''}`}>
                {labels[language]}
            </span>
        </button>
    );
};