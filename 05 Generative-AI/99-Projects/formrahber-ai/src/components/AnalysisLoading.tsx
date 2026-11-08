import React, { useEffect, useState } from 'react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { Sparkles, Scan, FileSearch, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AnalysisLoadingProps {
  currentLang: AppLanguage;
}

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: t.stepReading, icon: Scan },
    { label: t.stepDetecting, icon: FileSearch },
    { label: t.stepExplanations, icon: Sparkles },
    { label: t.stepDocuments, icon: ShieldCheck },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-8 animate-fade-in">
      
      {/* Animated AI Icon with Royal Blue Glow */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-[24px] bg-[#2563EB]/25 animate-ping" />
        <div className="w-20 h-20 rounded-[20px] bg-[#2563EB] flex items-center justify-center text-white shadow-xl shadow-blue-500/40">
          <Sparkles className="w-10 h-10 animate-bounce text-white" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#2563EB]">
          Analyzing your form. This may take few seconds..
        </h2>
      </div>

      {/* Progress Steps List */}
      <div className="bg-white rounded-[18px] p-6 border border-blue-100 shadow-sm space-y-3 text-left max-w-md mx-auto">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3.5 p-3.5 rounded-[12px] transition-all ${
                isCurrent
                  ? 'bg-[#DBEAFE] border border-blue-200 text-[#2563EB] font-bold'
                  : isDone
                  ? 'text-[#2563EB] font-semibold bg-blue-50/50'
                  : 'text-blue-300'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-[#2563EB] shrink-0" />
              ) : (
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isCurrent ? 'text-[#2563EB] animate-spin' : 'text-blue-300'
                  }`}
                />
              )}
              <span className="text-xs sm:text-sm">{step.label}</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#2563EB] font-bold">
        Your form is being analyzed by FormRahber AI...
      </p>

    </div>
  );
};
