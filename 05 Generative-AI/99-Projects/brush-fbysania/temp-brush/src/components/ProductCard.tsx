import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { Heart, MessageCircle, Sliders, Sparkles, Eye, Check, ShoppingBag } from 'lucide-react';
import { generateProductOrderWhatsAppUrl, openWhatsApp } from '../lib/whatsapp';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenCustomize: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  whatsappNumber?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onOpenCustomize,
  onAddToCart,
  whatsappNumber,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation limits (-8 to +8 deg for subtle luxury tilt)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const handleDirectWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateProductOrderWhatsAppUrl(product, undefined, whatsappNumber);
    openWhatsApp(url);
  };

  const primaryImg = product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
  const secondaryImg = product.images && product.images.length > 1 ? product.images[1] : null;
  const currentImg = product.images?.[activeImageIndex] || primaryImg;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white rounded-2xl border border-[#FCE7EB] hover:border-[#F3C5D4] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.1s ease-out, box-shadow 0.3s ease' : 'transform 0.4s ease-out, box-shadow 0.3s ease',
      }}
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/5 w-full bg-[#FFF8F9] overflow-hidden">
        
        {/* Main Product Image (Primary / Active) */}
        <img
          src={activeImageIndex === 0 ? primaryImg : currentImg}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
            secondaryImg && activeImageIndex === 0 ? 'group-hover:opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />

        {/* Second Image on Hover (Alternate drape / closeup view) */}
        {secondaryImg && activeImageIndex === 0 && (
          <img
            src={secondaryImg}
            alt={`${product.name} - Alternate View`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out pointer-events-none"
            loading="lazy"
          />
        )}

        {/* Soft overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.is_customizable && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#831843] text-[10px] font-bold uppercase tracking-wider shadow-xs border border-[#F3C5D4]">
              <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
              <span>Customizable</span>
            </span>
          )}

          {product.stock_status === 'made_to_order' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#831843]/90 text-[#FFF0F3] text-[9px] font-medium tracking-wide">
              Made to Order
            </span>
          )}

          {product.occasion && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#D4AF37]/90 text-white text-[9px] font-semibold">
              {product.occasion}
            </span>
          )}
        </div>

        {/* Wishlist Heart Toggle (Top Right) */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isWishlisted
              ? 'bg-[#BE185D] text-white shadow-md scale-110'
              : 'bg-white/80 text-[#831843] hover:bg-white hover:text-[#BE185D] shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Multi-image indicator dots (if more than 1 image) */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeImageIndex
                    ? 'bg-white scale-125 shadow-xs'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Quick View trigger on hover (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="w-full py-2 px-3 rounded-xl bg-white/95 backdrop-blur-xs text-[#831843] text-xs font-semibold hover:bg-white shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Full Details</span>
          </button>
        </div>
      </div>

      {/* Product Content / Specs */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
        
        <div className="space-y-1.5">
          {/* Fabric & Work Subtitle */}
          <div className="text-[11px] text-[#9D174D] font-medium tracking-wide uppercase font-sans-clean line-clamp-1">
            {product.fabric_type} • {product.work_type}
          </div>

          {/* Product Name */}
          <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#3D2C2E] group-hover:text-[#831843] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#7A5A62] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#FFF0F3] space-y-3">
          
          {/* Price details */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#831843]">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-[#9D7983] line-through">
                  Rs. {product.original_price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Colors Preview Dots */}
            {product.available_colors && product.available_colors.length > 0 && (
              <span className="text-[10px] font-medium text-[#9D174D] bg-[#FFF0F3] px-2 py-0.5 rounded-full">
                {product.available_colors.length} shades
              </span>
            )}
          </div>

          {/* Actions: Direct WhatsApp Order + Customizer */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="w-full py-2.5 px-2 rounded-xl bg-[#831843] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs hover:bg-[#BE185D] hover:shadow-md active:scale-95 transition-all"
              title="Add to cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>
            
            {/* Direct WhatsApp Order Button */}
            <button
              id={`whatsapp-order-btn-${product.id}`}
              onClick={handleDirectWhatsAppOrder}
              className="w-full py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all"
              title="Order on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="truncate">Buy on WhatsApp</span>
            </button>

            {/* Customization Button */}
            <button
              id={`customize-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onOpenCustomize(product);
              }}
              className="w-full py-2.5 px-2 rounded-xl bg-[#FFF0F3] hover:bg-[#FCE7EB] text-[#831843] border border-[#F3C5D4] text-xs font-semibold flex items-center justify-center gap-1 hover:border-[#BE185D] transition-all active:scale-95"
              title="Customize Color, Fabric or Size"
            >
              <Sliders className="w-3.5 h-3.5 text-[#BE185D] shrink-0" />
              <span className="truncate">Customize</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
