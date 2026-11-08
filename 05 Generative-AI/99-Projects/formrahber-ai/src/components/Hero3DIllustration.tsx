import React from 'react';

export const Hero3DIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-4/3 flex items-center justify-center select-none pointer-events-none">
      {/* Background Soft Glow Circles */}
      <div className="absolute -top-6 -right-6 w-64 h-64 bg-blue-200/50 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-6 -left-6 w-56 h-56 bg-emerald-200/40 rounded-full blur-3xl" />
      
      {/* Main Clay 3D Vector SVG */}
      <svg
        viewBox="0 0 540 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl relative z-10"
      >
        <defs>
          {/* Gradients for Clay Effect */}
          <linearGradient id="clipboardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="docGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>

          <linearGradient id="folderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          <linearGradient id="sphereGrad" x1="30%" y1="20%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BFDBFE" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          {/* Soft Shadow Filter */}
          <filter id="clayShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#1E293B" floodOpacity="0.12" />
          </filter>
          
          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#2563EB" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* --- FLOATING BACKGROUND ELEMENT: Soft Sphere --- */}
        <circle cx="90" cy="90" r="28" fill="url(#sphereGrad)" filter="url(#clayShadow)" className="animate-bounce" style={{ animationDuration: '4s' }} />
        <circle cx="450" cy="340" r="22" fill="url(#emeraldGrad)" opacity="0.8" filter="url(#clayShadow)" className="animate-bounce" style={{ animationDuration: '5s' }} />
        <circle cx="470" cy="80" r="14" fill="#DBEAFE" />

        {/* --- BACK FOLDER (Clay Style) --- */}
        <g filter="url(#clayShadow)" transform="translate(140, 160) rotate(-10)">
          <path
            d="M0 20 C0 8, 8 0, 20 0 L100 0 C110 0, 118 8, 125 15 L140 30 L220 30 C232 30, 240 38, 240 50 L240 170 C240 182, 232 190, 220 190 L20 190 C8 190, 0 182, 0 170 Z"
            fill="url(#folderGrad)"
          />
          {/* Inner Document sticking out */}
          <rect x="25" y="-20" width="180" height="150" rx="12" fill="#FFFFFF" opacity="0.9" />
          <line x1="45" y1="0" x2="160" y2="0" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
          <line x1="45" y1="20" x2="130" y2="20" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* --- CENTRAL MAIN CLIPBOARD --- */}
        <g filter="url(#clayShadow)" transform="translate(180, 70)">
          {/* Board Base */}
          <rect x="0" y="0" width="220" height="300" rx="24" fill="url(#clipboardGrad)" />

          {/* Paper Sheet */}
          <rect x="16" y="24" width="188" height="256" rx="16" fill="url(#docGrad1)" />

          {/* Top Clip Holder */}
          <rect x="65" y="-12" width="90" height="32" rx="10" fill="#1E293B" filter="url(#clayShadow)" />
          <rect x="85" y="-4" width="50" height="14" rx="5" fill="#64748B" />

          {/* Form Header Representation */}
          <rect x="36" y="50" width="90" height="14" rx="7" fill="#2563EB" />
          <rect x="36" y="74" width="148" height="8" rx="4" fill="#DBEAFE" />

          {/* Form Fields & Checked Rows */}
          {/* Row 1 */}
          <rect x="36" y="100" width="148" height="32" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
          <rect x="46" y="112" width="60" height="8" rx="4" fill="#94A3B8" />
          <circle cx="166" cy="116" r="8" fill="#10B981" />
          <path d="M162 116 L165 119 L171 113" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Row 2 */}
          <rect x="36" y="142" width="148" height="32" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
          <rect x="46" y="154" width="80" height="8" rx="4" fill="#94A3B8" />
          <circle cx="166" cy="158" r="8" fill="#10B981" />
          <path d="M162 158 L165 161 L171 155" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Row 3 - Active Focus */}
          <rect x="36" y="184" width="148" height="32" rx="8" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" />
          <rect x="46" y="196" width="70" height="8" rx="4" fill="#2563EB" />
          <rect x="156" y="192" width="20" height="16" rx="4" fill="#DBEAFE" />

          {/* Bottom Progress Bar */}
          <rect x="36" y="235" width="148" height="10" rx="5" fill="#E2E8F0" />
          <rect x="36" y="235" width="110" height="10" rx="5" fill="#10B981" />
        </g>

        {/* --- FRONT FLOATING CARD 1: AI Assistant Badge --- */}
        <g filter="url(#softGlow)" transform="translate(60, 220) rotate(-6)">
          <rect x="0" y="0" width="160" height="64" rx="18" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
          <circle cx="36" cy="32" r="18" fill="#DBEAFE" />
          {/* Sparkle Icon */}
          <path d="M36 21 L38 29 L46 31 L38 33 L36 41 L34 33 L26 31 L34 29 Z" fill="#2563EB" />
          <text x="64" y="28" fontFamily="sans-serif" fontWeight="800" fontSize="13" fill="#1F2937">
            AI Rahber
          </text>
          <text x="64" y="44" fontFamily="sans-serif" fontWeight="600" fontSize="11" fill="#10B981">
            Urdu &amp; English
          </text>
        </g>

        {/* --- FRONT FLOATING CARD 2: Safe Document Checkmark --- */}
        <g filter="url(#clayShadow)" transform="translate(340, 260) rotate(8)">
          <rect x="0" y="0" width="150" height="70" rx="18" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
          <circle cx="36" cy="35" r="18" fill="#D1FAE5" />
          <path d="M30 35 L34 39 L42 31" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x="62" y="32" fontFamily="sans-serif" fontWeight="800" fontSize="13" fill="#1F2937">
            100% Ready
          </text>
          <text x="62" y="48" fontFamily="sans-serif" fontWeight="600" fontSize="11" fill="#6B7280">
            Zero Mistakes
          </text>
        </g>

        {/* --- SPARKLES & LIGHT DECORATIVE LINES --- */}
        <g transform="translate(420, 130)">
          <path d="M0 0 L6 12 L18 18 L6 24 L0 36 L-6 24 L-18 18 L-6 12 Z" fill="#2563EB" opacity="0.8" />
        </g>
        <g transform="translate(130, 60)">
          <path d="M0 0 L4 8 L12 12 L4 16 L0 24 L-4 16 L-12 12 L-4 8 Z" fill="#10B981" opacity="0.9" />
        </g>

        {/* Thin Curved Path Line */}
        <path d="M 60 140 Q 180 20 300 60 T 480 180" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="6 6" opacity="0.3" />
      </svg>
    </div>
  );
};
