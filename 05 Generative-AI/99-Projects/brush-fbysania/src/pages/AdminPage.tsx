import React, { useState, useEffect } from 'react';
import { Product, Category, GalleryItem, CustomizationRequest, SiteContent } from '../types';
import {
  saveProduct,
  deleteProduct,
  saveCategory,
  deleteCategory,
  saveGalleryItem,
  deleteGalleryItem,
  updateCustomizationRequestStatus,
  deleteCustomizationRequest,
  saveSiteContent,
  uploadSiteImage,
  isUserAdmin,
  getActiveAdminEmail,
  adminLogout,
  getAdminCredentials,
  updateAdminCredentials,
  isSupabaseConfigured,
  SUPABASE_SQL_SCHEMA,
} from '../lib/supabase';
import { ImageUploader } from '../components/ImageUploader';
import { AdminPageContentEditor } from '../components/AdminPageContentEditor';
import { AdminLogin } from '../components/AdminLogin';
import {
  Package,
  FolderTree,
  Image,
  ClipboardList,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Search,
  Save,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  LayoutTemplate,
  ShieldCheck,
  Lock,
  Mail,
  Key,
  LogOut,
  Copy,
  Database,
} from 'lucide-react';

interface AdminPageProps {
  products: Product[];
  categories: Category[];
  galleryItems: GalleryItem[];
  customizationRequests: CustomizationRequest[];
  siteContent: SiteContent;
  onRefreshData: () => Promise<void>;
  onClose: () => void;
}

