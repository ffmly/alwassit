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

    const chips = [
        { icon: "💰", label: "Today's Spend" },
        { icon: "📈", label: "Monthly Income" },
        { icon: "🚨", label: "Risk Check" }
    ];

    return (
        <div className="h-full flex flex-col relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
            {/* Header - Fixed at top */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Icon name="smart_toy" className="text-white text-xl" />
                    </div>
                    <div>
                        <h2 className="text-lg font-display font-bold text-slate-900">Al-Wassit AI</h2>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Online · Your financial co-pilot
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Action Chips */}
            <div className="px-4 py-3 bg-white/40 backdrop-blur-sm border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quick Actions</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {chips.map((c, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleSend(c.label)}
                            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                        >
                            <span className="text-sm">{c.icon}</span>
                            <span>{c.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages Container - Fixed padding */}
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-32 no-scrollbar">
                <div className="space-y-4 mb-4">
                    {messages.map((m, idx) => (
                        <div 
                            key={m.id} 
                            className={`flex gap-2 animate-pop-in items-start ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Avatar */}
                            {m.sender === 'ai' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md mt-0.5">
                                    <Icon name="smart_toy" className="text-white text-sm" />
                                </div>
                            )}
                            {m.sender === 'user' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md mt-0.5">
                                    <Icon name="person" className="text-white text-sm" />
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`} style={{ maxWidth: 'calc(100% - 48px)' }}>
                                <div 
                                    className={`inline-block px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                        m.sender === 'user' 
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                                            : 'bg-white text-slate-800 shadow-md border border-slate-100'
                                    }`}
                                    style={{
                                        borderBottomRightRadius: m.sender === 'user' ? '4px' : '16px',
                                        borderBottomLeftRadius: m.sender === 'ai' ? '4px' : '16px',
                                        maxWidth: '100%',
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word'
                                    }}
                                >
                                    {m.text}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 px-1">
                                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex gap-2 animate-pop-in items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md mt-0.5">
                                <Icon name="smart_toy" className="text-white text-sm" />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm border border-slate-100 shadow-md flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={endRef}></div>
                </div>
            </div>

            {/* Input Area - Fixed at bottom with proper spacing */}
            <div className="fixed bottom-24 left-0 right-0 bg-white/95 backdrop-blur-xl px-4 py-3">
                <div className="relative flex items-center gap-2 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all overflow-hidden">
                    <input
                        value={input}
                        onChange={(e: any) => setInput(e.target.value)}
                        onKeyPress={(e: any) => e.key === 'Enter' && !e.shiftKey && handleSend(input)}
                        placeholder="Ask anything in English or Darja..."
                        className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none rounded-2xl"
                    />
                    <button 
                        onClick={() => handleSend(input)}
                        disabled={!input.trim() || isTyping}
                        className="flex-shrink-0 mr-1.5 p-2.5 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 disabled:hover:bg-blue-600"
                    >
                        <Icon name="send" className="text-lg" />
                    </button>
                </div>
                <p className="text-[9px] text-slate-400 text-center mt-2">
                    Al-Wassit AI can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
};