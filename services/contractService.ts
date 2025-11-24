// --- START OF FILE services/contractService.ts ---
export const generateContractId = () => `CTR-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`;

export const generateContractText = (user: any, amount: number) => {
    return `
    REPUBLIC OF ALGERIA
    DIGITAL LOAN AGREEMENT - AL-WASSIT
    
    Parties:
    Lender: Al-Wassit Trust Fund
    Borrower: ${user.firstName} ${user.lastName}
    
    Loan Details:
    Principal Amount: ${amount.toLocaleString()} DZD
    Term: 12 Months
    Interest Rate: 1.5% (Platinum Tier)
    
    Declaration:
    By digitally signing this document, the Borrower acknowledges receipt of funds and agrees to the automated repayment schedule deducted from their main balance.
    
    Contract ID: ${generateContractId()}
    Date: ${new Date().toLocaleDateString()}
    `;
};