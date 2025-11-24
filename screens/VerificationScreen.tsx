
import React, { useState, useEffect } from 'react';
import { Icon } from '../components/UIComponents';

export const VerificationScreen = ({ userData, onComplete, onBack }: { userData: any, onComplete: () => void, onBack: () => void }) => {
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
