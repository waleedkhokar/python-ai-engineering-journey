import React from 'react';
import { Product } from '../types';
import { X, Heart, MessageCircle, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl, generateProductOrderWhatsAppUrl, openWhatsApp } from '../lib/whatsapp';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemove: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  whatsappNumber?: string;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemove,
  onSelectProduct,
  whatsappNumber,
}) => {
  if (!isOpen) return null;

  const handleInquireAll = () => {
    if (wishlistProducts.length === 0) return;
    const itemsList = wishlistProducts.map((p, idx) => `${idx + 1}. *${p.name}* (Rs. ${p.price.toLocaleString()})`).join('\n');
    const msg = `Salam Sania! 🌸 I have saved these ${wishlistProducts.length} handmade dupattas in my wishlist:\n\n${itemsList}\n\nCould you please let me know about their availability and bundle pricing? Thank you! 💕`;
    const url = generateGeneralInquiryWhatsAppUrl(msg, whatsappNumber);
    openWhatsApp(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#FCE7EB] flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-[#FCE7EB] bg-gradient-to-r from-[#FFF0F3] to-[#FFF8F9] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#BE185D] text-white flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#831843]">
                  Your Saved Dupattas
                </h3>
                <p className="text-xs text-[#7A5A62]">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'piece' : 'pieces'} shortlisted
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#831843] hover:bg-[#FCE7EB] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body List */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 stroke-1" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-lg font-bold text-[#831843]">
                    Your Wishlist is Empty
                  </h4>
                  <p className="text-xs text-[#7A5A62] max-w-xs mx-auto mt-1">
                    Tap the heart icon on any hand-painted or embroidered dupatta to save your favorites here.
                  </p>
                </div>
              </div>
            ) : (
              wishlistProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-4 p-3 rounded-2xl border border-[#FCE7EB] hover:border-[#F3C5D4] bg-[#FFF8F9]/50 transition-colors group"
                >
                  <div
                    className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer bg-[#FFF0F3]"
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${
                        p.images.length > 1 ? 'group-hover:opacity-0' : ''
                      }`}
                    />
                    {p.images.length > 1 && (
                      <img
                        src={p.images[1]}
                        alt={`${p.name} alternate`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          onClick={() => {
                            onSelectProduct(p);
                            onClose();
                          }}
                          className="font-serif-luxury text-sm font-bold text-[#3D2C2E] hover:text-[#831843] cursor-pointer line-clamp-1"
                        >
                          {p.name}
                        </h4>
                        <button
                          onClick={() => onRemove(p.id)}
                          className="text-[#9D7983] hover:text-[#BE185D] p-1 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#9D174D] font-medium mt-0.5">
                        {p.fabric_type}
                      </p>
                      <p className="font-serif-luxury text-sm font-bold text-[#831843] mt-1">
                        Rs. {p.price.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const url = generateProductOrderWhatsAppUrl(p, undefined, whatsappNumber);
                        openWhatsApp(url);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#25D366] text-white text-[11px] font-semibold hover:bg-[#20BA5A] transition-colors mt-2 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>Order on WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Inquire All */}
          {wishlistProducts.length > 0 && (
            <div className="p-6 border-t border-[#FCE7EB] bg-[#FFF8F9] space-y-3">
              <button
                onClick={handleInquireAll}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Inquire All {wishlistProducts.length} on WhatsApp</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
