import React, { useState } from 'react';
import { Sparkles, MessageCircle, Sliders, ArrowRight, Heart, Star, Palette, ShieldCheck, Truck } from 'lucide-react';
import { SiteContent, PageView } from '../types';
import { generateGeneralInquiryWhatsAppUrl, openWhatsApp } from '../lib/whatsapp';

interface Hero3DProps {
  siteContent: SiteContent;
  onNavigate: (page: PageView) => void;
  onOpenBespokeModal: () => void;
}

export const Hero3D: React.FC<Hero3DProps> = ({
  siteContent,
  onNavigate,
  onOpenBespokeModal,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleWhatsAppConsult = () => {
    const url = generateGeneralInquiryWhatsAppUrl(
      'Salam Sania! 🌸 I am visiting your store and would love a personal consultation for a bespoke handmade dupatta.',
      siteContent.whatsapp_number
    );
    openWhatsApp(url);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFF0F3] via-[#FFF8F9] to-[#FFF0F3] py-16 lg:py-24"
    >
      {/* Soft floating background ambient orbs */}
      <div 
        className="absolute top-10 left-1/4 w-80 h-80 bg-[#FCE7EB] rounded-full blur-3xl opacity-70 pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}
      />
      <div 
        className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#F8D2DE] rounded-full blur-3xl opacity-60 pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)` }}
      />

      {/* Floating Petals / Botanical Micro Elements */}
      <div className="absolute top-16 left-8 sm:left-20 animate-float opacity-70 pointer-events-none text-2xl select-none">
        🌸
      </div>
      <div className="absolute top-1/3 right-10 sm:right-24 animate-float-delay opacity-60 pointer-events-none text-xl select-none">
        ✨
      </div>
      <div className="absolute bottom-20 left-12 sm:left-32 animate-float opacity-50 pointer-events-none text-3xl select-none">
        🌺
      </div>
      <div className="absolute top-2/3 right-1/3 animate-float-delay opacity-40 pointer-events-none text-lg select-none">
        🌸
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column: Brand Story & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Artisanal Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#F3C5D4] shadow-xs backdrop-blur-xs text-[#831843] text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#BE185D] animate-ping"></span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Boutique Handcrafted Dupattas</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold text-[#4A1D2B] leading-[1.12] tracking-tight">
              {siteContent.banner_title || 'Handmade Dupattas, Crafted With Love'}
            </h1>

            {/* Sub-headline / Tagline */}
            <p className="font-serif italic text-lg sm:text-xl text-[#9D174D] max-w-xl mx-auto lg:mx-0">
              "{siteContent.banner_tagline || 'Artisanal Hand-Painted & Embroidered Bespoke Creations by Sania'}"
            </p>

            {/* Description */}
            <p className="text-base text-[#5C3A42] leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans-clean">
              {siteContent.banner_subtitle ||
                'Every brushstroke tells a story. From delicate pure organza florals to majestic heirloom bridal veils, customize your dream dupatta tailored precisely to your occasion.'}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              
              {/* WhatsApp Primary Order CTA */}
              <button
                id="hero-order-whatsapp-btn"
                onClick={handleWhatsAppConsult}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#25D366] via-[#20BA5A] to-[#128C7E] text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Order via WhatsApp</span>
              </button>

              {/* Bespoke Studio CTA */}
              <button
                id="hero-customize-btn"
                onClick={onOpenBespokeModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#831843] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:from-[#9D174D] hover:to-[#701237] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <Sliders className="w-4 h-4 text-[#FDE047]" />
                <span>Design Custom Piece</span>
              </button>

              {/* Browse Catalog CTA */}
              <button
                id="hero-explore-btn"
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white text-[#831843] border border-[#F3C5D4] hover:bg-[#FFF0F3] font-medium text-sm transition-all shadow-2xs"
              >
                <span>Browse Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Craft Highlights Ribbon */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-[#FCE7EB] max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#831843]">100%</span>
                <span className="text-[11px] text-[#7A5A62] uppercase tracking-wider font-medium">Handmade & Painted</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#831843]">Custom</span>
                <span className="text-[11px] text-[#7A5A62] uppercase tracking-wider font-medium">Color Matching</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#831843]">Direct</span>
                <span className="text-[11px] text-[#7A5A62] uppercase tracking-wider font-medium">WhatsApp Booking</span>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Layered 3D Parallax Visual Display */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* 3D Stage Container */}
            <div 
              className="relative w-full max-w-md aspect-4/5 perspective-1000 group cursor-pointer"
              onClick={() => onNavigate('shop')}
            >
              {/* Layer 1: Background Decorative Gold Frame */}
              <div 
                className="absolute inset-0 rounded-3xl border-2 border-[#D4AF37]/40 bg-gradient-to-tr from-[#FCE7EB] to-[#FFF0F3] shadow-2xl transition-transform duration-500 ease-out"
                style={{
                  transform: `rotateX(${mousePos.y * -15}deg) rotateY(${mousePos.x * 15}deg) translateZ(0px)`,
                }}
              />

              {/* Layer 2: Main Featured Artisanal Dupatta Image */}
              <div 
                className="absolute inset-2 rounded-2xl overflow-hidden shadow-xl transition-transform duration-500 ease-out"
                style={{
                  transform: `rotateX(${mousePos.y * -18}deg) rotateY(${mousePos.x * 18}deg) translateZ(30px)`,
                }}
              >
                <img
                  src={siteContent.hero_image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'}
                  alt="Handmade Hand-Painted Dupatta by Sania"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A1D2B]/80 via-transparent to-black/10" />

                {/* Bottom caption in frame */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1 text-[#FDE047] text-xs font-semibold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Signature Collection</span>
                  </div>
                  <h3 className="font-serif-luxury text-xl font-bold leading-tight">
                    Gulabi Bahaar Organza
                  </h3>
                  <p className="text-xs text-[#FFF0F3]/90 line-clamp-1">
                    Hand-painted wild roses on blush sheer organza with golden kiran lace.
                  </p>
                </div>
              </div>

              {/* Layer 3: Floating 3D Badge (Top Right) */}
              <div 
                className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-[#F3C5D4] flex items-center gap-2.5 transition-transform duration-500 ease-out pointer-events-none"
                style={{
                  transform: `rotateX(${mousePos.y * -25}deg) rotateY(${mousePos.x * 25}deg) translateZ(60px)`,
                }}
              >
                <div className="w-8 h-8 rounded-full bg-[#FFF0F3] flex items-center justify-center text-[#BE185D]">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#831843] tracking-wider">Custom Dyes</div>
                  <div className="text-xs font-semibold text-[#4A1D2B]">Dress Matching</div>
                </div>
              </div>

              {/* Layer 4: Floating 3D Star Rating Badge (Bottom Left) */}
              <div 
                className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-[#F3C5D4] flex items-center gap-3 transition-transform duration-500 ease-out pointer-events-none"
                style={{
                  transform: `rotateX(${mousePos.y * -25}deg) rotateY(${mousePos.x * 25}deg) translateZ(60px)`,
                }}
              >
                <div className="w-9 h-9 rounded-full bg-[#831843] flex items-center justify-center text-[#FDE047]">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <div className="text-[11px] font-semibold text-[#4A1D2B]">100% Client Satisfaction</div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
