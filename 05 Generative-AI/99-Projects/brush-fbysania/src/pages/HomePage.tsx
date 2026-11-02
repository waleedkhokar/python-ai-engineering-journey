import React, { useState } from 'react';
import { Product, Category, GalleryItem, SiteContent, PageView } from '../types';
import { Hero3D } from '../components/Hero3D';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, MessageCircle, Sliders, ArrowRight, Heart, Star, Palette, ShieldCheck, CheckCircle2, Instagram, Scissors, Clock, Truck } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl, openWhatsApp } from '../lib/whatsapp';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  galleryItems: GalleryItem[];
  siteContent: SiteContent;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenCustomize: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigate: (page: PageView, filter?: string) => void;
  onOpenBespokeModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  galleryItems,
  siteContent,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onOpenCustomize,
  onAddToCart,
  onNavigate,
  onOpenBespokeModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const featuredProducts = products.filter(p => p.is_featured || p.rating === 5.0).slice(0, 6);
  const bestSellers = products.slice(0, 4);

  const handleWhatsAppConsult = () => {
    const url = generateGeneralInquiryWhatsAppUrl(
      'Salam Sania! 🌸 I am browsing your homepage and would like to order a custom handmade dupatta.',
      siteContent.whatsapp_number
    );
    openWhatsApp(url);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. 3D Hero Section */}
      <Hero3D
        siteContent={siteContent}
        onNavigate={onNavigate}
        onOpenBespokeModal={onOpenBespokeModal}
      />

      {/* 2. "Why Choose Us" / Artisanal Craftsmanship Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-[#FFF0F3] via-white to-[#FCE7EB] rounded-3xl p-8 sm:p-12 border border-[#F3C5D4] shadow-sm relative overflow-hidden">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#BE185D] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{siteContent.home_why_badge || 'Artisanal Excellence'}</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3D2C2E]">
              {siteContent.home_why_title || 'Why Choose Brush n Fabric?'}
            </h2>
            <p className="text-sm text-[#7A5A62] mt-2 font-sans-clean">
              {siteContent.home_why_subtitle || 'We reject mass manufacturing in favor of intentional, handcrafted couture that elevates your style.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white/80 backdrop-blur-xs p-6 rounded-2xl border border-[#FCE7EB] shadow-2xs hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#3D2C2E]">
                {siteContent.home_feature1_title || '100% Hand-Painted'}
              </h3>
              <p className="text-xs text-[#7A5A62] leading-relaxed">
                {siteContent.home_feature1_desc || 'Every motif and flower is individually painted with fine artist brushes using durable, color-fast textile pigments.'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/80 backdrop-blur-xs p-6 rounded-2xl border border-[#FCE7EB] shadow-2xs hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#3D2C2E]">
                {siteContent.home_feature2_title || 'Bespoke Customization'}
              </h3>
              <p className="text-xs text-[#7A5A62] leading-relaxed">
                {siteContent.home_feature2_desc || 'Send a picture of your outfit or swatch. We customize fabric, colors, lengths, and borders to match your dress.'}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/80 backdrop-blur-xs p-6 rounded-2xl border border-[#FCE7EB] shadow-2xs hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#3D2C2E]">
                {siteContent.home_feature3_title || 'Pure Luxury Fabrics'}
              </h3>
              <p className="text-xs text-[#7A5A62] leading-relaxed">
                {siteContent.home_feature3_desc || 'We use only authentic Korean organza, 100% pure crinkle chiffon, raw silk, and handloom Chanderi blends.'}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/80 backdrop-blur-xs p-6 rounded-2xl border border-[#FCE7EB] shadow-2xs hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#3D2C2E]">
                {siteContent.home_feature4_title || 'Direct Maker WhatsApp'}
              </h3>
              <p className="text-xs text-[#7A5A62] leading-relaxed">
                {siteContent.home_feature4_desc || 'Zero impersonal checkouts. Confirm your order, color match, and delivery date directly with Sania on WhatsApp.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Featured Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#BE185D] mb-1">
              <span>Artisanal Collections</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3D2C2E]">
              Explore by Technique & Fabric
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#BE185D] hover:text-[#831843] transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 3).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop')}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-[#FCE7EB]"
            >
              <img
                src={cat.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#FDE047]">
                  Curated Collection
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#FFF0F3]/90 line-clamp-2">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-[#FDE047] transition-colors">
                  <span>Explore Dupattas</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Best-Selling / Featured Handcrafted Dupattas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#BE185D] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Signature Drapes</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3D2C2E]">
              Featured Masterpieces
            </h2>
            <p className="text-xs sm:text-sm text-[#7A5A62] mt-1">
              Hand-painted and stitched on order. Tap to customize or buy instantly on WhatsApp.
            </p>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFF0F3] text-[#831843] border border-[#F3C5D4] hover:bg-[#FCE7EB] text-xs font-semibold transition-all shadow-2xs"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isWishlisted={wishlist.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              onOpenCustomize={onOpenCustomize}
              onAddToCart={onAddToCart}
              whatsappNumber={siteContent.whatsapp_number}
            />
          ))}
        </div>
      </section>

      {/* 5. Custom Order Process Walkthrough */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#831843] via-[#9D174D] to-[#831843] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#FDE047] text-xs font-bold uppercase tracking-widest">
              Simple 4-Step Journey
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold mt-1.5">
              How Custom Orders Work
            </h2>
            <p className="text-xs sm:text-sm text-[#FFF0F3]/80 mt-2">
              From your initial dress photo to a hand-painted heirloom delivered to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FDE047] text-[#831843] font-bold flex items-center justify-center font-serif text-lg">
                1
              </div>
              <h3 className="font-serif-luxury text-lg font-bold">
                Select or Share Dress
              </h3>
              <p className="text-xs text-[#FFF0F3]/80 leading-relaxed">
                Choose any design from our shop or upload an outfit picture for a custom color-matching consultation.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FDE047] text-[#831843] font-bold flex items-center justify-center font-serif text-lg">
                2
              </div>
              <h3 className="font-serif-luxury text-lg font-bold">
                WhatsApp Consultation
              </h3>
              <p className="text-xs text-[#FFF0F3]/80 leading-relaxed">
                Sania personally discusses your fabric choice, motif placement, and calligraphy details with you on WhatsApp.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FDE047] text-[#831843] font-bold flex items-center justify-center font-serif text-lg">
                3
              </div>
              <h3 className="font-serif-luxury text-lg font-bold">
                Handcrafted With Love
              </h3>
              <p className="text-xs text-[#FFF0F3]/80 leading-relaxed">
                Each flower is hand-painted, embellished with gotta/kiran lace, and quality checked in our atelier.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FDE047] text-[#831843] font-bold flex items-center justify-center font-serif text-lg">
                4
              </div>
              <h3 className="font-serif-luxury text-lg font-bold">
                Express Delivery
              </h3>
              <p className="text-xs text-[#FFF0F3]/80 leading-relaxed">
                Packaged delicately in boutique wrapping and dispatched across Pakistan and worldwide to your home.
              </p>
            </div>

          </div>

          <div className="mt-10 text-center">
            <button
              onClick={onOpenBespokeModal}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FDE047] text-[#831843] font-bold text-sm shadow-lg hover:bg-white transition-all transform hover:scale-105"
            >
              <Sliders className="w-4 h-4" />
              <span>Start Your Custom Request</span>
            </button>
          </div>

        </div>
      </section>

      {/* 6. Instagram & Lookbook Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#BE185D] mb-1">
              <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
              <span>@brushandfabricby_sania</span>
            </div>
            <h2 className="font-serif-luxury text-3xl font-bold text-[#3D2C2E]">
              Client Drapes & Studio Lookbook
            </h2>
          </div>

          <a
            href={siteContent.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#F3C5D4] text-[#831843] hover:bg-[#FFF0F3] text-xs font-semibold transition-colors"
          >
            <Instagram className="w-4 h-4 text-[#E1306C]" />
            <span>Follow on Instagram</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {galleryItems.slice(0, 5).map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('gallery')}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-[#FCE7EB]"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] font-bold text-[#FDE047]">{item.category_tag}</span>
                <p className="text-xs font-serif font-bold line-clamp-1">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Client Love / Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF8F9] rounded-3xl p-8 sm:p-12 border border-[#FCE7EB]">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="font-serif-luxury text-3xl font-bold text-[#3D2C2E]">
              Loved by Our Brides & Clients
            </h2>
            <p className="text-xs sm:text-sm text-[#7A5A62] mt-1">
              Real feedback from clients who ordered customized dupattas via WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-[#FCE7EB] shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#5C3A42] leading-relaxed italic">
                "Sania painted my Nikkah dupatta with custom Urdu calligraphy. The brushwork on the organza was so delicate, everyone at my event asked where I got it made!"
              </p>
              <div className="pt-2 border-t border-[#FFF0F3] flex items-center justify-between text-xs">
                <span className="font-bold text-[#831843]">Ayesha Tariq</span>
                <span className="text-[#9D7983] text-[11px]">Nikkah Bride, Lahore</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#FCE7EB] shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#5C3A42] leading-relaxed italic">
                "I sent a picture of my raw silk outfit and Sania color-matched the floral organza dupatta with 100% precision. Ordering on WhatsApp was so seamless and polite."
              </p>
              <div className="pt-2 border-t border-[#FFF0F3] flex items-center justify-between text-xs">
                <span className="font-bold text-[#831843]">Mahnoor Farooq</span>
                <span className="text-[#9D7983] text-[11px]">Custom Color Match</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#FCE7EB] shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#5C3A42] leading-relaxed italic">
                "Ordered the Gulabi Bahaar organza dupatta for Eid. The fabric feels pure and the kiran lace is stitched immaculately. Will definitely order again!"
              </p>
              <div className="pt-2 border-t border-[#FFF0F3] flex items-center justify-between text-xs">
                <span className="font-bold text-[#831843]">Hafsa Raza</span>
                <span className="text-[#9D7983] text-[11px]">Festive Order</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Bottom WhatsApp Direct CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gradient-to-r from-[#BE185D] via-[#9D174D] to-[#831843] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold">
              Looking for a One-of-a-Kind Dupatta?
            </h2>
            <p className="text-xs sm:text-sm text-[#FFF0F3]/90">
              Speak directly with Sania on WhatsApp to discuss your dream colors, fabric length, and occasion timeline.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleWhatsAppConsult}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#25D366] text-white font-bold text-sm shadow-lg hover:bg-[#20BA5A] transition-all transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat with Sania ({siteContent.display_whatsapp || '+92 371 6747099'})</span>
            </button>

            <button
              onClick={onOpenBespokeModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#831843] font-bold text-sm shadow-md hover:bg-[#FFF0F3] transition-all"
            >
              <Sliders className="w-4 h-4 text-[#BE185D]" />
              <span>Open Custom Order Form</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
