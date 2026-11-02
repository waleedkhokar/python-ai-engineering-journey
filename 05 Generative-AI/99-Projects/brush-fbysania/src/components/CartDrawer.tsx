import React from 'react';
import { CartItem } from '../types';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl, openWhatsApp } from '../lib/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  whatsappNumber?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onClear,
  whatsappNumber,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    const itemsList = items
      .map((item, index) => `${index + 1}. *${item.product.name}* x${item.quantity} - Rs. ${(item.product.price * item.quantity).toLocaleString()}`)
      .join('\n');
    const message = `Salam Sania! I would like to order these dupattas:\n\n${itemsList}\n\nSubtotal: Rs. ${subtotal.toLocaleString()}\n\nPlease confirm availability and delivery details.`;
    openWhatsApp(generateGeneralInquiryWhatsAppUrl(message, whatsappNumber));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#FCE7EB] flex flex-col">
          <div className="p-6 border-b border-[#FCE7EB] bg-gradient-to-r from-[#FFF0F3] to-[#FFF8F9] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#BE185D] text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#831843]">Your Cart</h3>
                <p className="text-xs text-[#7A5A62]">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-[#831843] hover:bg-[#FCE7EB]" title="Close cart">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 mx-auto text-[#BE185D] stroke-1" />
                <div>
                  <h4 className="font-serif-luxury text-lg font-bold text-[#831843]">Your Cart is Empty</h4>
                  <p className="text-xs text-[#7A5A62] mt-1">Add a dupatta to begin your order.</p>
                </div>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 p-3 rounded-2xl border border-[#FCE7EB] bg-[#FFF8F9]/50">
                  <img src={product.images[0]} alt={product.name} className="w-20 h-24 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif-luxury text-sm font-bold text-[#3D2C2E] line-clamp-2">{product.name}</h4>
                      <button onClick={() => onRemove(product.id)} className="text-[#9D7983] hover:text-[#BE185D] p-1" title="Remove from cart">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#9D174D] mt-0.5">Rs. {product.price.toLocaleString()}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#F3C5D4] rounded-lg bg-white">
                        <button onClick={() => onUpdateQuantity(product.id, quantity - 1)} className="p-1.5 text-[#831843] hover:bg-[#FFF0F3]" title="Decrease quantity"><Minus className="w-3 h-3" /></button>
                        <span className="w-7 text-center text-xs font-bold text-[#831843]">{quantity}</span>
                        <button onClick={() => onUpdateQuantity(product.id, quantity + 1)} className="p-1.5 text-[#831843] hover:bg-[#FFF0F3]" title="Increase quantity"><Plus className="w-3 h-3" /></button>
                      </div>
                      <span className="font-serif-luxury text-sm font-bold text-[#831843]">Rs. {(product.price * quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-[#FCE7EB] bg-[#FFF8F9] space-y-3">
              <div className="flex items-center justify-between text-sm font-bold text-[#831843]"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
              <p className="text-[11px] text-[#7A5A62]">Final availability, customization, and delivery charges are confirmed on WhatsApp.</p>
              <button onClick={handleCheckout} className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <span>Checkout on WhatsApp</span><ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onClear} className="w-full text-xs text-[#9D7983] hover:text-[#BE185D]">Clear cart</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};