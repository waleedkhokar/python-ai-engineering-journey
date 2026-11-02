import React, { useState } from 'react';
import { FlaskConical, BookOpen, Bot, Menu, X, Sparkles } from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  activeExperimentName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, activeExperimentName }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: ViewMode) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-1"
            id="nav-logo-button"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white font-sans">ChemLab</span>
                <span className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Chemistry Lab Assistant</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg font-medium text-sm transition-colors ${
                currentView === 'home'
                  ? 'bg-slate-800 text-teal-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
              id="nav-home-btn"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('experiments')}
              className={`px-3.5 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                currentView === 'experiments' || currentView === 'experiment-detail'
                  ? 'bg-slate-800 text-teal-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
              id="nav-experiments-btn"
            >
              <BookOpen className="w-4 h-4" />
              <span>Experiments</span>
            </button>
            <button
              onClick={() => handleNavClick('assistant')}
              className={`px-3.5 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                currentView === 'assistant'
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
              id="nav-assistant-btn"
            >
              <Bot className="w-4 h-4" />
              <span>AI Assistant</span>
              {activeExperimentName && (
                <span className="max-w-[120px] truncate bg-slate-900/60 text-teal-300 text-[10px] px-1.5 py-0.5 rounded border border-teal-400/30">
                  {activeExperimentName}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium ${
              currentView === 'home' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-300'
            }`}
            id="mobile-nav-home"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('experiments')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium flex items-center gap-2 ${
              currentView === 'experiments' || currentView === 'experiment-detail'
                ? 'bg-slate-800 text-teal-400 font-semibold'
                : 'text-slate-300'
            }`}
            id="mobile-nav-experiments"
          >
            <BookOpen className="w-5 h-5 text-teal-400" />
            <span>Experiments</span>
          </button>
          <button
            onClick={() => handleNavClick('assistant')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium flex items-center gap-2 ${
              currentView === 'assistant' ? 'bg-teal-500 text-slate-950 font-semibold' : 'text-slate-300'
            }`}
            id="mobile-nav-assistant"
          >
            <Bot className="w-5 h-5" />
            <span>AI Assistant</span>
          </button>
        </div>
      )}
    </header>
  );
};
