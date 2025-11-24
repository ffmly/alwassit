
interface FraudAssessment {
    fraudProbability: number;
    reasons: string[];
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const predictFraud = async (
    transaction: any, 
    userProfile: any
): Promise<FraudAssessment> => {
    // Hackathon Simulation: Simulate network latency for AI request
    await delay(600); 

    const reasons: string[] = [];
    let score = 0.1;

    // AI Logic Simulation
    if (transaction.amount > 50000) {
        score += 0.4;
        reasons.push("High Value / Montant 3ali");
    }

    if (transaction.location && transaction.location !== userProfile?.homeCity) {
        score += 0.35;
        reasons.push(`Unusual Location (${transaction.location}) / Blassa B3ida`);
    }

    // "Blacklisted IP" simulation
    if (transaction.ip && transaction.ip.startsWith('192.168.0.')) { 
        // local dev IPs are fine, this is just example logic
    } else if (transaction.country !== 'DZ') {
         score += 0.2;
         reasons.push("Foreign IP Address / IP Etranger");
    }

    return {
        fraudProbability: Math.min(score, 0.99),
        reasons
    };
};