type AdminTab = 'products' | 'categories' | 'requests' | 'gallery' | 'pages' | 'settings' | 'security';

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  categories,
  galleryItems,
  customizationRequests,
  siteContent,
  onRefreshData,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // In-app Delete Confirmation Modal State
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'product' | 'category' | 'gallery' | 'request';
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isUserAdmin());
  const [activeAdminEmail, setActiveAdminEmail] = useState<string>(() => getActiveAdminEmail());

  // Admin Credentials Edit Form State
  const [adminCredsForm, setAdminCredsForm] = useState({
    currentEmail: '',
    newEmail: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCredsPassword, setShowCredsPassword] = useState(false);
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [credsCopiedSql, setCredsCopiedSql] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      getAdminCredentials().then((creds) => {
        setAdminCredsForm({
          currentEmail: creds.email,
          newEmail: creds.email,
          newPassword: creds.password,
          confirmPassword: creds.password,
        });
        setActiveAdminEmail(creds.email);
      });
    }
  }, [isAuthenticated]);

  const handleUpdateAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCredsForm.newPassword !== adminCredsForm.confirmPassword) {
      showToast('New passwords do not match. Please re-enter identical passwords.', 'error');
      return;
    }
    if (adminCredsForm.newPassword.length < 4) {
      showToast('Password must be at least 4 characters long.', 'error');
      return;
    }
    setIsSavingCreds(true);
    try {
      const res = await updateAdminCredentials(adminCredsForm.newEmail, adminCredsForm.newPassword);
      if (res.success) {
        const cleanEmail = adminCredsForm.newEmail.trim().toLowerCase();
        setActiveAdminEmail(cleanEmail);
        setAdminCredsForm((prev) => ({
          ...prev,
          currentEmail: cleanEmail,
        }));
        showToast('Admin Gmail & Password successfully updated in Supabase database!', 'success');
      } else {
        showToast(res.error || 'Failed to update credentials.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update credentials.', 'error');
    } finally {
      setIsSavingCreds(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
    showToast('Signed out of Admin Desk successfully.', 'info');
  };

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteContent>(siteContent);

  useEffect(() => {
    setSettingsForm(siteContent);
  }, [siteContent]);

  // Product Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category_id: categories[0]?.id || '',
    price: 6500,
    original_price: 7500,
    fabric_type: 'Pure Korean Organza',
    work_type: 'Hand-Painted Floral',
    dimensions: '2.5 Meters',
    care_instructions: 'Dry clean recommended',
    occasion: 'Festive',
    description: '',
    full_description: '',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    available_colors: ['Blush Pink', 'Rose Magenta', 'Ivory Gold'],
    is_customizable: true,
    is_featured: true,
    in_stock: true,
    rating: 5.0,
  });

  // Category Form State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryImg, setCategoryImg] = useState('');

  // Gallery Form State
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryImg, setGalleryImg] = useState('');
  const [galleryTag, setGalleryTag] = useState('Organza');

  // Handlers for Products
  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      ...p,
      images: Array.isArray(p.images) && p.images.length > 0 ? [...p.images] : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      available_colors: Array.isArray(p.available_colors) ? [...p.available_colors] : ['Blush Pink'],
    });
    setIsAddingProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const productToSave: Product = {
        id: editingProduct ? editingProduct.id : `prod_${Date.now()}`,
        name: productForm.name || 'Untitled Dupatta',
        category_id: productForm.category_id || (categories[0]?.id || 'cat-organza'),
        price: Number(productForm.price) || 5000,
        original_price: productForm.original_price ? Number(productForm.original_price) : undefined,
        fabric_type: productForm.fabric_type || 'Organza',
        work_type: productForm.work_type || 'Hand-Painted',
        dimensions: productForm.dimensions || '2.5 Meters',
        care_instructions: productForm.care_instructions || 'Dry clean only',
        occasion: productForm.occasion || 'Festive',
        description: productForm.description || '',
        full_description: productForm.full_description || productForm.description || '',
        images: Array.isArray(productForm.images) && productForm.images.length > 0 ? productForm.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
        available_colors: Array.isArray(productForm.available_colors) && productForm.available_colors.length > 0 ? productForm.available_colors : ['Blush Pink'],
        is_customizable: Boolean(productForm.is_customizable),
        is_featured: Boolean(productForm.is_featured),
        in_stock: productForm.in_stock !== false,
        rating: 5.0,
      };

      await saveProduct(productToSave);
      await onRefreshData();
      setIsAddingProduct(false);
      setEditingProduct(null);
      showToast(editingProduct ? `"${productToSave.name}" updated successfully!` : `"${productToSave.name}" added to catalog!`);
    } catch (err) {
      console.error(err);
      showToast('Error saving product. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = (p: Product) => {
    setItemToDelete({ type: 'product', id: p.id, name: p.name });
  };

  // Handlers for Categories
  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryDesc(cat.description || '');
    setCategoryImg(cat.image_url || '');
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDesc('');
    setCategoryImg('');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    try {
      const cat: Category = {
        id: editingCategory ? editingCategory.id : `cat_${categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}_${Date.now().toString().slice(-4)}`,
        name: categoryName.trim(),
        slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: categoryDesc.trim(),
        image_url: categoryImg || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      };
      await saveCategory(cat);
      await onRefreshData();
      handleCancelCategoryEdit();
      showToast(editingCategory ? `Collection "${cat.name}" updated!` : `New collection "${cat.name}" created!`);
    } catch (err) {
      console.error(err);
      showToast('Error saving collection.', 'error');
    }
  };

  const handleDeleteCategory = (cat: Category) => {
    setItemToDelete({ type: 'category', id: cat.id, name: cat.name });
  };

  // Handlers for Gallery
  const handleEditGallery = (item: GalleryItem) => {
    setEditingGallery(item);
    setGalleryTitle(item.title);
    setGalleryCaption(item.caption || '');
    setGalleryImg(item.image_url);
    setGalleryTag(item.category_tag || 'Organza');
  };

  const handleCancelGalleryEdit = () => {
    setEditingGallery(null);
    setGalleryTitle('');
    setGalleryCaption('');
    setGalleryImg('');
    setGalleryTag('Organza');
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryTitle.trim() || !galleryImg.trim()) return;
    try {
      const item: GalleryItem = {
        id: editingGallery ? editingGallery.id : `gal_${Date.now()}`,
        title: galleryTitle.trim(),
        caption: galleryCaption.trim(),
        image_url: galleryImg.trim(),
        category_tag: galleryTag,
      };
      await saveGalleryItem(item);
      await onRefreshData();
      handleCancelGalleryEdit();
      showToast(editingGallery ? `Portfolio photo "${item.title}" updated!` : `"${item.title}" added to gallery!`);
    } catch (err) {
      console.error(err);
      showToast('Error saving portfolio item.', 'error');
    }
  };

  const handleDeleteGallery = (item: GalleryItem) => {
    setItemToDelete({ type: 'gallery', id: item.id, name: item.title });
  };

  // Handlers for Request Status & Deletion
  const handleStatusChange = async (id: string, newStatus: CustomizationRequest['status']) => {
    try {
      await updateCustomizationRequestStatus(id, newStatus);
      await onRefreshData();
      showToast(`Order status updated to "${newStatus}".`);
    } catch (err) {
      console.error(err);
      showToast('Error updating status.', 'error');
    }
  };

  const handleDeleteRequest = (req: CustomizationRequest) => {
    setItemToDelete({ type: 'request', id: req.id, name: `Inquiry from ${req.customer_name}` });
  };

  // Centralized Deletion Execution with immediate feedback
  const handleExecuteDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      if (itemToDelete.type === 'product') {
        await deleteProduct(itemToDelete.id);
        if (editingProduct?.id === itemToDelete.id) {
          setEditingProduct(null);
          setIsAddingProduct(false);
        }
        showToast(`"${itemToDelete.name}" deleted from catalog.`, 'info');
      } else if (itemToDelete.type === 'category') {
        await deleteCategory(itemToDelete.id);
        if (editingCategory?.id === itemToDelete.id) {
          handleCancelCategoryEdit();
        }
        showToast(`Collection "${itemToDelete.name}" deleted.`, 'info');
      } else if (itemToDelete.type === 'gallery') {
        await deleteGalleryItem(itemToDelete.id);
        if (editingGallery?.id === itemToDelete.id) {
          handleCancelGalleryEdit();
        }
        showToast(`"${itemToDelete.name}" removed from portfolio.`, 'info');
      } else if (itemToDelete.type === 'request') {
        await deleteCustomizationRequest(itemToDelete.id);
        showToast(`"${itemToDelete.name}" deleted.`, 'info');
      }
      await onRefreshData();
    } catch (err) {
      console.error('Delete execution error:', err);
      showToast(`Error deleting ${itemToDelete.type}.`, 'error');
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // Handlers for Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSiteContent(settingsForm);
      await onRefreshData();
      showToast('Studio & WhatsApp settings updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error updating settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={(email) => {
          setIsAuthenticated(true);
          setActiveAdminEmail(email);
          showToast(`Welcome! Logged in as ${email}`, 'success');
        }}
        onBackToStore={onClose}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F9] py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${
          toastMessage.type === 'error'
            ? 'bg-red-50 text-red-700 border-red-200'
            : toastMessage.type === 'info'
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-[#FFF0F3] text-[#831843] border-[#F3C5D4]'
        }`}>
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#BE185D] shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#7A5A62] hover:text-[#3D2C2E]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#FCE7EB] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#BE185D] to-[#831843] text-white flex items-center justify-center font-serif font-bold text-xl shadow-md shrink-0">
            BnF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-luxury text-2xl font-bold text-[#3D2C2E]">
                Studio Admin Desk
              </h1>
              <span className="text-[10px] bg-[#25D366]/15 text-[#128C7E] px-2.5 py-0.5 rounded-full font-bold">
                Live
              </span>
            </div>
            <p className="text-xs text-[#7A5A62]">
              Manage dupatta catalog, incoming WhatsApp requests, gallery, and brand contact settings.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Active Admin Email Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F3] border border-[#FCE7EB] text-[11px] text-[#831843]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#BE185D]" />
            <span className="truncate max-w-[170px] font-semibold">{activeAdminEmail}</span>
          </div>

          {/* Quick link to Security / Password */}
          <button
            onClick={() => setActiveTab('security')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-xs transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#BE185D] text-white shadow-xs'
                : 'bg-[#FFF0F3] text-[#831843] hover:bg-[#FCE7EB]'
            }`}
            title="Manage Admin Gmail and Password"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Admin Security</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-red-600 border border-red-200 hover:bg-red-50 font-semibold text-xs transition-colors cursor-pointer"
            title="Sign out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

          {/* Exit to Storefront */}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF0F3] text-[#831843] hover:bg-[#FCE7EB] font-semibold text-xs transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Storefront</span>
          </button>
        </div>
      </div>

      {/* Main Admin Nav Tabs */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-[#831843] text-white shadow-xs'
              : 'bg-white text-[#831843] border border-[#FCE7EB] hover:bg-[#FFF0F3]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Dupattas Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all relative ${
            activeTab === 'requests'
              ? 'bg-[#831843] text-white shadow-xs'
              : 'bg-white text-[#831843] border border-[#FCE7EB] hover:bg-[#FFF0F3]'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Order Inquiries ({customizationRequests.length})</span>
          {customizationRequests.some(r => r.status === 'new') && (
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${
            activeTab === 'categories'
              ? 'bg-[#831843] text-white shadow-xs'
              : 'bg-white text-[#831843] border border-[#FCE7EB] hover:bg-[#FFF0F3]'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Collections ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${
            activeTab === 'gallery'
              ? 'bg-[#831843] text-white shadow-xs'
              : 'bg-white text-[#831843] border border-[#FCE7EB] hover:bg-[#FFF0F3]'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Gallery Portfolio ({galleryItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${
            activeTab === 'pages'
              ? 'bg-[#831843] text-white shadow-xs'
              : 'bg-white text-[#831843] border border-[#FCE7EB] hover:bg-[#FFF0F3]'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          <span>Page Content & Bespoke Editor</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#831843] text-white shadow-xs'
              : 'bg-white text-[#831843] border border-[#FCE7EB] hover:bg-[#FFF0F3]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Studio Settings & WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#831843] text-white shadow-xs'
              : 'bg-white text-[#831843] border border-[#FCE7EB] hover:bg-[#FFF0F3]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Security & Login</span>
        </button>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto">
        
        {/* TAB 1: PRODUCTS / DUPATTAS CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#FCE7EB]">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#9D7983] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#FCE7EB] text-xs focus:outline-hidden"
                />
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    category_id: categories[0]?.id || '',
                    price: 6500,
                    original_price: 7500,
                    fabric_type: 'Pure Korean Organza',
                    work_type: 'Hand-Painted Botanical Florals',
                    dimensions: '2.5 Meters',
                    care_instructions: 'Dry clean recommended',
                    occasion: 'Festive',
                    description: '',
                    full_description: '',
                    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
                    available_colors: ['Blush Pink', 'Rose Magenta'],
                    is_customizable: true,
                    is_featured: true,
                    in_stock: true,
                  });
                  setIsAddingProduct(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#BE185D] text-white text-xs font-bold shadow-xs hover:bg-[#831843] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Handmade Dupatta</span>
              </button>
            </div>

            {/* Product Add / Edit Modal */}
            {isAddingProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#F3C5D4] shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-[#FCE7EB] pb-3">
                    <h3 className="font-serif-luxury text-xl font-bold text-[#831843]">
                      {editingProduct ? `Edit Dupatta: ${editingProduct.name}` : 'Add New Handmade Dupatta'}
                    </h3>
                    <button
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="p-1 rounded-full text-[#7A5A62] hover:bg-[#FCE7EB]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                    
                    <div>
                      <label className="block font-bold text-[#831843] mb-1">Dupatta Name *</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#831843] mb-1">Collection / Category</label>
                        <select
                          value={productForm.category_id}
                          onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#831843] mb-1">Occasion</label>
                        <select
                          value={productForm.occasion}
                          onChange={(e) => setProductForm({ ...productForm, occasion: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                        >
                          <option value="Bridal">Bridal</option>
                          <option value="Festive">Festive</option>
                          <option value="Partywear">Partywear</option>
                          <option value="Casual">Casual</option>
                          <option value="Luxury">Luxury</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#831843] mb-1">Price (Rs.) *</label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#831843] mb-1">Original / Strikethrough Price (Rs.)</label>
                        <input
                          type="number"
                          value={productForm.original_price || ''}
                          onChange={(e) => setProductForm({ ...productForm, original_price: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#831843] mb-1">Fabric Type</label>
                        <input
                          type="text"
                          value={productForm.fabric_type}
                          onChange={(e) => setProductForm({ ...productForm, fabric_type: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#831843] mb-1">Technique / Work</label>
                        <input
                          type="text"
                          value={productForm.work_type}
                          onChange={(e) => setProductForm({ ...productForm, work_type: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                        />
                      </div>
                    </div>

                    <div className="bg-[#FFF8F9] p-4 rounded-2xl border border-[#FCE7EB]">
                      <ImageUploader
                        multiple={true}
                        maxFiles={6}
                        label="Dupatta Photos (Upload from Device, Link, or Select Sample)"
                        description="Upload high quality photos of the dupatta. First photo will be the main cover."
                        value={Array.isArray(productForm.images) ? productForm.images : []}
                        onChange={(imgs) => setProductForm({ ...productForm, images: imgs })}
                        uploadImage={(imageDataUrl) => uploadSiteImage(imageDataUrl, 'products')}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#831843] mb-1">Available Colors (comma separated)</label>
                      <input
                        type="text"
                        value={Array.isArray(productForm.available_colors) ? productForm.available_colors.join(', ') : ''}
                        onChange={(e) => setProductForm({
                          ...productForm,
                          available_colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                        })}
                        className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#831843] mb-1">Short Description</label>
                      <textarea
                        rows={2}
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#831843] mb-1">Full Artisanal Description</label>
                      <textarea
                        rows={3}
                        value={productForm.full_description}
                        onChange={(e) => setProductForm({ ...productForm, full_description: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-[#831843]">
                        <input
                          type="checkbox"
                          checked={productForm.is_customizable}
                          onChange={(e) => setProductForm({ ...productForm, is_customizable: e.target.checked })}
                          className="rounded text-[#BE185D]"
                        />
                        <span>Customizable on Order</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-bold text-[#831843]">
                        <input
                          type="checkbox"
                          checked={productForm.is_featured}
                          onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                          className="rounded text-[#BE185D]"
                        />
                        <span>Featured on Homepage</span>
                      </label>
                    </div>

                    <div className="pt-4 border-t border-[#FCE7EB] flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingProduct(false);
                          setEditingProduct(null);
                        }}
                        className="px-4 py-2 rounded-xl text-[#7A5A62] hover:bg-[#FCE7EB]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 rounded-xl bg-[#BE185D] text-white font-bold hover:bg-[#831843]"
                      >
                        {isSaving ? 'Saving...' : editingProduct ? 'Update Dupatta' : 'Save Dupatta'}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-[#FCE7EB] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-[#3D2C2E]">
                <thead className="bg-[#FFF0F3] text-[#831843] font-bold uppercase tracking-wider text-[11px] border-b border-[#FCE7EB]">
                  <tr>
                    <th className="p-4">Dupatta</th>
                    <th className="p-4">Fabric & Work</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Customizable</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFF0F3]">
                  {products
                    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-[#FFF8F9]/80 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-14 rounded-xl object-cover shrink-0 border border-[#FCE7EB]"
                          />
                          <div>
                            <div className="font-serif-luxury font-bold text-sm text-[#3D2C2E]">{p.name}</div>
                            <div className="text-[10px] text-[#9D7983]">{p.occasion}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-[#831843]">{p.fabric_type}</div>
                          <div className="text-[11px] text-[#7A5A62]">{p.work_type}</div>
                        </td>
                        <td className="p-4 font-bold text-[#831843]">
                          Rs. {p.price.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.is_customizable ? 'bg-[#25D366]/20 text-[#128C7E]' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {p.is_customizable ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.is_featured ? 'bg-[#BE185D]/15 text-[#BE185D]' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {p.is_featured ? 'Featured' : 'Standard'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditProduct(p)}
                            className="p-1.5 rounded-lg text-[#831843] hover:bg-[#FFF0F3]"
                            title="Edit Dupatta"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                            title="Delete Dupatta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: INCOMING ORDER / CUSTOMIZATION REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-[#831843]">
                    Incoming Custom Orders & Inquiries
                  </h3>
                  <p className="text-xs text-[#7A5A62]">
                    Requests logged when clients click "Order via WhatsApp" or submit custom forms.
                  </p>
                </div>
              </div>

              {customizationRequests.length === 0 ? (
                <div className="text-center py-12 text-[#7A5A62] text-xs">
                  No order requests logged yet. As users place inquiries, they will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {customizationRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl border border-[#FCE7EB] bg-[#FFF8F9]/40 hover:bg-white transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif-luxury font-bold text-base text-[#3D2C2E]">
                              {req.customer_name}
                            </span>
                            <span className="text-xs text-[#7A5A62]">
                              ({req.customer_contact})
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              req.status === 'new'
                                ? 'bg-amber-100 text-amber-800'
                                : req.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-[#BE185D] mt-0.5">
                            {req.product_name || 'Bespoke Order'}
                          </div>
                        </div>

                        {/* Status Change Selector, Direct WhatsApp reply, and Delete */}
                        <div className="flex items-center gap-2">
                          <select
                            value={req.status}
                            onChange={(e) => handleStatusChange(req.id, e.target.value as any)}
                            className="text-xs p-1.5 rounded-lg border border-[#FCE7EB] bg-white font-medium text-[#3D2C2E]"
                          >
                            <option value="new">New</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <a
                            href={`https://wa.me/${req.customer_contact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Salam ${req.customer_name}! 🌸 This is Sania from Brush n Fabric regarding your custom dupatta inquiry for ${req.product_name}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:bg-[#20BA5A] transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            <span>Message Client</span>
                          </a>

                          <button
                            onClick={() => handleDeleteRequest(req)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Details Box */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-[#FCE7EB] text-xs">
                        <div>
                          <span className="text-[#9D7983] block text-[10px]">Color:</span>
                          <span className="font-medium text-[#3D2C2E]">{req.color_choice || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[#9D7983] block text-[10px]">Fabric:</span>
                          <span className="font-medium text-[#3D2C2E]">{req.fabric_choice || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[#9D7983] block text-[10px]">Length / Tassels:</span>
                          <span className="font-medium text-[#3D2C2E]">{req.size_choice} • {req.tassels_option}</span>
                        </div>
                        <div>
                          <span className="text-[#9D7983] block text-[10px]">Est. Price:</span>
                          <span className="font-bold text-[#831843]">Rs. {req.estimated_price?.toLocaleString() || 'N/A'}</span>
                        </div>
                      </div>

                      {req.notes && (
                        <div className="text-xs text-[#5C3A42] bg-[#FFF0F3] p-2.5 rounded-lg">
                          <strong>Client Notes:</strong> {req.notes}
                        </div>
                      )}

                      {req.reference_image_url && (
                        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#FCE7EB]">
                          <img
                            src={req.reference_image_url}
                            alt="Client Outfit Swatch Reference"
                            className="w-14 h-14 object-cover rounded-lg border border-[#FCE7EB] shrink-0"
                          />
                          <div className="text-xs space-y-1">
                            <span className="font-bold text-[#831843] block">Outfit / Swatch Photo Attached</span>
                            <a
                              href={req.reference_image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#BE185D] hover:underline text-[11px] font-semibold inline-block"
                            >
                              View Full Size Swatch ↗
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Form */}
            <div className="bg-white p-6 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-luxury text-lg font-bold text-[#831843]">
                  {editingCategory ? `Edit Collection: ${editingCategory.name}` : 'Create New Collection'}
                </h3>
                {editingCategory && (
                  <button
                    onClick={handleCancelCategoryEdit}
                    className="text-xs font-semibold text-[#7A5A62] hover:text-[#831843]"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#831843] mb-1">Collection Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#FCE7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#831843] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={categoryDesc}
                    onChange={(e) => setCategoryDesc(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#FCE7EB]"
                  />
                </div>
                <div className="bg-[#FFF8F9] p-3 rounded-2xl border border-[#FCE7EB]">
                  <ImageUploader
                    label="Collection Cover Photo"
                    description="Upload an image or paste a URL for this collection"
                    value={categoryImg}
                    onChange={(url) => setCategoryImg(url as string)}
                    uploadImage={(imageDataUrl) => uploadSiteImage(imageDataUrl, 'admin')}
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={handleCancelCategoryEdit}
                      className="w-1/3 py-2.5 rounded-xl border border-[#FCE7EB] text-[#7A5A62] font-semibold hover:bg-[#FFF0F3] transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#BE185D] text-white font-bold hover:bg-[#831843] transition-colors"
                  >
                    {editingCategory ? 'Update Collection' : 'Save Collection'}
                  </button>
                </div>
              </form>
            </div>

            {/* Categories List */}
            <div className="md:col-span-2 space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`bg-white p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 shadow-2xs ${
                    editingCategory?.id === cat.id ? 'border-[#BE185D] ring-2 ring-[#BE185D]/20' : 'border-[#FCE7EB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#FCE7EB]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif-luxury font-bold text-sm text-[#3D2C2E]">{cat.name}</h4>
                        {editingCategory?.id === cat.id && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#BE185D]/10 text-[#BE185D] font-bold">
                            Editing
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#7A5A62] line-clamp-1">{cat.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="p-1.5 text-[#831843] hover:bg-[#FFF0F3] rounded-lg"
                      title="Edit Collection"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY / LOOKBOOK */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-luxury text-lg font-bold text-[#831843]">
                  {editingGallery ? `Edit Portfolio Photo: ${editingGallery.title}` : 'Add Portfolio Photo'}
                </h3>
                {editingGallery && (
                  <button
                    onClick={handleCancelGalleryEdit}
                    className="text-xs font-semibold text-[#7A5A62] hover:text-[#831843]"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveGallery} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#831843] mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nikkah Veil in Ivory Gold"
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#FCE7EB]"
                  />
                </div>
                <div className="bg-[#FFF8F9] p-3 rounded-2xl border border-[#FCE7EB]">
                  <ImageUploader
                    label="Portfolio Photo"
                    required={true}
                    description="Upload photo from your device or paste URL"
                    value={galleryImg}
                    onChange={(url) => setGalleryImg(url as string)}
                    uploadImage={(imageDataUrl) => uploadSiteImage(imageDataUrl, 'admin')}
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#831843] mb-1">Category Tag</label>
                  <select
                    value={galleryTag}
                    onChange={(e) => setGalleryTag(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#FCE7EB]"
                  >
                    <option value="Bridal">Bridal</option>
                    <option value="Organza">Organza</option>
                    <option value="Festive">Festive</option>
                    <option value="Custom Match">Custom Match</option>
                    <option value="Hand-Painted">Hand-Painted</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#831843] mb-1">Caption</label>
                  <textarea
                    rows={2}
                    value={galleryCaption}
                    onChange={(e) => setGalleryCaption(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#FCE7EB]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {editingGallery && (
                    <button
                      type="button"
                      onClick={handleCancelGalleryEdit}
                      className="w-1/3 py-2.5 rounded-xl border border-[#FCE7EB] text-[#7A5A62] font-semibold hover:bg-[#FFF0F3] transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#BE185D] text-white font-bold hover:bg-[#831843] transition-colors"
                  >
                    {editingGallery ? 'Update Portfolio Photo' : 'Add to Gallery'}
                  </button>
                </div>
              </form>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl overflow-hidden border shadow-2xs group relative transition-all ${
                    editingGallery?.id === item.id ? 'border-[#BE185D] ring-2 ring-[#BE185D]/20' : 'border-[#FCE7EB]'
                  }`}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-3">
                    <span className="text-[9px] font-bold text-[#BE185D] uppercase">{item.category_tag}</span>
                    <h5 className="font-serif-luxury font-bold text-xs truncate text-[#3D2C2E]">{item.title}</h5>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditGallery(item)}
                      className="bg-white/90 backdrop-blur-xs text-[#831843] p-1.5 rounded-lg hover:bg-white shadow-xs"
                      title="Edit Portfolio Photo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(item)}
                      className="bg-red-600/90 text-white p-1.5 rounded-lg hover:bg-red-600 shadow-xs"
                      title="Remove Portfolio Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PAGE CONTENT & BESPOKE CUSTOMIZER */}
        {activeTab === 'pages' && (
          <AdminPageContentEditor
            content={settingsForm}
            onChange={(updated) => setSettingsForm(updated)}
            onSave={async (directContent) => {
              setIsSaving(true);
              try {
                const toSave = directContent || settingsForm;
                setSettingsForm(toSave);
                await saveSiteContent(toSave);
                await onRefreshData();
                showToast('Bespoke page & website settings saved successfully!');
              } catch (err) {
                console.error(err);
                showToast('Error saving page content.', 'error');
              } finally {
                setIsSaving(false);
              }
            }}
            isSaving={isSaving}
          />
        )}

        {/* TAB 6: STUDIO SETTINGS & WHATSAPP */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs max-w-3xl space-y-6">
            <h3 className="font-serif-luxury text-xl font-bold text-[#831843]">
              Studio & WhatsApp Configuration
            </h3>

            {/* Quick Link to Admin Credentials */}
            <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF0F3] border border-[#F3C5D4] text-[#BE185D] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#831843] text-xs">Admin Login Credentials & Supabase Database</h4>
                  <p className="text-[11px] text-[#7A5A62]">
                    Active Gmail: <strong className="text-[#3D2C2E]">{activeAdminEmail}</strong> • Password protected
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className="px-4 py-2 rounded-xl bg-[#BE185D] hover:bg-[#831843] text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Edit Login Credentials</span>
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              
              {/* WhatsApp Config */}
              <div className="p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#128C7E]">
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Business Checkout Number</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#128C7E] font-bold mb-1">WhatsApp Raw Number (e.g. 923716747099)</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.whatsapp_number}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                      className="w-full p-2 rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#128C7E] font-bold mb-1">Display Format (e.g. +92 371 6747099)</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.display_whatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, display_whatsapp: e.target.value })}
                      className="w-full p-2 rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#831843] mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={settingsForm.instagram_url}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagram_url: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#831843] mb-1">TikTok URL</label>
                  <input
                    type="url"
                    value={settingsForm.tiktok_url}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tiktok_url: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                  />
                </div>
              </div>

              {/* Email & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#831843] mb-1">Studio Email</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#831843] mb-1">Studio Location</label>
                  <input
                    type="text"
                    value={settingsForm.studio_location}
                    onChange={(e) => setSettingsForm({ ...settingsForm, studio_location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                  />
                </div>
              </div>

              {/* Announcement Bar */}
              <div>
                <label className="block font-bold text-[#831843] mb-1">Top Announcement Bar Text</label>
                <input
                  type="text"
                  value={settingsForm.announcement_text}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcement_text: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              {/* Hero Copy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#831843] mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={settingsForm.hero_title}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#831843] mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={settingsForm.hero_subtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                  />
                </div>
              </div>

              {/* Branding & Media Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#FFF8F9] p-4 rounded-2xl border border-[#FCE7EB]">
                  <ImageUploader
                    label="Hero Showcase Drape Photo"
                    description="Upload high-res dupatta drape image for homepage hero"
                    value={settingsForm.hero_image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'}
                    onChange={(url) => setSettingsForm({ ...settingsForm, hero_image_url: url as string })}
                    uploadImage={(imageDataUrl) => uploadSiteImage(imageDataUrl, 'admin')}
                  />
                </div>

                <div className="bg-[#FFF8F9] p-4 rounded-2xl border border-[#FCE7EB]">
                  <ImageUploader
                    label="About Story / Sania Studio Portrait"
                    description="Upload photo of Sania painting or dupatta studio workshop"
                    value={settingsForm.about_image_url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80'}
                    onChange={(url) => setSettingsForm({ ...settingsForm, about_image_url: url as string })}
                    uploadImage={(imageDataUrl) => uploadSiteImage(imageDataUrl, 'admin')}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#FCE7EB]">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#BE185D] to-[#831843] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
                >
                  {isSaving ? 'Updating...' : 'Save All Settings'}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 7: ADMIN SECURITY & SUPABASE CREDENTIALS */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            
            {/* Overview Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] border border-[#F3C5D4] text-[#BE185D] flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3D2C2E]">
                      Admin Security & Credentials
                    </h2>
                    <p className="text-xs text-[#7A5A62]">
                      Manage the Gmail address and password used to access this admin panel. Synced directly with your Supabase database.
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0F3] border border-[#FCE7EB] text-xs font-semibold text-[#831843] self-start sm:self-auto">
                  <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Mode'}</span>
                </div>
              </div>

              {/* Current Active Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#FCE7EB] text-xs">
                <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB]">
                  <span className="text-[#7A5A62] block mb-1">Active Admin Gmail</span>
                  <span className="font-bold text-[#831843] text-sm break-all flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-[#BE185D]" />
                    {activeAdminEmail}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB]">
                  <span className="text-[#7A5A62] block mb-1">Password Status</span>
                  <span className="font-bold text-[#3D2C2E] text-sm flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 shrink-0 text-[#BE185D]" />
                    ••••••••••••
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB]">
                  <span className="text-[#7A5A62] block mb-1">Database Sync</span>
                  <span className="font-bold text-emerald-700 text-sm flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    Supabase & Local Cache
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Credentials Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs">
              <form onSubmit={handleUpdateAdminCredentials} className="space-y-6">
                
                <div className="border-b border-[#FCE7EB] pb-4">
                  <h3 className="font-serif-luxury text-lg font-bold text-[#831843] flex items-center gap-2">
                    <Key className="w-5 h-5 text-[#BE185D]" />
                    <span>Change Admin Gmail & Password</span>
                  </h3>
                  <p className="text-xs text-[#7A5A62] mt-1">
                    Enter your new Gmail address and chosen password below. Once saved, these will become your active login credentials.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  
                  {/* New Gmail Address */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-[#831843]">
                      Admin Gmail / Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A5A62]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={adminCredsForm.newEmail}
                        onChange={(e) => setAdminCredsForm({ ...adminCredsForm, newEmail: e.target.value })}
                        placeholder="e.g. brushnfabric@gmail.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#FCE7EB] bg-white text-[#3D2C2E] focus:border-[#BE185D] focus:ring-2 focus:ring-[#BE185D]/20 focus:outline-hidden transition-all shadow-2xs font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-[#7A5A62]">
                      This is the Gmail address you will use to log into the studio admin desk.
                    </p>
                  </div>

                  {/* Password Visibility Toggle helper */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-[#831843]">
                        Show Passwords
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCredsPassword(!showCredsPassword)}
                        className="text-[11px] text-[#BE185D] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {showCredsPassword ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hide Characters</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Show Characters</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3 bg-[#FFF8F9] rounded-xl border border-[#FCE7EB] text-[11px] text-[#7A5A62]">
                      💡 Tip: Choose a secure password known only to you or studio managers.
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-[#831843]">
                      New Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A5A62]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showCredsPassword ? 'text' : 'password'}
                        required
                        minLength={4}
                        value={adminCredsForm.newPassword}
                        onChange={(e) => setAdminCredsForm({ ...adminCredsForm, newPassword: e.target.value })}
                        placeholder="Enter at least 4 characters"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#FCE7EB] bg-white text-[#3D2C2E] focus:border-[#BE185D] focus:ring-2 focus:ring-[#BE185D]/20 focus:outline-hidden transition-all shadow-2xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-[#831843]">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A5A62]">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <input
                        type={showCredsPassword ? 'text' : 'password'}
                        required
                        minLength={4}
                        value={adminCredsForm.confirmPassword}
                        onChange={(e) => setAdminCredsForm({ ...adminCredsForm, confirmPassword: e.target.value })}
                        placeholder="Re-type your new password"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#FCE7EB] bg-white text-[#3D2C2E] focus:border-[#BE185D] focus:ring-2 focus:ring-[#BE185D]/20 focus:outline-hidden transition-all shadow-2xs font-medium"
                      />
                    </div>
                  </div>

                </div>

                {/* Submit button bar */}
                <div className="pt-4 border-t border-[#FCE7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSavingCreds}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#831843] text-white font-bold text-xs shadow-md hover:shadow-lg hover:from-[#9D174D] hover:to-[#6B1236] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSavingCreds ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Credentials in Supabase Database</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminCredsForm({
                        currentEmail: 'brushnfabric@gmail.com',
                        newEmail: 'brushnfabric@gmail.com',
                        newPassword: 'sania123',
                        confirmPassword: 'sania123',
                      });
                      showToast('Values reset in form. Click Save to apply.', 'info');
                    }}
                    className="text-xs text-[#7A5A62] hover:text-[#BE185D] underline font-medium cursor-pointer"
                  >
                    Reset Form to Defaults
                  </button>
                </div>

              </form>
            </div>

            {/* Supabase Database Schema & Setup Guide */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#3D2C2E] flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#BE185D]" />
                    <span>Supabase Database Table Setup</span>
                  </h3>
                  <p className="text-xs text-[#7A5A62] mt-0.5">
                    Your admin credentials are saved in the <code className="bg-[#FFF0F3] px-1.5 py-0.5 rounded text-[#831843] font-mono">admin_credentials</code> table.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                    setCredsCopiedSql(true);
                    showToast('Full Supabase SQL schema copied to clipboard!', 'success');
                    setTimeout(() => setCredsCopiedSql(false), 3000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF0F3] border border-[#F3C5D4] text-[#831843] hover:bg-[#FCE7EB] font-bold text-xs transition-colors cursor-pointer"
                >
                  {credsCopiedSql ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#BE185D]" />
                      <span>Copy Supabase SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-[#1E1E24] text-[#E0E0E0] rounded-2xl font-mono text-[11px] overflow-x-auto border border-gray-700 max-h-48 leading-relaxed">
                <pre>{`-- Supabase Table for Admin Credentials
create table if not exists admin_credentials (
  id text primary key,
  email text not null,
  password text not null,
  updated_at timestamp with time zone default now()
);

-- Seed default primary admin if not exists
insert into admin_credentials (id, email, password)
values ('primary', 'brushnfabric@gmail.com', 'sania123')
on conflict (id) do nothing;

alter table admin_credentials enable row level security;
create policy "Allow all on admin_credentials" on admin_credentials for all using (true) with check (true);`}</pre>
              </div>

              <p className="text-[11px] text-[#7A5A62]">
                ✨ If you are connecting a new Supabase project, run this SQL in your Supabase SQL Editor to initialize all tables including admin authentication.
              </p>
            </div>

          </div>
        )}

      </div>

      {/* Delete Confirmation Modal Dialog */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-red-200 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#831843]">
                  Confirm Deletion
                </h3>
                <p className="text-xs text-[#7A5A62]">
                  Are you sure you want to permanently delete this {itemToDelete.type}?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-100 text-xs text-red-900">
              <span className="font-bold text-red-950">Item: </span>
              <span className="font-serif-luxury font-bold">{itemToDelete.name}</span>
              <p className="text-[11px] text-red-700 mt-1">This will remove it from your live catalog/database.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setItemToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-[#FCE7EB] text-[#7A5A62] text-xs font-semibold hover:bg-[#FFF0F3] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleExecuteDelete}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
