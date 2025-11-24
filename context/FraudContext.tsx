import React, { createContext, useContext, useState, useEffect } from 'react';
import { FraudEvent, FraudSettings } from '../types';
import { SecurityActionsModal } from '../components/SecurityActionsModal';
import { FraudNotificationToast } from '../components/FraudNotificationToast';

interface FraudContextType {
    settings: FraudSettings;
    updateSettings: (s: Partial<FraudSettings>) => void;
    triggerMockEvent: () => void;
}

const FraudContext = createContext<FraudContextType | null>(null);

export const FraudProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useState<FraudSettings>({
        sensitivity: 'STANDARD',
        autoFreeze: false,
        notifications: { push: true, sms: false }
    });
    const [currentEvent, setCurrentEvent] = useState<FraudEvent | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const updateSettings = (newSettings: Partial<FraudSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const triggerMockEvent = () => {
        const mock: FraudEvent = {
            id: 'mock-1',
            timestamp: Date.now(),
            score: 0.88,
            severity: 'HIGH',
            reasons: ['Simultaneous Login (Marseille)', 'Velocity check'],
            transactionDetails: {
                amount: 75000,
                currency: 'DZD',
                merchant: 'Fnac Champs-Élysées',
                location: 'France',
                device: 'New Device (Android)'
            },
            status: 'PENDING'
        };
        setCurrentEvent(mock);
    };

    const handleResolve = (id: string, action: string) => {
        console.log(`Action taken on ${id}: ${action}`);
        setCurrentEvent(null);
        setModalOpen(false);
    };

    return (
        <FraudContext.Provider value={{ settings, updateSettings, triggerMockEvent }}>
            {children}
            
            <FraudNotificationToast 
                event={currentEvent} 
                onOpen={() => setModalOpen(true)} 
                onDismiss={() => setCurrentEvent(null)}
            />
            
            {modalOpen && currentEvent && (
                <SecurityActionsModal 
                    event={currentEvent}
                    onClose={() => setModalOpen(false)}
                    onResolve={handleResolve}
                />
            )}
        </FraudContext.Provider>
    );
};

export const useFraud = () => {
    const context = useContext(FraudContext);
    if (!context) throw new Error("useFraud must be used within FraudProvider");
    return context;
};