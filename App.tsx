import React, { useState } from 'react';
import { AppView, Transaction, TransactionType, User } from './types';
import { Icon, BottomNav } from './components/UIComponents';

// Import Screens
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignupScreen } from './screens/SignupScreen';
import { VerificationScreen } from './screens/VerificationScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SendMoneyScreen } from './screens/SendMoneyScreen';
import { LoanScreen } from './screens/LoanScreen';
import { AIAssistantScreen } from './screens/AIAssistantScreen';
import { BillsScreen } from './screens/BillsScreen';
import { TopUpScreen } from './screens/TopUpScreen';
import { ScanScreen } from './screens/ScanScreen';
import { CreditScoreScreen } from './screens/CreditScoreScreen';

// --- Mock Data ---
const MOCK_USER: User = {
  id: 'u1',
  firstName: 'Amine',
  lastName: 'Benali',
  balance: 145200.50,
  isVerified: true, 
  monthlyIncome: 85000,
  city: 'Algiers',
  creditScore: 720 // Gold Tier
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: TransactionType.PAYMENT, amount: -1500, category: 'Utilities', merchant: 'Sonelgaz', date: new Date().toISOString().split('T')[0], status: 'completed' },
  { id: '2', type: TransactionType.PAYMENT, amount: -4500, category: 'Groceries', merchant: 'Uno Hypermarket', date: '2023-10-24', status: 'completed' },
  { id: '3', type: TransactionType.DEPOSIT, amount: 85000, category: 'Salary', recipient: 'Tech Corp SARL', date: new Date().toISOString().split('T')[0], status: 'completed' },
  { id: '4', type: TransactionType.TRANSFER, amount: -2000, category: 'P2P', recipient: 'Fatima Z.', date: '2023-10-18', status: 'completed' },
  { id: '5', type: TransactionType.PAYMENT, amount: -3200, category: 'Entertainment', merchant: 'Netflix', date: '2023-10-17', status: 'completed' },
];

