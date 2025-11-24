import { FraudEvent } from '../types';
import { predictFraud } from './geminiFraudService';

export const detectSuspiciousActivity = async (
    transaction: any,
    user: any
): Promise<FraudEvent | null> => {
    const rulesTriggered: string[] = [];
    
    // 1. Static Rule: Max Amount
    if (transaction.amount > 100000) {
        rulesTriggered.push("Exceeds limit (100k DZD)");
    }

    // 2. Hybrid AI Assessment
    const aiResult = await predictFraud(transaction, user);
    
    const combinedScore = (rulesTriggered.length * 0.2) + aiResult.fraudProbability;

    // Threshold logic
    if (combinedScore > 0.6 || rulesTriggered.length > 0) {
        return {
            id: `evt_${Date.now()}`,
            timestamp: Date.now(),
            score: Math.min(combinedScore, 1),
            severity: combinedScore > 0.8 ? 'CRITICAL' : 'HIGH',
            reasons: [...rulesTriggered, ...aiResult.reasons],
            transactionDetails: {
                amount: transaction.amount,
                currency: 'DZD',
                merchant: transaction.merchant || 'Unknown',
                location: transaction.location || 'Unknown',
                device: transaction.device || 'Unknown'
            },
            status: 'PENDING'
        };
    }

    return null;
};