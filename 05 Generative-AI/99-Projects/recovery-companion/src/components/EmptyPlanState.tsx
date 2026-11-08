import React from 'react';
import { PlusCircle, Sparkles, FileText, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { LanguageCode } from '../types';

interface EmptyPlanStateProps {
  currentLanguage?: LanguageCode;
  onOpenUpload: () => void;
  onLoadSample: () => void;
  title?: string;
  description?: string;
}

export const EmptyPlanState: React.FC<EmptyPlanStateProps> = ({
  currentLanguage = 'en',
  onOpenUpload,
  onLoadSample,
  title,
  description
}) => {
  const isUrdu = currentLanguage === 'ur';

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-10 px-4 animate-fadeIn">
      <div className="max-w-xl w-full saas-card p-8 bg-white border border-slate-200 shadow-xl text-center space-y-6">
        
        <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
          <HeartPulse className="w-10 h-10 text-blue-600 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {isUrdu ? 'نیا ریکوری پلان' : 'Personal Recovery Portal'}
          </span>
          <h2 className="heavy-type text-2xl text-slate-950 uppercase tracking-tight">
            {title || (isUrdu ? 'ابھی کوئی ڈسچارج پلان موجود نہیں' : 'No Recovery Plan Found Yet')}
          </h2>
          <p className="text-xs text-slate-600 font-bold max-w-md mx-auto leading-relaxed">
            {description || (isUrdu 
              ? 'اپنے مریض کی معلومات اور دوائیں درج کر کے ایک منٹ میں مکمل ریکوری پلان تیار کریں، یا ڈیمو آزنائیں۔'
              : 'Enter patient details, medicines, and doctor instructions to create a structured medication schedule and recovery checklist in minutes.')}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenUpload}
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-4 h-4 text-blue-200" />
            <span>{isUrdu ? 'نیا ریکوری پلان بنائیں' : 'Create Recovery Plan Manually'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onLoadSample}
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-black uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{isUrdu ? 'نمونہ ریکوری پلان دیکھیں (ڈیمو)' : 'Try Sample Recovery Plan (Demo)'}</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center space-x-2 text-[11px] font-bold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isUrdu ? 'تمام ڈیٹا محفوظ اور محقق ہے' : 'End-to-End Encrypted & Scoped Strictly to Your Account'}</span>
        </div>

      </div>
    </div>
  );
};
