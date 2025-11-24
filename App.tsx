
import React, { useState, useEffect, useRef } from 'react';
import { 
  AreaChart, Area, Tooltip, ResponsiveContainer, XAxis 
} from 'recharts';
import { AppView, Transaction, TransactionType, User } from './types';
import { getFinancialAdvice, assessLoanRisk, chatWithAssistant } from './services/geminiService';
import { Icon, Button, Input, Card, BottomNav } from './components/UIComponents';

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

const SpendingData = [
  { name: 'Mon', amount: 1200 },
  { name: 'Tue', amount: 2800 },
  { name: 'Wed', amount: 1400 },
  { name: 'Thu', amount: 500 },
  { name: 'Fri', amount: 4500 },
  { name: 'Sat', amount: 6500 },
  { name: 'Sun', amount: 2500 },
];

// --- Main Component ---
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

  const [pin, setPin] = useState('');
  
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

  // Landing Screen
  if (view === AppView.LANDING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-between p-8 text-center relative overflow-hidden perspective-2000">
        
        <div className="z-10 flex flex-col items-center justify-center flex-1 w-full perspective-1000">
            <div className="relative w-40 h-40 mb-12 preserve-3d animate-[float_4s_ease-in-out_infinite] hover:rotate-y-12 transition-transform duration-500 cursor-pointer">
                <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] rotate-6 opacity-20 blur-xl"></div>
                <div className="relative w-full h-full bg-white/60 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(37,99,235,0.3)] border border-white/50">
                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
                         <Icon name="account_balance_wallet" className="text-5xl drop-shadow-md" />
                    </div>
                </div>
            </div>
            
            <h1 className="text-6xl font-display font-extrabold mb-4 tracking-tighter text-slate-900 drop-shadow-sm animate-pop-in">
                Al-<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Wassit</span>
            </h1>
            <p className="text-slate-500 text-lg mb-12 max-w-xs leading-relaxed animate-pop-in delay-100 font-medium">
                The future of Algerian finance. <br/> <span className="text-blue-600 font-semibold bg-blue-50/50 px-2 py-1 rounded-lg mt-2 inline-block backdrop-blur-sm border border-blue-100">Secure. Instant. Limitless.</span>
            </p>
            
            <div className="w-full max-w-xs space-y-4">
                <Button onClick={() => setView(AppView.LOGIN)} delay="delay-200">
                    Log In
                </Button>
                <Button variant="secondary" onClick={() => setView(AppView.SIGNUP_FORM)} delay="delay-300">
                    Create Account
                </Button>
            </div>
        </div>
        
        <p className="z-10 text-xs text-slate-400 mt-4 uppercase tracking-widest font-semibold animate-pop-in delay-500">Hackathon Edition v2.1</p>
      </div>
    );
  }

  // Login Screen
  if (view === AppView.LOGIN) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        
        <button onClick={() => setView(AppView.LANDING)} className="absolute top-8 left-6 text-slate-500 hover:text-slate-800 z-20 transition-colors p-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:scale-110 active:scale-95 duration-200 border border-white/50">
          <Icon name="arrow_back" />
        </button>

        <div className="w-24 h-24 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 flex items-center justify-center mb-8 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.15)] animate-pop-in float-3d">
            <Icon name="lock" className="text-blue-600 text-4xl drop-shadow-sm" />
        </div>

        <h1 className="text-3xl font-display font-bold mb-2 text-slate-900 animate-pop-in delay-100">Welcome Back</h1>
        <p className="text-slate-500 mb-10 animate-pop-in delay-200 font-medium">Authenticate to access your vault</p>
        
        <div className="w-full max-w-xs space-y-8 z-10 animate-pop-in delay-300">
          <div className="flex justify-center gap-4">
            {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 border border-slate-300 shadow-inner ${pin.length > i ? 'bg-blue-600 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-110' : 'bg-white/50'}`}></div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-[280px] mx-auto perspective-1000">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button 
                    key={n} 
                    onClick={() => {
                        const newPin = pin + n;
                        setPin(newPin);
                        if (newPin.length === 4) setView(AppView.HOME);
                    }}
                    className="w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 hover:border-blue-300 flex items-center justify-center text-xl font-bold text-slate-700 transition-all active:scale-90 active:bg-blue-50/50 shadow-[0_4px_0_0_rgba(203,213,225,0.6)] hover:shadow-[0_6px_0_0_rgba(203,213,225,0.6)] active:shadow-none translate-y-0 active:translate-y-1"
                >
                    {n}
                </button>
            ))}
             <div className="w-16 h-16"></div>
             <button 
                onClick={() => {
                    const newPin = pin + '0';
                    setPin(newPin);
                    if (newPin.length === 4) setView(AppView.HOME);
                }}
                className="w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 hover:border-blue-300 flex items-center justify-center text-xl font-bold text-slate-700 transition-all active:scale-90 active:bg-blue-50/50 shadow-[0_4px_0_0_rgba(203,213,225,0.6)] hover:shadow-[0_6px_0_0_rgba(203,213,225,0.6)] active:shadow-none translate-y-0 active:translate-y-1"
            >
                0
            </button>
             <button onClick={() => setPin(pin.slice(0, -1))} className="w-16 h-16 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors active:scale-90"><Icon name="backspace" /></button>
          </div>

          <Button variant="secondary" className="mt-4 shadow-none border-transparent bg-transparent hover:bg-white/20" onClick={() => setView(AppView.HOME)}>
             <Icon name="face" className="text-blue-500" /> Face ID
          </Button>
        </div>
      </div>
    );
  }

  // Common Header Logic
  const showHeader = [AppView.HOME, AppView.SEND_MONEY, AppView.LOANS, AppView.AI_ASSISTANT, AppView.BILLS, AppView.TOPUP, AppView.CREDIT_SCORE].includes(view);

  return (
    <div className="min-h-screen bg-transparent text-slate-900 font-sans max-w-md mx-auto relative overflow-hidden border-x border-white/20 perspective-2000 shadow-2xl">
        
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
                        <Icon key={i} name="star" className={`text-[12px] ${tier.color}`} />
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
      <div className="px-5 pb-32 pt-4 min-h-screen">
        {view === AppView.SIGNUP_FORM && (
          <SignupFormView 
            data={signupData} 
            onChange={setSignupData} 
            onNext={() => setView(AppView.VERIFICATION)}
            onBack={() => setView(AppView.LANDING)}
          />
        )}
        
        {view === AppView.VERIFICATION && (
          <VerificationView 
            userData={signupData}
            onComplete={() => {
              setUser({ ...MOCK_USER, firstName: signupData.firstName || 'User', city: signupData.city, isVerified: true });
              setView(AppView.HOME);
            }}
            onBack={() => setView(AppView.SIGNUP_FORM)}
          />
        )}

        {view === AppView.HOME && (
          <HomeView 
            user={user} 
            transactions={transactions} 
            onNavigate={handleNav} 
            onRequestVerification={() => setView(AppView.VERIFICATION)}
            tier={tier}
          />
        )}
        
        {view === AppView.SEND_MONEY && <SendMoneyView balance={user.balance} onBack={() => setView(AppView.HOME)} />}
        {view === AppView.LOANS && <LoanView user={user} tier={tier} />}
        {view === AppView.AI_ASSISTANT && <AIAssistantView history={transactions} />}
        {view === AppView.BILLS && <BillsView onBack={() => setView(AppView.HOME)} />}
        {view === AppView.TOPUP && <TopUpView onBack={() => setView(AppView.HOME)} />}
        {view === AppView.SCAN && <ScanView onBack={() => setView(AppView.HOME)} />}
        {view === AppView.CREDIT_SCORE && <CreditScoreView user={user} tier={tier} onBack={() => setView(AppView.HOME)} />}
      </div>

      {/* Bottom Navigation */}
      {[AppView.HOME, AppView.SEND_MONEY, AppView.LOANS, AppView.AI_ASSISTANT, AppView.BILLS, AppView.TOPUP].includes(view) && (
        <BottomNav activeTab={AppView[view]} onTabChange={handleNav} />
      )}
    </div>
  );
};

// --- View Components ---

const SignupFormView = ({ data, onChange, onNext, onBack }: any) => {
  const handleChange = (field: string, value: string) => onChange({ ...data, [field]: value });
  const isValid = data.firstName && data.lastName && data.birthYear && data.city;

  return (
    <div className="pt-8 h-full flex flex-col relative">
      <button onClick={onBack} className="absolute top-0 left-0 text-slate-500 hover:text-slate-800 p-2 bg-white/50 rounded-full shadow-sm border border-white hover:scale-110 transition-transform">
        <Icon name="arrow_back" />
      </button>
      
      <div className="mb-8 mt-12 animate-pop-in">
        <h2 className="text-3xl font-display font-bold text-slate-900">Join the Future</h2>
        <p className="text-slate-500 mt-2">Create your digital identity.</p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4">
          <Input label="First Name" placeholder="Amine" value={data.firstName} onChange={(e: any) => handleChange('firstName', e.target.value)} delay="delay-100" />
          <Input label="Last Name" placeholder="Benali" value={data.lastName} onChange={(e: any) => handleChange('lastName', e.target.value)} delay="delay-200" />
        </div>
        <div className="flex gap-4">
           <Input label="Birth Year" type="number" placeholder="1995" value={data.birthYear} onChange={(e: any) => handleChange('birthYear', e.target.value)} delay="delay-300" />
           <Input label="Birthday" type="date" value={data.birthDay} onChange={(e: any) => handleChange('birthDay', e.target.value)} delay="delay-300" />
        </div>
        <Input label="City" placeholder="Algiers" icon="location_on" value={data.city} onChange={(e: any) => handleChange('city', e.target.value)} delay="delay-400" />
      </div>

      <div className="flex-1"></div>
      <Button onClick={onNext} disabled={!isValid} delay="delay-500">
        Proceed to Biometrics <Icon name="fingerprint" />
      </Button>
    </div>
  );
};

const VerificationView = ({ userData, onComplete, onBack }: { userData: any, onComplete: () => void, onBack: () => void }) => {
  const [step, setStep] = useState(1);
  const [analysisText, setAnalysisText] = useState("Initializing Biometrics...");

  useEffect(() => {
    if (step === 4) {
      const sequences = [
        "Scanning Document Hologram...",
        `Extracting Data: ${userData.firstName} ${userData.lastName}...`,
        "Analyzing Facial Topology...",
        "Cross-referencing National Database...",
        "Verification Successful."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setAnalysisText(sequences[i]);
        i++;
        if (i >= sequences.length) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
        }
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [step, onComplete, userData]);

  return (
    <div className="h-full flex flex-col pt-4">
       <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full text-slate-600 border border-transparent hover:border-white"><Icon name="arrow_back" /></button>
        <h2 className="text-xl font-bold font-display text-slate-900">Identity Verification</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8 perspective-1000">
        {step < 4 && (
            <div className="relative transform-style-3d animate-pop-in">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-2xl blur opacity-75 animate-pulse"></div>
                <div className="relative w-72 h-[400px] bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-2xl overflow-hidden transform transition-transform hover:rotate-y-6 hover:rotate-x-6 duration-500">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=1000&auto=format&fit=crop')] bg-cover opacity-10 grayscale"></div>
                    
                    {/* Scanning Grid Animation */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] animate-[scan_2.5s_ease-in-out_infinite]"></div>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                         <div className="w-24 h-24 border-2 border-slate-300/50 rounded-lg flex items-center justify-center mb-4 bg-white/50 backdrop-blur-sm shadow-inner">
                            <Icon name={step === 3 ? "face" : "badge"} className="text-5xl text-slate-400" />
                         </div>
                         <h3 className="text-xl font-bold text-slate-800 mb-2">{step === 3 ? "Selfie Verification" : `Scan ID ${step === 1 ? 'Front' : 'Back'}`}</h3>
                         <p className="text-xs text-slate-500">Align within the frame for auto-capture</p>
                    </div>

                    {/* Corner Brackets */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
            </div>
        )}

        {step < 4 ? (
            <button 
                onClick={() => setStep(step + 1)}
                className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center group transition-all hover:scale-110 shadow-lg shadow-blue-100 animate-pop-in delay-200"
            >
                <div className="w-16 h-16 bg-blue-600 rounded-full shadow-lg group-hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Icon name="camera" className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </button>
        ) : (
            <div className="flex flex-col items-center animate-pop-in">
                <div className="w-32 h-32 relative mb-8">
                     <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                     <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin reverse"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold font-mono text-blue-600">{Math.floor(Math.random() * 99)}%</span>
                     </div>
                </div>
                <p className="text-blue-600 font-mono text-sm tracking-wider animate-pulse">{analysisText}</p>
            </div>
        )}
      </div>
    </div>
  );
};

const HomeView = ({ user, transactions, onNavigate, onRequestVerification, tier }: any) => {
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
                        {Array.from({length: tier.stars}).map((_,i) => <Icon key={i} name="star" className={`text-[10px] ${tier.name === 'Gold' ? 'text-amber-400' : 'text-blue-400'}`} />)}
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
      <div className="grid grid-cols-4 gap-4 perspective-1000">
        {[
          { icon: 'send', label: 'Send', action: 'SEND_MONEY', color: 'text-blue-600 bg-blue-50/80', border: 'border-blue-100', delay: 'delay-200' },
          { icon: 'receipt_long', label: 'Bills', action: 'BILLS', color: 'text-purple-600 bg-purple-50/80', border: 'border-purple-100', delay: 'delay-300' },
          { icon: 'add_card', label: 'Top-up', action: 'TOPUP', color: 'text-pink-600 bg-pink-50/80', border: 'border-pink-100', delay: 'delay-400' },
          { icon: 'qr_code_scanner', label: 'Scan', action: 'SCAN', color: 'text-emerald-600 bg-emerald-50/80', border: 'border-emerald-100', delay: 'delay-500' }
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(item.action)}
            className={`flex flex-col items-center gap-3 group animate-pop-in ${item.delay}`}
          >
            <div className={`w-16 h-16 rounded-2xl ${item.color} backdrop-blur-md border ${item.border} flex items-center justify-center float-3d transition-all duration-300 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <Icon name={item.icon} className="text-2xl" />
            </div>
            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 tracking-wide transition-colors">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Analytics */}
      <Card noPadding className="bg-white/60 backdrop-blur-md border-slate-100 shadow-sm" delay="delay-200">
        <div className="p-5 flex justify-between items-center border-b border-slate-100/50">
          <h3 className="font-bold text-slate-800">Spending Flow</h3>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-100">▼ 12% vs last week</span>
        </div>
        <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SpendingData}>
                    <defs>
                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" animationDuration={2000} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </Card>

      {/* Transactions */}
      <div>
        <h3 className="font-bold text-lg text-slate-900 mb-4 animate-pop-in delay-300">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.map((tx, idx) => (
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

// --- Features Views (Styled) ---

const CreditScoreView = ({ user, tier, onBack }: any) => {
    // Gauge calculations
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    // Calculate offset based on score (max 850). We want it to be a partial circle (approx 260 degrees) or full.
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
                                <Icon 
                                    key={i} 
                                    name="star" 
                                    className={`text-[14px] ${i < tier.stars ? tier.color : 'text-slate-200'}`} 
                                />
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

const BillsView = ({ onBack }: { onBack: () => void }) => {
    const [billState, setBillState] = useState<'IDLE' | 'FETCHING' | 'FOUND' | 'PAID'>('IDLE');
    const billers = [
        { name: 'Sonelgaz', icon: 'lightbulb', color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
        { name: 'SEAAL', icon: 'water_drop', color: 'text-blue-600 bg-blue-50 border-blue-100' },
        { name: 'Alg. Telecom', icon: 'router', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
        { name: 'AADL', icon: 'home', color: 'text-purple-600 bg-purple-50 border-purple-100' }
      ];

    return (
        <div className="pt-4 space-y-6">
            <div className="flex items-center gap-4 mb-2 animate-pop-in">
                <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full text-slate-600 hover:scale-110 transition-transform"><Icon name="arrow_back" /></button>
                <h2 className="text-xl font-display font-bold text-slate-900">Pay Bills</h2>
            </div>
            
            {billState === 'IDLE' && (
                <div className="grid grid-cols-2 gap-4 perspective-1000">
                    {billers.map((b, i) => (
                        <button 
                            key={b.name} 
                            onClick={() => setBillState('FETCHING')} 
                            className={`glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 transition group bg-white/60 backdrop-blur-md border border-slate-100 float-3d animate-pop-in`}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${b.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                <Icon name={b.icon} className="text-3xl" />
                            </div>
                            <span className="font-bold text-slate-800">{b.name}</span>
                        </button>
                    ))}
                </div>
            )}
            
            {billState === 'FETCHING' && (
                <div className="flex flex-col items-center justify-center h-64 space-y-6 animate-pop-in">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"></div>
                         <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin reverse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Icon name="cloud_sync" className="text-blue-600 animate-pulse text-3xl" />
                        </div>
                    </div>
                    <p className="font-mono text-blue-600 animate-pulse">Secure Handshake...</p>
                    <button onClick={() => setBillState('FOUND')} className="text-xs underline text-slate-400 hover:text-slate-600">Debug: Found</button>
                </div>
            )}

            {billState === 'FOUND' && (
                <Card className="animate-pop-in border-blue-100 bg-white/90 shadow-xl rotate-1">
                     <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashed border-slate-200">
                        <span className="text-slate-500">Invoice #INV-9923</span>
                        <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded border border-red-100 animate-pulse">Unpaid</span>
                     </div>
                     <h3 className="text-4xl font-bold text-slate-900 mb-1">4,500.00 <span className="text-sm text-slate-400">DZD</span></h3>
                     <p className="text-slate-500 text-sm mb-6">Due Date: 25 Oct 2023</p>
                     <Button onClick={() => setBillState('PAID')}>Pay Now</Button>
                </Card>
            )}

            {billState === 'PAID' && (
                 <div className="flex flex-col items-center justify-center h-64 space-y-6 text-center animate-pop-in">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
                        <Icon name="check" className="text-4xl text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Payment Confirmed</h3>
                    <Button variant="outline" onClick={onBack}>Return Home</Button>
                 </div>
            )}
        </div>
    )
}

const TopUpView = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="pt-4 space-y-6">
             <div className="flex items-center gap-4 mb-2 animate-pop-in">
                <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full text-slate-600 hover:scale-110 transition-transform"><Icon name="arrow_back" /></button>
                <h2 className="text-xl font-display font-bold text-slate-900">Digital Services</h2>
            </div>
            
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 animate-pop-in delay-100">Entertainment</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 perspective-1000 px-1">
                        {['Netflix', 'Spotify', 'Disney+', 'Shahid'].map((n, i) => (
                            <div key={n} className={`min-w-[100px] aspect-square glass-panel rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-white/50 border border-slate-100 shadow-sm float-3d animate-pop-in`} style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shadow-inner"><Icon name="play_circle" className="text-slate-600 text-2xl" /></div>
                                <span className="text-xs font-medium text-slate-700">{n}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 animate-pop-in delay-200">Gaming</h3>
                    <div className="grid grid-cols-2 gap-4 perspective-1000">
                        {['Free Fire', 'PUBG', 'Steam', 'Valorant'].map((g, i) => (
                            <div key={g} className={`glass-panel p-4 rounded-2xl flex items-center gap-3 hover:border-blue-400 transition cursor-pointer bg-white/50 border border-slate-100 shadow-sm float-3d animate-pop-in`} style={{ animationDelay: `${(i+2) * 100}ms` }}>
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    <Icon name="sports_esports" className="text-white" />
                                </div>
                                <span className="font-bold text-sm text-slate-800">{g}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 animate-pop-in delay-300">Mobile Data</h3>
                    <div className="grid grid-cols-3 gap-3 perspective-1000">
                         {['Djezzy', 'Mobilis', 'Ooredoo'].map((m, i) => (
                             <button key={m} className={`py-3 rounded-xl bg-white/50 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all font-bold text-sm text-slate-600 float-3d animate-pop-in`} style={{ animationDelay: `${(i+4) * 100}ms` }}>
                                {m}
                             </button>
                         ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ScanView = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black z