import React from 'react';
import { PageView, SiteContent } from '../types';
import { Sparkles, MessageCircle, Mail, MapPin, Heart, ShieldCheck, Instagram } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  siteContent: SiteContent;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, siteContent }) => {
  return (
    <footer className="bg-[#2A171D] text-[#FFF0F3] pt-16 pb-12 border-t border-[#831843]/30 relative overflow-hidden">
      {/* Decorative subtle background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#BE185D]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="cursor-pointer" onClick={() => onNavigate('home')}>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#FDE047] tracking-tight">
                Brush <span className="text-white font-normal italic font-serif">&</span> Fabric
              </h3>
              <p className="text-xs uppercase tracking-[0.25em] text-[#F3C5D4] font-sans-clean mt-0.5">
                by Sania • Artisanal Studio
              </p>
            </div>
            <p className="text-sm text-[#F3C5D4]/80 leading-relaxed font-sans-clean">
              Bespoke hand-painted and hand-embroidered luxury dupattas. Every drape is custom handcrafted to perfection with love, patience, and high-grade artisanal dyes.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                id="footer-instagram-link"
                href={siteContent.instagram_url || 'https://www.instagram.com/brushandfabricby_sania?igsi=MTI5OTdjaTAyNWh3Yg=='}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#831843]/60 hover:bg-[#E1306C] border border-[#F3C5D4]/20 flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-sm"
                title="Follow on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

              {/* TikTok */}
              <a
                id="footer-tiktok-link"
                href={siteContent.tiktok_url || 'https://www.tiktok.com/@brushandfabricby_sania?_r=1&_t=ZS-99OZxHoWsfF'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#831843]/60 hover:bg-[#000000] border border-[#F3C5D4]/20 flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-sm"
                title="Follow on TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.29c.02 1.95-.57 3.96-1.8 5.48-1.46 1.83-3.79 2.87-6.15 2.72-2.84-.13-5.38-2.03-6.19-4.75-.98-3.13.68-6.66 3.75-7.85 1.09-.43 2.29-.53 3.44-.34v4.06c-.66-.2-1.4-.23-2.04-.03-.98.27-1.74 1.1-1.88 2.09-.23 1.34.61 2.67 1.93 2.98 1.15.28 2.45-.16 3.03-1.2.3-.52.41-1.12.4-1.72V.02h-2.52z"/>
                </svg>
              </a>

              {/* WhatsApp direct */}
              <a
                id="footer-whatsapp-link"
                href={`https://wa.me/${siteContent.whatsapp_number || '923716747099'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#831843]/60 hover:bg-[#25D366] border border-[#F3C5D4]/20 flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-sm"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-lg font-semibold text-[#FDE047] tracking-wide border-b border-[#831843]/40 pb-2">
              Collections & Studio
            </h4>
            <ul className="space-y-2 text-sm text-[#F3C5D4]/80">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Shop All Dupattas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('customization')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Bespoke Custom Orders</span>
                  <span className="text-[10px] bg-[#BE185D] text-white px-1.5 py-0.2 rounded-full font-bold">Popular</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-white transition-colors">
                  Lookbook & Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Meet Sania (About Us)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Craft Promise */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-lg font-semibold text-[#FDE047] tracking-wide border-b border-[#831843]/40 pb-2">
              Our Artisanal Promise
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F3C5D4]/80">
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>No Mass Production:</strong> Every piece is hand-painted and stitched individually.</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Pure Fabrics:</strong> Handloom organza, pure crinkle chiffon, raw silk, and lawn.</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong>Color Matching:</strong> Send your dress picture and we mix matching dyes.</span>
              </li>
            </ul>
          </div>

          {/* Column 4: WhatsApp Ordering & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-lg font-semibold text-[#FDE047] tracking-wide border-b border-[#831843]/40 pb-2">
              WhatsApp Order Desk
            </h4>
            <p className="text-xs text-[#F3C5D4]/80">
              All orders & customizations are confirmed directly on WhatsApp with Sania.
            </p>
            <div className="space-y-2 text-sm text-[#F3C5D4]">
              <a
                href={`https://wa.me/${siteContent.whatsapp_number || '923716747099'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#831843]/50 hover:bg-[#831843] border border-[#F3C5D4]/20 text-[#FFF0F3] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span className="font-mono text-xs font-semibold">{siteContent.display_whatsapp || '+92 371 6747099'}</span>
              </a>

              <a
                href={`mailto:${siteContent.email || 'brushnfabric@gmail.com'}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#831843]/50 hover:bg-[#831843] border border-[#F3C5D4]/20 text-[#FFF0F3] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#FDE047]" />
                <span className="text-xs">{siteContent.email || 'brushnfabric@gmail.com'}</span>
              </a>

              <div className="flex items-center gap-2 text-xs text-[#F3C5D4]/70 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{siteContent.studio_location || 'Lahore, Pakistan • Worldwide Delivery'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-[#831843]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F3C5D4]/60 gap-4">
          <p>© {new Date().getFullYear()} Brush n Fabric by Sania. All rights reserved. Handcrafted in Pakistan.</p>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-[#BE185D] fill-current" /> for handmade dupattas
            </span>
            <span className="text-[#831843]">|</span>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-[#FDE047] transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