const App = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  
  // Signup State
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    birthYear: '',
    birthDay: '',
    city: ''
  });

  const handleNav = (v: string) => setView(AppView[v as keyof typeof AppView]);

  // Helper to get Tier info
  const getTierInfo = (score: number) => {
    if (score >= 800) return { 
        name: 'Platinum', 
        color: 'text-fuchsia-600', 
        bg: 'bg-fuchsia-50', 
        border: 'border-fuchsia-200', 
        gradient: 'from-fuchsia-500 to-pink-500', 
        shadow: 'shadow-fuchsia-500/30',
        stars: 5,
        maxLoan: 500000
    };
    if (score >= 700) return { 
        name: 'Gold', 
        color: 'text-amber-500', 
        bg: 'bg-amber-50', 
        border: 'border-amber-200', 
        gradient: 'from-amber-400 to-orange-500', 
        shadow: 'shadow-amber-500/30',
        stars: 4,
        maxLoan: 200000
    };
    if (score >= 550) return { 
        name: 'Silver', 
        color: 'text-slate-600', 
        bg: 'bg-slate-50', 
        border: 'border-slate-200', 
        gradient: 'from-slate-400 to-slate-600', 
        shadow: 'shadow-slate-500/30',
        stars: 3,
        maxLoan: 50000
    };
    return { 
        name: 'Bronze', 
        color: 'text-orange-600', 
        bg: 'bg-orange-50', 
        border: 'border-orange-200', 
        gradient: 'from-orange-400 to-red-500', 
        shadow: 'shadow-orange-500/30',
        stars: 2,
        maxLoan: 10000
    };
  };

  const tier = getTierInfo(user.creditScore);

  // Common Header Logic
  const showHeader = [AppView.HOME, AppView.SEND_MONEY, AppView.LOANS, AppView.AI_ASSISTANT, AppView.BILLS, AppView.TOPUP, AppView.CREDIT_SCORE].includes(view);

  return (
    <div className="flex justify-center items-center min-h-screen p-0 md:p-8">
      {/* Desktop Frame Wrapper */}
      <div className="min-h-screen md:min-h-[800px] md:h-[850px] w-full md:max-w-[420px] bg-white/5 md:bg-white/30 backdrop-blur-3xl text-slate-900 font-sans relative overflow-hidden md:rounded-[3rem] border border-white/20 shadow-2xl md:ring-8 md:ring-white/20 perspective-2000">
        
        {/* Top Header */}
        {showHeader && (
            <div className="px-6 pt-12 pb-4 flex justify-between items-center sticky top-0 bg-white/10 backdrop-blur-xl z-40 border-b border-white/20 animate-pop-in">
            <div className="flex items-center gap-4" onClick={() => setView(AppView.HOME)}>
                <div className="relative group cursor-pointer hover:scale-110 transition-transform duration-300">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative w-10 h-10 rounded-full bg-white/80 border border-white flex items-center justify-center overflow-hidden shadow-sm">
                        <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Amine" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="flex flex-col">
                <span className="text-xs text-slate-600 font-bold tracking-wider uppercase">Hello, {user.firstName}</span>
                <span className="text-sm font-bold text-slate-900">Al-Wassit</span>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                {/* Credit Score Badge */}
                <button 
                onClick={() => setView(AppView.CREDIT_SCORE)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${tier.border} ${tier.bg} hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-sm`}
                >
                    <div className="flex -space-x-1">
                        {Array.from({length: Math.min(3, tier.stars)}).map((_, i) => (
                            <React.Fragment key={i}>
                                <Icon name="star" className={`text-[12px] ${tier.color}`} />
                            </React.Fragment>
                        ))}
                    </div>
                    <span className={`text-xs font-bold ${tier.color}`}>{user.creditScore}</span>
                </button>

                <button className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center border border-white hover:bg-white transition relative shadow-sm hover:shadow-md hover:-translate-y-1 duration-300">
                    <Icon name="notifications" className="text-slate-700" />
                    <div className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></div>
                </button>
            </div>
            </div>
        )}

        {/* Main Content Area */}
        <div className="px-5 pb-32 pt-4 h-full overflow-y-auto no-scrollbar">
            {view === AppView.LANDING && (
                <LandingScreen 
                    onLogin={() => setView(AppView.LOGIN)} 
                    onSignup={() => setView(AppView.SIGNUP_FORM)} 
                />
            )}

            {view === AppView.LOGIN && (
                <LoginScreen 
                    onBack={() => setView(AppView.LANDING)} 
                    onLoginSuccess={() => setView(AppView.HOME)} 
                />
            )}

            {view === AppView.SIGNUP_FORM && (
            <SignupScreen 
                data={signupData} 
                onChange={setSignupData} 
                onNext={() => setView(AppView.VERIFICATION)}
                onBack={() => setView(AppView.LANDING)}
            />
            )}
            
            {view === AppView.VERIFICATION && (
            <VerificationScreen 
                userData={signupData}
                onComplete={() => {
                setUser({ ...MOCK_USER, firstName: signupData.firstName || 'User', city: signupData.city, isVerified: true });
                setView(AppView.HOME);
                }}
                onBack={() => setView(AppView.SIGNUP_FORM)}
            />
            )}

            {view === AppView.HOME && (
            <HomeScreen 
                user={user} 
                transactions={transactions} 
                onNavigate={handleNav} 
                onRequestVerification={() => setView(AppView.VERIFICATION)}
                tier={tier}
            />
            )}
            
            {view === AppView.SEND_MONEY && <SendMoneyScreen balance={user.balance} onBack={() => setView(AppView.HOME)} />}
            {view === AppView.LOANS && <LoanScreen user={user} tier={tier} />}
            {view === AppView.AI_ASSISTANT && <AIAssistantScreen history={transactions} />}
            {view === AppView.BILLS && <BillsScreen onBack={() => setView(AppView.HOME)} />}
            {view === AppView.TOPUP && <TopUpScreen onBack={() => setView(AppView.HOME)} />}
            {view === AppView.SCAN && <ScanScreen onBack={() => setView(AppView.HOME)} />}
            {view === AppView.CREDIT_SCORE && <CreditScoreScreen user={user} tier={tier} onBack={() => setView(AppView.HOME)} />}
        </div>

        {/* Bottom Navigation */}
        {[AppView.HOME, AppView.SEND_MONEY, AppView.LOANS, AppView.AI_ASSISTANT, AppView.BILLS, AppView.TOPUP].includes(view) && (
            <BottomNav activeTab={AppView[view]} onTabChange={handleNav} />
        )}
      </div>
    </div>
  );
};

export default App;