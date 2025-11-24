// --- START OF FILE context/DeclarationContext.tsx ---
import React, { createContext, useContext, useState } from 'react';
import { Declaration, DeclarationCategory } from '../types';
import { generateDeclarationSummary, classifyDeclaration } from '../services/aiDeclarationService';

interface DeclarationContextType {
  declarations: Declaration[];
  addDeclaration: (cat: DeclarationCategory, data: any, summary: string, sig: string) => Promise<string>;
  getSuggestion: (text: string) => Promise<{category: DeclarationCategory, confidence: number}>;
  generateDoc: (cat: DeclarationCategory, data: any) => Promise<string>;
}

const DeclarationContext = createContext<DeclarationContextType | null>(null);

export const DeclarationProvider = ({ children }: { children: React.ReactNode }) => {
  const [declarations, setDeclarations] = useState<Declaration[]>([
    {
      id: 'DEC-001',
      userId: 'USR-123',
      category: 'TRANSACTION',
      status: 'RESOLVED',
      severity: 'LOW',
      timestamp: Date.now() - 86400000 * 2,
      formData: {},
      aiSummary: 'Mock Summary',
      signature: ''
    }
  ]);

  const addDeclaration = async (category: DeclarationCategory, formData: any, aiSummary: string, signature: string) => {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1000));
      const newDec: Declaration = {
          id: `DEC-${Math.floor(Math.random()*10000)}`,
          userId: 'USR-123',
          category,
          status: 'OPEN',
          severity: formData.freezeRequest ? 'CRITICAL' : 'MEDIUM',
          timestamp: Date.now(),
          formData,
          aiSummary,
          signature
      };
      setDeclarations(prev => [newDec, ...prev]);
      return newDec.id;
  };

  return (
    <DeclarationContext.Provider value={{
        declarations,
        addDeclaration,
        getSuggestion: classifyDeclaration,
        generateDoc: generateDeclarationSummary
    }}>
      {children}
    </DeclarationContext.Provider>
  );
};

export const useDeclaration = () => {
    const ctx = useContext(DeclarationContext);
    if (!ctx) throw new Error("useDeclaration must be used within DeclarationProvider");
    return ctx;
};