import React, { useState } from 'react';
import { GalleryItem, SiteContent } from '../types';
import { Sparkles, MessageCircle, X, Eye, Sliders, ArrowRight } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl, openWhatsApp } from '../lib/whatsapp';

interface GalleryPageProps {
  galleryItems: GalleryItem[];
  siteContent: SiteContent;
  onOpenBespokeModal: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  galleryItems,
  siteContent,
  onOpenBespokeModal,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const tags = ['all', 'Bridal', 'Organza', 'Festive', 'Custom Match', 'Hand-Painted'];

  const filtered = galleryItems.filter(item => {
    if (selectedTag === 'all') return true;
    return item.category_tag.toLowerCase() === selectedTag.toLowerCase();
  });

  const handleInquireSimilar = (item: GalleryItem) => {
    const text = `Salam Sania! 🌸 I was admiring this piece from your Gallery: "${item.title}" (${item.caption}). I would love to order a similar customized dupatta. Could you share price and availability?`;
    const url = generateGeneralInquiryWhatsAppUrl(text, siteContent.whatsapp_number);
    openWhatsApp(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF0F3] border border-[#F3C5D4] text-[#BE185D] text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Atelier Lookbook & Portfolio</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#3D2C2E]">
          Our Handcrafted Masterpieces
        </h1>
        <p className="text-sm text-[#7A5A62] font-sans-clean leading-relaxed">
          A showcase of completed bespoke dupattas crafted with love for real brides, festive events, and customized ensemble matches.
        </p>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 text-xs">
        {tags.map((tag) => {
          const isSel = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full font-medium transition-all capitalize whitespace-nowrap ${
                isSel
                  ? 'bg-[#831843] text-white shadow-xs'
                  : 'bg-[#FFF0F3] text-[#831843] hover:bg-[#FCE7EB]'
              }`}
            >
              {tag === 'all' ? 'All Creations' : tag}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group relative bg-white rounded-3xl overflow-hidden border border-[#FCE7EB] hover:border-[#F3C5D4] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
          >
            <div className="relative aspect-4/5 overflow-hidden bg-[#FFF8F9]">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-bold text-[#FDE047] uppercase tracking-wider">
                  {item.category_tag}
                </span>
                <h3 className="font-serif-luxury text-xl font-bold mt-1">{item.title}</h3>
                <p className="text-xs text-[#FFF0F3]/90 line-clamp-2 mt-1">{item.caption}</p>
                <div className="pt-3 flex items-center gap-2 text-xs font-semibold text-[#FDE047]">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Click to Expand & Inquire</span>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-2 bg-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#BE185D]">
                  {item.category_tag}
                </span>
                <h3 className="font-serif-luxury text-lg font-bold text-[#3D2C2E] group-hover:text-[#831843] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#7A5A62] line-clamp-2 mt-1 leading-relaxed">
                  {item.caption}
                </p>
              </div>

              <div className="pt-3 border-t border-[#FFF0F3] flex items-center justify-between">
                <span className="text-[11px] text-[#9D174D] font-medium">Bespoke Creation</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInquireSimilar(item);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#25D366] hover:text-[#128C7E]"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Order Similar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#F3C5D4]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-4/3 sm:aspect-16/10 bg-[#FFF8F9] overflow-hidden">
              <img
                src={activeItem.image_url}
                alt={activeItem.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="p-6 sm:p-8 space-y-4 bg-white">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#BE185D]">
                  {activeItem.category_tag} • Handcrafted Masterpiece
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#3D2C2E] mt-1">
                  {activeItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C3A42] leading-relaxed mt-2">
                  {activeItem.caption}
                </p>
              </div>

              <div className="pt-4 border-t border-[#FCE7EB] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => handleInquireSimilar(activeItem)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-md hover:bg-[#20BA5A] transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Order Similar Design on WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    setActiveItem(null);
                    onOpenBespokeModal();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FFF0F3] text-[#831843] border border-[#F3C5D4] text-xs font-semibold hover:bg-[#FCE7EB] transition-all"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#BE185D]" />
                  <span>Customize Colors / Fabric</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-[#FFF0F3] rounded-3xl p-8 text-center space-y-4 border border-[#F3C5D4]">
        <h3 className="font-serif-luxury text-2xl font-bold text-[#831843]">
          Have an Inspiration Picture or Dress to Match?
        </h3>
        <p className="text-xs sm:text-sm text-[#7A5A62] max-w-lg mx-auto">
          Send your picture directly to Sania on WhatsApp or use our bespoke request form.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenBespokeModal}
            className="px-6 py-3 rounded-full bg-[#BE185D] text-white text-xs font-bold shadow-md hover:bg-[#831843] transition-colors"
          >
            Open Bespoke Form
          </button>
        </div>
      </div>

    </div>
  );
};
