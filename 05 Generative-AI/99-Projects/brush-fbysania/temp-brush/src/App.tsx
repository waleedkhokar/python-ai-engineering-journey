import React, { useState, useEffect } from 'react';
import {
  Product,
  Category,
  GalleryItem,
  CustomizationRequest,
  SiteContent,
  PageView,
  CartItem,
} from './types';
import {
  getProducts,
  getCategories,
  getGalleryItems,
  getCustomizationRequests,
  getSiteContent,
} from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CustomizerModal } from './components/CustomizerModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CustomizationPage } from './pages/CustomizationPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

const getInitialPage = (): PageView => {
  if (typeof window !== 'undefined' && window.location.pathname.replace(/\/$/, '').endsWith('/admin')) {
    return 'admin';
  }
  return 'home';
};

export const App: React.FC = () => {
  // Navigation & View State
  const [currentPage, setCurrentPage] = useState<PageView>(getInitialPage);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>(undefined);

  // Modals & Drawers State
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [customizeTargetProduct, setCustomizeTargetProduct] = useState<Product | null>(null);

  // Wishlist State (persisted to LocalStorage)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bnf_wishlist_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bnf_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Data Layer State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [customizationRequests, setCustomizationRequests] = useState<CustomizationRequest[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>({
    whatsapp_number: '923716747099',
    display_whatsapp: '+92 371 6747099',
    instagram_url: 'https://www.instagram.com/brushandfabricby_sania?igsi=MTI5OTdjaTAyNWh3Yg==',
    tiktok_url: 'https://www.tiktok.com/@brushandfabricby_sania?_r=1&_t=ZS-99OZxHoWsfF',
    email: 'brushnfabric@gmail.com',
    studio_location: 'Lahore, Pakistan • Worldwide Express Shipping',
    announcement_text: '🌸 Bespoke Hand-Painted Dupattas • Order & Inquire Directly on WhatsApp +92 371 6747099',
    hero_title: 'Hand-Painted Dupattas, Crafted Just For You',
    hero_subtitle: 'Artisanal, made-to-order dupattas on pure organza, chiffon, and silk. Every floral stroke painted with care by Sania.',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Fetch
  const loadAllData = async () => {
    try {
      const [prods, cats, gals, reqs, content] = await Promise.all([
        getProducts(),
        getCategories(),
        getGalleryItems(),
        getCustomizationRequests(),
        getSiteContent(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setGalleryItems(gals);
      setCustomizationRequests(reqs);
      if (content) {
        setSiteContent(content);
      }
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Save Wishlist to LocalStorage
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem('bnf_wishlist_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const persistCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem('bnf_cart_v1', JSON.stringify(items));
    } catch {}
  };

  const handleAddToCart = (product: Product) => {
    const existing = cartItems.find((item) => item.product.id === product.id);
    persistCart(existing
      ? cartItems.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cartItems, { product, quantity: 1 }]);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    persistCart(quantity <= 0
      ? cartItems.filter((item) => item.product.id !== productId)
      : cartItems.map((item) => item.product.id === productId ? { ...item, quantity } : item));
  };

  // Navigation Handler with scroll to top
  const handleNavigate = (page: PageView, filter?: string) => {
    if (filter) {
      setSelectedCategoryFilter(filter);
    } else {
      setSelectedCategoryFilter(undefined);
    }
    setCurrentPage(page);
    const path = page === 'home' ? '/' : `/${page}`;
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product Selection (Opens Product Detail page)
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Customizer Modal for a product or bespoke
  const handleOpenCustomizeModal = (product?: Product) => {
    setCustomizeTargetProduct(product || null);
    setIsCustomizeModalOpen(true);
  };

  // Wishlisted Products Objects
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F9] text-[#3D2C2E] font-sans-clean selection:bg-[#F3C5D4] selection:text-[#831843]">
      
      {/* 1. Main Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBespokeModal={() => handleOpenCustomizeModal()}
        onOpenBespoke={() => handleOpenCustomizeModal()}
        siteContent={siteContent}
      />

      {/* 2. Main Page Content View */}
      <main className="flex-1">
        {isLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-[#F3C5D4] border-t-[#BE185D] animate-spin"></div>
            <p className="font-serif-luxury text-lg text-[#831843] animate-pulse">
              Preparing Sania's Handmade Atelier...
            </p>
          </div>
        ) : (
          <>
            {/* HOME PAGE */}
            {currentPage === 'home' && (
              <HomePage
                products={products}
                categories={categories}
                galleryItems={galleryItems}
                siteContent={siteContent}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={handleSelectProduct}
                onOpenCustomize={handleOpenCustomizeModal}
                onAddToCart={handleAddToCart}
                onNavigate={handleNavigate}
                onOpenBespokeModal={() => handleOpenCustomizeModal()}
              />
            )}

            {/* SHOP / CATALOG PAGE */}
            {currentPage === 'shop' && (
              <ShopPage
                products={products}
                categories={categories}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={handleSelectProduct}
                onOpenCustomize={handleOpenCustomizeModal}
                onAddToCart={handleAddToCart}
                siteContent={siteContent}
                initialCategory={selectedCategoryFilter}
              />
            )}

            {/* PRODUCT DETAIL PAGE */}
            {currentPage === 'product' && selectedProduct && (
              <ProductDetailPage
                product={selectedProduct}
                allProducts={products}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={handleSelectProduct}
                onOpenCustomize={handleOpenCustomizeModal}
                onAddToCart={handleAddToCart}
                onBack={() => handleNavigate('shop')}
                siteContent={siteContent}
              />
            )}

            {/* BESPOKE CUSTOMIZATION STUDIO PAGE */}
            {currentPage === 'customization' && (
              <CustomizationPage siteContent={siteContent} />
            )}

            {/* GALLERY / LOOKBOOK PAGE */}
            {currentPage === 'gallery' && (
              <GalleryPage
                galleryItems={galleryItems}
                siteContent={siteContent}
                onOpenBespokeModal={() => handleOpenCustomizeModal()}
              />
            )}

            {/* ABOUT / STORY PAGE */}
            {currentPage === 'about' && (
              <AboutPage
                siteContent={siteContent}
                onNavigate={handleNavigate}
                onOpenBespokeModal={() => handleOpenCustomizeModal()}
              />
            )}

            {/* CONTACT PAGE */}
            {currentPage === 'contact' && (
              <ContactPage siteContent={siteContent} />
            )}

            {/* ADMIN DESK PAGE */}
            {currentPage === 'admin' && (
              <AdminPage
                products={products}
                categories={categories}
                galleryItems={galleryItems}
                customizationRequests={customizationRequests}
                siteContent={siteContent}
                onRefreshData={loadAllData}
                onClose={() => handleNavigate('home')}
              />
            )}
          </>
        )}
      </main>

      {/* 3. Footer */}
      <Footer
        siteContent={siteContent}
        onNavigate={handleNavigate}
      />

      {/* 4. Floating WhatsApp Action Button */}
      <FloatingWhatsApp
        whatsappNumber={siteContent.whatsapp_number}
        displayNumber={siteContent.display_whatsapp}
      />

      {/* 5. Customizer Modal Popup (For product or bespoke) */}
      <CustomizerModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        product={customizeTargetProduct}
        whatsappNumber={siteContent.whatsapp_number}
      />

      {/* 6. Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemove={handleToggleWishlist}
        onSelectProduct={handleSelectProduct}
        whatsappNumber={siteContent.whatsapp_number}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemove={(productId) => handleUpdateCartQuantity(productId, 0)}
        onClear={() => persistCart([])}
        whatsappNumber={siteContent.whatsapp_number}
      />

      {/* 7. Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

    </div>
  );
};

export default App;
