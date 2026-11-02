import React, { useState, useRef } from 'react';
import { SiteContent, BespokeDupattaBanner } from '../types';
import { INITIAL_BESPOKE_BANNERS } from '../data/seedData';
import {
  Sparkles,
  MessageCircle,
  Check,
  Palette,
  Scissors,
  Layers,
  Heart,
  ShieldCheck,
  X,
  FileText,
  Clock,
  Brush,
  ArrowRight,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Tag,
  Eye,
  CheckCircle,
  Flame,
} from 'lucide-react';
import { generateBespokeRequestWhatsAppUrl, openWhatsApp } from '../lib/whatsapp';
import { logCustomizationRequest, uploadSiteImage } from '../lib/supabase';
import { ImageUploader } from '../components/ImageUploader';
import confetti from 'canvas-confetti';

interface CustomizationPageProps {
  siteContent: SiteContent;
}

const FABRIC_TIERS = [
  {
    name: 'Pure Korean Organza',
    desc: 'Crisp, featherweight, translucent glass-like texture. Ideal for hand-painted botanical roses & gold dust borders.',
    priceOffset: 6500,
    drapeBadge: 'Crisp & Sheer',
    img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '100% Pure Crinkle Chiffon',
    desc: 'Fluid, ultra-soft, breezy drape. Perfect for ombré watercolor blends, jasmine sprays, and easy pleating.',
    priceOffset: 5500,
    drapeBadge: 'Fluid & Soft',
    img: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Pure 80gm Raw Silk',
    desc: 'Rich structured handloom feel with a royal sheen. Stays firm on shoulders for winter weddings & mehndi ensembles.',
    priceOffset: 9500,
    drapeBadge: 'Structured & Rich',
    img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Bridal Soft Micro-Net',
    desc: 'Grand bridal veil drape. Perfect for custom Urdu calligraphy ("Qubool Hai"), gotta patti borders, and pearl drops.',
    priceOffset: 12500,
    drapeBadge: 'Grand Bridal',
    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
  },
];

const TECHNIQUES = [
  'Hand-Painted Botanical Florals & Roses',
  'Custom Urdu / Arabic Nikkah Calligraphy & Dates',
  'Two-Tone Ombré Dip-Dye Watercolor Blend',
  'Handcrafted Gotta Patti Jaal & Kiran Lace',
  'Resham Needlework & Shadow Stitching',
];

const POPULAR_COLORS = [
  'Gulabi Blush Pink',
  'Royal Rose Magenta',
  'Bridal Crimson Red',
  'Ivory Pearl Gold',
  'Mint Pistachio',
  'Lilac Lavender',
  'Powder Sky Blue',
  'Butter Mustard Yellow',
];

