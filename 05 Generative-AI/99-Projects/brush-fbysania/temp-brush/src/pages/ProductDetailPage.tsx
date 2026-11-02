import React, { useState } from 'react';
import { Product, SiteContent } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ImageUploader } from '../components/ImageUploader';
import {
  Heart,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  Check,
  Palette,
  ShieldCheck,
  Scissors,
  Truck,
  RotateCcw,
  Share2,
  Upload,
  X,
  Star,
  Info,
  FileText,
  Sliders,
  ShoppingBag,
} from 'lucide-react';
import { generateProductOrderWhatsAppUrl, openWhatsApp } from '../lib/whatsapp';
import { uploadSiteImage } from '../lib/supabase';
import { logCustomizationRequest } from '../lib/supabase';
import confetti from 'canvas-confetti';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenCustomize: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
  siteContent: SiteContent;
}

const TASSELS_OPTIONS = [
  'Four-Sided Traditional Golden Kiran Lace',
  'Artisanal Pearl & Crystal Hanging Drops',
  'Handmade Matching Silk Thread Tassels',
  'Delicate Scalloped Embroidered Border',
  'Minimalist Clean Folded Hem',
];

const LENGTH_OPTIONS = [
  'Standard 2.5 Meters (Classic Dupatta)',
  '2.75 Meters (Grand Bridal Drape & Veil)',
  '3.0 Meters (Opulent Royal Shawl Cut)',
  'Custom Length (Specify in instructions)',
];

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onOpenCustomize,
  onAddToCart,
  onBack,
  siteContent,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.available_colors[0] || 'Original Design');
  const [customColorText, setCustomColorText] = useState('');
  const [selectedLength, setSelectedLength] = useState(product.dimensions || LENGTH_OPTIONS[0]);
  const [selectedTassels, setSelectedTassels] = useState(TASSELS_OPTIONS[0]);
  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [referenceImg, setReferenceImg] = useState<string | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [successWaUrl, setSuccessWaUrl] = useState<string | null>(null);
  const [copiedOrderText, setCopiedOrderText] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category_id === product.category_id || p.fabric_type === product.fabric_type))
    .slice(0, 3);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReferenceImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this handmade dupatta by Sania: ${product.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Main WhatsApp Order Flow
  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();

    setIsOrdering(true);
    const finalColor = customColorText.trim() ? `${selectedColor} (${customColorText.trim()})` : selectedColor;
    const clientName = customerName.trim() || 'Client (Web Visitor)';
    const clientContact = customerContact.trim() || 'Via WhatsApp Chat';

    // 1. Generate pre-filled WhatsApp link
    const waUrl = generateProductOrderWhatsAppUrl(
      product,
      {
        colorChoice: finalColor,
        fabricChoice: product.fabric_type,
        sizeChoice: selectedLength,
        tasselsChoice: selectedTassels,
        specialNotes: notes.trim(),
        customerName: customerName.trim() || undefined,
        referenceImageUploaded: Boolean(referenceImg),
        referenceImageUrl: referenceImg || undefined,
      },
      siteContent.whatsapp_number
    );

    setSuccessWaUrl(waUrl);

    // 2. Confetti effect
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#25D366', '#BE185D', '#D4AF37', '#FFF0F3'],
      });
    } catch {}

    // 3. Open WhatsApp synchronously in user gesture
    openWhatsApp(waUrl);

    // 4. Log order inquiry asynchronously in background without blocking WhatsApp
    logCustomizationRequest({
      product_id: product.id,
      product_name: product.name,
      customer_name: clientName,
      customer_contact: clientContact,
      color_choice: finalColor,
      fabric_choice: product.fabric_type,
      size_choice: selectedLength,
      tassels_option: selectedTassels,
      notes: notes.trim(),
      reference_image_url: referenceImg || undefined,
      estimated_price: product.price,
      status: 'new',
      whatsapp_sent: true,
    }).catch((err) => {
      console.warn('Logging order notice:', err);
    }).finally(() => {
      setIsOrdering(false);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#831843] hover:text-[#BE185D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs text-[#7A5A62] hover:text-[#831843] transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Main Product Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        
        {/* Left Column: Image Gallery with Zoom/Thumbnail Previews */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Large Image Display */}
          <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-[#FFF8F9] border border-[#FCE7EB] shadow-md group">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              {product.is_customizable && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xs text-[#831843] text-xs font-bold uppercase tracking-wider shadow-sm border border-[#F3C5D4]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Customizable</span>
                </span>
              )}
              {product.occasion && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#831843] text-white text-[11px] font-semibold">
                  {product.occasion}
                </span>
              )}
            </div>

            {/* Wishlist Heart on Large Image */}
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                isWishlisted
                  ? 'bg-[#BE185D] text-white shadow-md scale-110'
                  : 'bg-white/80 text-[#831843] hover:bg-white hover:text-[#BE185D] shadow-xs'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Zoom hint */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-xs text-white text-[11px] py-1.5 px-3 rounded-xl text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Hand-painted by Sania • 100% Artisanal Quality
            </div>
          </div>

          {/* Thumbnail Gallery Row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                    idx === activeImageIndex
                      ? 'border-[#BE185D] shadow-md scale-105'
                      : 'border-[#FCE7EB] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Artisanal Guarantee Cards */}
          <div className="grid grid-cols-3 gap-3 pt-4 text-center">
            <div className="bg-[#FFF8F9] p-3 rounded-2xl border border-[#FCE7EB] space-y-1">
              <Palette className="w-5 h-5 text-[#BE185D] mx-auto" />
              <div className="text-[11px] font-bold text-[#831843]">Hand-Painted</div>
              <div className="text-[10px] text-[#7A5A62]">Permanent Dyes</div>
            </div>
            <div className="bg-[#FFF8F9] p-3 rounded-2xl border border-[#FCE7EB] space-y-1">
              <Scissors className="w-5 h-5 text-[#BE185D] mx-auto" />
              <div className="text-[11px] font-bold text-[#831843]">Custom Fitted</div>
              <div className="text-[10px] text-[#7A5A62]">To Your Outfit</div>
            </div>
            <div className="bg-[#FFF8F9] p-3 rounded-2xl border border-[#FCE7EB] space-y-1">
              <Truck className="w-5 h-5 text-[#BE185D] mx-auto" />
              <div className="text-[11px] font-bold text-[#831843]">Express Delivery</div>
              <div className="text-[10px] text-[#7A5A62]">Worldwide Shipping</div>
            </div>
          </div>

        </div>

        {/* Right Column: Details, Specifications, & Direct WhatsApp Custom Order Form */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Title & Price Header */}
          <div className="space-y-2 border-b border-[#FCE7EB] pb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#9D174D] uppercase tracking-wider">
              <span>{product.fabric_type}</span>
              <span>•</span>
              <span>{product.work_type}</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#3D2C2E]">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-[#7A5A62] font-medium">5.0 (Boutique Artisan Masterpiece)</span>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 pt-3">
              <span className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#831843]">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.original_price && (
                <span className="text-sm text-[#9D7983] line-through">
                  Rs. {product.original_price.toLocaleString()}
                </span>
              )}
              <span className="text-xs bg-[#FFF0F3] text-[#BE185D] px-2.5 py-1 rounded-full font-bold border border-[#F3C5D4]">
                Made-to-Order Handcrafted
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-serif-luxury text-lg font-bold text-[#3D2C2E]">
              Artisanal Story & Details
            </h3>
            <p className="text-xs sm:text-sm text-[#5C3A42] leading-relaxed">
              {product.full_description || product.description}
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 gap-3 bg-[#FFF8F9] p-4 rounded-2xl border border-[#FCE7EB] text-xs">
            <div>
              <span className="text-[#9D7983] font-medium">Fabric Base:</span>
              <p className="font-semibold text-[#3D2C2E] mt-0.5">{product.fabric_type}</p>
            </div>
            <div>
              <span className="text-[#9D7983] font-medium">Embellishment:</span>
              <p className="font-semibold text-[#3D2C2E] mt-0.5">{product.work_type}</p>
            </div>
            <div>
              <span className="text-[#9D7983] font-medium">Length / Cut:</span>
              <p className="font-semibold text-[#3D2C2E] mt-0.5">{product.dimensions || '2.5 Meters (Standard)'}</p>
            </div>
            <div>
              <span className="text-[#9D7983] font-medium">Care Instructions:</span>
              <p className="font-semibold text-[#3D2C2E] mt-0.5">{product.care_instructions || 'Dry clean only'}</p>
            </div>
          </div>

          {/* DIRECT WHATSAPP ORDER & CUSTOMIZATION FORM */}
          <form onSubmit={handleWhatsAppOrder} className="bg-white rounded-3xl p-6 border-2 border-[#F3C5D4] shadow-md space-y-5">
            
            <div className="flex items-center justify-between border-b border-[#FCE7EB] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#BE185D]" />
                <h3 className="font-serif-luxury text-lg font-bold text-[#831843]">
                  Customize & Order on WhatsApp
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onOpenCustomize(product)}
                className="text-[11px] text-[#BE185D] hover:text-[#831843] font-bold flex items-center gap-1 bg-[#FFF0F3] hover:bg-[#FCE7EB] px-2.5 py-1 rounded-full border border-[#F3C5D4] transition-colors cursor-pointer"
                title="Open Advanced Customizer"
              >
                <Sliders className="w-3.5 h-3.5 text-[#BE185D]" />
                <span>Customizer Studio</span>
              </button>
            </div>

            {/* 1. Color Palette Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#831843] flex items-center justify-between">
                <span>1. Color Choice</span>
                <span className="text-[11px] font-normal text-[#9D174D]">{selectedColor}</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {product.available_colors.map((color) => {
                  const isSel = selectedColor === color;
                  return (
                    <button
                      type="button"
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isSel
                          ? 'border-[#BE185D] bg-[#FFF0F3] text-[#831843] font-bold shadow-xs'
                          : 'border-[#FCE7EB] hover:bg-[#FFF8F9] text-[#5C3A42]'
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                placeholder="Or specify custom color match (e.g. pastel mint, rose peach)..."
                value={customColorText}
                onChange={(e) => setCustomColorText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#FCE7EB] text-xs focus:border-[#BE185D] focus:outline-hidden"
              />
            </div>

            {/* 2. Length & Tassels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#831843] mb-1">
                  2. Length / Cut
                </label>
                <select
                  value={selectedLength}
                  onChange={(e) => setSelectedLength(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] focus:outline-hidden"
                >
                  {LENGTH_OPTIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#831843] mb-1">
                  3. Border Tassels
                </label>
                <select
                  value={selectedTassels}
                  onChange={(e) => setSelectedTassels(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] focus:outline-hidden"
                >
                  {TASSELS_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Reference Image Upload */}
            <div className="bg-[#FFF8F9] p-3.5 rounded-2xl border border-[#FCE7EB]">
              <ImageUploader
                label="4. Dress / Swatch Reference (Optional)"
                description="Upload your outfit photo so Sania can match the tones"
                value={referenceImg || ''}
                onChange={(url) => setReferenceImg(url as string)}
                uploadImage={(imageDataUrl) => uploadSiteImage(imageDataUrl, 'references')}
              />
            </div>

            {/* 4. Special Instructions */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#831843] mb-1">
                5. Special Instructions / Names / Urdu Calligraphy
              </label>
              <input
                type="text"
                placeholder="e.g. Add Urdu calligraphy 'Qubool Hai' or bride & groom names..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#FCE7EB] text-xs focus:border-[#BE185D] focus:outline-hidden"
              />
            </div>

            {/* 5. Customer Name & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#FCE7EB]">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#FCE7EB] text-xs focus:outline-hidden"
              />
              <input
                type="tel"
                placeholder="Your WhatsApp Number (Optional)"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#FCE7EB] text-xs focus:outline-hidden"
              />
            </div>

            {/* Success WhatsApp Order Banner */}
            {successWaUrl && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-sm space-y-2.5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
                    <Check className="w-4 h-4 text-emerald-600 bg-emerald-200 rounded-full p-0.5" />
                    <span>Order Details Prepared for WhatsApp!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSuccessWaUrl(null)}
                    className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  If WhatsApp did not launch in a new tab, tap below to open your chat directly with Sania:
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openWhatsApp(successWaUrl)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-md hover:bg-[#1ebd5b] transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Open WhatsApp Chat Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const urlObj = new URL(successWaUrl);
                        const text = urlObj.searchParams.get('text') || '';
                        navigator.clipboard.writeText(text);
                        setCopiedOrderText(true);
                        setTimeout(() => setCopiedOrderText(false), 3000);
                      } catch {}
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100/50 transition-colors cursor-pointer"
                  >
                    {copiedOrderText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5" />}
                    <span>{copiedOrderText ? 'Copied!' : 'Copy Order Text'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* THE ONLY CHECKOUT BUTTON: ORDER VIA WHATSAPP */}
            <div className="pt-2">
              <button
                id="product-detail-add-to-cart-btn"
                type="button"
                onClick={() => onAddToCart(product)}
                className="w-full mb-3 py-3.5 px-6 rounded-2xl bg-[#831843] text-white font-bold text-sm shadow-md hover:bg-[#BE185D] hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                id="product-detail-whatsapp-buy-btn"
                type="submit"
                disabled={isOrdering}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] via-[#20BA5A] to-[#128C7E] text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
              >
                <MessageCircle className="w-6 h-6 fill-current shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-bold leading-tight">Order via WhatsApp Now</div>
                  <div className="text-[11px] text-white/90 font-normal">
                    Pre-fills details & connects directly with Sania (+92 371 6747099)
                  </div>
                </div>
              </button>

              <div className="mt-2.5 text-center text-[11px] text-[#7A5A62] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                <span>No online payment needed now • Payment & details confirmed on WhatsApp</span>
              </div>
            </div>

          </form>

        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#FCE7EB] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#3D2C2E]">
              You May Also Love
            </h2>
            <button
              onClick={onBack}
              className="text-xs font-semibold text-[#BE185D] hover:underline"
            >
              View All Collection
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
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
        </div>
      )}

    </div>
  );
};
