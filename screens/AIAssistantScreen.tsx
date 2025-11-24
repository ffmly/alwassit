
import React, { useState, useRef, useEffect } from 'react';
import { Icon, Input } from '../components/UIComponents';
import { chatWithAssistant } from '../services/geminiService';

export const AIAssistantScreen = ({ history }: any) => {
    const [messages, setMessages] = useState<any[]>([
        { id: 1, text: "Welcome back, Amine! I've noticed you spent 12% less on groceries this week. Keep it up! 🇩🇿", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const endRef = useRef<any>(null);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Calculate Context
        const totalSpent = history.filter((t: any) => t.amount < 0).reduce((acc: number, t: any) => acc + Math.abs(t.amount), 0);
        const context = `User spent ${totalSpent} DZD recently. Top category: Groceries.`;

        const response = await chatWithAssistant(text, context);

        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'ai' }]);
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const chips = ["💰 Today's Spend", "📈 Monthly Income", "🚨 Risk Check"];

    return (
        <div className="h-full flex flex-col relative">
            <div className="pt-4 px-4 mb-2 animate-pop-in flex-none">
                <h2 className="text-2xl font-display font-bold text-slate-900">Al-Wassit AI</h2>
                <p className="text-slate-500 text-sm">Your financial co-pilot.</p>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-2 px-4 flex-none">
                {chips.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => handleSend(c)}
                        className="whitespace-nowrap px-4 py-2 rounded-full bg-white/50 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-blue-600 hover:text-white transition-colors shadow-sm"
                    >
                        {c}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-pop-in`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 rounded-tl-sm border border-slate-100'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white/50 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
                <div ref={endRef}></div>
            </div>

            <div className="flex-none p-4 pb-24 z-20">
                <div className="glass-panel p-2 rounded-[2rem] flex items-center gap-2 shadow-xl border border-white/60 bg-white/40 backdrop-blur-xl">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-500 px-4 py-2 text-sm font-medium"
                        onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                    />
                    <button
                        onClick={() => handleSend(input)}
                        disabled={!input.trim()}
                        className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Icon name="send" className="text-[20px]" />
                    </button>
                </div>
            </div>
        </div>
    );
};