export const CustomizationPage: React.FC<CustomizationPageProps> = ({ siteContent }) => {
  const fabrics = siteContent.bespoke_fabrics && siteContent.bespoke_fabrics.length > 0 ? siteContent.bespoke_fabrics : FABRIC_TIERS;
  const techniques = siteContent.bespoke_techniques && siteContent.bespoke_techniques.length > 0 ? siteContent.bespoke_techniques : TECHNIQUES;
  const popularColors = siteContent.bespoke_colors && siteContent.bespoke_colors.length > 0 ? siteContent.bespoke_colors : POPULAR_COLORS;
  const sizes = siteContent.bespoke_sizes && siteContent.bespoke_sizes.length > 0 ? siteContent.bespoke_sizes : [
    'Standard 2.5 Meters',
    '2.75 Meters Grand Bridal',
    '3.0 Meters Royal Shawl',
  ];
  const trims = siteContent.bespoke_trims && siteContent.bespoke_trims.length > 0 ? siteContent.bespoke_trims : [
    'Four-Sided Golden Kiran Lace',
    'Handcrafted Pearl & Crystal Droplets',
    'Scalloped Gotta Patti Edgings',
    'Minimal Raw Silk Piping (No Lace)',
  ];

  // Dupatta Banners
  const banners: BespokeDupattaBanner[] = (siteContent.bespoke_banners && siteContent.bespoke_banners.length > 0)
    ? siteContent.bespoke_banners
    : INITIAL_BESPOKE_BANNERS;

  // Active banner slide index
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Form selections
  const [selectedFabric, setSelectedFabric] = useState(fabrics[0]?.name || 'Pure Korean Organza');
  const [selectedTechnique, setSelectedTechnique] = useState(techniques[0] || 'Hand-Painted Botanical Florals & Roses');
  const [selectedColor, setSelectedColor] = useState(popularColors[0] || 'Gulabi Blush Pink');
  const [customColorDetail, setCustomColorDetail] = useState('');
  const [selectedSize, setSelectedSize] = useState(sizes[0] || 'Standard 2.5 Meters');
  const [selectedTassels, setSelectedTassels] = useState(trims[0] || 'Four-Sided Golden Kiran Lace');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [notes, setNotes] = useState('');
  const [referenceImg, setReferenceImg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successWaUrl, setSuccessWaUrl] = useState<string | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [appliedBannerToast, setAppliedBannerToast] = useState<string | null>(null);
  const [selectedShowcaseModal, setSelectedShowcaseModal] = useState<any | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  const calculateEstimate = () => {
    const tier = fabrics.find(f => f.name === selectedFabric);
    let base = tier ? tier.priceOffset : 6500;
    if (selectedTechnique.includes('Calligraphy')) base += 2000;
    if (selectedSize.includes('Grand Bridal') || selectedSize.includes('3.0') || selectedSize.includes('2.75')) base += 1500;
    return base;
  };

  const estimatedTotal = calculateEstimate();
  const directWhatsAppNumber = siteContent.whatsapp_number || '923716747099';
  const displayWhatsApp = siteContent.display_whatsapp || '+92 371 6747099';

  // Apply a banner's style presets and smoothly scroll to the customizer
  const handleApplyBannerPreset = (banner: BespokeDupattaBanner) => {
    if (banner.fabric_preset) {
      const match = fabrics.find(f => f.name.toLowerCase().includes(banner.fabric_preset!.toLowerCase()));
      if (match) setSelectedFabric(match.name);
      else setSelectedFabric(banner.fabric_preset);
    }
    if (banner.technique_preset) {
      const matchTech = techniques.find(t => t.toLowerCase().includes(banner.technique_preset!.toLowerCase()));
      if (matchTech) setSelectedTechnique(matchTech);
      else setSelectedTechnique(banner.technique_preset);
    }
    if (banner.color_preset) {
      const matchCol = popularColors.find(c => c.toLowerCase().includes(banner.color_preset!.toLowerCase()));
      if (matchCol) setSelectedColor(matchCol);
      else setSelectedColor(banner.color_preset);
    }

    // Set notes hint if empty
    if (!notes) {
      setNotes(`Inspired by "${banner.title}". Looking for similar aesthetics and detailing.`);
    }

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#BE185D', '#D4AF37', '#FCE7EB'],
      });
    } catch {}

    setAppliedBannerToast(`Applied style preset: "${banner.title}"`);
    setTimeout(() => setAppliedBannerToast(null), 4000);

    // Scroll to interactive customizer
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBespokeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const waUrl = generateBespokeRequestWhatsAppUrl({
      fabric_choice: selectedFabric,
      color_choice: customColorDetail ? `${selectedColor} (${customColorDetail})` : selectedColor,
      size_choice: selectedSize,
      tassels_option: selectedTassels,
      notes: notes.trim() || undefined,
      estimated_price: estimatedTotal,
      reference_image_url: referenceImg || undefined,
      customer_name: customerName.trim() || undefined,
      customer_contact: customerContact.trim() || undefined,
    }, directWhatsAppNumber);

    setSuccessWaUrl(waUrl);

    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#BE185D', '#25D366', '#D4AF37', '#FFF0F3'],
      });
    } catch {}

    openWhatsApp(waUrl);

    setIsSubmitting(true);
    logCustomizationRequest({
      fabric_choice: selectedFabric,
      color_choice: customColorDetail ? `${selectedColor} - ${customColorDetail}` : selectedColor,
      size_choice: selectedSize,
      tassels_option: selectedTassels,
      reference_image_url: referenceImg || undefined,
      customer_name: customerName.trim() || 'Valued Client',
      customer_contact: customerContact.trim() || 'Via WhatsApp Chat',
      notes: `${selectedTechnique}. ${notes}`.trim(),
      estimated_price: estimatedTotal,
      status: 'new',
      whatsapp_sent: true,
    }).catch(err => {
      console.warn('Custom request logging notice:', err);
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const currentBanner = banners[activeBannerIndex] || banners[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-14">
      
      {/* Toast Notification when a banner preset is applied */}
      {appliedBannerToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#831843] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-[#F3C5D4]/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Sparkles className="w-5 h-5 text-[#FDE047] animate-pulse shrink-0" />
          <div className="text-xs">
            <strong className="block font-bold">Preset Selected!</strong>
            <span className="text-[#FFF0F3]/90">{appliedBannerToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setAppliedBannerToast(null)}
            className="text-white/80 hover:text-white p-1 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ATELIER HERO BANNER WITH DUPATTA SPOTLIGHT                             */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#500724] via-[#831843] to-[#BE185D] text-white shadow-2xl border border-[#F3C5D4]/30">
        
        {/* Subtle decorative background pattern / image */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `url(${siteContent.bespoke_hero_image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80'})`
          }}
        />

        <div className="relative z-10 p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & Call-To-Action */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#FDE047] text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-4 h-4 text-[#FDE047]" />
              <span>{siteContent.bespoke_badge || "Sania's Custom Atelier"}</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold leading-tight text-white drop-shadow-sm">
              {siteContent.bespoke_title || 'Bespoke Handcrafted & Hand-Painted Dupattas'}
            </h1>

            <p className="text-sm sm:text-base text-white/90 font-sans-clean leading-relaxed max-w-xl">
              {siteContent.bespoke_subtitle ||
                'Whether you are matching a designer bridal lehenga, creating an heirloom Nikkah veil with custom Urdu calligraphy, or dreaming of watercolor botanical roses on sheer organza — Sania hand-paints each piece exclusively to your vision.'}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-medium text-white/90">
              <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#25D366]" /> 100% Pure Textiles
              </span>
              <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#25D366]" /> Color-Matched to Outfit
              </span>
              <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#25D366]" /> Wash-Fast Pigments
              </span>
              <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#25D366]" /> Worldwide Delivery
              </span>
            </div>

            {/* Direct Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  if (formRef.current) {
                    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#831843] font-bold text-xs shadow-lg hover:bg-[#FFF0F3] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Start Designing Your Dupatta</span>
                <ArrowRight className="w-4 h-4 text-[#BE185D]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = `https://wa.me/${directWhatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Salam Sania! 🌸 I would like to inquire about getting a bespoke hand-painted/embroidered dupatta made.")}`;
                  openWhatsApp(url);
                }}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-md hover:bg-[#1ebd5b] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Featured Dupatta Card Spotlight */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md p-3 border border-white/20 shadow-2xl group">
              <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden">
                <img
                  src={siteContent.bespoke_hero_image_url || (banners[0]?.image_url) || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                  alt="Bespoke dupatta showcase"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#FDE047] mb-1">
                    Signature Creation
                  </span>
                  <h3 className="font-serif-luxury text-lg font-bold text-white leading-snug">
                    Artisanal Botanical Organza & Nikkah Calligraphy
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 mt-1">
                    Every flower painted by hand with permanent fine artist pigments.
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FDE047]">
                      Bespoke Orders Open
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (banners[0]) handleApplyBannerPreset(banners[0]);
                      }}
                      className="px-3 py-1.5 rounded-full bg-white/90 text-[#831843] text-xs font-bold hover:bg-white transition-colors"
                    >
                      Customize This →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DUPATTA BANNERS CAROUSEL & SHOWCASE (EDITABLE IN ADMIN PANEL)          */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#FCE7EB] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F3] text-[#BE185D] text-xs font-bold uppercase tracking-wider mb-2">
              <Tag className="w-3.5 h-3.5" />
              <span>Curated Dupatta Styles</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#3D2C2E]">
              Featured Dupatta Collections & Banners
            </h2>
            <p className="text-xs sm:text-sm text-[#7A5A62] mt-1">
              Select any dupatta style to automatically apply its fabric, technique, and palette in the customizer below.
            </p>
          </div>

          {/* Banner Slider Controls */}
          {banners.length > 1 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveBannerIndex((prev) => (prev > 0 ? prev - 1 : banners.length - 1))}
                className="w-9 h-9 rounded-full bg-white border border-[#F3C5D4] text-[#831843] hover:bg-[#FFF0F3] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                title="Previous Dupatta Banner"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1 px-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveBannerIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeBannerIndex === i ? 'w-6 bg-[#BE185D]' : 'w-2 bg-[#FCE7EB] hover:bg-[#F3C5D4]'
                    }`}
                    title={`Go to banner ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveBannerIndex((prev) => (prev < banners.length - 1 ? prev + 1 : 0))}
                className="w-9 h-9 rounded-full bg-white border border-[#F3C5D4] text-[#831843] hover:bg-[#FFF0F3] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                title="Next Dupatta Banner"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Featured Big Banner Presentation */}
        {currentBanner && (
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#FCE7EB] bg-white group">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
              
              {/* Dupatta Banner Image */}
              <div className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden">
                <img
                  src={currentBanner.image_url}
                  alt={currentBanner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                
                {/* Badge overlay on image */}
                {currentBanner.badge && (
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#831843] font-bold text-xs shadow-md border border-white">
                    <Sparkles className="w-3.5 h-3.5 text-[#BE185D]" />
                    <span>{currentBanner.badge}</span>
                  </div>
                )}

                {/* Price pill on image */}
                {currentBanner.price_hint && (
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#FDE047] font-bold text-xs shadow-md">
                    <span>{currentBanner.price_hint}</span>
                  </div>
                )}
              </div>

              {/* Dupatta Banner Content & Action */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-white via-[#FFF8F9] to-[#FFF0F3]/40">
                <div className="space-y-4">
                  
                  {/* Category / Fabric indicator */}
                  <div className="flex flex-wrap items-center gap-2">
                    {currentBanner.fabric_preset && (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FFF0F3] text-[#831843] border border-[#FCE7EB]">
                        {currentBanner.fabric_preset}
                      </span>
                    )}
                    {currentBanner.technique_preset && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white text-[#7A5A62] border border-[#FCE7EB]">
                        {currentBanner.technique_preset}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#3D2C2E] leading-tight">
                    {currentBanner.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#7A5A62] leading-relaxed">
                    {currentBanner.subtitle}
                  </p>

                  {/* Highlights checklist */}
                  <div className="space-y-2 pt-2 text-xs text-[#5C3A42]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#BE185D] shrink-0" />
                      <span>Customizable shade match for your outfit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#BE185D] shrink-0" />
                      <span>Permanent, non-bleeding artist textile paints</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#BE185D] shrink-0" />
                      <span>Finished with signature gotta or kiran lace</span>
                    </div>
                  </div>
                </div>

                {/* Banner CTA Buttons */}
                <div className="pt-6 border-t border-[#FCE7EB] flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleApplyBannerPreset(currentBanner)}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#831843] text-white font-bold text-xs shadow-md hover:shadow-lg hover:from-[#9D174D] hover:to-[#6B1236] transition-all cursor-pointer"
                  >
                    <span>{currentBanner.cta_text || 'Customize This Style'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const msg = `Salam Sania! 🌸 I am interested in ordering the "${currentBanner.title}" dupatta style (${currentBanner.price_hint || ''}). Could you share details on custom shades and making time?`;
                      const url = `https://wa.me/${directWhatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
                      openWhatsApp(url);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-sm hover:bg-[#1ebd5b] transition-all cursor-pointer"
                    title="Inquire about this dupatta on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Thumbnail selector grid for all banners */}
        {banners.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {banners.map((b, idx) => {
              const isSel = activeBannerIndex === idx;
              return (
                <div
                  key={b.id || idx}
                  onClick={() => setActiveBannerIndex(idx)}
                  className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex items-center gap-3 ${
                    isSel
                      ? 'border-[#BE185D] bg-[#FFF0F3] shadow-sm'
                      : 'border-[#FCE7EB] bg-white hover:border-[#F3C5D4] hover:bg-[#FFF8F9]'
                  }`}
                >
                  <img
                    src={b.image_url}
                    alt={b.title}
                    className="w-12 h-12 rounded-xl object-cover border border-[#FCE7EB] shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-[#BE185D] block truncate">
                      {b.badge || `Style 0${idx + 1}`}
                    </span>
                    <h4 className="font-serif-luxury text-xs font-bold text-[#3D2C2E] truncate">
                      {b.title}
                    </h4>
                    <p className="text-[10px] text-[#7A5A62] truncate">
                      {b.price_hint || 'Customizable'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. VISUAL 4-STEP PROCESS GUIDE WITH PHOTOS                                */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#BE185D] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#FCE7EB]">
            How It Works
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#3D2C2E]">
            The 4-Step Bespoke Journey
          </h2>
          <p className="text-xs sm:text-sm text-[#7A5A62]">
            From pure unstitched loom yardage to an heirloom masterpiece, personally crafted for your special day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl border border-[#FCE7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-[#F3C5D4] transition-all group flex flex-col">
            <div className="relative h-44 w-full overflow-hidden bg-[#FFF8F9]">
              <img
                src={siteContent.bespoke_step1_img || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
                alt="Choose Base Fabric"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md text-[#BE185D] font-serif font-bold text-xs flex items-center justify-center shadow-xs border border-white">
                01
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-[#3D2C2E]">
                  {siteContent.bespoke_step1_title || 'Choose Base Fabric'}
                </h3>
                <p className="text-xs text-[#7A5A62] mt-1.5 leading-relaxed">
                  {siteContent.bespoke_step1_desc || 'Select pure Korean organza, fluid crinkle chiffon, raw silk, or bridal net.'}
                </p>
              </div>
              <div className="pt-3 border-t border-[#FFF0F3] text-[11px] font-bold text-[#BE185D] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Pure & Tested Yardage</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl border border-[#FCE7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-[#F3C5D4] transition-all group flex flex-col">
            <div className="relative h-44 w-full overflow-hidden bg-[#FFF8F9]">
              <img
                src={siteContent.bespoke_step2_img || 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80'}
                alt="Color & Palette Match"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md text-[#BE185D] font-serif font-bold text-xs flex items-center justify-center shadow-xs border border-white">
                02
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-[#3D2C2E]">
                  {siteContent.bespoke_step2_title || 'Color & Palette Match'}
                </h3>
                <p className="text-xs text-[#7A5A62] mt-1.5 leading-relaxed">
                  {siteContent.bespoke_step2_desc || 'Share your dress photo or pick from our artisanal dye palette.'}
                </p>
              </div>
              <div className="pt-3 border-t border-[#FFF0F3] text-[11px] font-bold text-[#BE185D] flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" />
                <span>Custom Shade Dyeing</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl border border-[#FCE7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-[#F3C5D4] transition-all group flex flex-col">
            <div className="relative h-44 w-full overflow-hidden bg-[#FFF8F9]">
              <img
                src={siteContent.bespoke_step3_img || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80'}
                alt="Artisanal Hand-Paint"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md text-[#BE185D] font-serif font-bold text-xs flex items-center justify-center shadow-xs border border-white">
                03
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-[#3D2C2E]">
                  {siteContent.bespoke_step3_title || 'Artisanal Hand-Paint'}
                </h3>
                <p className="text-xs text-[#7A5A62] mt-1.5 leading-relaxed">
                  {siteContent.bespoke_step3_desc || 'Sania personally paints your custom motifs with permanent, non-bleeding pigments.'}
                </p>
              </div>
              <div className="pt-3 border-t border-[#FFF0F3] text-[11px] font-bold text-[#BE185D] flex items-center gap-1">
                <Brush className="w-3.5 h-3.5" />
                <span>Single-Artisan Craft</span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl border border-[#FCE7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-[#F3C5D4] transition-all group flex flex-col">
            <div className="relative h-44 w-full overflow-hidden bg-[#FFF8F9]">
              <img
                src={siteContent.bespoke_step4_img || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'}
                alt="Finishing & Delivery"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md text-[#BE185D] font-serif font-bold text-xs flex items-center justify-center shadow-xs border border-white">
                04
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-[#3D2C2E]">
                  {siteContent.bespoke_step4_title || 'Finishing & Delivery'}
                </h3>
                <p className="text-xs text-[#7A5A62] mt-1.5 leading-relaxed">
                  {siteContent.bespoke_step4_desc || 'Framed with kiran lace or pearls, packaged with love, and shipped to you.'}
                </p>
              </div>
              <div className="pt-3 border-t border-[#FFF0F3] text-[11px] font-bold text-[#BE185D] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Heirloom Packaging</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN INTERACTIVE BESPOKE CUSTOMIZER FORM                               */}
      {/* ========================================================================= */}
      <div 
        ref={formRef}
        id="bespoke-interactive-form"
        className="bg-white rounded-3xl border-2 border-[#F3C5D4] shadow-xl overflow-hidden scroll-mt-20"
      >
        
        {/* Form Header Banner */}
        <div className="bg-gradient-to-r from-[#831843] via-[#BE185D] to-[#9D174D] text-white p-6 sm:p-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-[#FDE047] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Dupatta Atelier</span>
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold">
              {siteContent.bespoke_form_heading || 'Build Your Custom Dupatta & Order on WhatsApp'}
            </h2>
            <p className="text-xs sm:text-sm text-[#FFF0F3]/90">
              {siteContent.bespoke_form_subheading || 'Choose your fabric, art technique, and exact color palette below. We calculate an instant estimate and connect you directly with Sania.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleBespokeSubmit} className="p-6 sm:p-10 space-y-9 bg-[#FFF8F9]/30">
          
          {/* Step 1: Base Fabric Choice with Visual Photo Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold uppercase tracking-wider text-[#831843] font-serif-luxury flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#BE185D]" />
                <span>Step 1: Choose Your Base Fabric</span>
              </label>
              <span className="text-[11px] text-[#7A5A62]">Click to preview drape & textures</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fabrics.map((tier) => {
                const isSel = selectedFabric === tier.name;
                return (
                  <div
                    key={tier.name}
                    onClick={() => setSelectedFabric(tier.name)}
                    className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all flex flex-col justify-between ${
                      isSel
                        ? 'border-[#BE185D] bg-[#FFF0F3] shadow-md scale-[1.02]'
                        : 'border-[#FCE7EB] bg-white hover:border-[#F3C5D4] hover:shadow-xs'
                    }`}
                  >
                    {/* Fabric image preview */}
                    {tier.img && (
                      <div className="relative h-28 w-full overflow-hidden bg-[#FCE7EB]">
                        <img
                          src={tier.img}
                          alt={tier.name}
                          className="w-full h-full object-cover"
                        />
                        {isSel && (
                          <div className="absolute top-2 right-2 bg-[#BE185D] text-white p-1 rounded-full shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white">
                          {tier.drapeBadge || 'Luxury Textile'}
                        </span>
                      </div>
                    )}

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        {!tier.img && (
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFF0F3] text-[#831843]">
                              {tier.drapeBadge || 'Luxury Textile'}
                            </span>
                            {isSel && (
                              <div className="bg-[#BE185D] text-white p-1 rounded-full shadow-xs">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                        )}
                        <h4 className="font-serif-luxury text-sm font-bold text-[#3D2C2E]">{tier.name}</h4>
                        <p className="text-xs text-[#7A5A62] mt-1 leading-relaxed">{tier.desc}</p>
                      </div>

                      <div className="text-xs font-bold text-[#831843] pt-2 border-t border-[#FCE7EB] flex items-center justify-between">
                        <span>Base Price</span>
                        <span>From Rs. {tier.priceOffset.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Desired Craft Technique */}
          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-wider text-[#831843] font-serif-luxury flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#BE185D]" />
              <span>Step 2: Desired Craft Technique</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {techniques.map((tech) => {
                const isSel = selectedTechnique === tech;
                return (
                  <button
                    type="button"
                    key={tech}
                    onClick={() => setSelectedTechnique(tech)}
                    className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSel
                        ? 'border-[#BE185D] bg-[#FFF0F3] text-[#831843] shadow-xs'
                        : 'border-[#FCE7EB] bg-white text-[#5C3A42] hover:bg-[#FFF8F9]'
                    }`}
                  >
                    <span>{tech}</span>
                    {isSel && <Check className="w-4 h-4 text-[#BE185D] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Color Palette & Swatch Matching */}
          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-wider text-[#831843] font-serif-luxury flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#BE185D]" />
              <span>Step 3: Curated Palette or Custom Outfit Match</span>
            </label>

            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {popularColors.map((col) => {
                  const isSel = selectedColor === col;
                  return (
                    <button
                      type="button"
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        isSel
                          ? 'border-[#BE185D] bg-[#BE185D] text-white font-bold shadow-xs'
                          : 'border-[#FCE7EB] bg-white text-[#5C3A42] hover:bg-[#FFF8F9]'
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                placeholder="Or specify custom tone (e.g. 'Match my blush pink Farshi Gharara or send swatch on WhatsApp')..."
                value={customColorDetail}
                onChange={(e) => setCustomColorDetail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#FCE7EB] text-xs text-[#3D2C2E] bg-white focus:border-[#BE185D] focus:outline-hidden shadow-2xs"
              />

              {/* Have an outfit photo or dress swatch? - Upload Section */}
              <div className="p-5 rounded-2xl bg-white border border-[#FCE7EB] shadow-2xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FFF0F3] text-[#BE185D] border border-[#F3C5D4] shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#3D2C2E] flex items-center gap-2">
                      <span>Have an outfit photo or dress swatch?</span>
                      <span className="text-[10px] font-bold text-[#BE185D] bg-[#FFF0F3] px-2 py-0.5 rounded-full border border-[#F3C5D4]">
                        Photo Swatch Match
                      </span>
                    </h4>
                    <p className="text-xs text-[#7A5A62] mt-0.5 leading-relaxed">
                      Upload a photo of your dress, bridal lehenga, or fabric swatch. Sania will match the hand-painted dye palette to your exact outfit colors and tone.
                    </p>
                  </div>
                </div>

                {/* Interactive Uploader */}
                <div className="bg-[#FFF8F9]/60 p-4 rounded-xl border border-[#FCE7EB]">
                  <ImageUploader
                    label="Upload Outfit Photo / Fabric Swatch (Optional)"
                    description="Upload JPG, PNG, WebP or paste an image link"
                    value={referenceImg || ''}
                    onChange={(url) => setReferenceImg(url as string)}
                    uploadImage={(imageDataUrl) => uploadSiteImage(imageDataUrl, 'references')}
                  />
                </div>

                {referenceImg ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 animate-in fade-in">
                    <div className="flex items-center gap-3">
                      <img
                        src={referenceImg}
                        alt="Attached swatch"
                        className="w-12 h-12 object-cover rounded-lg border border-emerald-300 shadow-2xs shrink-0"
                      />
                      <div>
                        <span className="font-bold flex items-center gap-1 text-emerald-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Outfit Swatch Attached!</span>
                        </span>
                        <p className="text-[11px] text-emerald-700">
                          This swatch photo will be sent with your custom order details via WhatsApp.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReferenceImg(null)}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold text-[11px] underline cursor-pointer shrink-0"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[11px] text-[#7A5A62] bg-[#FFF0F3]/50 p-2.5 rounded-xl border border-[#FCE7EB]">
                    <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span>
                      Any photo uploaded here is securely included in your WhatsApp inquiry to Sania.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 4: Length & Borders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#FCE7EB] space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#831843]">
                Dimensions / Length Cut
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] focus:outline-hidden"
              >
                {sizes.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#FCE7EB] space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#831843]">
                Border & Tassels Embellishment
              </label>
              <select
                value={selectedTassels}
                onChange={(e) => setSelectedTassels(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] focus:outline-hidden"
              >
                {trims.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 5: Notes & Personalized Calligraphy */}
          <div className="bg-white p-5 rounded-2xl border border-[#FCE7EB] space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#831843]">
              Special Instructions / Urdu Calligraphy / Date / Names
            </label>
            <textarea
              rows={3}
              placeholder="Describe your design vision (e.g. 'Write Ayesha & Bilal with Qubool Hai on the pallu in antique gold paint', or mention specific flower motifs)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#FCE7EB] text-xs text-[#3D2C2E] focus:border-[#BE185D] focus:outline-hidden"
            />
          </div>

          {/* Step 6: Customer Details */}
          <div id="bespoke-contact-section" className="bg-white p-5 rounded-2xl border border-[#FCE7EB] space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#831843]">
                Your Contact Details (Optional)
              </label>
              <span className="text-[11px] text-[#7A5A62]">Connects directly to WhatsApp chat</span>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="font-bold">⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your Full Name (e.g. Fatima Ali)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#FCE7EB] text-xs focus:border-[#BE185D] focus:outline-hidden"
              />
              <input
                type="tel"
                placeholder="Your WhatsApp Number (Optional)"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#FCE7EB] text-xs focus:border-[#BE185D] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Success / WhatsApp Ready Banner */}
          {successWaUrl && (
            <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 shadow-md space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Check className="w-5 h-5 text-emerald-600 bg-emerald-200 rounded-full p-0.5" />
                  <span>Custom Order Details Ready!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccessWaUrl(null)}
                  className="text-emerald-700 hover:text-emerald-900 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-emerald-900 leading-relaxed">
                Your custom bespoke request has been prepared. If WhatsApp didn't open automatically, tap the button below to connect with Sania immediately:
              </p>

              {referenceImg && (
                <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200 flex items-center gap-3">
                  <img
                    src={referenceImg}
                    alt="Attached swatch"
                    className="w-14 h-14 object-cover rounded-xl border border-emerald-300 shadow-2xs shrink-0"
                  />
                  <div className="text-xs text-emerald-950 space-y-0.5">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Dress Swatch Photo Included in WhatsApp Message</span>
                    </span>
                    <p className="text-[11px] text-emerald-700">
                      Sania will receive your order details and swatch matching request directly in chat.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => openWhatsApp(successWaUrl)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-md hover:bg-[#1ebd5b] transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Open WhatsApp Chat Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      const urlObj = new URL(successWaUrl);
                      const text = urlObj.searchParams.get('text') || '';
                      navigator.clipboard.writeText(text);
                      setCopiedMessage(true);
                      setTimeout(() => setCopiedMessage(false), 3000);
                    } catch {}
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100/50 transition-colors cursor-pointer"
                >
                  {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5" />}
                  <span>{copiedMessage ? 'Message Copied!' : 'Copy Order Text'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Estimate & WhatsApp Launch Order Button */}
          <div className="bg-gradient-to-r from-[#FFF0F3] via-white to-[#FCE7EB] p-6 rounded-3xl border border-[#F3C5D4] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <div className="text-[11px] uppercase font-bold text-[#9D174D] tracking-wider">
                Estimated Artisanal Price
              </div>
              <div className="font-serif-luxury text-3xl font-bold text-[#831843]">
                Rs. {estimatedTotal.toLocaleString()}
              </div>
              <p className="text-[11px] text-[#7A5A62]">
                *Includes hand-painting, pure fabric, and border finish. Final quote confirmed on WhatsApp.
              </p>
            </div>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
              <button
                id="submit-bespoke-custom-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{isSubmitting ? 'Opening WhatsApp...' : 'Send Custom Request via WhatsApp'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>

      {/* ========================================================================= */}
      {/* 5. BESPOKE DUPATTA MASTERPIECES LOOKBOOK GALLERY                           */}
      {/* ========================================================================= */}
      {siteContent.bespoke_showcase_images && siteContent.bespoke_showcase_images.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#FCE7EB] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#BE185D] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#FCE7EB]">
                Real Atelier Creations
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#3D2C2E] mt-2">
                {siteContent.bespoke_showcase_title || 'Bespoke Masterpieces & Client Creations'}
              </h2>
              <p className="text-xs sm:text-sm text-[#7A5A62] mt-1">
                {siteContent.bespoke_showcase_subtitle || 'A glimpse of custom hand-painted bridal dupattas, Nikkah veils, and color-matched heirlooms crafted by Sania.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteContent.bespoke_showcase_images.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-3xl border border-[#FCE7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-[#F3C5D4] transition-all group flex flex-col justify-between"
              >
                <div 
                  className="relative h-60 w-full overflow-hidden bg-[#FFF8F9] cursor-pointer"
                  onClick={() => setSelectedShowcaseModal(item)}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#831843] text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Detail</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-serif-luxury text-sm font-bold text-[#3D2C2E] leading-snug">
                      {item.title}
                    </h4>
                    {item.caption && (
                      <p className="text-xs text-[#7A5A62] mt-1 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setNotes(`Looking for a custom piece similar to "${item.title}".`);
                      if (formRef.current) {
                        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                      setAppliedBannerToast(`Referenced style: "${item.title}"`);
                      setTimeout(() => setAppliedBannerToast(null), 3500);
                    }}
                    className="w-full text-center py-2 px-3 rounded-xl bg-[#FFF0F3] hover:bg-[#FCE7EB] text-[#831843] font-bold text-xs transition-colors cursor-pointer"
                  >
                    Request Similar Style →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox / Modal for Showcase preview */}
      {selectedShowcaseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative h-80 sm:h-96 w-full">
              <img
                src={selectedShowcaseModal.image_url}
                alt={selectedShowcaseModal.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedShowcaseModal(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-serif-luxury text-lg font-bold text-[#3D2C2E]">
                {selectedShowcaseModal.title}
              </h3>
              {selectedShowcaseModal.caption && (
                <p className="text-xs text-[#7A5A62] leading-relaxed">
                  {selectedShowcaseModal.caption}
                </p>
              )}
              <div className="pt-3 border-t border-[#FCE7EB] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedShowcaseModal(null)}
                  className="px-4 py-2 rounded-xl border border-[#FCE7EB] text-xs font-semibold text-[#7A5A62]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = selectedShowcaseModal.title;
                    setSelectedShowcaseModal(null);
                    setNotes(`Looking for a custom piece similar to "${title}".`);
                    if (formRef.current) {
                      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-[#BE185D] hover:bg-[#831843] text-white text-xs font-bold"
                >
                  Customize This Style
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ATELIER PROMISE & ASSURANCE                                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-3xl bg-white border border-[#FCE7EB] shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <h4 className="font-serif-luxury font-bold text-sm text-[#3D2C2E]">Pure Handcrafted Love</h4>
          <p className="text-xs text-[#7A5A62] leading-relaxed">
            Every motif is hand-drawn and painted stroke by stroke by Sania. No digital printing, no mass production factories.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#FCE7EB] shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <h4 className="font-serif-luxury font-bold text-sm text-[#3D2C2E]">Transparent Crafting Timeline</h4>
          <p className="text-xs text-[#7A5A62] leading-relaxed">
            Standard bespoke orders take 7 to 12 working days. Urgent bridal slots can be coordinated directly on WhatsApp.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#FCE7EB] shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-serif-luxury font-bold text-sm text-[#3D2C2E]">Direct WhatsApp Coordination</h4>
          <p className="text-xs text-[#7A5A62] leading-relaxed">
            Communicate directly with Sania at {displayWhatsApp} for shade adjustments, outfit matches, and progress previews.
          </p>
        </div>
      </div>

    </div>
  );
};
