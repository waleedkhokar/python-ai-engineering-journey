import React from 'react';
import { SiteContent, PageView } from '../types';
import { Sparkles, MessageCircle, Heart, Palette, Scissors, ShieldCheck, Instagram, ArrowRight } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl, openWhatsApp } from '../lib/whatsapp';

interface AboutPageProps {
  siteContent: SiteContent;
  onNavigate: (page: PageView) => void;
  onOpenBespokeModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  siteContent,
  onNavigate,
  onOpenBespokeModal,
}) => {
  const handleChatWithSania = () => {
    const url = generateGeneralInquiryWhatsAppUrl(
      'Salam Sania! 🌸 I just read your story on the website and would love to discuss a custom dupatta order.',
      siteContent.whatsapp_number
    );
    openWhatsApp(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left: Story */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F3] border border-[#F3C5D4] text-[#BE185D] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{siteContent.about_badge || "The Artisan's Journey"}</span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-[#3D2C2E] leading-tight">
            {siteContent.about_title || 'The Art of Handmade Drapes'}
          </h1>

          <div className="prose text-sm text-[#5C3A42] leading-relaxed space-y-4 font-sans-clean">
            {(siteContent.about_story || '').split('\n\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Highlights */}
          <div className="pt-2 space-y-2.5">
            <div className="flex items-start gap-3 text-xs text-[#831843] font-semibold">
              <span className="w-5 h-5 rounded-full bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <span>{siteContent.about_highlight_1 || '100% Handcrafted & Hand-Painted in Small Artisanal Batches'}</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-[#831843] font-semibold">
              <span className="w-5 h-5 rounded-full bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <span>{siteContent.about_highlight_2 || 'Full Bespoke Customization (Fabric, Motif, Color Matching & Urdu Calligraphy)'}</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-[#831843] font-semibold">
              <span className="w-5 h-5 rounded-full bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <span>{siteContent.about_highlight_3 || 'Direct Maker-to-You WhatsApp Consultation & Worldwide Express Delivery'}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={handleChatWithSania}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-xs font-bold shadow-md hover:bg-[#20BA5A] transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Talk to Sania on WhatsApp</span>
            </button>

            <button
              onClick={onOpenBespokeModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#831843] text-white text-xs font-bold shadow-md hover:bg-[#BE185D] transition-all"
            >
              <span>Request Custom Piece</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right: Studio Imagery */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#FFF8F9] aspect-4/5">
            <img
              src={siteContent.about_image_url || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'}
              alt="Sania's Handcrafted Dupatta Studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D2C2E]/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FDE047]">
                Made with Love in Pakistan
              </span>
              <h3 className="font-serif-luxury text-xl font-bold">
                {siteContent.about_studio_caption_title || 'Brush n Fabric by Sania'}
              </h3>
              <p className="text-xs text-[#FFF0F3]/90">
                {siteContent.about_studio_caption_subtitle || 'Preserving the delicate art of hand-painting on sheer silks and organzas.'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Craft Values Grid */}
      <div className="bg-[#FFF8F9] rounded-3xl p-8 sm:p-12 border border-[#FCE7EB] space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-serif-luxury text-3xl font-bold text-[#3D2C2E]">
            {siteContent.about_values_title || 'Our Core Studio Values'}
          </h2>
          <p className="text-xs text-[#7A5A62]">
            {siteContent.about_values_subtitle || 'Every dupatta we deliver is rooted in slow fashion and artistic integrity.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#FCE7EB] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#3D2C2E]">
              {siteContent.about_value1_title || 'Slow, Intentional Fashion'}
            </h3>
            <p className="text-xs text-[#7A5A62] leading-relaxed">
              {siteContent.about_value1_desc || 'We never rush or mass-produce. Each dupatta takes days of delicate brushwork, layer curing, and hand-embroidery.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#FCE7EB] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#3D2C2E]">
              {siteContent.about_value2_title || 'Zero Color Bleeding Guarantee'}
            </h3>
            <p className="text-xs text-[#7A5A62] leading-relaxed">
              {siteContent.about_value2_desc || 'We formulate special textile medium solutions that bond permanently to pure silk and organza fibers without stiffening the fabric.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#FCE7EB] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#3D2C2E]">
              {siteContent.about_value3_title || 'Custom Tailored to You'}
            </h3>
            <p className="text-xs text-[#7A5A62] leading-relaxed">
              {siteContent.about_value3_desc || 'You are co-creator of your piece. We adjust shade undertones, floral density, and edge trims to suit your exact preference.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
