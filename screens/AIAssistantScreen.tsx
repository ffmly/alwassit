
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
        <div className="h-full flex flex-col pt-4 pb-24 relative">
             <div className="mb-4 animate-pop-in px-2">
                <h2 className="text-2xl font-display font-bold text-slate-900">Al-Wassit AI</h2>
                <p className="text-slate-500 text-sm">Your financial co-pilot.</p>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-2 px-2">
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
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white text-slate-700 rounded-tl-sm border border-slate-100'}`}>
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

            <div className="absolute bottom-24 left-0 right-0 px-4">
                <div className="relative">
                    <Input 
                        value={input} 
                        onChange={(e: any) => setInput(e.target.value)} 
                        placeholder="Ask anything in English or Darja..." 
                        className="shadow-xl"
                    />
                    <button 
                        onClick={() => handleSend(input)}
                        className="absolute right-2 top-2 p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                    >
                        <Icon name="send" />
                    </button>
                </div>
            </div>
        </div>
    );
};
