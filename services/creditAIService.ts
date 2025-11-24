// --- START OF FILE services/creditAIService.ts ---
import { CreditAssessment } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const assessCreditEligibility = async (
    userProfile: any, 
    requestedAmount: number
): Promise<CreditAssessment> => {
    // Simulate AI Latency
    await delay(1500);

    const monthlyIncome = userProfile.monthlyIncome || 0;
    const currentScore = userProfile.creditScore || 0;
    
    // AI Logic Rules
    // 1. DTI (Debt to Income) rough check
    const isIncomeSufficient = monthlyIncome * 0.4 > (requestedAmount / 12); 
    
    // 2. Trust Score Impact
    const scoreImpact = Math.floor(requestedAmount / 5000); 

    if (currentScore < 500) {
        return {
            eligible: false,
            maxAmount: 0,
            trustScoreImpact: 0,
            riskLevel: 'HIGH',
            reasons: ["Trust Score below 500", "Payment history insufficient"]
        };
    }

    if (!isIncomeSufficient && requestedAmount > 10000) {
        return {
            eligible: false,
            maxAmount: monthlyIncome * 4,
            trustScoreImpact: -5,
            riskLevel: 'MEDIUM',
            reasons: ["Requested amount exceeds safe DTI ratio", "Suggest lowering amount"]
        };
    }

    return {
        eligible: true,
        maxAmount: Math.min(monthlyIncome * 5, userProfile.balance * 2),
        trustScoreImpact: +12,
        riskLevel: 'LOW',
        reasons: [
            "Consistent monthly income detected",
            "Trust Score allows Tier-1 interest rates",
            "Banking history is positive"
        ]
    };
};