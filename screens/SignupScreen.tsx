
import React from 'react';
import { Button, Icon, Input } from '../components/UIComponents';

export const SignupScreen = ({ data, onChange, onNext, onBack }: any) => {
  const handleChange = (field: string, value: string) => onChange({ ...data, [field]: value });
  const isValid = data.firstName && data.lastName && data.birthYear && data.city;

  return (
    <div className="pt-8 h-full flex flex-col relative">
      <button onClick={onBack} className="absolute top-0 left-0 text-slate-500 hover:text-slate-800 p-2 bg-white/50 rounded-full shadow-sm border border-white hover:scale-110 transition-transform">
        <Icon name="arrow_back" />
      </button>
      
      <div className="mb-8 mt-12 animate-pop-in">
        <h2 className="text-3xl font-display font-bold text-slate-900">Join the Future</h2>
        <p className="text-slate-500 mt-2">Create your digital identity.</p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4">
          <Input label="First Name" placeholder="Amine" value={data.firstName} onChange={(e: any) => handleChange('firstName', e.target.value)} delay="delay-100" />
          <Input label="Last Name" placeholder="Benali" value={data.lastName} onChange={(e: any) => handleChange('lastName', e.target.value)} delay="delay-200" />
        </div>
        <div className="flex gap-4">
           <Input label="Birth Year" type="number" placeholder="1995" value={data.birthYear} onChange={(e: any) => handleChange('birthYear', e.target.value)} delay="delay-300" />
           <Input label="Birthday" type="date" value={data.birthDay} onChange={(e: any) => handleChange('birthDay', e.target.value)} delay="delay-300" />
        </div>
        <Input label="City" placeholder="Algiers" icon="location_on" value={data.city} onChange={(e: any) => handleChange('city', e.target.value)} delay="delay-400" />
      </div>

      <div className="flex-1"></div>
      <Button onClick={onNext} disabled={!isValid} delay="delay-500">
        Proceed to Biometrics <Icon name="fingerprint" />
      </Button>
    </div>
  );
};
