// --- START OF FILE components/DeclarationFormController.tsx ---
import React from 'react';
import { DeclarationCategory } from '../types';
import { Input, Icon } from './UIComponents';

interface Props {
  category: DeclarationCategory;
  data: any;
  onChange: (field: string, val: any) => void;
}

export const DeclarationFormController = ({ category, data, onChange }: Props) => {
  const handleChange = (e: any, field: string) => onChange(field, e.target.value);

  // Field Sets based on Category
  const renderFields = () => {
    switch (category) {
      case 'TRANSACTION':
        return (
          <>
            <Input label="Transaction ID (if known)" placeholder="#TX-12345" value={data.referenceId} onChange={(e:any) => handleChange(e, 'referenceId')} />
            <Input label="Amount (DZD)" type="number" placeholder="5000" icon="payments" value={data.amount} onChange={(e:any) => handleChange(e, 'amount')} />
            <Input label="Recipient Name/Phone" icon="person" value={data.subject} onChange={(e:any) => handleChange(e, 'subject')} />
            <label className="text-xs font-bold text-slate-500 uppercase mt-4 block">Problem Type</label>
            <select className="w-full bg-white/80 p-3 rounded-2xl text-sm border border-slate-200 mt-2" onChange={(e) => onChange('subType', e.target.value)}>
              <option>Duplicate Payment</option>
              <option>Wrong Amount</option>
              <option>Failed but Debited</option>
            </select>
          </>
        );

      case 'FRAUD_SECURITY':
        return (
          <>
            <div className="bg-red-50 p-3 rounded-xl flex gap-3 border border-red-100 mb-4">
               <Icon name="warning" className="text-red-500" />
               <p className="text-xs text-red-600 font-bold">This triggers an automatic security freeze option after submission.</p>
            </div>
            <Input label="Affected Card/Account" placeholder="Last 4 digits" value={data.referenceId} onChange={(e:any) => handleChange(e, 'referenceId')} />
            <Input label="Location (if suspicious)" icon="location_on" value={data.location} onChange={(e:any) => handleChange(e, 'location')} />
            <div className="flex items-center gap-3 my-4">
                 <input type="checkbox" className="w-5 h-5 rounded accent-red-600" onChange={(e) => onChange('freezeRequest', e.target.checked)}/>
                 <label className="text-sm font-bold text-slate-700">Request Instant Card Freeze</label>
            </div>
          </>
        );

      case 'TECH_ISSUE':
        return (
          <>
            <Input label="Feature causing error" placeholder="e.g. Loans, Login..." value={data.subject} onChange={(e:any) => handleChange(e, 'subject')} />
            <Input label="Device Model" placeholder="iPhone 13, Samsung S21..." value={data.device} onChange={(e:any) => handleChange(e, 'device')} />
             <label className="text-xs font-bold text-slate-500 uppercase mt-4 block">Screenshot Upload</label>
            <div className="h-24 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center mt-2 cursor-pointer hover:bg-slate-50">
               <span className="text-xs text-slate-400">Tap to upload proof</span>
            </div>
          </>
        );

      default:
        return (
             <Input label="Subject / Topic" placeholder="Main issue title" value={data.subject} onChange={(e:any) => handleChange(e, 'subject')} />
        );
    }
  };

  return (
    <div className="space-y-4 animate-pop-in">
       {renderFields()}
       <div className="mt-4">
         <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Detailed Description</label>
         <textarea 
            className="w-full h-32 p-4 bg-white/80 rounded-2xl border border-slate-200 text-sm focus:outline-blue-500"
            placeholder="Explain clearly what happened..."
            value={data.description}
            onChange={(e) => handleChange(e, 'description')}
         />
       </div>
    </div>
  );
};