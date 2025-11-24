// --- START OF FILE context/NotificationContext.tsx ---
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification, NotificationType } from '../types';
// We remove NotificationOverlay import from here to avoid UI coupling

interface NotificationContextType {
    notify: (type: NotificationType, title: string, message: string, opts?: any) => void;
    notifySuccess: (title: string, msg: string) => void;
    notifyError: (title: string, msg: string) => void;
    triggerSimulation: () => void;
    // New exposed values for UI components to consume
    notifications: AppNotification[];
    dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children, lang = 'en' }: any) => {
    const [queue, setQueue] = useState<AppNotification[]>([]);

    const notify = (type: NotificationType, title: string, message: string, opts: any = {}) => {
        const id = `notif_${Date.now()}_${Math.random()}`;
        const newNote: AppNotification = {
            id,
            type,
            title,
            message,
            timestamp: Date.now(),
            ...opts
        };
        setQueue(prev => [newNote, ...prev].slice(0, 3));
        if (navigator.vibrate) navigator.vibrate(type === 'ERROR' ? [50, 50, 50] : 50);
    };

    const dismiss = (id: string) => {
        setQueue(prev => prev.filter(n => n.id !== id));
    };

    const notifySuccess = (t: string, m: string) => notify('SUCCESS', t, m);
    const notifyError = (t: string, m: string) => notify('ERROR', t, m);

    const triggerSimulation = () => {
        const events = [
            { type: 'SUCCESS', title: "Money Received", message: "Yassine B. sent you 2,500 DZD." },
            { type: 'WARNING', title: "Bill Due", message: "Sonelgaz bill expires in 2 days." },
        ];
        const random = events[Math.floor(Math.random() * events.length)];
        // @ts-ignore
        notify(random.type, random.title, random.message);
    };

    return (
        <NotificationContext.Provider value={{ notify, notifySuccess, notifyError, triggerSimulation, notifications: queue, dismiss }}>
            {/* Logic Only - No UI rendered here anymore */}
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used within NotificationProvider");
    return context;
};