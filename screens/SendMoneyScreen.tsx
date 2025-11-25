import React from 'react';
import { Icon, Button, Input } from '../components/UIComponents';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

export const SendMoneyScreen = ({ balance, onBack, onSend }: { balance: number, onBack: () => void, onSend: (amount: number, recipient: string) => void }) => {
    const { notifySuccess, notifyError, triggerSimulation } = useNotification();
    const { t, isRTL } = useLanguage();
    const [recipient, setRecipient] = React.useState('');
    const [amount, setAmount] = React.useState('');

    const handleSend = () => {
        const numAmount = parseFloat(amount);
        if (!recipient) { notifyError(t('errorTitle'), "Recipient required"); return; }
        if (!numAmount || numAmount <= 0) { notifyError(t('errorTitle'), "Invalid amount"); return; }
        if (numAmount > balance) { notifyError(t('errorTitle'), "Insufficient funds"); return; }
        
        onSend(numAmount, recipient);
        notifySuccess(t('successSent'), `${numAmount.toLocaleString()} ${t('currency')} -> ${recipient}`);
        setTimeout(() => { setRecipient(''); setAmount(''); }, 1000);
    };

    return (
        <div className="pt-4 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-4 mb-2 animate-pop-in">
                <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full text-slate-600 hover:scale-110 transition-transform">
                    <Icon name="arrow_back" className={isRTL ? 'rotate-180' : ''} />
                </button>
                <h2 className="text-xl font-display font-bold text-slate-900">{t('sendMoneyTitle')}</h2>
            </div>

            <div className="glass-panel p-6 rounded-2xl animate-pop-in">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">{t('availBalance')}</span>
                <h2 className="text-3xl font-display font-bold text-slate-900 mt-1" dir="ltr">
                    <span className={isRTL ? 'block text-right' : ''}>{balance.toLocaleString()} <span className="text-lg text-slate-400">{t('currency')}</span></span>
                </h2>
            </div>

            <div className="space-y-4 animate-pop-in delay-100">
                <Input
                    label={t('recipient')}
                    placeholder={t('recipientPlaceholder')}
                    icon="person"
                    value={recipient}
                    onChange={(e: any) => setRecipient(e.target.value)}
                />
                <Input
                    label={t('amount')}
                    placeholder="0.00"
                    type="number"
                    icon="attach_money"
                    value={amount}
                    onChange={(e: any) => setAmount(e.target.value)}
                />
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 animate-pop-in delay-200">{t('recentContacts')}</h3>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {['Fatima', 'Karim', 'Yasmine', 'Omar'].map((n, i) => (
                        <div key={i} onClick={() => setRecipient(n)} className="flex flex-col items-center gap-2 cursor-pointer group animate-pop-in">
                            <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <span className="font-bold text-slate-600 text-lg">{n[0]}</span>
                            </div>
                            <span className="text-xs font-medium text-slate-600">{n}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-8 animate-pop-in delay-300">
                <Button onClick={handleSend}>{t('sendNow')} <Icon name={isRTL ? "send_check" : "send"} /></Button>
            </div>
            
             <button onClick={triggerSimulation} className="w-full py-2 text-xs font-bold text-slate-400 uppercase border border-dashed border-slate-300 rounded-xl hover:bg-white transition-colors">
                Debug: Incoming Op
            </button>
        </div>
    );
};