// --- START OF FILE screens/AIAssistantScreen.tsx ---
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../components/UIComponents';
import { chatWithAssistant } from '../services/geminiService'; // Ensure this stub exists or mock it locally if missing

export const AIAssistantScreen = ({ history }: any) => {
    const [messages, setMessages] = useState<any[]>([
        { id: 1, text: "Saha Amine! I see you spent less on food this week. Rak mlih! 🇩🇿", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const endRef = useRef<any>(null);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;
        setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user' }]);
        setInput('');
        setIsTyping(true);

        // Simulation
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now()+1, text: "I'm checking your accounts... (Demo Mode)", sender: 'ai' }]);
        }, 1500);
    };

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const chips = [
        { icon: "💰", label: "Spend Check" },
        { icon: "📈", label: "My Income" },
        { icon: "🚨", label: "Security" }
    ];

    return (
        <div className="h-full flex flex-col relative">
            
            {/* AI Header */}
            <div className="bg-white/80 backdrop-blur-md p-4 flex items-center gap-3 border-b border-blue-100 rounded-3xl mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Icon name="smart_toy" />
                </div>
                <div>
                    <h2 className="font-display font-bold text-slate-800">Al-Wassit Pilot</h2>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Online</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 px-1 pb-2">
                {chips.map((c, i) => (
                    <button key={i} onClick={() => handleSend(c.label)} className="flex items-center gap-1 bg-white border border-slate-100 px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-slate-600 hover:text-blue-600 whitespace-nowrap active:scale-95 transition">
                        <span>{c.icon}</span> {c.label}
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 px-2 pb-24">
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                         <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${m.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
                             <Icon name={m.sender === 'user' ? 'person' : 'smart_toy'} />
                         </div>
                         <div className={`p-3 rounded-2xl text-sm max-w-[80%] leading-relaxed ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-br-sm shadow-md' : 'bg-white text-slate-700 rounded-bl-sm border border-slate-100 shadow-sm'}`}>
                             {m.text}
                         </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Icon name="more_horiz" className="animate-bounce text-blue-500"/></div>
                    </div>
                )}
                <div ref={endRef}></div>
            </div>

            {/* Input Bar - POSITION FIXED RELATIVE TO PARENT */}
            <div className="absolute bottom-4 left-0 right-0 bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100 flex items-center gap-2">
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                    className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-700 placeholder-slate-400 text-sm"
                    placeholder="Ask AI..."
                />
                <button onClick={() => handleSend(input)} className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg active:scale-90 transition">
                    <Icon name="send" className="text-sm transform rotate-45 -ml-1 mt-1" />
                </button>
            </div>
        </div>
    );
};