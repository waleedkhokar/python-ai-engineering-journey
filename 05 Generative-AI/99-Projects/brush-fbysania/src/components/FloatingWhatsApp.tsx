import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send, Palette, HeartHandshake } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl, openWhatsApp } from '../lib/whatsapp';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
  displayNumber: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  whatsappNumber,
  displayNumber,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickPrompts = [
    {
      title: '🌸 Custom Color Match',
      desc: 'I want to match a dupatta to my dress',
      msg: 'Salam Sania! 🌸 I have an outfit picture and want to get a matching hand-painted dupatta designed. How does the color matching process work?',
    },
    {
      title: '👑 Nikkah / Bridal Inquiry',
      desc: 'Calligraphy & bridal veil orders',
      msg: 'Salam Sania! ✨ I am inquiring about a bespoke Nikkah dupatta with custom Urdu calligraphy and gotta work. Could you share details on timelines and pricing?',
    },
    {
      title: '🎨 Urgent / Express Order',
      desc: 'Check fast delivery dates',
      msg: 'Salam Sania! 🎀 I need a hand-painted dupatta on an urgent timeline. What is your earliest dispatch slot?',
    },
  ];

  const handleSend = (text: string) => {
    const url = generateGeneralInquiryWhatsAppUrl(text, whatsappNumber);
    openWhatsApp(url);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Quick Chat Card */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#FCE7EB] overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#831843] via-[#BE185D] to-[#9D174D] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-serif text-lg font-bold">
                  S
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#831843]"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight flex items-center gap-1.5">
                  <span>Chat with Sania</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
                </h4>
                <p className="text-[11px] text-[#FFF0F3]/80">Usually replies within minutes on WhatsApp</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body with Quick Prompts */}
          <div className="p-4 space-y-3 bg-[#FFF8F9]/50 max-h-80 overflow-y-auto">
            <div className="bg-white p-3 rounded-xl border border-[#FCE7EB] text-xs text-[#5C3A42] leading-relaxed shadow-2xs">
              <p className="font-medium text-[#831843] flex items-center gap-1 mb-1">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Boutique Order Assistant</span>
              </p>
              Salam! Welcome to Brush n Fabric. Tap any option below or type a message to start our WhatsApp consultation:
            </div>

            <div className="space-y-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.msg)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#FFF0F3] border border-[#FCE7EB] hover:border-[#BE185D]/40 transition-all text-xs group flex items-start justify-between gap-2 shadow-2xs"
                >
                  <div>
                    <p className="font-semibold text-[#831843] group-hover:text-[#BE185D]">{p.title}</p>
                    <p className="text-[11px] text-[#7A5A62]">{p.desc}</p>
                  </div>
                  <Send className="w-3.5 h-3.5 text-[#BE185D]/60 group-hover:text-[#BE185D] shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>

            {/* Custom message input */}
            <div className="pt-2">
              <div className="flex items-center gap-2 bg-white rounded-xl border border-[#FCE7EB] p-1.5 focus-within:border-[#BE185D] transition-colors shadow-2xs">
                <input
                  type="text"
                  placeholder="Type custom inquiry..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customMsg.trim()) {
                      handleSend(customMsg);
                    }
                  }}
                  className="w-full px-2 py-1 text-xs text-[#3D2C2E] placeholder-[#9D7983] bg-transparent focus:outline-hidden"
                />
                <button
                  onClick={() => customMsg.trim() && handleSend(customMsg)}
                  disabled={!customMsg.trim()}
                  className="p-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#1EBE5D] disabled:opacity-40 transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="px-4 py-2 bg-[#FFF0F3] border-t border-[#FCE7EB] text-[10px] text-center text-[#831843]/80 font-medium">
            Opens in WhatsApp • {displayNumber || '+92 371 6747099'}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="floating-whatsapp-bubble-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-hidden"
        aria-label="Contact Sania on WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 animate-ping"></span>
        <MessageCircle className="w-6 h-6 shrink-0 relative z-10" />
        <span className="font-semibold text-xs sm:text-sm tracking-wide relative z-10 hidden sm:inline">
          Order on WhatsApp
        </span>
      </button>
    </div>
  );
};
