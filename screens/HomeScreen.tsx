
import React, { useState } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { Icon, Card } from '../components/UIComponents';
import { AppView } from '../types';

const SpendingData = [
  { name: 'Mon', amount: 1200 },
  { name: 'Tue', amount: 2800 },
  { name: 'Wed', amount: 1400 },
  { name: 'Thu', amount: 500 },
  { name: 'Fri', amount: 4500 },
  { name: 'Sat', amount: 6500 },
  { name: 'Sun', amount: 2500 },
];

export const HomeScreen = ({ user, transactions, onNavigate, onRequestVerification, tier }: any) => {
  const [showRiskAlert, setShowRiskAlert] = useState(true);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Risk Alert */}
      {showRiskAlert && (
        <div className="relative group animate-pop-in">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-orange-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white/70 backdrop-blur-md border border-red-100 p-4 rounded-2xl flex gap-4 items-start shadow-sm hover:shadow-md transition-all">
                <div className="bg-red-50 p-2 rounded-lg">
                    <Icon name="gpp_maybe" className="text-red-500" />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-sm text-red-600 uppercase tracking-wider">Security Alert</h4>
                    <p className="text-xs text-slate-500 mt-1 mb-3">Login attempt detected from Marseille, France. Block if not you.</p>
                    <div className="flex gap-3">
                    <button onClick={() => setShowRiskAlert(false)} className="text-xs bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:scale-105 transition-all">Block Access</button>
                    <button onClick={() => setShowRiskAlert(false)} className="text-xs text-red-500 hover:text-red-700 transition">It was me</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Verification Banner */}
      {!user.isVerified && (
        <div onClick={onRequestVerification} className="glass-panel p-4 rounded-2xl flex justify-between items-center cursor-pointer group hover:shadow-lg transition-all border-l-4 border-blue-500 bg-white/70 animate-pop-in">
          <div className="flex gap-4 items-center">
            <div className="p-2 bg-blue-50 rounded-lg"><Icon name="fingerprint" className="text-blue-500" /></div>
            <div>
              <p className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">Complete Verification</p>
              <p className="text-xs text-slate-500">Unlock Tier 2 Limits</p>
            </div>
          </div>
          <Icon name="chevron_right" className="text-slate-400 group-hover:translate-x-1 transition-transform" />
        </div>
      )}

      {/* 3D Glass Credit Card */}
      <div className="perspective-1000 h-56 w-full cursor-pointer group animate-pop-in delay-100">
        <div className="card-3d relative w-full h-full rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)]">
            {/* Backgrounds */}
            <div className="absolute inset-0 bg-[#0f172a] z-0"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/60 rounded-full blur-[60px] mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/60 rounded-full blur-[50px] mix-blend-screen animate-pulse"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            
            {/* Holographic Finish */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* Content */}
            <div className="relative z-20 flex justify-between items-start transform transition-transform group-hover:translate-z-10">
                <div className="flex items-center gap-2">
                     <Icon name="contactless" className="text-white/70" />
                     <span className="text-xs font-mono text-white/50 tracking-widest">NFC PAY</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-display font-bold italic text-white/90">Al-Wassit <span className={`${tier.name === 'Gold' ? 'text-amber-400' : 'text-blue-400'}`}>{tier.name}</span></span>
                    <div className="flex gap-0.5 mt-1">
                        {Array.from({length: tier.stars}).map((_,i) => (
                             <React.Fragment key={i}>
                                <Icon name="star" className={`text-[10px] ${tier.name === 'Gold' ? 'text-amber-400' : 'text-blue-400'}`} />
                             </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative z-20 transform transition-transform group-hover:translate-z-20">
                 <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Total Balance</p>
                 <h2 className="text-3xl font-display font-bold text-white tracking-tight drop-shadow-md">
                    {user.balance.toLocaleString('fr-DZ')} <span className="text-blue-400 text-xl">DZD</span>
                 </h2>
            </div>

            <div className="relative z-20 flex justify-between items-end transform transition-transform group-hover:translate-z-10">
                <div className="flex flex-col">
                     <span className="text-[10px] text-slate-400 uppercase mb-1">Card Holder</span>
                     <span className="font-mono text-sm tracking-widest text-white/90 uppercase">{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex flex-col items-end">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 brightness-200 contrast-0 grayscale invert opacity-80" alt="Visa" />
                </div>
            </div>
        </div>
      </div>

      {/* Action Grid */}
<div className="grid grid-cols-6 gap-4 perspective-1000">
  {[
    {
      icon: 'send',
      label: 'Send',
      action: 'SEND_MONEY',
      color: 'text-blue-600 bg-blue-50/80',
      border: 'border-blue-100',
      delay: 'delay-200'
    },

    {
      icon: 'receipt_long',
      label: 'Bills',
      action: 'BILLS',
      color: 'text-purple-600 bg-purple-50/80',
      border: 'border-purple-100',
      delay: 'delay-300'
    },

    {
      icon: 'add_card',
      label: 'Top-up',
      action: 'TOPUP',
      color: 'text-pink-600 bg-pink-50/80',
      border: 'border-pink-100',
      delay: 'delay-400'
    },

    {
      icon: 'qr_code_scanner',
      label: 'Scan',
      action: 'SCAN',
      color: 'text-emerald-600 bg-emerald-50/80',
      border: 'border-emerald-100',
      delay: 'delay-500'
    },

    {
      icon: 'shield',
      label: 'Protect',
      action: 'FRAUD_SETTINGS',
      color: 'text-red-600 bg-red-50/80',
      border: 'border-red-100',
      delay: 'delay-600'
    },

    // ⭐ NEW SUPPORT BUTTON
    {
      icon: 'support_agent',
      label: 'Support',
      action: 'DECLARATION_CENTER',
      color: 'text-slate-600 bg-slate-50',
      border: 'border-slate-200',
      delay: 'delay-700'
    }

  ].map((item, i) => (
    <button
      key={i}
      onClick={() => onNavigate(item.action)}
      className={`flex flex-col items-center gap-3 group animate-pop-in ${item.delay}`}
    >
      <div
        className={`w-16 h-16 rounded-2xl ${item.color} backdrop-blur-md border ${item.border} flex items-center justify-center float-3d transition-all duration-300 relative overflow-hidden group-hover:scale-105 group-hover:shadow-md`}
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        <Icon name={item.icon} className="text-2xl" />
      </div>

      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 tracking-wide transition-colors">
        {item.label}
      </span>
    </button>
  ))}
</div>



      {/* Transactions */}
      <div>
        <h3 className="font-bold text-lg text-slate-900 mb-4 animate-pop-in delay-300">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.map((tx: any, idx: number) => (
            <div key={tx.id} className={`group flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm hover:bg-white/80 border border-slate-100/50 hover:border-slate-200 transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 animate-pop-in`} style={{ animationDelay: `${(idx + 3) * 100}ms` }}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} group-hover:scale-110 transition-transform`}>
                  <Icon name={tx.amount > 0 ? 'arrow_downward' : 'arrow_upward'} className="text-xl" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">{tx.merchant || tx.recipient || tx.category}</p>
                  <p className="text-xs text-slate-500">{tx.date} • {tx.category}</p>
                </div>
              </div>
              <span className={`font-mono font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                {tx.amount > 0 ? '+' : ''}{Math.abs(tx.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
