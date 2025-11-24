import React, { useEffect, useState } from 'react';
import { Icon } from './UIComponents';
import { translations } from '../i18n/fraudTranslations';

export const FraudNotificationToast = ({ event, onOpen, onDismiss, lang = 'dz' }: any) => {
    const [visible, setVisible] = useState(false);
    // @ts-ignore
    const t = translations[lang] || translations.en;

    useEffect(() => {
        if (event) setVisible(true);
    }, [event]);

    if (!visible || !event) return null;

    return (
        <div className="fixed top-4 left-4 right-4 z-[100] animate-pop-in cursor-pointer" onClick={onOpen}>
            <div className="bg-white/95 backdrop-blur-xl border-l-4 border-red-500 rounded-2xl shadow-2xl p-4 flex gap-4 items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 animate-pulse">
                    <Icon name="gpp_bad" className="text-2xl" />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{t.alertTitle}</h4>
                    <p className="text-xs text-slate-500">
                        {event.transactionDetails.amount.toLocaleString()} DZD • {event.transactionDetails.merchant}
                    </p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDismiss(); setVisible(false); }}>
                    <Icon name="close" className="text-slate-400" />
                </button>
            </div>
        </div>
    );
};