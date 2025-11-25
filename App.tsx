import React, { useState } from 'react';
import { AppView, Transaction, TransactionType, User } from './types';
import { Icon, BottomNav } from './components/UIComponents';
import { interpretVoiceCommand } from './services/geminiService';
import { LanguageProvider } from './context/LanguageContext';
// --- CONTEXT PROVIDERS ---
import { FraudProvider } from './context/FraudContext';
import { CreditProvider } from './context/CreditContext';
import { DeclarationProvider } from './context/DeclarationContext';
import { NotificationProvider } from './context/NotificationContext';

// --- UI COMPONENTS ---
import { NotificationUI } from './components/NotificationOverlay';

// --- SCREENS ---
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignupScreen } from './screens/SignupScreen';
import { VerificationScreen } from './screens/VerificationScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AIAssistantScreen } from './screens/AIAssistantScreen';
import { ScanScreen } from './screens/ScanScreen';
import { CreditScoreScreen } from './screens/CreditScoreScreen';
import { MapScreen } from './screens/MapScreen';
import { BillsScreen } from './screens/BillsScreen';
import { TopUpScreen } from './screens/TopUpScreen';
import { SendMoneyScreen } from './screens/SendMoneyScreen';

// Financial Features
import { LoanRequestScreen } from './screens/LoanRequestScreen';
import { FraudSettingsScreen } from './screens/FraudSettingsScreen';
import { DeclarationCenterScreen } from './screens/DeclarationCenterScreen';
import { CreateDeclarationScreen } from './screens/CreateDeclarationScreen';

// --- Mock Data ---
const MOCK_USER: User = {
  id: 'u1',
  firstName: 'Amine',
  lastName: 'Benali',
  balance: 145200.5,
  isVerified: true,
  monthlyIncome: 85000,
  city: 'Algiers',
  creditScore: 720
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: TransactionType.PAYMENT, amount: -1500, category: 'Utilities', merchant: 'Sonelgaz', date: new Date().toISOString().split('T')[0], status: 'completed' },
  { id: '2', type: TransactionType.PAYMENT, amount: -4500, category: 'Groceries', merchant: 'Uno Hypermarket', date: '2023-10-24', status: 'completed' },
  { id: '3', type: TransactionType.DEPOSIT, amount: 85000, category: 'Salary', recipient: 'Tech Corp SARL', date: new Date().toISOString().split('T')[0], status: 'completed' },
  { id: '4', type: TransactionType.TRANSFER, amount: -2000, category: 'P2P', recipient: 'Fatima Z.', date: '2023-10-18', status: 'completed' },
  { id: '5', type: TransactionType.PAYMENT, amount: -3200, category: 'Entertainment', merchant: 'Netflix', date: '2023-10-17', status: 'completed' },
];

