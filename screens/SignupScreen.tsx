import React from 'react';
import { Button, Icon, Input } from '../components/UIComponents';
import { useLanguage } from '../context/LanguageContext';

export const SignupScreen = ({ data, onChange, onNext, onBack }: any) => {
  const handleChange = (field: string, value: string) => onChange({ ...data, [field]: value });
  const { t, isRTL } = useLanguage();
  const isValid = data.firstName && data.lastName && data.birthYear && data.city && data.nid && data.age && data.gender;

  return (
    <div className="pt-8 h-full flex flex-col relative" dir={isRTL ? 'rtl' : 'ltr'}>
      <button onClick={onBack} className="absolute top-0 left-0 rtl:right-0 rtl:left-auto text-slate-500 hover:text-slate-800 p-2 bg-white/50 rounded-full shadow-sm border border-white hover:scale-110 transition-transform">
        <Icon name="arrow_back" className={isRTL ? 'rotate-180' : ''} />
      </button>

      <div className="mb-8 mt-12 animate-pop-in">
        <h2 className="text-3xl font-display font-bold text-slate-900">{t('joinFuture')}</h2>
        <p className="text-slate-500 mt-2">{t('createIdentity')}</p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4">
          <Input label={t('firstName')} placeholder="Amine" value={data.firstName} onChange={(e: any) => handleChange('firstName', e.target.value)} delay="delay-100" />
          <Input label={t('lastName')} placeholder="Benali" value={data.lastName} onChange={(e: any) => handleChange('lastName', e.target.value)} delay="delay-200" />
        </div>
        <div className="flex gap-4">
          <Input label={t('birthYear')} type="number" placeholder="1995" value={data.birthYear} onChange={(e: any) => handleChange('birthYear', e.target.value)} delay="delay-300" />
          <Input label={t('age')} type="number" placeholder="28" value={data.age} onChange={(e: any) => handleChange('age', e.target.value)} delay="delay-300" />
        </div>
        <Input label={t('nid')} placeholder="123456789" value={data.nid} onChange={(e: any) => handleChange('nid', e.target.value)} delay="delay-350" />

        <div className="space-y-2 animate-pop-in delay-400">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 rtl:mr-1 rtl:ml-0">{t('gender')}</label>
          <div className="flex gap-4">
            {['male', 'female'].map((gKey) => (
              <button
                key={gKey}
                onClick={() => handleChange('gender', gKey === 'male' ? 'Male' : 'Female')}
                className={`flex-1 py-3 rounded-2xl border transition-all ${data.gender?.toLowerCase() === (gKey === 'male' ? 'male' : 'female') ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white/50 border-slate-200 text-slate-600 hover:bg-white'}`}
              >
                {t(gKey as any)}
              </button>
            ))}
          </div>
        </div>

        <Input label={t('city')} placeholder="Algiers" icon="location_on" value={data.city} onChange={(e: any) => handleChange('city', e.target.value)} delay="delay-400" />
      </div>

      <div className="flex-1"></div>
      <Button onClick={onNext} disabled={!isValid} delay="delay-500">
        {t('proceedBio')} <Icon name="fingerprint" />
      </Button>
    </div>
  );
};