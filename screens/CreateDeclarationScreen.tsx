// --- START OF FILE screens/CreateDeclarationScreen.tsx ---
import React, { useState } from 'react';
import { useDeclaration } from '../context/DeclarationContext';
import { DeclarationCategory } from '../types';
import { Icon, Button } from '../components/UIComponents';
import { DeclarationFormController } from '../components/DeclarationFormController';
import { SignaturePadModal } from '../components/SignaturePadModal'; // Reusing existing component
import { declarationTranslations } from '../i18n/declarationTranslations';

export const CreateDeclarationScreen = ({ onNavigate, lang='en' }: any) => {
    const { getSuggestion, generateDoc, addDeclaration } = useDeclaration();
    const [step, setStep] = useState(1);
    const [prompt, setPrompt] = useState('');
    const [category, setCategory] = useState<DeclarationCategory | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [docText, setDocText] = useState('');
    const [isSigning, setIsSigning] = useState(false);

    // @ts-ignore
    const t = declarationTranslations[lang] || declarationTranslations.en;

    const handleAI = async () => {
        if(!prompt) return;
        setIsAnalyzing(true);
        const { category } = await getSuggestion(prompt);
        setIsAnalyzing(false);
        setCategory(category);
        setStep(2);
    };

    const handleGenerateDoc = async () => {
        setIsAnalyzing(true);
        const text = await generateDoc(category!, formData);
        setDocText(text);
        setIsAnalyzing(false);
        setStep(3);
    };

    const handleFinalSubmit = async (sig: string) => {
        setIsSigning(false);
        setStep(4); // Processing UI
        await addDeclaration(category!, formData, docText, sig);
        // Could enable "Instant Freeze" Logic here for security types
        onNavigate('DECLARATION_CENTER');
    };

    // Category Grid
    const cats: {key: DeclarationCategory, icon: string, label: string}[] = [
        { key: 'TRANSACTION', icon: 'payments', label: 'Payments' },
        { key: 'FRAUD_SECURITY', icon: 'gpp_bad', label: 'Fraud/Hack' },
        { key: 'TECH_ISSUE', icon: 'bug_report', label: 'App Bug' },
        { key: 'ACCOUNT', icon: 'manage_accounts', label: 'Account' }
    ];

    return (
        <div className="h-full flex flex-col pt-4 relative">
             <div className="flex items-center gap-3 px-4 mb-2">
                 <button onClick={() => step === 1 ? onNavigate('DECLARATION_CENTER') : setStep(step - 1)} className="p-2 rounded-full bg-white shadow-sm text-slate-500">
                     <Icon name="arrow_back" />
                 </button>
                 <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-600 transition-all duration-500" style={{width: `${step * 25}%`}}></div>
                 </div>
                 <span className="text-xs font-bold text-slate-400">Step {step}/4</span>
             </div>

             <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
                
                {/* STEP 1: CATEGORY SELECTION */}
                {step === 1 && (
                    <div className="animate-pop-in space-y-6">
                        <h2 className="text-2xl font-display font-bold text-slate-800">What happened?</h2>
                        
                        {/* AI Input */}
                        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                            <label className="text-xs font-bold text-blue-500 mb-2 block flex items-center gap-1">
                                <Icon name="auto_awesome" /> AI Assistance
                            </label>
                            <textarea 
                                value={prompt} 
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t.aiPrompt} 
                                className="w-full h-24 text-sm resize-none focus:outline-none placeholder-slate-300" 
                            />
                            <div className="flex justify-end mt-2">
                                <button 
                                    onClick={handleAI} disabled={!prompt || isAnalyzing}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 active:scale-95 transition flex items-center gap-2">
                                    {isAnalyzing ? 'Thinking...' : t.aiButton} <Icon name="arrow_forward" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-center text-slate-400 font-bold uppercase mb-4 tracking-wider line-clamp-1 flex items-center gap-2">
                                <span className="h-[1px] flex-1 bg-slate-200"></span> 
                                {t.categories} 
                                <span className="h-[1px] flex-1 bg-slate-200"></span>
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {cats.map(c => (
                                    <button key={c.key} onClick={() => { setCategory(c.key); setStep(2); }} 
                                        className="p-4 bg-white/60 hover:bg-white border border-slate-100 rounded-2xl flex flex-col items-center gap-2 transition hover:shadow-md hover:scale-[1.02] group">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                                            <Icon name={c.icon} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600">{c.label}</span>
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => { setCategory('GENERAL'); setStep(2); }} className="w-full mt-3 py-3 text-xs text-slate-400 font-bold">Other / General Issue</button>
                        </div>
                    </div>
                )}

                {/* STEP 2: DETAILS FORM */}
                {step === 2 && category && (
                    <div className="animate-slide-up pb-20">
                         <h2 className="text-xl font-bold text-slate-800 mb-1">{t.cats[category]}</h2>
                         <p className="text-xs text-slate-500 mb-6">Please provide precise details for faster resolution.</p>
                         
                         <DeclarationFormController category={category} data={formData} onChange={(k, v) => setFormData(prev => ({...prev, [k]: v}))} />

                         <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
                            <div className="pointer-events-auto">
                                <Button onClick={handleGenerateDoc} disabled={isAnalyzing}>
                                    {isAnalyzing ? 'Generating Report...' : 'Next: Review Summary'}
                                </Button>
                            </div>
                         </div>
                    </div>
                )}

                {/* STEP 3: PREVIEW & CONFIRM */}
                {step === 3 && (
                    <div className="animate-slide-up">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 font-mono text-[10px] text-slate-600 leading-relaxed whitespace-pre-wrap shadow-inner h-96 overflow-y-auto">
                            {docText}
                        </div>
                        
                        <Button onClick={() => setIsSigning(true)} variant="primary">
                            <Icon name="history_edu" /> {t.confirmBtn}
                        </Button>
                    </div>
                )}
                
                {step === 4 && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-blue-600 font-bold animate-pulse">Submitting to Secure Ledger...</p>
                    </div>
                )}

             </div>

             <SignaturePadModal 
                isOpen={isSigning}
                onClose={() => setIsSigning(false)}
                onSign={handleFinalSubmit}
                contractText={docText} // We reuse the prop from Loan Feature
                lang={lang}
             />
        </div>
    );
};