import React, { useState } from 'react';
import { AppLanguage, SampleFormTemplate } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { SAMPLE_FORMS } from '../data/sampleForms';
import { Hero3DIllustration } from './Hero3DIllustration';
import {
  Upload,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  FileSearch,
  ShieldCheck,
  Languages,
  BookOpen,
  ChevronDown,
  ArrowRight,
  GraduationCap,
  Building2,
  FileText,
  Clock,
  Sparkle,
} from 'lucide-react';

interface LandingHeroProps {
  currentLang: AppLanguage;
  onStartUpload: () => void;
  onSelectSample: (sample: SampleFormTemplate) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  currentLang,
  onStartUpload,
  onSelectSample,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: {
        en: 'What types of forms can FormRahber help me fill?',
        ur: 'فارم رہبر کن قسم کے فارمز میں میری مدد کر سکتا ہے؟',
        roman_urdu: 'FormRahber kis tarah ke forms me meri help kar sakta hai?'
      },
      a: {
        en: 'FormRahber supports all standard official forms including university admission forms, scholarship applications, bank account opening/KYC forms, government CNIC/domicile applications, and job applications.',
        ur: 'فارم رہبر تمام ایک صفحے والے سرکاری و نجی فارمز، جیسے یونیورسٹی داخلہ فارم، اسکالرشپ، بینک اکاؤنٹ، ڈومیسائل اور نوکری کی درخواستوں کو سپورٹ کرتا ہے۔',
        roman_urdu: 'FormRahber saare official forms jaise university admission, scholarship, bank account, aur domicile forms ko support karta hai.'
      }
    },
    {
      q: {
        en: 'How does multi-language support work?',
        ur: 'ملٹی لینگویج (زبان کا انتخاب) کیسے کام کرتا ہے؟',
        roman_urdu: 'Multi-language support kaise kaam karta hai?'
      },
      a: {
        en: 'You can switch between English, Urdu (اردو), and Roman Urdu at any time. FormRahber instantly re-translates explanations, guidance, and document requirements without needing to re-upload your photo.',
        ur: 'آپ کسی بھی وقت انگریزی، اردو اور رومن اردو کے درمیان زبان تبدیل کر سکتے ہیں۔ فارم رہبر آپ کی تصویر دوبارہ اپ لوڈ کیے بغیر تمام وضاحتوں کا فوری ترجمہ کر دیتا ہے۔',
        roman_urdu: 'Aap kisi bhi waqt English, Urdu, aur Roman Urdu switch kar sakte hain. AI saare explanations ko instantly re-translate kar deta hai.'
      }
    },
    {
      q: {
        en: 'Do I need to sign up or create an account?',
        ur: 'کیا مجھے اکاؤنٹ یا سائن اپ کرنے کی ضرورت ہے؟',
        roman_urdu: 'Kya mujhe account ya sign up karne ki zaroorat hai?'
      },
      a: {
        en: 'No account required! FormRahber operates completely in your current session. No personal data or form images are stored permanently.',
        ur: 'کسی اکاؤنٹ کی ضرورت نہیں! فارم رہبر صرف آپ کے موجودہ سیشن میں کام کرتا ہے۔ کوئی بھی ذاتی ڈیٹا یا تصویر محفوظ نہیں کی جاتی۔',
        roman_urdu: 'Koi account zaroori nahi! Aapka data sirf aapke local browser session me rehta hai aur safe hai.'
      }
    },
    {
      q: {
        en: 'What if I don’t have a photo right now?',
        ur: 'اگر میرے پاس ابھی فارم کی تصویر نہ ہو تو کیا کروں؟',
        roman_urdu: 'Agar mere paas abhi photo na ho toh kya karoon?'
      },
      a: {
        en: 'You can test FormRahber immediately by clicking "Try a Sample Form" below to see how it analyzes university, banking, or government forms.',
        ur: 'آپ نیچے "نمونہ فارم آزمائیں" پر کلک کر کے فوری طور پر یونیورسٹی یا بینک فارم کی ٹیسٹنگ کر سکتے ہیں۔',
        roman_urdu: 'Aap neeche "Sample Form Try Karein" par click karke instantly test kar sakte hain.'
      }
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:py-16 bg-gradient-to-b from-[#F8FBFF] via-[#F0F7FF] to-white rounded-[24px] sm:rounded-[32px] border border-[#E5E7EB] shadow-xs px-6 sm:px-10 lg:px-12">
        
        {/* Background Abstract Floating Elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Primary Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            


            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-[#1F2937] tracking-tight leading-[1.15]">
              {t.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed whitespace-pre-line max-w-2xl">
              {t.heroSubtitle}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Primary Button */}
              <button
                id="hero-upload-btn"
                onClick={onStartUpload}
                className="px-8 py-4 rounded-[16px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-base shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
              >
                <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{t.uploadButton}</span>
                <ArrowRight className="w-4.5 h-4.5 text-blue-100 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Button */}
              <a
                href="#sample-forms-section"
                className="px-6 py-4 rounded-[16px] bg-white hover:bg-[#F8FBFF] text-[#2563EB] font-bold text-base border-2 border-[#2563EB] shadow-xs transition-all hover:shadow-md flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4.5 h-4.5 text-[#2563EB]" />
                <span>{t.trySampleButton}</span>
              </a>
            </div>

            {/* Feature Highlights Grid */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-2.5 p-3 rounded-[14px] bg-white/90 border border-[#E5E7EB] shadow-2xs">
                <Languages className="w-5 h-5 text-[#2563EB] shrink-0" />
                <span className="text-xs font-bold text-[#1F2937]">Urdu & English AI</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-[14px] bg-white/90 border border-[#E5E7EB] shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0" />
                <span className="text-xs font-bold text-[#1F2937]">Zero Mistakes</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-[14px] bg-white/90 border border-[#E5E7EB] shadow-2xs">
                <FileSearch className="w-5 h-5 text-[#2563EB] shrink-0" />
                <span className="text-xs font-bold text-[#1F2937]">Doc Checklist</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-[14px] bg-white/90 border border-[#E5E7EB] shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                <span className="text-xs font-bold text-[#1F2937]">Step-by-Step</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Clay Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center pt-4 lg:pt-0">
            <Hero3DIllustration />
          </div>

        </div>
      </section>

      {/* --- TRY SAMPLE FORMS SECTION --- */}
      <section id="sample-forms-section" className="space-y-8 pt-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
            {t.samplesHeader}
          </h2>
          <p className="text-[#6B7280] text-sm max-w-xl mx-auto">
            Select a demo official form to test FormRahber in real-time without uploading your own document.
          </p>
        </div>

        {/* Sample Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_FORMS.map((sample) => {
            const desc = sample.description[currentLang] || sample.description.en;
            return (
              <div
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className="group relative bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col justify-between cursor-pointer touch-manipulation"
              >
                <div>
                  <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-100/90 border-b border-[#E5E7EB] flex items-start justify-center">
                    <img
                      src={sample.imageUrl}
                      alt={sample.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover object-top scale-105 group-hover:scale-115 transition-transform duration-300 shadow-2xs"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-[#2563EB] shadow-2xs border border-white/60">
                      {sample.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-[#10B981] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-md shadow-2xs">
                      {sample.badge}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-lg text-[#1F2937] group-hover:text-[#2563EB] transition-colors">
                      {sample.title}
                    </h3>
                    <p className="text-xs text-[#6B7280] line-clamp-3 leading-relaxed group-hover:text-slate-700 transition-colors">
                      {desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    id={`sample-select-${sample.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSample(sample);
                    }}
                    className="w-full py-3 px-4 rounded-[14px] bg-[#DBEAFE]/60 hover:bg-[#2563EB] hover:text-white text-[#2563EB] font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 group-hover:bg-[#2563EB] group-hover:text-white group-hover:shadow-md cursor-pointer active:scale-95 touch-manipulation"
                  >
                    <span>Analyze This Form</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how-it-works-section" className="bg-gradient-to-br from-[#F8FBFF] to-white border border-[#E5E7EB] rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 space-y-10 shadow-xs">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
            {t.howItWorksTitle}
          </h2>
          <p className="text-[#6B7280] text-sm max-w-xl mx-auto">
            {t.howItWorksSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          
          <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] space-y-3.5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all">
            <div className="w-10 h-10 rounded-[12px] bg-[#DBEAFE] text-[#2563EB] font-extrabold flex items-center justify-center text-base">
              1
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#1F2937]">{t.step1Title}</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">{t.step1Desc}</p>
          </div>

          <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] space-y-3.5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all">
            <div className="w-10 h-10 rounded-[12px] bg-[#DBEAFE] text-[#2563EB] font-extrabold flex items-center justify-center text-base">
              2
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#1F2937]">{t.step2Title}</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">{t.step2Desc}</p>
          </div>

          <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] space-y-3.5 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all">
            <div className="w-10 h-10 rounded-[12px] bg-[#D1FAE5] text-[#10B981] font-extrabold flex items-center justify-center text-base">
              3
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#1F2937]">{t.step3Title}</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">{t.step3Desc}</p>
          </div>

          <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] space-y-3.5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all">
            <div className="w-10 h-10 rounded-[12px] bg-[#DBEAFE] text-[#2563EB] font-extrabold flex items-center justify-center text-base">
              4
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#1F2937]">{t.step4Title}</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">{t.step4Desc}</p>
          </div>

          <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] space-y-3.5 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 rounded-[12px] bg-indigo-100 text-indigo-600 font-extrabold flex items-center justify-center text-base">
              5
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#1F2937]">{t.step5Title}</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">{t.step5Desc}</p>
          </div>

        </div>
      </section>

      {/* --- FAQ ACCORDION SECTION --- */}
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
            {t.faqTitle}
          </h2>
          <p className="text-[#6B7280] text-sm">
            Everything you need to know about FormRahber AI assistant
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            const qText = faq.q[currentLang] || faq.q.en;
            const aText = faq.a[currentLang] || faq.a.en;

            return (
              <div
                key={idx}
                className="bg-white rounded-[18px] border border-[#E5E7EB] overflow-hidden shadow-2xs hover:border-blue-200 transition-all"
              >
                <button
                  id={`faq-toggle-${idx}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-[#1F2937] flex items-center justify-between gap-4 hover:bg-[#F8FBFF] transition-colors text-sm sm:text-base"
                >
                  <span>{qText}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#6B7280] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#2563EB]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#6B7280] leading-relaxed border-t border-[#E5E7EB] bg-[#F8FBFF]/60">
                    {aText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
