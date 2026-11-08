import React, { useState } from 'react';
import { Sparkles, ShieldCheck, HeartPulse, ArrowRight, Check, X } from 'lucide-react';

interface OnboardingExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingExplainerModal: React.FC<OnboardingExplainerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState<number>(0);

  if (!isOpen) return null;

  const screens = [
    {
      icon: Sparkles,
      iconBg: 'bg-blue-100 text-blue-600',
      badge: 'Step 1 of 3 • Plain Language',
      title: 'We Simplify Complex Hospital Paperwork',
      description: 'Discharge papers are full of dense clinical jargon, medical abbreviations, and overwhelming notes. Recovery Companion converts them into a clear, step-by-step daily recovery checklist and medication timeline.',
      bulletPoints: [
        'Plain-language translations for terms like "arthroplasty" or "bid pc"',
        'Extracted medication schedules with dosage reminders',
        'Clear list of red-flag emergency warning signs'
      ]
    },
    {
      icon: ShieldCheck,
      iconBg: 'bg-emerald-100 text-emerald-600',
      badge: 'Step 2 of 3 • Medical Safety',
      title: 'We Never Diagnose or Alter Treatment',
      description: 'Safety is our absolute highest priority. Our AI model strictly parses your official discharge document and never introduces unverified medical advice or changes your prescribed dosages.',
      bulletPoints: [
        '100% grounded in your original hospital discharge documents',
        'Direct source quotes provided for every medication & instruction',
        'Unclear or low-confidence text flagged for doctor verification'
      ]
    },
    {
      icon: HeartPulse,
      iconBg: 'bg-teal-100 text-teal-600',
      badge: 'Step 3 of 3 • Care Team First',
      title: 'Your Care Team Always Comes First',
      description: 'Recovery Companion is designed to give you peace of mind and help you communicate with your doctors, nurses, and family caregivers. Always contact your surgeon or physician for medical decisions.',
      bulletPoints: [
        'Instant hotline bar with 1-click doctor calling',
        'Shareable caregiver link & printable PDF summary',
        'Urdu, Spanish, and multi-language support for peace of mind'
      ]
    }
  ];

  const current = screens[step];
  const Icon = current.icon;

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('recovery_companion_onboarded', 'true');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-6 pb-0 flex items-center justify-between">
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-black uppercase tracking-wider">
            {current.badge}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Screen Content */}
        <div className="p-6 space-y-5 text-center">
          <div className={`w-16 h-16 rounded-3xl ${current.iconBg} flex items-center justify-center mx-auto shadow-sm`}>
            <Icon className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">
              {current.title}
            </h2>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2 max-w-md mx-auto">
              {current.description}
            </p>
          </div>

          {/* Bullet points */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2.5">
            {current.bulletPoints.map((pt, idx) => (
              <div key={idx} className="flex items-start space-x-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="text-xs text-slate-700 font-bold leading-tight">
                  {pt}
                </span>
              </div>
            ))}
          </div>

          {/* Step Indicator Dots */}
          <div className="flex items-center justify-center space-x-2 pt-2">
            {screens.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === step ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl text-xs font-black uppercase text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
            >
              Skip
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-md shadow-blue-600/20 flex items-center space-x-2"
          >
            <span>{step === screens.length - 1 ? 'Get Started' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
