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
  gender?: 'Male' | 'Female';
  nid?: string;
  age?: number;
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
  CREDIT_SCORE,
  MAP
}

// --- FRAUD DETECTION TYPES (Imene) ---
export type FraudSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FraudEvent {
    id: string;
    timestamp: number;
    score: number; // 0.0 to 1.0
    severity: FraudSeverity;
    reasons: string[]; 
    transactionDetails: {
        amount: number;
        currency: string;
        merchant?: string;
        location: string;
        device: string;
    };
    status: 'PENDING' | 'BLOCKED' | 'ALLOWED' | 'FLAGGED';
}

export interface FraudSettings {
    sensitivity: 'RELAXED' | 'STANDARD' | 'PARANOID';
    autoFreeze: boolean;
    notifications: {
        push: boolean;
        sms: boolean;
    };
}

// --- CREDIT & LOAN CONTRACT TYPES (Imene) ---
export interface CreditAssessment {
    eligible: boolean;
    maxAmount: number;
    trustScoreImpact: number; // e.g., +15
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    reasons: string[];
}

export interface ContractData {
    id: string;
    timestamp: number;
    amount: number;
    fees: number;
    borrowerName: string;
    borrowerId: string;
    signatureImage: string; // Base64
    termsVersion: string;
}

// --- DECLARATION TYPES (Imene) ---
export type DeclarationCategory = 
  | 'TRANSACTION' 
  | 'REPORT_USER' 
  | 'ACCOUNT' 
  | 'FRAUD_SECURITY' 
  | 'TECH_ISSUE' 
  | 'LOAN_CONTRACT' 
  | 'KYC_UPDATE' 
  | 'GENERAL';

export interface Declaration {
  id: string;
  userId: string;
  category: DeclarationCategory;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: number;
  formData: Record<string, any>;
  aiSummary: string;
  signature: string; // Base64
  attachments?: string[];
}

// --- NOTIFICATION TYPES (Imene) ---
export type NotificationType = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: number;
    amount?: number; // Optional context
    actionLabel?: string;
    onAction?: () => void;
}