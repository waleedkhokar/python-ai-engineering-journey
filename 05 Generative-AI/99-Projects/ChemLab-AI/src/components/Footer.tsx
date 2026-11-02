import React from 'react';
import { FlaskConical, ShieldAlert, Sparkles, GraduationCap } from 'lucide-react';
import { ViewMode } from '../types';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight">ChemLab AI</span>
                <p className="text-xs text-slate-400 font-medium">Chemistry Lab Assistant</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md text-xs sm:text-sm">
              An intelligent educational web platform designed specifically for undergraduate Chemistry students to prepare for practical laboratory classes, master chemical principles, revise for viva examinations, and track experimental lab readiness.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium bg-teal-950/40 border border-teal-800/40 px-3 py-1.5 rounded-lg w-fit">
              <GraduationCap className="w-4 h-4" />
              <span>Built for Undergraduate Chemistry Education</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Quick Navigation</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-teal-400 transition-colors"
                  id="footer-home-link"
                >
                  Home Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('experiments')}
                  className="hover:text-teal-400 transition-colors"
                  id="footer-experiments-link"
                >
                  Experiment Library (5 Key Labs)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('assistant')}
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                  id="footer-assistant-link"
                >
                  <span>Ask AI Chemistry Assistant</span>
                  <Sparkles className="w-3 h-3 text-teal-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* Educational Safety Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Laboratory Safety Notice</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              ChemLab AI is an educational preparation assistant and does not replace qualified laboratory instructors, institutional safety procedures, or physical PPE requirements. Always follow your lab supervisor's direct guidance.
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ChemLab AI — Chemistry Lab Assistant. Educational AI Platform for Chemistry Students.</p>
          <p className="text-slate-500">Powered by Gemini AI & Server-Side Security</p>
        </div>
      </div>
    </footer>
  );
};
