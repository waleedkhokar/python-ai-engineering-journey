import React, { useState } from 'react';
import { Product } from '../types';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = products.filter((p) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.fabric_type.toLowerCase().includes(q) ||
      p.work_type.toLowerCase().includes(q) ||
      p.occasion.toLowerCase().includes(q) ||
      p.available_colors.some(c => c.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-20 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#F3C5D4] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#FCE7EB] flex items-center gap-3 bg-[#FFF8F9]">
          <Search className="w-5 h-5 text-[#831843] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search dupattas by fabric (Organza, Chiffon, Raw Silk), color, or design..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm sm:text-base text-[#3D2C2E] placeholder-[#9D7983] bg-transparent focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FCE7EB] text-[#831843]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="px-5 py-2.5 bg-white border-b border-[#FCE7EB] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#9D7983] font-medium shrink-0">Popular:</span>
          {['Organza', 'Nikkah Bridal', 'Crinkle Chiffon', 'Gotta Patti', 'Blush Pink', 'Raw Silk'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-[#FFF0F3] hover:bg-[#FCE7EB] text-[#831843] transition-colors whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#7A5A62] text-sm">
              No matching dupattas found for "{query}". You can request a custom piece on WhatsApp!
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#FFF0F3] border border-transparent hover:border-[#F3C5D4] cursor-pointer transition-all group"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif-luxury text-base font-bold text-[#3D2C2E] group-hover:text-[#831843] truncate">
                      {p.name}
                    </h4>
                    {p.is_customizable && (
                      <span className="text-[9px] bg-[#FCE7EB] text-[#831843] px-2 py-0.5 rounded-full font-semibold shrink-0">
                        Customizable
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9D174D] font-medium mt-0.5">
                    {p.fabric_type} • {p.work_type}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-serif-luxury text-sm font-bold text-[#831843]">
                    Rs. {p.price.toLocaleString()}
                  </span>
                  <div className="text-[10px] text-[#25D366] font-semibold flex items-center justify-end gap-1 mt-1">
                    <span>WhatsApp Order</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
