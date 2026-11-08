import React from 'react';
import { FileText } from 'lucide-react';
import { AppLanguage } from '../types';

interface FooterProps {
  currentLang?: AppLanguage;
  onNavigateHome: () => void;
  onNavigateDemoForms: () => void;
  onNavigateHowItWorks: () => void;
  onNavigateUpload: () => void;
  onNavigateAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang = 'en',
  onNavigateHome,
  onNavigateDemoForms,
  onNavigateHowItWorks,
  onNavigateUpload,
  onNavigateAbout,
}) => {
  const content = {
    en: {
      desc: 'AI-powered assistant that helps users understand and complete official forms with confidence.',
      home: 'Home',
      demoForms: 'Demo Forms',
      howItWorks: 'How it works',
      uploadForm: 'Upload Form',
      about: 'About',
      rights: '© 2026 FormRahber. All rights reserved.',
    },
    ur: {
      desc: 'اے آئی پر مبنی اسسٹنٹ جو صارفین کو سرکاری فارم اعتماد کے ساتھ سمجھنے اور پر کرنے میں مدد کرتا ہے۔',
      home: 'ہوم',
      demoForms: 'نمونہ فارمز',
      howItWorks: 'یہ کیسے کام کرتا ہے',
      uploadForm: 'فارم اپ لوڈ کریں',
      about: 'ہمارے بارے میں',
      rights: '© 2026 فارم رہبر۔ تمام حقوق محفوظ ہیں۔',
    },
    roman_urdu: {
      desc: 'AI-powered assistant jo users ko official forms samajhne aur fill karne mein madad karta hai.',
      home: 'Home',
      demoForms: 'Demo Forms',
      howItWorks: 'How it works',
      uploadForm: 'Upload Form',
      about: 'About',
      rights: '© 2026 FormRahber. Tamam huqooq mehfooz hain.',
    },
  };

  const t = content[currentLang] || content.en;
  const isUrdu = currentLang === 'ur';

  return (
    <footer className={`w-full bg-[#0F172A] pt-10 pb-6 mt-16 border-t border-slate-800 ${isUrdu ? 'font-urdu' : ''}`}>
      <div className="w-full px-6 sm:px-10 lg:px-12 space-y-6 flex flex-col items-start text-left">
        
        {/* Brand & Description */}
        <div className="space-y-3 max-w-2xl text-left">
          <div className="flex items-center gap-2.5 font-extrabold text-xl text-[#FFFFFF]">
            <div className="w-7 h-7 bg-[#2563EB] rounded-lg flex items-center justify-center text-white shadow-xs">
              <FileText className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[#FFFFFF]">FormRahber</span>
          </div>

          <p className="text-sm text-[#CBD5E1] leading-relaxed text-left">
            {t.desc}
          </p>
        </div>

        {/* Vertical Navigation Links */}
        <div className="flex flex-col items-start gap-2.5 text-sm font-semibold text-[#CBD5E1]">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#3B82F6] transition-colors cursor-pointer text-left"
          >
            {t.home}
          </button>

          <button
            onClick={onNavigateDemoForms}
            className="hover:text-[#3B82F6] transition-colors cursor-pointer text-left"
          >
            {t.demoForms}
          </button>

          <button
            onClick={onNavigateHowItWorks}
            className="hover:text-[#3B82F6] transition-colors cursor-pointer text-left"
          >
            {t.howItWorks}
          </button>

          <button
            onClick={onNavigateUpload}
            className="hover:text-[#3B82F6] transition-colors cursor-pointer text-left"
          >
            {t.uploadForm}
          </button>

          <button
            onClick={onNavigateAbout}
            className="hover:text-[#3B82F6] transition-colors cursor-pointer text-left"
          >
            {t.about}
          </button>
        </div>

        {/* Copyright Divider & Line */}
        <div className="w-full border-t border-slate-800 pt-5 text-xs text-[#CBD5E1]/70 font-medium text-center">
          {t.rights}
        </div>

      </div>
    </footer>
  );
};

