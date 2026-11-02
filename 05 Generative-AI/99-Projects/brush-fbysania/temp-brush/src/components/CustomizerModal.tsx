import React, { useState } from 'react';
import { Product, CustomizationRequest } from '../types';
import { ImageUploader } from './ImageUploader';
import { X, Sparkles, MessageCircle, Upload, Check, Palette, Sliders, ShieldCheck, Heart, FileText, ExternalLink } from 'lucide-react';
import { generateProductOrderWhatsAppUrl, generateBespokeRequestWhatsAppUrl, openWhatsApp } from '../lib/whatsapp';
import { logCustomizationRequest, uploadSiteImage } from '../lib/supabase';
import confetti from 'canvas-confetti';

interface CustomizerModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
}

const POPULAR_COLORS = [
  { name: 'Gulabi Blush Pink', hex: '#F8C8DC' },
  { name: 'Royal Magenta Rose', hex: '#BE185D' },
  { name: 'Crimson Bridal Red', hex: '#991B1B' },
  { name: 'Ivory Pearl White', hex: '#FFFFF0' },
  { name: 'Champagne Beige Gold', hex: '#E6D7B9' },
  { name: 'Pistachio Sage Green', hex: '#C1D7AE' },
  { name: 'Lilac Lavender', hex: '#D8B4E2' },
  { name: 'Sky Mist Pastel', hex: '#BAE6FD' },
  { name: 'Butter Gold Yellow', hex: '#FDE047' },
  { name: 'Midnight Navy', hex: '#1E293B' },
];

const FABRIC_OPTIONS = [
  'Pure Korean Organza (Crisp & Sheer)',
  '100% Pure Crinkle Chiffon (Flowy & Soft)',
  'Pure 80gm Raw Silk (Structured & Regal)',
  'Handloom Chanderi Silk Blend (Subtle Sheen)',
  'Bridal Soft Micro-Net (Feather Light)',
  'Superfine Cotton Lawn (Breathable Daily)',
];

const SIZE_OPTIONS = [
  'Standard 2.5 Meters (Classic Dupatta)',
  '2.75 Meters (Grand Bridal Drape & Veil)',
  '3.0 Meters (Opulent Royal Shawl Cut)',
  'Custom Length (Specify in notes)',
];

