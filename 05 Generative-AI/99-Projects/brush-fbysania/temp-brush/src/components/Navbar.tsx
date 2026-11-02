import React, { useState } from 'react';
import { PageView, SiteContent } from '../types';
import { Sparkles, Heart, Search, Menu, X, MessageCircle, Instagram, Sliders, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView, productId?: string) => void;
  siteContent: SiteContent;
  wishlistCount: number;
  onOpenWishlist: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenBespokeModal?: () => void;
  onOpenBespoke?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  siteContent,
  wishlistCount,
  onOpenWishlist,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenBespokeModal,
  onOpenBespoke,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTriggerCustomOrder = () => {
    if (typeof onOpenBespokeModal === 'function') {
      onOpenBespokeModal();
    } else if (typeof onOpenBespoke === 'function') {
      onOpenBespoke();
    } else {
      onNavigate('customization');
    }
  };

  const navItems: { label: string; page: PageView; icon?: React.ReactNode }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop Dupattas', page: 'shop' },
    { label: 'Bespoke Custom', page: 'customization' },
    { label: 'Lookbook Gallery', page: 'gallery' },
    { label: 'About Sania', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-[#9D174D] via-[#BE185D] to-[#9D174D] text-[#FFF0F3] text-xs sm:text-sm py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-[#FDE047] animate-pulse" />
        <span className="truncate">{siteContent.announcement_text || '✨ Handmade with Love by Sania • Worldwide Shipping • Custom Orders Open'}</span>
        <Sparkles className="w-3.5 h-3.5 text-[#FDE047] animate-pulse hidden sm:inline" />
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-[#FFF8F9]/90 backdrop-blur-md border-b border-[#FCE7EB] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#831843] hover:bg-[#FCE7EB] transition-colors focus:outline-hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo & Tagline */}
            <div 
              className="flex flex-col cursor-pointer text-center lg:text-left select-none group"
              onClick={() => onNavigate('home')}
            >
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-[#831843] group-hover:text-[#BE185D] transition-colors">
                  Brush <span className="text-[#D4AF37] font-normal italic font-serif">&</span> Fabric
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#9D174D]/80 font-medium font-sans-clean -mt-1">
                by Sania • Artisanal Studio
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    id={`nav-link-${item.page}`}
                    onClick={() => onNavigate(item.page)}
                    className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#FCE7EB] text-[#831843] font-semibold shadow-xs'
                        : 'text-[#5C3A42] hover:text-[#9D174D] hover:bg-[#FFF0F3]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search trigger */}
              <button
                id="header-search-btn"
                onClick={onOpenSearch}
                className="p-2.5 rounded-full text-[#831843] hover:bg-[#FCE7EB] transition-all hover:scale-105 active:scale-95"
                title="Search Dupattas"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist button */}
              <button
                id="header-wishlist-btn"
                onClick={onOpenWishlist}
                className="relative p-2.5 rounded-full text-[#831843] hover:bg-[#FCE7EB] transition-all hover:scale-105 active:scale-95"
                title="View Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#BE185D] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                id="header-cart-btn"
                onClick={onOpenCart}
                className="relative p-2.5 rounded-full text-[#831843] hover:bg-[#FCE7EB] transition-all hover:scale-105 active:scale-95"
                title="View cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#BE185D] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Custom Order CTA button */}
              <button
                id="header-custom-order-btn"
                onClick={handleTriggerCustomOrder}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#BE185D] to-[#9D174D] text-white text-xs font-semibold tracking-wide uppercase shadow-sm hover:shadow-md hover:from-[#9D174D] hover:to-[#831843] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-[#FDE047]" />
                <span>Custom Order</span>
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#FCE7EB] bg-[#FFF8F9] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-4 duration-200">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between transition-colors ${
                  currentPage === item.page
                    ? 'bg-[#FCE7EB] text-[#831843] font-bold'
                    : 'text-[#5C3A42] hover:bg-[#FFF0F3]'
                }`}
              >
                <span>{item.label}</span>
                {currentPage === item.page && <span className="w-2 h-2 rounded-full bg-[#BE185D]"></span>}
              </button>
            ))}

            <div className="pt-3 border-t border-[#FCE7EB] flex flex-col gap-2">
              <button
                id="mobile-custom-order-btn"
                onClick={() => {
                  handleTriggerCustomOrder();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#BE185D] to-[#9D174D] text-white font-semibold text-sm shadow-md cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-[#FDE047]" />
                <span>Request Custom Dupatta</span>
              </button>

              <a
                href={`https://wa.me/${siteContent.whatsapp_number || '923716747099'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp ({siteContent.display_whatsapp || '+92 371 6747099'})</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
