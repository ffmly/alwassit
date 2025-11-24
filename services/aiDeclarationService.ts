// --- START OF FILE services/aiDeclarationService.ts ---
import { DeclarationCategory } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const classifyDeclaration = async (text: string): Promise<{category: DeclarationCategory, confidence: number}> => {
  await delay(1200); // Simulate Gemini processing
  const lower = text.toLowerCase();
  
  if (lower.includes('stolen') || lower.includes('hack') || lower.includes('unknown') || lower.includes('block')) return { category: 'FRAUD_SECURITY', confidence: 0.95 };
  if (lower.includes('transfer') || lower.includes('sent') || lower.includes('money') || lower.includes('wrong')) return { category: 'TRANSACTION', confidence: 0.88 };
  if (lower.includes('crash') || lower.includes('slow') || lower.includes('bug') || lower.includes('error')) return { category: 'TECH_ISSUE', confidence: 0.85 };
  if (lower.includes('id') || lower.includes('passport') || lower.includes('photo')) return { category: 'KYC_UPDATE', confidence: 0.82 };
  if (lower.includes('loan') || lower.includes('credit') || lower.includes('interest')) return { category: 'LOAN_CONTRACT', confidence: 0.90 };
  
  return { category: 'GENERAL', confidence: 0.5 };
};

export const generateDeclarationSummary = async (category: string, data: any): Promise<string> => {
  await delay(1000);
  const date = new Date().toLocaleString();
  
  // Dynamic template based on form data
  return `OFFICIAL DECLARATION - AL-WASSIT
-----------------------------------
TYPE: ${category}
DATE: ${date}

USER STATEMENT:
"${data.description || 'No detailed description provided.'}"

KEY DETAILS:
- Subject: ${data.subject || 'N/A'}
- Reference ID: ${data.referenceId || 'N/A'}
- Amount in Dispute: ${data.amount ? data.amount + ' DZD' : 'N/A'}
- Priority Level: ${data.severity || 'Medium'}

AI ASSESSMENT:
The user has formally submitted this request via secure app channel. Authenticity verified by device signature.

I hereby certify that the information provided is true and correct to the best of my knowledge under penalty of perjury.
-----------------------------------`;
};