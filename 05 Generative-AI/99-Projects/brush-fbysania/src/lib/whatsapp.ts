import { Product, CustomizationRequest } from '../types';

export function formatWhatsAppPhone(phone: string): string {
  // strip spaces, +, dashes
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    return '92' + clean.slice(1);
  }
  return clean || '923716747099';
}

export function generateProductOrderWhatsAppUrl(
  product: Product,
  customDetails?: {
    colorChoice?: string;
    fabricChoice?: string;
    sizeChoice?: string;
    tasselsChoice?: string;
    specialNotes?: string;
    customerName?: string;
    referenceImageUploaded?: boolean;
    referenceImageUrl?: string;
  },
  customPhoneNumber?: string
): string {
  const phone = formatWhatsAppPhone(customPhoneNumber || '923716747099');

  let text = `🌸 *NEW DUPATTA ORDER INQUIRY*\n`;
  text += `*Brand:* Brush n Fabric by Sania\n`;
  text += `──────────────────\n`;
  text += `🛍️ *Product:* ${product.name}\n`;
  text += `💰 *Base Price:* Rs. ${product.price.toLocaleString()}\n`;
  text += `🧵 *Fabric Type:* ${customDetails?.fabricChoice || product.fabric_type}\n`;
  text += `🎨 *Chosen Color/Palette:* ${customDetails?.colorChoice || product.available_colors[0] || 'Original Design'}\n`;
  text += `📐 *Dimensions / Length:* ${customDetails?.sizeChoice || product.dimensions || '2.5 Meters (Standard)'}\n`;
  
  if (customDetails?.tasselsChoice) {
    text += `✨ *Edging/Tassels:* ${customDetails.tasselsChoice}\n`;
  }
  
  if (customDetails?.customerName) {
    text += `👤 *Customer Name:* ${customDetails.customerName}\n`;
  }
  
  if (customDetails?.specialNotes) {
    text += `📝 *Special Instructions/Customization:* "${customDetails.specialNotes}"\n`;
  }
  
  if (customDetails?.referenceImageUrl) {
    if (customDetails.referenceImageUrl.startsWith('http://') || customDetails.referenceImageUrl.startsWith('https://')) {
      text += `📸 *Outfit / Swatch Photo Link:* ${customDetails.referenceImageUrl}\n`;
    } else {
      text += `📸 *Outfit / Swatch Photo:* ✅ Attached with order (sharing photo in chat for color matching)\n`;
    }
  } else if (customDetails?.referenceImageUploaded) {
    text += `📸 *Outfit / Swatch Photo:* ✅ Attached with order (sharing photo in chat for color matching)\n`;
  }
  
  text += `──────────────────\n`;
  text += `Salam Sania! I would love to place an order for this handmade piece. Please confirm availability, crafting timeline, and payment details. Thank you! 💕`;

  const encoded = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function generateBespokeRequestWhatsAppUrl(
  req: Partial<CustomizationRequest>,
  customPhoneNumber?: string
): string {
  const phone = formatWhatsAppPhone(customPhoneNumber || '923716747099');

  let text = `✨ *BESPOKE CUSTOM DUPATTA REQUEST*\n`;
  text += `*Brand:* Brush n Fabric by Sania\n`;
  text += `──────────────────\n`;
  if (req.customer_name) text += `👤 *Client Name:* ${req.customer_name}\n`;
  if (req.customer_contact) text += `📞 *Contact/WhatsApp:* ${req.customer_contact}\n`;
  text += `🧵 *Desired Fabric:* ${req.fabric_choice || 'Pure Organza'}\n`;
  text += `🎨 *Color Scheme / Theme:* ${req.color_choice || 'Custom Color Match'}\n`;
  text += `📐 *Length/Cut:* ${req.size_choice || 'Standard 2.5m'}\n`;
  if (req.tassels_option) text += `✨ *Borders & Tassels:* ${req.tassels_option}\n`;
  if (req.estimated_price) text += `💵 *Estimated Budget:* Rs. ${req.estimated_price.toLocaleString()}\n`;
  if (req.notes) text += `📝 *Design Vision / Details:* "${req.notes}"\n`;

  // Outfit / Swatch Reference
  if (req.reference_image_url) {
    if (req.reference_image_url.startsWith('http://') || req.reference_image_url.startsWith('https://')) {
      text += `📸 *Outfit / Swatch Photo Link:* ${req.reference_image_url}\n`;
    } else {
      text += `📸 *Outfit / Swatch Photo:* ✅ Attached with custom order (sharing photo in chat for exact dye matching)\n`;
    }
  }

  text += `──────────────────\n`;
  text += `Salam Sania! I am looking for a customized, one-of-a-kind handmade dupatta. I'd love to discuss my outfit match and finalize the order with you! 🌸`;

  const encoded = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function generateGeneralInquiryWhatsAppUrl(
  message?: string,
  customPhoneNumber?: string
): string {
  const phone = formatWhatsAppPhone(customPhoneNumber || '923716747099');
  const text = message || `Salam Sania! 🌸 I am browsing "Brush n Fabric by Sania" and have an inquiry regarding your custom hand-painted and embroidered dupattas.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Universally and reliably opens a WhatsApp URL across mobile, desktop, and iframes.
 * Avoids popup blocker issues by using a dynamic anchor click with fallbacks.
 */
export function openWhatsApp(url: string): boolean {
  if (!url) return false;
  
  // 1. Try standard window.open first (most compatible with popup policies in direct user gestures)
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win && !win.closed) {
      try {
        win.focus?.();
      } catch {}
      return true;
    }
  } catch (err) {
    console.warn('Direct window.open notice:', err);
  }

  // 2. Try anchor click (fallback for certain popup-blocker configurations)
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
      } catch {}
    }, 300);
    return true;
  } catch (err) {
    console.warn('Anchor click notice:', err);
  }

  // 3. In case window.open was blocked and user is in a top-level tab
  try {
    if (window.top === window) {
      window.location.href = url;
      return true;
    }
  } catch {}

  return false;
}