const App = () => {
  const [view, setView] = useState<AppView | string>(AppView.LANDING);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lang, setLang] = useState('dz');

  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    birthYear: '',
    birthDay: '',
    city: '',
    gender: '',
    nid: '',
    age: ''
  });

  const [isListening, setIsListening] = useState(false);

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

  const handleLoanBalanceUpdate = (amount: number) => {
    setUser(prev => ({ ...prev, balance: prev.balance + amount }));
  };

  const handleNav = (v: string | AppView) => {
    if (typeof v === 'string' && v in AppView) {
      setView(AppView[v as keyof typeof AppView]);
    } else {
      setView(v);
    }
  };

  const handleVoiceCommand = async () => {
    if (isListening) { setIsListening(false); return; }
    setIsListening(true);

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice recognition not supported in this browser.");
      setIsListening(false);
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-DZ';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      console.log("Voice Input:", text);
      setIsListening(false);

      const result = await interpretVoiceCommand(text);
      console.log("Interpreted Command:", result);

      if (result.intent === 'SEND_MONEY') setView(AppView.SEND_MONEY);
      else if (result.intent === 'CHECK_BALANCE') setView(AppView.HOME);
      else if (result.intent === 'LOANS') setView(AppView.LOANS);
      else alert(`Didn't understand: "${text}"`);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSendMoney = (amount: number, recipient: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: TransactionType.TRANSFER,
      amount: -amount,
      category: 'Transfer',
      recipient,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    setTransactions([newTransaction, ...transactions]);
    setUser({ ...user, balance: user.balance - amount });
    setView(AppView.HOME);
  };

  const getActiveTab = (currentView: AppView | string) => {
    if (currentView === AppView.HOME) return 'HOME';
    if (currentView === AppView.SEND_MONEY) return 'SEND_MONEY';
    if (currentView === AppView.LOANS) return 'LOANS';
    if (currentView === AppView.AI_ASSISTANT) return 'AI_ASSISTANT';
    if (currentView === AppView.MAP) return 'MAP';
    const mapping: Record<string, string> = {
      'LOANS': 'LOANS',
      'FRAUD_SETTINGS': 'HOME',
      'DECLARATION_CENTER': 'HOME',
      'CREATE_DECLARATION': 'HOME'
    };
    return typeof currentView === 'string' ? mapping[currentView] || 'HOME' : 'HOME';
  };

  const showVoiceAssist = true;

  return (
    <LanguageProvider>
      <NotificationProvider lang={lang}>
      <FraudProvider>
        <CreditProvider userProfile={user} onBalanceUpdate={handleLoanBalanceUpdate}>
          <DeclarationProvider>
            <div className="bg-slate-100 min-h-screen font-sans text-slate-900 flex justify-center items-center py-0 sm:py-6 selection:bg-blue-200">
              <div className="w-full h-screen sm:h-[92vh] sm:max-w-[400px] bg-slate-50 sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col border-[0px] sm:border-[8px] border-white ring-1 ring-black/5 transform transition-transform duration-300">

                <NotificationUI lang={lang} />

                {/* Header */}
                {isAuthenticated && ![AppView.LANDING, AppView.LOGIN, AppView.SIGNUP_FORM, AppView.AI_ASSISTANT].includes(view as AppView) && (
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

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setView(AppView.CREDIT_SCORE)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full border ${tier.border} ${tier.bg} hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-sm`}
                      >
                        <div className="flex -space-x-1">
                          {Array.from({ length: Math.min(3, tier.stars) }).map((_, i) => (
                            <React.Fragment key={i}>
                              <Icon name="star" className={`text-[10px] ${tier.color}`} />
                            </React.Fragment>
                          ))}
                        </div>
                        <span className={`text-[10px] font-bold ${tier.color}`}>{user.creditScore}</span>
                      </button>

                      <button className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md active:scale-95 transition">
                        <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Amine" alt="profile" className="w-full h-full object-cover"/>
                      </button>
                    </div>
                  </div>
                )}

                {/* MAIN CONTENT */}
                <div className="flex-1 overflow-y-auto no-scrollbar relative p-6 pb-32">
                  {view === AppView.LANDING && <LandingScreen onLogin={() => setView(AppView.LOGIN)} onSignup={() => setView(AppView.SIGNUP_FORM)} />}
                  {view === AppView.LOGIN && <LoginScreen onBack={() => setView(AppView.LANDING)} onLoginSuccess={() => { setIsAuthenticated(true); setView(AppView.HOME); }} />}
                  {view === AppView.SIGNUP_FORM && <SignupScreen data={signupData} onChange={setSignupData} onNext={() => setView(AppView.VERIFICATION)} onBack={() => setView(AppView.LANDING)} />}
                  {view === AppView.VERIFICATION && <VerificationScreen userData={signupData} onComplete={() => { setUser({ ...MOCK_USER, firstName: signupData.firstName || 'User', city: signupData.city, isVerified: true, age: parseInt(signupData.age) || 30, gender: signupData.gender as any, nid: signupData.nid }); setIsAuthenticated(true); setView(AppView.HOME); }} onBack={() => setView(AppView.SIGNUP_FORM)} />}
                  {view === AppView.HOME && <HomeScreen user={user} tier={tier} transactions={transactions} onNavigate={handleNav} onRequestVerification={() => setView(AppView.VERIFICATION)} />}
                  {view === AppView.SEND_MONEY && <SendMoneyScreen balance={user.balance} onBack={() => setView(AppView.HOME)} onSend={handleSendMoney} />}
                  {view === AppView.AI_ASSISTANT && <AIAssistantScreen history={transactions} />}
                  {view === AppView.BILLS && <BillsScreen onBack={() => setView(AppView.HOME)} />}
                  {view === AppView.TOPUP && <TopUpScreen onBack={() => setView(AppView.HOME)} />}
                  {view === AppView.SCAN && <ScanScreen onBack={() => setView(AppView.HOME)} />}
                  {view === AppView.CREDIT_SCORE && <CreditScoreScreen user={user} tier={tier} onBack={() => setView(AppView.HOME)} />}
                  {view === AppView.MAP && <MapScreen onBack={() => setView(AppView.HOME)} />}
                  {(view === AppView.LOANS || view === 'LOANS') && <LoanRequestScreen user={user} onBack={() => setView(AppView.HOME)} lang={lang} />}
                  {view === 'FRAUD_SETTINGS' && <FraudSettingsScreen onBack={() => setView(AppView.HOME)} lang={lang} />}
                  {view === 'DECLARATION_CENTER' && <DeclarationCenterScreen onNavigate={setView} lang={lang} />}
                  {view === 'CREATE_DECLARATION' && <CreateDeclarationScreen onNavigate={setView} lang={lang} />}
                </div>

                {/* BOTTOM NAV */}
                {isAuthenticated && ![AppView.LANDING, AppView.LOGIN, AppView.SIGNUP_FORM].includes(view as AppView) && (
                  <div className="absolute bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
                    <div className="pointer-events-auto w-full flex justify-center">
                      <BottomNav activeTab={getActiveTab(view)} onTabChange={handleNav} showVoiceAssist={showVoiceAssist} isListening={isListening} onVoiceClick={handleVoiceCommand} />
                    </div>
                  </div>
                )}

              </div>
            </div>
          </DeclarationProvider>
        </CreditProvider>
      </FraudProvider>
    </NotificationProvider>
    </LanguageProvider>
  );
};

export default App;