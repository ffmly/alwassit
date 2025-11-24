
import React from 'react';
import { Icon } from '../components/UIComponents';

export const CreditScoreScreen = ({ user, tier, onBack }: any) => {
    // Gauge calculations
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - ((user.creditScore / 850) * circumference);

    return (
        <div className="pt-4 space-y-6 h-full flex flex-col">
             <div className="flex items-center gap-4 mb-2 animate-pop-in">
                <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full text-slate-600 hover:scale-110 transition-transform"><Icon name="arrow_back" /></button>
                <h2 className="text-xl font-display font-bold text-slate-900">Wassit Trust Score</h2>
            </div>

            <div className="flex-1 flex flex-col items-center perspective-1000 overflow-y-auto no-scrollbar pb-20">
                {/* 3D Gauge Container */}
                <div className="relative w-80 h-80 flex items-center justify-center mb-8 float-3d animate-pop-in mt-4">
                    {/* Background Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-tr ${tier.gradient} rounded-full blur-[80px] opacity-20 animate-pulse`}></div>
                    
                    {/* SVG Gauge */}
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-xl p-4" viewBox="0 0 256 256">
                        {/* Background Track */}
                        <circle cx="128" cy="128" r={radius} stroke="#f1f5f9" strokeWidth="20" fill="none" className="backdrop-blur-sm" />
                        
                        {/* Ticks Ring (Static) */}
                        {Array.from({length: 60}).map((_, i) => (
                            <line 
                                key={i}
                                x1="128" y1="40" x2="128" y2={i % 5 === 0 ? "50" : "45"}
                                transform={`rotate(${i * 6} 128 128)`}
                                className={i * 6 <= (user.creditScore/850)*360 ? "stroke-slate-400" : "stroke-slate-200"}
                                strokeWidth={i % 5 === 0 ? "2" : "1"}
                            />
                        ))}

                        {/* Progress Circle Gradient Defs */}
                         <defs>
                            <linearGradient id={`grad-${tier.name}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={tier.name === 'Platinum' ? '#d946ef' : tier.name === 'Gold' ? '#fbbf24' : '#94a3b8'} />
                                <stop offset="100%" stopColor={tier.name === 'Platinum' ? '#8b5cf6' : tier.name === 'Gold' ? '#f97316' : '#475569'} />
                            </linearGradient>
                        </defs>
                        
                        {/* Progress Arc */}
                        <circle 
                            cx="128" cy="128" r={radius} 
                            stroke={`url(#grad-${tier.name})`} 
                            strokeWidth="20" 
                            fill="none" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={offset} 
                            strokeLinecap="round" 
                            className="transition-all duration-1000 ease-out" 
                        />
                    </svg>

                    {/* Center Text & Badge */}
                    <div className="absolute flex flex-col items-center justify-center w-48 h-48 bg-white/50 backdrop-blur-xl rounded-full border border-white/50 shadow-inner">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</span>
                        <span className="text-6xl font-display font-extrabold text-slate-800 tracking-tighter">{user.creditScore}</span>
                        <span className={`text-sm font-bold bg-gradient-to-r ${tier.gradient} text-transparent bg-clip-text uppercase tracking-widest mt-1`}>{tier.name}</span>
                        
                        {/* Stars Display */}
                        <div className="flex gap-1 mt-3">
                            {Array.from({length: 5}).map((_, i) => (
                                <React.Fragment key={i}>
                                    <Icon 
                                        name="star" 
                                        className={`text-[14px] ${i < tier.stars ? tier.color : 'text-slate-200'}`} 
                                    />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="w-full space-y-4 animate-pop-in delay-200 px-2">
                    <div className="flex items-center justify-between">
                         <h3 className="font-bold text-slate-900">Tier Benefits</h3>
                         <span className={`text-xs font-bold px-2 py-1 rounded-lg ${tier.bg} ${tier.color} border ${tier.border}`}>Level {tier.stars}/5</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <div className={`glass-panel p-4 rounded-2xl flex items-center gap-4 bg-white/60 border-l-4 ${tier.name === 'Platinum' || tier.name === 'Gold' ? 'border-green-500' : 'border-slate-300'} shadow-sm`}>
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shadow-sm"><Icon name="payments" /></div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm">Instant Micro-Loans</h4>
                                <p className="text-xs text-slate-500">Up to {tier.maxLoan.toLocaleString()} DZD approval.</p>
                            </div>
                            {tier.stars < 4 && <Icon name="lock" className="text-slate-300" />}
                        </div>
                        
                        <div className={`glass-panel p-4 rounded-2xl flex items-center gap-4 bg-white/60 border-l-4 ${tier.name === 'Platinum' ? 'border-purple-500' : 'border-slate-300'} shadow-sm`}>
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm"><Icon name="diamond" /></div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm">VIP Concierge</h4>
                                <p className="text-xs text-slate-500">24/7 Priority Support & Travel Perks.</p>
                            </div>
                             {tier.stars < 5 && <Icon name="lock" className="text-slate-300" />}
                        </div>

                        <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 bg-white/60 border-l-4 border-blue-500 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm"><Icon name="savings" /></div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm">Zero Fees</h4>
                                <p className="text-xs text-slate-500">On all local transfers under 10k DZD.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
