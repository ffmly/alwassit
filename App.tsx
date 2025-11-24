// --- START OF FILE App.tsx ---

import React, { useState } from 'react';

// --- CONTEXT PROVIDERS ---
import { FraudProvider } from './context/FraudContext';
import { CreditProvider } from './context/CreditContext';
import { DeclarationProvider } from './context/DeclarationContext';
import { NotificationProvider } from './context/NotificationContext';

// --- UI COMPONENTS ---
import { BottomNav } from './components/UIComponents';
// FIX: Import the standalone NotificationUI to place it manually in the layout
import { NotificationUI } from './components/NotificationOverlay';

// --- SCREENS ---
// Auth & Onboarding
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignupScreen } from './screens/SignupScreen';
import { VerificationScreen } from './screens/VerificationScreen';

// Main Dashboard & Utils
import { HomeScreen } from './screens/HomeScreen';
import { AIAssistantScreen } from './screens/AIAssistantScreen';
import { ScanScreen } from './screens/ScanScreen';

// Financial Features
import { CreditScoreScreen } from './screens/CreditScoreScreen';
import { LoanRequestScreen } from './screens/LoanRequestScreen';
import { BillsScreen } from './screens/BillsScreen';
import { TopUpScreen } from './screens/TopUpScreen';
import { SendMoneyScreen } from './screens/SendMoneyScreen';

// Security & Support Modules
import { FraudSettingsScreen } from './screens/FraudSettingsScreen';
import { DeclarationCenterScreen } from './screens/DeclarationCenterScreen';
import { CreateDeclarationScreen } from './screens/CreateDeclarationScreen';

