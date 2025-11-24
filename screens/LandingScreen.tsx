
import React from 'react';
import { Button, Icon } from '../components/UIComponents';

export const LandingScreen = ({ onLogin, onSignup }: { onLogin: () => void, onSignup: () => void }) => {
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
              <Button onClick={onLogin} delay="delay-200">
                  Log In
              </Button>
              <Button variant="secondary" onClick={onSignup} delay="delay-300">
                  Create Account
              </Button>
          </div>
      </div>
      
      <p className="z-10 text-xs text-slate-400 mt-4 uppercase tracking-widest font-semibold animate-pop-in delay-500">Hackathon Edition v2.1</p>
    </div>
  );
};
