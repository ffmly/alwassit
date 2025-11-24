
import React from 'react';
import { Icon, Button, Input } from '../components/UIComponents';

export const SendMoneyScreen = ({ balance, onBack }: { balance: number, onBack: () => void }) => {
    return (
        <div className="pt-4 space-y-6">
            <div className="flex items-center gap-4 mb-2 animate-pop-in">
                <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full text-slate-600 hover:scale-110 transition-transform"><Icon name="arrow_back" /></button>
                <h2 className="text-xl font-display font-bold text-slate-900">Send Money</h2>
            </div>

            <div className="glass-panel p-6 rounded-2xl animate-pop-in">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Available Balance</span>
                <h2 className="text-3xl font-display font-bold text-slate-900 mt-1">{balance.toLocaleString()} <span className="text-lg text-slate-400">DZD</span></h2>
            </div>

            <div className="space-y-4 animate-pop-in delay-100">
                <Input label="Recipient" placeholder="Name or Phone Number" icon="person" />
                <Input label="Amount" placeholder="0.00" type="number" icon="attach_money" />
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 animate-pop-in delay-200">Recent Contacts</h3>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {['Fatima', 'Karim', 'Yasmine', 'Omar'].map((n, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group animate-pop-in" style={{ animationDelay: `${(i+2)*100}ms` }}>
                            <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <span className="font-bold text-slate-600 text-lg">{n[0]}</span>
                            </div>
                            <span className="text-xs font-medium text-slate-600">{n}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-8 animate-pop-in delay-300">
                 <Button>Send Now <Icon name="send" /></Button>
            </div>
        </div>
    );
};