const App = () => {
  // Navigation & Auth State
  const [view, setView] = useState('LANDING');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lang, setLang] = useState('dz'); // Default: Darja

  // --- MOCK USER DATA ---
  const [user, setUser] = useState({
    firstName: "Amine",
    lastName: "Benali",
    balance: 124500, // DZD
    creditScore: 780, // Trust Score
    monthlyIncome: 85000,
    isVerified: true,
    homeCity: "Algiers",
    knownDevice: "iPhone 13",
    accountTier: "platinum"
  });

  const transactions = [
    { id: 1, amount: -4500, category: 'Shopping', merchant: 'Zara Home', date: 'Today' },
    { id: 2, amount: 2000, category: 'Transfer', merchant: 'Karim B.', date: 'Yesterday' },
    { id: 3, amount: -1200, category: 'Food', merchant: 'Yassir Food', date: '21 Nov' },
  ];

  const tiers = {
    platinum: {
        name: 'Platinum',
        stars: 5,
        gradient: 'from-fuchsia-600 to-purple-600',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        maxLoan: 500000
    }
  };

  // Helper to update balance when a Loan is approved
  const handleLoanBalanceUpdate = (amount: number) => {
      setUser(prev => ({ ...prev, balance: prev.balance + amount }));
  };

  // Determine active tab for BottomNav highlighting
  const getActiveTab = (currentView: string) => {
      const mapping: Record<string, string> = {
          'LOANS': 'LOANS',
          'SEND_MONEY': 'SEND_MONEY',
          'AI_ASSISTANT': 'AI_ASSISTANT',
          'HOME': 'HOME',
          // Mappings for sub-screens
          'CREDIT_SCORE': 'HOME',
          'BILLS': 'HOME',
          'TOPUP': 'HOME',
          'SCAN': 'HOME',
          'FRAUD_SETTINGS': 'HOME',
          'DECLARATION_CENTER': 'HOME',
          'CREATE_DECLARATION': 'HOME'
      };
      return mapping[currentView] || 'HOME';
  };

  return (
    // 1. Context Wrappers (Providers logic only, no UI injection)
    <NotificationProvider lang={lang}>
      <FraudProvider>
        <CreditProvider userProfile={user} onBalanceUpdate={handleLoanBalanceUpdate}>
          <DeclarationProvider>
            
            {/* 2. Global Centering Container */}
            <div className="bg-slate-100 min-h-screen font-sans text-slate-900 flex justify-center items-center py-0 sm:py-6 selection:bg-blue-200">
                
                {/* 3. MOBILE PHONE FRAME (Relative Context) */}
                <div className="w-full h-screen sm:h-[92vh] sm:max-w-[400px] bg-slate-50 sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col border-[0px] sm:border-[8px] border-white ring-1 ring-black/5 transform transition-transform duration-300">

                    {/* ✅ FIX: Notification UI lives INSIDE the phone frame now */}
                    <NotificationUI lang={lang} />

                    {/* --- HEADER --- 
                        Visible only on inner screens when logged in.
                    */}
                    {isAuthenticated && !['LANDING', 'LOGIN', 'SIGNUP', 'AI_ASSISTANT'].includes(view) && (
                         <div className="px-6 pt-8 sm:pt-6 pb-2 flex justify-between items-center bg-slate-50/80 backdrop-blur-sm z-30 sticky top-0 transition-all">
                            <div 
                                onClick={() => setLang(prev => prev === 'en' ? 'dz' : 'en')}
                                className="cursor-pointer group select-none"
                            >
                                <h1 className="text-xl font-display font-bold text-slate-900 group-active:scale-95 transition-transform">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Al-Wassit
                                    </span>
                                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        {lang.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md active:scale-95 transition">
                                <img src="https://i.pravatar.cc/150?u=amine" alt="profile" className="w-full h-full object-cover"/>
                            </button>
                        </div>
                    )}

                    {/* --- MAIN CONTENT AREA --- */}
                    <div className="flex-1 overflow-y-auto no-scrollbar relative p-6 pb-32">
                        
                        {/* --- PUBLIC VIEWS --- */}
                        {view === 'LANDING' && (
                            <LandingScreen 
                                onLogin={() => setView('LOGIN')} 
                                onSignup={() => setView('SIGNUP')} 
                            />
                        )}
                        
                        {view === 'LOGIN' && (
                            <LoginScreen 
                                onBack={() => setView('LANDING')} 
                                onLoginSuccess={() => { setIsAuthenticated(true); setView('HOME'); }} 
                            />
                        )}
                        
                        {view === 'SIGNUP' && (
                            <SignupScreen 
                                data={user} onChange={() => {}} 
                                onNext={() => setView('VERIFICATION')}
                                onBack={() => setView('LANDING')}
                            />
                        )}

                        {view === 'VERIFICATION' && (
                            <VerificationScreen 
                                userData={user}
                                onComplete={() => { setIsAuthenticated(true); setView('HOME'); }}
                                onBack={() => setView('SIGNUP')}
                            />
                        )}

                        {/* --- DASHBOARD & UTILS --- */}
                        {view === 'HOME' && (
                            <HomeScreen 
                                user={user} 
                                tier={tiers.platinum} 
                                transactions={transactions}
                                onNavigate={setView}
                                onRequestVerification={() => setView('VERIFICATION')}
                            />
                        )}

                        {view === 'CREDIT_SCORE' && <CreditScoreScreen user={user} tier={tiers.platinum} onBack={() => setView('HOME')} />}
                        {view === 'BILLS' && <BillsScreen onBack={() => setView('HOME')} />}
                        {view === 'TOPUP' && <TopUpScreen onBack={() => setView('HOME')} />}
                        {view === 'SEND_MONEY' && <SendMoneyScreen balance={user.balance} onBack={() => setView('HOME')} />}
                        {view === 'SCAN' && <ScanScreen onBack={() => setView('HOME')} />}
                        {view === 'AI_ASSISTANT' && <AIAssistantScreen history={transactions} />}

                        {/* --- FEATURE: LOANS (Signed Contract) --- */}
                        {view === 'LOANS' && <LoanRequestScreen user={user} onBack={() => setView('HOME')} lang={lang} />}

                        {/* --- FEATURE: FRAUD & SECURITY --- */}
                        {view === 'FRAUD_SETTINGS' && <FraudSettingsScreen onBack={() => setView('HOME')} lang={lang} />}

                        {/* --- FEATURE: USER DECLARATIONS --- */}
                        {view === 'DECLARATION_CENTER' && <DeclarationCenterScreen onNavigate={setView} lang={lang} />}
                        {view === 'CREATE_DECLARATION' && <CreateDeclarationScreen onNavigate={setView} lang={lang} />}

                    </div>

                    {/* --- BOTTOM NAVIGATION --- */}
                    {isAuthenticated && !['LANDING', 'LOGIN', 'SIGNUP'].includes(view) && (
                        <div className="absolute bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
                            <div className="pointer-events-auto">
                                <BottomNav 
                                    activeTab={getActiveTab(view)} 
                                    onTabChange={setView} 
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>

          </DeclarationProvider>
        </CreditProvider>
      </FraudProvider>
    </NotificationProvider>
  );
};

export default App;