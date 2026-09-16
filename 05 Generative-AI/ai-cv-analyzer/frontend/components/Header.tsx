import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Custom Image Logo */}
          <div className="h-10 w-10 relative rounded-xl overflow-hidden shadow-md shadow-blue-500/10 border border-slate-200 bg-white flex items-center justify-center">
            <Image 
              src="/logo.jpeg" 
              alt="AI CV Analyzer Logo" 
              fill 
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              AI CV Analyzer & Matcher
            </span>
            <p className="text-xs text-slate-500 font-medium">
              Professional Grade ATS Evaluation
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Got Your Dream Job</span>
        </div>
      </div>
    </header>
  );
}