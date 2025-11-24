// --- START OF FILE context/CreditContext.tsx ---
import React, { createContext, useContext, useState } from 'react';
import { CreditAssessment } from '../types';
import { assessCreditEligibility } from '../services/creditAIService';
import { generateContractText } from '../services/contractService';

interface CreditContextType {
    creditsUsedThisYear: number;
    checkEligibility: (amount: number) => Promise<CreditAssessment>;
    requestContract: (amount: number) => string;
    completeLoan: (contractId: string, signature: string) => Promise<boolean>;
    resetCredits: () => void; // For demo/debug
}

// User Mock Extension
export const initialCreditState = {
    creditsUsed: 1, // Start with 1 used for realism
    maxCredits: 3,
    lastLoanDate: "2024-03-10"
};

const CreditContext = createContext<CreditContextType | null>(null);

export const CreditProvider = ({ children, userProfile, onBalanceUpdate }: any) => {
    const [creditsUsedThisYear, setCreditsUsed] = useState(initialCreditState.creditsUsed);

    const checkEligibility = async (amount: number) => {
        // Enforce Limit
        if (creditsUsedThisYear >= initialCreditState.maxCredits) {
            return {
                eligible: false,
                maxAmount: 0,
                trustScoreImpact: 0,
                riskLevel: 'HIGH' as const,
                reasons: ["Yearly Limit Reached (3/3 Credits). Try next year."]
            };
        }
        return await assessCreditEligibility(userProfile, amount);
    };

    const requestContract = (amount: number) => {
        return generateContractText(userProfile, amount);
    };

    const completeLoan = async (contractId: string, signature: string) => {
        // Simulate Backend Transaction
        await new Promise(r => setTimeout(r, 2000));
        
        // Update Local State
        setCreditsUsed(prev => prev + 1);
        
        // Callback to App to update main wallet balance (Mock)
        if (onBalanceUpdate) onBalanceUpdate(50000); // Adding example amount

        console.log(`Loan Finalized. ID: ${contractId}. Signature: ${signature.substring(0,20)}...`);
        return true;
    };

    const resetCredits = () => setCreditsUsed(0);

    return (
        <CreditContext.Provider value={{ creditsUsedThisYear, checkEligibility, requestContract, completeLoan, resetCredits }}>
            {children}
        </CreditContext.Provider>
    );
};

export const useCredit = () => {
    const context = useContext(CreditContext);
    if (!context) throw new Error("useCredit must be used within CreditProvider");
    return context;
};