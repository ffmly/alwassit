// --- MODIFY START OF FILE screens/SendMoneyScreen.tsx ---

import React from 'react';
import { Icon, Button, Input } from '../components/UIComponents';
import { useNotification } from '../context/NotificationContext'; // Import hook

export const SendMoneyScreen = ({ balance, onBack }: { balance: number, onBack: () => void }) => {
    const { notifySuccess, notifyError, triggerSimulation } = useNotification(); // Use hook

    const handleSend = () => {
        // Simulate Logic
        if (balance < 500) {
             notifyError("Failed", "Insufficient balance for this operation.");
        } else {
             notifySuccess("Sent!", "Transfer of 5,000 DZD successful.");
             setTimeout(onBack, 1000); // Go back after toast
        }
    };

    return (
        <div className="pt-4 space-y-6">
            <div className="flex items-center gap-4 mb-2 animate-pop-in">
                <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full text-slate-600 hover:scale-110 transition-transform"><Icon name="arrow_back" /></button>
                <h2 className="text-xl font-display font-bold text-slate-900">Send Money</h2>
            </div>
            
            {/* ... Existing Input UI ... */}
            
            <div className="glass-panel p-6 rounded-2xl animate-pop-in">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Available Balance</span>
                <h2 className="text-3xl font-display font-bold text-slate-900 mt-1">{balance.toLocaleString()} <span className="text-lg text-slate-400">DZD</span></h2>
            </div>

            <div className="space-y-4 animate-pop-in delay-100">
                <Input label="Recipient" placeholder="Name or Phone Number" icon="person" />
                <Input label="Amount" placeholder="0.00" type="number" icon="attach_money" />
            </div>

            <div className="pt-8 animate-pop-in delay-300">
                 <Button onClick={handleSend}>Send Now <Icon name="send" /></Button>
            </div>

            {/* Test Button for Notification Simulation */}
            <button onClick={triggerSimulation} className="w-full py-2 text-xs font-bold text-slate-400 uppercase border border-dashed border-slate-300 rounded-xl hover:bg-white">
                Simulate Incoming Server Notification
            </button>
        </div>
    );
};