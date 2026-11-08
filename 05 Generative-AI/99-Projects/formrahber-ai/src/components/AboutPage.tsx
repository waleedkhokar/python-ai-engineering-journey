import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldAlert, Target, Zap, FileText } from 'lucide-react';
import { AppLanguage } from '../types';

interface AboutPageProps {
  currentLang: AppLanguage;
  onStartUpload: () => void;
  onBackToHome: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ currentLang, onStartUpload, onBackToHome }) => {
  const isUrdu = currentLang === 'ur';

  const content = {
    en: {
      backHome: 'Back to Home',
      tagline: 'About FormRahber',
      heroTitle: 'Making Official Forms Easy for Everyone',
      heroDesc:
        "FormRahber is an AI-powered web application that helps users understand and complete official forms with confidence. Whether you're filling out a university admission form, scholarship application, bank form, job application, or government document, FormRahber explains every field in simple language and guides you through the process step by step.",
      sectionAssistsTitle: 'How FormRahber Assists You',
      sectionAssistsDesc:
        'The application analyzes uploaded form images, identifies each field, explains confusing terms, suggests commonly required documents, and helps format user responses correctly in English, Urdu, or Roman Urdu.',
      missionTitle: 'Our Mission',
      missionDesc:
        'Our mission is to make official forms easier to understand and reduce the confusion many people experience when completing important documents.',
      featuresTitle: 'Key Features',
      features: [
        'AI-powered form analysis',
        'Plain-language field explanations',
        'English, Urdu, and Roman Urdu support',
        'Document checklist suggestions',
        'Guided form completion',
        'Review before filling the original form',
        'Downloadable filled form preview',
      ],
      disclaimerTitle: 'Disclaimer',
      disclaimerDesc:
        'FormRahber is an educational and portfolio project developed to demonstrate AI-powered form assistance. It is not affiliated with NADRA, any bank, university, government department, or other official organization. Users should always verify important information before submitting official documents.',
      ctaTitle: 'Ready to try FormRahber?',
      ctaSub: 'Upload any form or snapshot to get started instantly.',
      ctaBtn: 'Get Started',
    },
    ur: {
      backHome: 'ہوم پر واپس جائیں',
      tagline: 'فارم رہبر کے بارے میں',
      heroTitle: 'سرکاری اور اہم فارمز کو ہر ایک کے لیے آسان بنانا',
      heroDesc:
        'فارم رہبر ایک AI سے لیس ویب ایپلی کیشن ہے جو صارفین کو اعتماد کے ساتھ سرکاری فارمز سمجھنے اور پر کرنے میں مدد کرتی ہے۔ چاہے آپ یونیورسٹی ایڈمیشن فارم، اسکالرشپ فارم، بینک فارم، جاب کی درخواست، یا سرکاری دستاویز پر کر رہے ہوں، فارم رہبر ہر خانے کی سادہ زبان میں وضاحت کرتا ہے اور قدم بہ قدم رہنمائی فراہم کرتا ہے۔',
      sectionAssistsTitle: 'فارم رہبر آپ کی کیسے مدد کرتا ہے',
      sectionAssistsDesc:
        'یہ ایپلی کیشن اپ لوڈ کی گئی فارم تصویر کا تجزیہ کرتی ہے، ہر خانے کی نشاندہی کرتی ہے، الجھن پیدا کرنے والی اصطلاحات کی وضاحت کرتی ہے، ضروری دستاویزات تجاویز کرتی ہے، اور آپ کے جوابات کو انگریزی، اردو یا رومن اردو میں درست فارمیٹ کرنے میں مدد دیتی ہے۔',
      missionTitle: 'ہمارا مقصد',
      missionDesc:
        'ہمارا مقصد سرکاری فارمز کو سمجھنا آسان بنانا اور اہم دستاویزات کو پر کرتے وقت لوگوں کو درپیش الجھن اور پریشانی کو کم کرنا ہے۔',
      featuresTitle: 'اہم خصوصیات',
      features: [
        'AI کی مدد سے فارم کا تجزیہ',
        'سادہ اور آسان زبان میں خانوں کی وضاحت',
        'انگریزی، اردو اور رومن اردو کی مکمل سپورٹ',
        'ضروری دستاویزات کی فہرست',
        'رہنمائی کے ساتھ فارم کی تکمیل',
        'اصل فارم بھرنے سے پہلے کا جائزہ',
        'پر شدہ فارم ڈاؤن لوڈ کرنے کی سہولت',
      ],
      disclaimerTitle: 'وضاحتی اعلان (ڈس کلیمر)',
      disclaimerDesc:
        'فارم رہبر ایک تعلیمی اور پورٹ فولیو پروجیکٹ ہے جو AI سے فارم بھرنے میں رہنمائی کا مظاہرہ کرنے کے لیے بنایا گیا ہے۔ اس کا نادرا، کسی بینک، یونیورسٹی، یا سرکاری ادارے سے کوئی تعلق نہیں ہے۔ صارفین کو چاہیے کہ وہ سرکاری دستاویزات جمع کرانے سے پہلے تمام معلومات کی خود تصدیق کر لیں۔',
      ctaTitle: 'کیا آپ فارم رہبر استعمال کرنے کے لیے تیار ہیں؟',
      ctaSub: 'شروع کرنے کے لیے کسی بھی فارم کی تصویر اپ لوڈ کریں۔',
      ctaBtn: 'ابھی شروع کریں',
    },
    roman_urdu: {
      backHome: 'Home par wapas jayein',
      tagline: 'FormRahber Ke Baare Mein',
      heroTitle: 'Official Forms Ko Har Aik Ke Liye Aasan Banana',
      heroDesc:
        "FormRahber aik AI-powered web application hai jo users ko ehtimad ke sath official forms samajhne aur fill karne mein madad karti hai. Chahe aap university admission form, scholarship application, bank form, job application, ya kisi sarkari document ko fill kar rahe ho, FormRahber har field ki aasan zuban mein wazahat karta hai aur step-by-step rahnumai deta hai.",
      sectionAssistsTitle: 'FormRahber Aap Ki Kaise Madad Karta Hai',
      sectionAssistsDesc:
        'Yeh application uploaded form image ka analysis karti hai, har field ko pehchanti hai, confusing terms ki wazahat karti hai, zaroori documents suggest karti hai, aur aap ke jawabat ko English, Urdu ya Roman Urdu mein sahi format mein laane mein madad karti hai.',
      missionTitle: 'Hamara Mission',
      missionDesc:
        'Hamara mission official forms ko samajhna aasan banana aur ahem documents fill karte waqt logon ko hone wali confusion ko kam karna hai.',
      featuresTitle: 'Ahem Features',
      features: [
        'AI-powered form analysis',
        'Aasan zuban mein fields ki wazahat',
        'English, Urdu, aur Roman Urdu support',
        'Required documents ki checklist',
        'Step-by-step guided form filling',
        'Original form fill karne se pehle review',
        'Downloadable filled form preview',
      ],
      disclaimerTitle: 'Important Disclaimer',
      disclaimerDesc:
        'FormRahber aik educational aur portfolio project hai jo AI form assistance dikhane ke liye banaya gaya hai. Is ka NADRA, kisi bank, university ya kisi sarkari idaray se koi taalluq nahi hai. Official documents submit karne se pehle users hamesha apni maloomat verify kar lein.',
      ctaTitle: 'FormRahber try karne ke liye tayyar hain?',
      ctaSub: 'Kisi bhi form ki photo upload karke shuru karein.',
      ctaBtn: 'Get Started',
    },
  };

  const t = content[currentLang] || content.en;

  return (
    <div className={`max-w-4xl mx-auto space-y-10 py-4 px-2 sm:px-0 ${isUrdu ? 'font-urdu' : ''}`}>
      
      {/* Back Button */}
      <div className="flex justify-start">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs transition-all hover:border-slate-300 cursor-pointer"
        >
          <ArrowLeft className={`w-4 h-4 text-[#2563EB] ${isUrdu ? 'rotate-180' : ''}`} />
          <span>{t.backHome}</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#1F2937] text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4 relative overflow-hidden text-left">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-blue-100 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          <span>{t.tagline}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {t.heroTitle}
        </h1>

        <p className="text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed pt-2">
          {t.heroDesc}
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8 text-left">
        
        {/* How it assists */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-[#2563EB]" />
            <span>{t.sectionAssistsTitle}</span>
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            {t.sectionAssistsDesc}
          </p>
        </div>

        {/* Our Mission */}
        <div className="p-6 rounded-[18px] bg-blue-50/70 border border-blue-200/80 space-y-2">
          <div className="flex items-center gap-2 text-[#2563EB] font-extrabold text-lg">
            <Target className="w-5 h-5" />
            <span>{t.missionTitle}</span>
          </div>
          <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed">
            {t.missionDesc}
          </p>
        </div>

        {/* Key Features */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#2563EB]" />
            <span>{t.featuresTitle}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {t.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-[18px] bg-slate-50/80 border border-slate-200/70 text-slate-800 font-bold text-xs sm:text-sm shadow-2xs hover:border-blue-300 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-[#2563EB] shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-6 rounded-[18px] bg-amber-50/80 border border-amber-200/90 space-y-2 text-amber-900">
          <div className="flex items-center gap-2 font-extrabold text-base text-amber-800">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{t.disclaimerTitle}</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            {t.disclaimerDesc}
          </p>
        </div>

        {/* CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">{t.ctaTitle}</h3>
            <p className="text-xs text-slate-500">{t.ctaSub}</p>
          </div>

          <button
            onClick={onStartUpload}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.ctaBtn}</span>
          </button>
        </div>

      </div>

    </div>
  );
};

