import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, LogIn } from 'lucide-react';
import { LanguageCode } from '../types';
import { LocalUser } from '../lib/firestoreService';

interface DemoPlanBannerProps {
  currentUser: LocalUser | null;
  currentLanguage?: LanguageCode;
  onOpenUpload: () => void;
  onSwitchToRealPlan?: () => void;
  hasRealPlan?: boolean;
}

export const DemoPlanBanner: React.FC<DemoPlanBannerProps> = ({
  currentUser,
  currentLanguage = 'en',
  onOpenUpload,
  onSwitchToRealPlan,
  hasRealPlan = false
}) => {
  const isUrdu = currentLanguage === 'ur';

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2.5 shadow-md flex items-center justify-between flex-wrap gap-2 text-xs font-black z-30 animate-fadeIn">
      <div className="flex items-center space-x-2">
        <span className="bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{isUrdu ? 'ڈیمو ڈیٹا' : 'DEMO PLAN'}</span>
        </span>
        <span className="text-slate-950 font-bold">
          {isUrdu 
            ? 'آپ نمونہ پلان (ایلینور وینس) دیکھ رہے ہیں۔ یہ آپ کے حقیقی اکاؤنٹ میں محفوظ نہیں ہو گا۔'
            : 'Viewing Sample Plan (Eleanor Vance). Changes made here will not save to your account.'}
        </span>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        {hasRealPlan && onSwitchToRealPlan ? (
          <button
            onClick={onSwitchToRealPlan}
            className="px-3 py-1 bg-slate-950 hover:bg-slate-800 text-white font-black uppercase tracking-wider text-[11px] rounded-lg transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <span>{isUrdu ? 'میرا حقیقی پلان دیکھیں' : 'Switch to My Real Plan'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={onOpenUpload}
            className="px-3 py-1 bg-slate-950 hover:bg-slate-800 text-white font-black uppercase tracking-wider text-[11px] rounded-lg transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <span>{isUrdu ? 'اپنا اصلی ڈسچارج پیپر اپلوڈ کریں' : 'Upload My Real Paper'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