const TASSELS_OPTIONS = [
  'Four-Sided Traditional Golden Kiran Lace',
  'Artisanal Pearl & Crystal Hanging Drops',
  'Handmade Matching Silk Thread Tassels',
  'Delicate Scalloped Embroidered Border',
  'Minimalist Clean Folded Hem',
];

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  product,
  isOpen,
  onClose,
  whatsappNumber,
}) => {
  const [selectedColor, setSelectedColor] = useState(
    product?.available_colors?.[0] || 'Gulabi Blush Pink'
  );
  const [customColorText, setCustomColorText] = useState('');
  const [selectedFabric, setSelectedFabric] = useState(
    product?.fabric_type || FABRIC_OPTIONS[0]
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.dimensions || SIZE_OPTIONS[0]
  );
  const [selectedTassels, setSelectedTassels] = useState(TASSELS_OPTIONS[0]);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [referenceImg, setReferenceImg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedWaUrl, setSubmittedWaUrl] = useState<string | null>(null);
  const [copiedOrderText, setCopiedOrderText] = useState(false);

  if (!isOpen) return null;

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

  const calculateEstimatedPrice = (): number => {
    let base = product ? product.price : 6500;
    if (selectedFabric.includes('Raw Silk')) base += 2500;
    if (selectedSize.includes('2.75 Meters')) base += 1200;
    if (selectedSize.includes('3.0 Meters')) base += 2000;
    if (selectedTassels.includes('Pearl & Crystal')) base += 1000;
    return base;
  };

  const estimatedPrice = calculateEstimatedPrice();

  const handleSubmitAndOpenWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    const finalColor = customColorText.trim() ? `${selectedColor} (${customColorText.trim()})` : selectedColor;
    const clientName = customerName.trim() || 'Client (Custom Order)';
    const clientContact = customerContact.trim() || 'Direct WhatsApp';

    // 1. Generate WhatsApp Link
    let waUrl = '';
    if (product) {
      waUrl = generateProductOrderWhatsAppUrl(
        product,
        {
          colorChoice: finalColor,
          fabricChoice: selectedFabric,
          sizeChoice: selectedSize,
          tasselsChoice: selectedTassels,
          specialNotes: notes.trim(),
          customerName: customerName.trim() || undefined,
          referenceImageUploaded: Boolean(referenceImg),
          referenceImageUrl: referenceImg || undefined,
        },
        whatsappNumber
      );
    } else {
      waUrl = generateBespokeRequestWhatsAppUrl(
        {
          customer_name: clientName,
          customer_contact: clientContact,
          fabric_choice: selectedFabric,
          color_choice: finalColor,
          size_choice: selectedSize,
          tassels_option: selectedTassels,
          estimated_price: estimatedPrice,
          notes: notes.trim(),
          reference_image_url: referenceImg || undefined,
        },
        whatsappNumber
      );
    }

    setSubmittedWaUrl(waUrl);

    // 2. Confetti celebration
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#BE185D', '#D4AF37', '#FCE7EB', '#25D366'],
      });
    } catch {}

    // 3. Immediately open WhatsApp synchronously within the user gesture
    openWhatsApp(waUrl);

    // 4. Log request to database asynchronously in background without blocking
    logCustomizationRequest({
      product_id: product ? product.id : null,
      product_name: product ? product.name : 'Bespoke Custom Atelier Request',
      customer_name: clientName,
      customer_contact: clientContact,
      customer_email: customerEmail.trim() || undefined,
      color_choice: finalColor,
      fabric_choice: selectedFabric,
      size_choice: selectedSize,
      tassels_option: selectedTassels,
      notes: notes.trim(),
      reference_image_url: referenceImg || undefined,
      estimated_price: estimatedPrice,
      status: 'new',
      whatsapp_sent: true,
    }).catch((err) => {
      console.warn('Logging customization notice:', err);
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#F3C5D4] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#831843] via-[#BE185D] to-[#9D174D] text-white p-6 sm:p-8 relative">
          <button
            id="close-customizer-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[#FDE047] text-xs font-bold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Sania's Bespoke Atelier</span>
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold">
            {product ? `Customize "${product.name}"` : 'Create Your Bespoke Custom Dupatta'}
          </h2>
          <p className="text-xs sm:text-sm text-[#FFF0F3]/90 mt-1 font-sans-clean">
            Tailor the color palette, base silk/organza, borders, and dimensions. Finalize directly with Sania on WhatsApp.
          </p>
        </div>

        {/* Customization Form */}
        <form onSubmit={handleSubmitAndOpenWhatsApp} className="p-6 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto bg-[#FFF8F9]/40">
          
          {/* Step 1: Color Palette */}
          <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#FCE7EB] shadow-2xs">
            <label className="block text-sm font-bold text-[#831843] font-serif-luxury flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#BE185D]" />
                1. Select Base Color / Palette
              </span>
              <span className="text-xs font-normal text-[#9D174D]">{selectedColor}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {POPULAR_COLORS.map((c) => {
                const isSelected = selectedColor === c.name;
                return (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left border text-xs transition-all ${
                      isSelected
                        ? 'border-[#BE185D] bg-[#FFF0F3] shadow-xs font-semibold'
                        : 'border-[#FCE7EB] hover:bg-[#FFF8F9] text-[#5C3A42]'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="truncate">{c.name.split(' ')[0]}</span>
                    {isSelected && <Check className="w-3 h-3 text-[#BE185D] ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Shade input */}
            <div className="pt-2">
              <input
                type="text"
                placeholder="Or specify custom color match (e.g., 'Match my pastel mint lehenga' or Pantone shade)..."
                value={customColorText}
                onChange={(e) => setCustomColorText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7EB] text-xs focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] bg-white text-[#3D2C2E]"
              />
            </div>
          </div>

          {/* Step 2: Fabric & Length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Fabric Selection */}
            <div className="bg-white p-5 rounded-2xl border border-[#FCE7EB] shadow-2xs space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#831843]">
                2. Base Fabric Type
              </label>
              <select
                value={selectedFabric}
                onChange={(e) => setSelectedFabric(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] focus:border-[#BE185D] focus:outline-hidden"
              >
                {FABRIC_OPTIONS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Length / Dimensions */}
            <div className="bg-white p-5 rounded-2xl border border-[#FCE7EB] shadow-2xs space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#831843]">
                3. Length & Cut
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] focus:border-[#BE185D] focus:outline-hidden"
              >
                {SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Step 3: Tassels / Edging & Reference Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Edging & Tassels */}
            <div className="bg-white p-5 rounded-2xl border border-[#FCE7EB] shadow-2xs space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#831843]">
                4. Border / Tassels Embellishment
              </label>
              <select
                value={selectedTassels}
                onChange={(e) => setSelectedTassels(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] focus:border-[#BE185D] focus:outline-hidden"
              >
                {TASSELS_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Reference Image Upload */}
            <div className="bg-white p-5 rounded-2xl border border-[#FCE7EB] shadow-2xs space-y-2">
              <ImageUploader
                label="5. Reference Outfit / Swatch (Optional)"
                description="Upload your lehenga or fabric swatch"
                value={referenceImg || ''}
                onChange={(url) => setReferenceImg(url as string)}
                uploadImage={(imageDataUrl) => uploadSiteImage(imageDataUrl, 'references')}
              />
            </div>

          </div>

          {/* Step 4: Special Instructions & Calligraphy */}
          <div className="bg-white p-5 rounded-2xl border border-[#FCE7EB] shadow-2xs space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#831843]">
              6. Special Customization Notes / Urdu Calligraphy / Date
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Write 'Qubool Hai' and names 'Ayesha & Bilal' in gold calligraphy on the corner pallu, or match the exact floral embroidery of my sleeve..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] focus:outline-hidden"
            />
          </div>

          {/* Step 5: Customer Details for WhatsApp Order Confirmation */}
          <div className="bg-white p-5 rounded-2xl border border-[#FCE7EB] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#831843]">
                7. Your Contact Details (Optional)
              </label>
              <span className="text-[11px] text-[#7A5A62]">Connects directly to Sania's WhatsApp</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Your Full Name (e.g. Ayesha Khan)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] focus:border-[#BE185D] focus:outline-hidden"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="WhatsApp / Phone Number (Optional)"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#FCE7EB] text-xs bg-white text-[#3D2C2E] focus:border-[#BE185D] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Success / WhatsApp Ready Banner */}
          {submittedWaUrl && (
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-sm space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Check className="w-5 h-5 text-emerald-600 bg-emerald-200 rounded-full p-0.5" />
                  <span>Custom Order Prepared for WhatsApp!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittedWaUrl(null)}
                  className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-emerald-900 leading-relaxed">
                If WhatsApp did not launch automatically in a new tab, tap below to open the chat directly with Sania:
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => openWhatsApp(submittedWaUrl)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-md hover:bg-[#1ebd5b] transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Open WhatsApp Chat Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      const urlObj = new URL(submittedWaUrl);
                      const text = urlObj.searchParams.get('text') || '';
                      navigator.clipboard.writeText(text);
                      setCopiedOrderText(true);
                      setTimeout(() => setCopiedOrderText(false), 3000);
                    } catch {}
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100/50 transition-colors cursor-pointer"
                >
                  {copiedOrderText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5" />}
                  <span>{copiedOrderText ? 'Copied!' : 'Copy Order Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2.5 rounded-full bg-white border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span>Done & Close</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Price Summary & WhatsApp Submit */}
          <div className="bg-gradient-to-r from-[#FFF0F3] to-[#FCE7EB] p-5 rounded-2xl border border-[#F3C5D4] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[11px] text-[#9D174D] uppercase font-bold tracking-wider">
                Estimated Handcrafted Price
              </div>
              <div className="font-serif-luxury text-2xl font-bold text-[#831843]">
                Rs. {estimatedPrice.toLocaleString()}
              </div>
              <p className="text-[10px] text-[#7A5A62]">
                *Exact quote & delivery timeline confirmed on WhatsApp with Sania
              </p>
            </div>

            <button
              id="submit-whatsapp-custom-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#25D366] via-[#20BA5A] to-[#128C7E] text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{isSubmitting ? 'Preparing Chat...' : 'Confirm & Open WhatsApp Chat'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
