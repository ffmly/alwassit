import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { Transaction } from "../types";

// Initialize Gemini
// Note: In a real app, never expose the key on the client side. 
// This is for demonstration within the secure runtime environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_FLASH = 'gemini-2.5-flash';

export const getFinancialAdvice = async (
  transactions: Transaction[], 
  language: 'en' | 'ar-DZ' = 'en'
): Promise<string> => {
  try {
    const txData = JSON.stringify(transactions.slice(0, 10)); // Analyze last 10
    const prompt = `
      You are a helpful Algerian financial assistant. 
      Analyze these recent transactions: ${txData}.
      Provide 3 short, actionable tips to save money or manage budget better.
      Context: The user is in Algeria using Dinar (DZD).
      Output Language: ${language === 'ar-DZ' ? 'Algerian Arabic (Darja)' : 'English'}.
      Keep it friendly and encouraging.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });

    return response.text || "Unable to generate advice at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI service is currently unavailable.";
  }
};

export const assessLoanRisk = async (
  amount: number,
  monthlyIncome: number,
  history: Transaction[]
): Promise<any> => {
  try {
    const prompt = `
      Act as a risk assessment engine for a micro-finance app in Algeria.
      User Income: ${monthlyIncome} DZD.
      Requested Loan: ${amount} DZD.
      Recent Activity: ${JSON.stringify(history.slice(0, 5))}.
      
      Determine if this loan should be approved. 
      Return JSON format.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            approved: { type: Type.BOOLEAN },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            reasoning: { type: Type.STRING },
            suggestedMaxAmount: { type: Type.NUMBER }
          },
          required: ["approved", "riskLevel", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Risk Assessment Error:", error);
    return { approved: false, reasoning: "AI Service Error" };
  }
};

export const chatWithAssistant = async (message: string, context: string): Promise<string> => {
    try {
        const prompt = `
            System: You are Al-Wassit's voice assistant. You speak English or Algerian Darja based on user input.
            User Context: ${context}
            User Message: ${message}
            
            Reply briefly (max 2 sentences).
        `;
        const response = await ai.models.generateContent({
            model: MODEL_FLASH,
            contents: prompt
        });
        return response.text || "I didn't catch that.";
    } catch (e) {
        return "Service unavailable.";
    }
}