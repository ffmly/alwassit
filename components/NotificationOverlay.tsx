// --- START OF FILE components/NotificationOverlay.tsx ---
import React, { useEffect, useState } from 'react';
import { AppNotification } from '../types';
import { Icon } from './UIComponents';
import { notificationTranslations } from '../i18n/notificationTranslations';
import { useNotification } from '../context/NotificationContext'; // Import Hook

const NotificationItem = ({ note, onDismiss, lang = 'en' }: { note: AppNotification, onDismiss: (id: string) => void, lang: string }) => {
    // @ts-ignore
    const t = notificationTranslations[lang] || notificationTranslations.en;
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        if (note.type !== 'ERROR') {
            const timer = setTimeout(() => handleDismiss(), 4000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setExiting(true);
        setTimeout(() => onDismiss(note.id), 300);
    };

    const styles = {
        SUCCESS: "bg-emerald-50/95 border-emerald-200 text-emerald-800 shadow-emerald-500/10",
        ERROR: "bg-rose-50/95 border-rose-200 text-rose-800 shadow-rose-500/10",
        WARNING: "bg-amber-50/95 border-amber-200 text-amber-800 shadow-amber-500/10",
        INFO: "bg-blue-50/95 border-blue-200 text-blue-800 shadow-blue-500/10"
    };

    const icons = {
        SUCCESS: "check_circle",
        ERROR: "report",
        WARNING: "warning",
        INFO: "notifications"
    };

    return (
        <div 
            className={`
                w-full mb-3 p-4 rounded-2xl shadow-xl border flex gap-3 items-start pointer-events-auto
                transition-all duration-300 transform 
                ${styles[note.type]}
                ${exiting ? 'opacity-0 -translate-y-full scale-95' : 'opacity-100 translate-y-0 scale-100'}
                animate-pop-in
            `}
        >
            <div className="shrink-0 pt-0.5"><Icon name={icons[note.type]} className="text-xl" /></div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="font-display font-bold text-[10px] uppercase tracking-wider opacity-90">{t[note.type.toLowerCase()]}</h4>
                    <span className="text-[10px] opacity-70">{t.justNow}</span>
                </div>
                <p className="text-sm font-bold leading-tight">{note.title}</p>
                <p className="text-xs opacity-90 mt-1 leading-snug">{note.message}</p>
            </div>
        </div>
    );
};

// EXPORT A SELF-CONTAINED UI COMPONENT
export const NotificationUI = ({ lang }: { lang: string }) => {
    const { notifications, dismiss } = useNotification();

    return (
        <div className="absolute top-0 left-0 right-0 z-[100] p-4 pt-14 flex flex-col items-center pointer-events-none w-full max-w-full">
            {notifications.map((n) => (
                <NotificationItem key={n.id} note={n} onDismiss={dismiss} lang={lang} />
            ))}
        </div>
    );
};