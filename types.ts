
export enum TransactionType {
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
  DEPOSIT = 'DEPOSIT',
  LOAN = 'LOAN'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  recipient?: string;
  merchant?: string;
  date: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  balance: number;
  isVerified: boolean;
  monthlyIncome: number;
  city?: string;
  birthDate?: string;
  creditScore: number;
}

export interface LoanOffer {
  amount: number;
  durationMonths: number;
  interestRate: number;
  monthlyPayment: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  reasoning: string;
}

export enum AppView {
  LANDING,
  LOGIN,
  SIGNUP_FORM,
  VERIFICATION,
  HOME,
  SEND_MONEY,
  LOANS,
  AI_ASSISTANT,
  BILLS,
  TOPUP,
  SCAN,
  CREDIT_SCORE
}