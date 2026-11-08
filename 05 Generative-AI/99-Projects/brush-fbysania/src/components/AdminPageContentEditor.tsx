import React, { useState } from 'react';
import { SiteContent, BespokeFabricTier, FaqItem, BespokeShowcaseItem, BespokeDupattaBanner } from '../types';
import { INITIAL_BESPOKE_BANNERS } from '../data/seedData';
import { ImageUploader } from './ImageUploader';
import { uploadSiteImage } from '../lib/supabase';
import {
  Sparkles,
  Layers,
  Scissors,
  Palette,
  HelpCircle,
  Home,
  BookOpen,
  MessageCircle,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Save,
  Info,
  Image as ImageIcon,
} from 'lucide-react';

interface AdminPageContentEditorProps {
  content: SiteContent;
  onChange: (content: SiteContent) => void;
  onSave: (directContent?: SiteContent) => Promise<void>;
  isSaving: boolean;
}

type PageSectionTab = 'bespoke' | 'home' | 'about' | 'contact_faqs';

export const AdminPageContentEditor: React.FC<AdminPageContentEditorProps> = ({
  content,
  onChange,
  onSave,
  isSaving,
}) => {
  const [activeSection, setActiveSection] = useState<PageSectionTab>('bespoke');

  const handleTriggerSave = () => {
    onSave(content);
  };

  const handleUploadImage = (imageDataUrl: string) => uploadSiteImage(imageDataUrl, 'admin');

  // Bespoke Fabric Modal / Inline State
  const [editingFabricIndex, setEditingFabricIndex] = useState<number | null>(null);
  const [fabricForm, setFabricForm] = useState<BespokeFabricTier>({
    id: '',
    name: '',
    desc: '',
    priceOffset: 6500,
    img: '',
    drapeBadge: 'Crisp & Sheer',
  });
  const [isAddingFabric, setIsAddingFabric] = useState(false);

  // Bespoke Showcase Lookbook State
  const [editingShowcaseIndex, setEditingShowcaseIndex] = useState<number | null>(null);
  const [showcaseForm, setShowcaseForm] = useState<BespokeShowcaseItem>({
    id: '',
    title: '',
    caption: '',
    image_url: '',
  });
  const [isAddingShowcase, setIsAddingShowcase] = useState(false);

  // New item inputs
  const [newTechnique, setNewTechnique] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newTrim, setNewTrim] = useState('');

  // FAQ Modal / Inline State
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);
  const [faqForm, setFaqForm] = useState<FaqItem>({
    id: '',
    q: '',
    a: '',
  });
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  // Bespoke Dupatta Banners State
  const [editingBannerIndex, setEditingBannerIndex] = useState<number | null>(null);
  const [bannerForm, setBannerForm] = useState<BespokeDupattaBanner>({
    id: '',
    title: '',
    subtitle: '',
    badge: 'Curated Dupatta Style',
    image_url: '',
    cta_text: 'Customize This Style',
    price_hint: 'Starting from Rs. 6,500',
    fabric_preset: '',
    technique_preset: '',
    color_preset: '',
  });
  const [isAddingBanner, setIsAddingBanner] = useState(false);

  const fabrics = content.bespoke_fabrics || [];
  const techniques = content.bespoke_techniques || [];
  const colors = content.bespoke_colors || [];
  const sizes = content.bespoke_sizes || [];
  const trims = content.bespoke_trims || [];
  const faqs = content.faqs || [];
  const showcaseItems = content.bespoke_showcase_images || [];
  const banners = content.bespoke_banners || INITIAL_BESPOKE_BANNERS;

  // Banner Handlers
  const handleStartAddBanner = () => {
    setBannerForm({
      id: `banner_${Date.now()}`,
      title: '',
      subtitle: '',
      badge: 'Royal Heirloom Style',
      image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      cta_text: 'Customize This Style',
      price_hint: 'Starting from Rs. 6,500',
      fabric_preset: 'Pure Korean Organza',
      technique_preset: 'Hand-Painted Botanical Florals & Roses',
      color_preset: 'Gulabi Blush Pink',
    });
    setIsAddingBanner(true);
    setEditingBannerIndex(null);
  };

  const handleStartEditBanner = (index: number) => {
    setEditingBannerIndex(index);
    setBannerForm({ ...banners[index] });
    setIsAddingBanner(false);
  };

  const handleSaveBanner = () => {
    if (!bannerForm.title.trim()) return;
    const updated = [...banners];
    if (editingBannerIndex !== null) {
      updated[editingBannerIndex] = bannerForm;
    } else {
      updated.push({ ...bannerForm, id: bannerForm.id || `banner_${Date.now()}` });
    }
    onChange({ ...content, bespoke_banners: updated });
    setIsAddingBanner(false);
    setEditingBannerIndex(null);
  };

  const handleDeleteBanner = (index: number) => {
    const updated = banners.filter((_, i) => i !== index);
    onChange({ ...content, bespoke_banners: updated });
    if (editingBannerIndex === index) {
      setEditingBannerIndex(null);
      setIsAddingBanner(false);
    }
  };

  // Fabric Handlers
  const handleStartAddFabric = () => {
    setFabricForm({
      id: `fab_${Date.now()}`,
      name: '',
      desc: '',
      priceOffset: 6500,
      img: '',
      drapeBadge: 'Crisp & Sheer',
    });
    setIsAddingFabric(true);
    setEditingFabricIndex(null);
  };

  const handleStartEditFabric = (index: number) => {
    setEditingFabricIndex(index);
    setFabricForm({ ...fabrics[index] });
    setIsAddingFabric(false);
  };

  const handleSaveFabric = () => {
    if (!fabricForm.name.trim()) return;
    const updated = [...fabrics];
    if (editingFabricIndex !== null) {
      updated[editingFabricIndex] = fabricForm;
    } else {
      updated.push({ ...fabricForm, id: fabricForm.id || `fab_${Date.now()}` });
    }
    onChange({ ...content, bespoke_fabrics: updated });
    setIsAddingFabric(false);
    setEditingFabricIndex(null);
  };

  const handleDeleteFabric = (index: number) => {
    const updated = fabrics.filter((_, i) => i !== index);
    onChange({ ...content, bespoke_fabrics: updated });
    if (editingFabricIndex === index) {
      setEditingFabricIndex(null);
      setIsAddingFabric(false);
    }
  };

  // Bespoke Showcase Handlers
  const handleStartAddShowcase = () => {
    setShowcaseForm({
      id: `showcase_${Date.now()}`,
      title: '',
      caption: '',
      image_url: '',
    });
    setIsAddingShowcase(true);
    setEditingShowcaseIndex(null);
  };

  const handleStartEditShowcase = (index: number) => {
    setEditingShowcaseIndex(index);
    setShowcaseForm({ ...showcaseItems[index] });
    setIsAddingShowcase(false);
  };

  const handleSaveShowcase = () => {
    if (!showcaseForm.title.trim() && !showcaseForm.image_url.trim()) return;
    const updated = [...showcaseItems];
    if (editingShowcaseIndex !== null) {
      updated[editingShowcaseIndex] = showcaseForm;
    } else {
      updated.push({ ...showcaseForm, id: showcaseForm.id || `showcase_${Date.now()}` });
    }
    onChange({ ...content, bespoke_showcase_images: updated });
    setIsAddingShowcase(false);
    setEditingShowcaseIndex(null);
  };

  const handleDeleteShowcase = (index: number) => {
    const updated = showcaseItems.filter((_, i) => i !== index);
    onChange({ ...content, bespoke_showcase_images: updated });
    if (editingShowcaseIndex === index) {
      setEditingShowcaseIndex(null);
      setIsAddingShowcase(false);
    }
  };

  // Technique Handlers
  const handleAddTechnique = () => {
    if (!newTechnique.trim()) return;
    onChange({
      ...content,
      bespoke_techniques: [...techniques, newTechnique.trim()],
    });
    setNewTechnique('');
  };

  const handleDeleteTechnique = (index: number) => {
    onChange({
      ...content,
      bespoke_techniques: techniques.filter((_, i) => i !== index),
    });
  };

  // Color Handlers
  const handleAddColor = () => {
    if (!newColor.trim()) return;
    onChange({
      ...content,
      bespoke_colors: [...colors, newColor.trim()],
    });
    setNewColor('');
  };

  const handleDeleteColor = (index: number) => {
    onChange({
      ...content,
      bespoke_colors: colors.filter((_, i) => i !== index),
    });
  };

  // Size Handlers
  const handleAddSize = () => {
    if (!newSize.trim()) return;
    onChange({
      ...content,
      bespoke_sizes: [...sizes, newSize.trim()],
    });
    setNewSize('');
  };

  const handleDeleteSize = (index: number) => {
    onChange({
      ...content,
      bespoke_sizes: sizes.filter((_, i) => i !== index),
    });
  };

  // Trim Handlers
  const handleAddTrim = () => {
    if (!newTrim.trim()) return;
    onChange({
      ...content,
      bespoke_trims: [...trims, newTrim.trim()],
    });
    setNewTrim('');
  };

  const handleDeleteTrim = (index: number) => {
    onChange({
      ...content,
      bespoke_trims: trims.filter((_, i) => i !== index),
    });
  };

  // FAQ Handlers
  const handleStartAddFaq = () => {
    setFaqForm({
      id: `faq_${Date.now()}`,
      q: '',
      a: '',
    });
    setIsAddingFaq(true);
    setEditingFaqIndex(null);
  };

  const handleStartEditFaq = (index: number) => {
    setEditingFaqIndex(index);
    setFaqForm({ ...faqs[index] });
    setIsAddingFaq(false);
  };

  const handleSaveFaq = () => {
    if (!faqForm.q.trim() || !faqForm.a.trim()) return;
    const updated = [...faqs];
    if (editingFaqIndex !== null) {
      updated[editingFaqIndex] = faqForm;
    } else {
      updated.push({ ...faqForm, id: faqForm.id || `faq_${Date.now()}` });
    }
    onChange({ ...content, faqs: updated });
    setIsAddingFaq(false);
    setEditingFaqIndex(null);
  };

  const handleDeleteFaq = (index: number) => {
    onChange({
      ...content,
      faqs: faqs.filter((_, i) => i !== index),
    });
    if (editingFaqIndex === index) {
      setEditingFaqIndex(null);
      setIsAddingFaq(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Section Navigation */}
      <div className="bg-white p-4 rounded-3xl border border-[#FCE7EB] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveSection('bespoke')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold transition-all ${
              activeSection === 'bespoke'
                ? 'bg-[#BE185D] text-white shadow-xs'
                : 'bg-[#FFF8F9] text-[#831843] hover:bg-[#FFF0F3]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bespoke Customizer Page</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold transition-all ${
              activeSection === 'home'
                ? 'bg-[#BE185D] text-white shadow-xs'
                : 'bg-[#FFF8F9] text-[#831843] hover:bg-[#FFF0F3]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Page & Features</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('about')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold transition-all ${
              activeSection === 'about'
                ? 'bg-[#BE185D] text-white shadow-xs'
                : 'bg-[#FFF8F9] text-[#831843] hover:bg-[#FFF0F3]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>About Artisan Story</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('contact_faqs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold transition-all ${
              activeSection === 'contact_faqs'
                ? 'bg-[#BE185D] text-white shadow-xs'
                : 'bg-[#FFF8F9] text-[#831843] hover:bg-[#FFF0F3]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Contact & FAQs</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleTriggerSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#831843] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving Changes...' : 'Save All Page Edits'}</span>
        </button>
      </div>

      {/* 1. BESPOKE CUSTOMIZER PAGE EDITOR (Image-Free & Fast) */}
      {activeSection === 'bespoke' && (
        <div className="space-y-8">
          
          {/* Quick Save Alert Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#FFF0F3] border border-[#F3C5D4] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 text-xs text-[#831843]">
              <Sparkles className="w-5 h-5 text-[#BE185D] shrink-0" />
              <div>
                <span className="font-bold block text-sm">Bespoke Customizer Page Settings</span>
                <span className="text-[#7A5A62]">All images removed for lightweight, instant loading. Edit text, fabrics, colors, and options below.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTriggerSave}
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#BE185D] text-white font-bold text-xs shadow-md hover:bg-[#831843] transition-all cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Bespoke Page Settings'}</span>
            </button>
          </div>

          {/* Header Info & Headings */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-[#831843] font-serif-luxury">
              <Sparkles className="w-4 h-4 text-[#BE185D]" />
              <span>Bespoke Page Top Headers & Intro Story</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#831843] mb-1">Top Badge Label</label>
                <input
                  type="text"
                  value={content.bespoke_badge || ''}
                  onChange={(e) => onChange({ ...content, bespoke_badge: e.target.value })}
                  placeholder="e.g. Sania's Custom Atelier"
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#831843] mb-1">Main Heading (H1)</label>
                <input
                  type="text"
                  value={content.bespoke_title || ''}
                  onChange={(e) => onChange({ ...content, bespoke_title: e.target.value })}
                  placeholder="e.g. Create a Custom Dupatta Just For You"
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#831843] mb-1">Sub-heading Story</label>
                <textarea
                  rows={2}
                  value={content.bespoke_subtitle || ''}
                  onChange={(e) => onChange({ ...content, bespoke_subtitle: e.target.value })}
                  placeholder="Introductory text describing the bespoke process..."
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#831843] mb-1">Form Card Heading</label>
                <input
                  type="text"
                  value={content.bespoke_form_heading || ''}
                  onChange={(e) => onChange({ ...content, bespoke_form_heading: e.target.value })}
                  placeholder="e.g. Build Your Custom Piece & Order on WhatsApp"
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#831843] mb-1">Form Card Subheading</label>
                <input
                  type="text"
                  value={content.bespoke_form_subheading || ''}
                  onChange={(e) => onChange({ ...content, bespoke_form_subheading: e.target.value })}
                  placeholder="e.g. Fill in your specifications below..."
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white"
                />
              </div>

              <div className="sm:col-span-2 bg-[#FFF8F9] p-4 rounded-2xl border border-[#FCE7EB]">
                <ImageUploader
                  uploadImage={handleUploadImage}
                  label="Bespoke Hero Image"
                  description="Upload or paste the featured image shown on the bespoke custom page"
                  value={content.bespoke_hero_image_url || ''}
                  onChange={(url) => onChange({ ...content, bespoke_hero_image_url: url as string })}
                  aspectRatio="landscape"
                />
              </div>
            </div>
          </div>

          {/* 4 Process Steps (Text Content Only) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h4 className="font-serif-luxury text-base font-bold text-[#831843] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#BE185D]" />
                <span>4-Step Process Guide Cards (Text & Philosophy)</span>
              </h4>
              <span className="text-[11px] text-[#7A5A62]">Displayed in the 4 guide cards on the Bespoke page</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB] space-y-3">
                <span className="font-bold text-[#BE185D] block text-xs">Step 01</span>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Title</label>
                  <input
                    type="text"
                    value={content.bespoke_step1_title || ''}
                    onChange={(e) => onChange({ ...content, bespoke_step1_title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Description</label>
                  <textarea
                    rows={3}
                    value={content.bespoke_step1_desc || ''}
                    onChange={(e) => onChange({ ...content, bespoke_step1_desc: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <ImageUploader
                  uploadImage={handleUploadImage}
                  label="Step 1 Image"
                  value={content.bespoke_step1_img || ''}
                  onChange={(url) => onChange({ ...content, bespoke_step1_img: url as string })}
                  aspectRatio="landscape"
                />
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB] space-y-3">
                <span className="font-bold text-[#BE185D] block text-xs">Step 02</span>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Title</label>
                  <input
                    type="text"
                    value={content.bespoke_step2_title || ''}
                    onChange={(e) => onChange({ ...content, bespoke_step2_title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Description</label>
                  <textarea
                    rows={3}
                    value={content.bespoke_step2_desc || ''}
                    onChange={(e) => onChange({ ...content, bespoke_step2_desc: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <ImageUploader
                  uploadImage={handleUploadImage}
                  label="Step 2 Image"
                  value={content.bespoke_step2_img || ''}
                  onChange={(url) => onChange({ ...content, bespoke_step2_img: url as string })}
                  aspectRatio="landscape"
                />
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB] space-y-3">
                <span className="font-bold text-[#BE185D] block text-xs">Step 03</span>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Title</label>
                  <input
                    type="text"
                    value={content.bespoke_step3_title || ''}
                    onChange={(e) => onChange({ ...content, bespoke_step3_title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Description</label>
                  <textarea
                    rows={3}
                    value={content.bespoke_step3_desc || ''}
                    onChange={(e) => onChange({ ...content, bespoke_step3_desc: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <ImageUploader
                  uploadImage={handleUploadImage}
                  label="Step 3 Image"
                  value={content.bespoke_step3_img || ''}
                  onChange={(url) => onChange({ ...content, bespoke_step3_img: url as string })}
                  aspectRatio="landscape"
                />
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB] space-y-3">
                <span className="font-bold text-[#BE185D] block text-xs">Step 04</span>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Title</label>
                  <input
                    type="text"
                    value={content.bespoke_step4_title || ''}
                    onChange={(e) => onChange({ ...content, bespoke_step4_title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Description</label>
                  <textarea
                    rows={3}
                    value={content.bespoke_step4_desc || ''}
                    onChange={(e) => onChange({ ...content, bespoke_step4_desc: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <ImageUploader
                  uploadImage={handleUploadImage}
                  label="Step 4 Image"
                  value={content.bespoke_step4_img || ''}
                  onChange={(url) => onChange({ ...content, bespoke_step4_img: url as string })}
                  aspectRatio="landscape"
                />
              </div>
            </div>
          </div>

          {/* Fabric Tiers Manager (100% Image-Free, Super Lightweight) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-serif-luxury text-lg font-bold text-[#831843] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#BE185D]" />
                  <span>Base Fabric Options ({fabrics.length})</span>
                </h4>
                <p className="text-xs text-[#7A5A62]">
                  Add, edit, or remove base fabric options shown in Step 1 of the Customizer.
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartAddFabric}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#BE185D] text-white text-xs font-bold shadow-xs hover:bg-[#831843] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Fabric</span>
              </button>
            </div>

            {/* Inline Fabric Form (Add or Edit) */}
            {(isAddingFabric || editingFabricIndex !== null) && (
              <div className="p-5 rounded-2xl bg-[#FFF0F3] border-2 border-[#BE185D]/30 space-y-4 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-[#831843] text-sm">
                    {editingFabricIndex !== null ? `Edit Fabric: ${fabricForm.name}` : 'Create New Base Fabric Option'}
                  </h5>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingFabric(false);
                      setEditingFabricIndex(null);
                    }}
                    className="p-1 rounded-full text-[#7A5A62] hover:bg-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Fabric Name *</label>
                    <input
                      type="text"
                      required
                      value={fabricForm.name}
                      onChange={(e) => setFabricForm({ ...fabricForm, name: e.target.value })}
                      placeholder="e.g. Pure Korean Organza"
                      className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Drape / Texture Badge</label>
                    <input
                      type="text"
                      value={fabricForm.drapeBadge || ''}
                      onChange={(e) => setFabricForm({ ...fabricForm, drapeBadge: e.target.value })}
                      placeholder="e.g. Crisp & Sheer"
                      className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Base Price Offset (Rs.) *</label>
                    <input
                      type="number"
                      required
                      value={fabricForm.priceOffset}
                      onChange={(e) => setFabricForm({ ...fabricForm, priceOffset: Number(e.target.value) })}
                      placeholder="e.g. 6500"
                      className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-bold text-[#831843] mb-1">Fabric Description *</label>
                    <textarea
                      rows={2}
                      value={fabricForm.desc}
                      onChange={(e) => setFabricForm({ ...fabricForm, desc: e.target.value })}
                      placeholder="e.g. Crisp, featherweight, translucent texture. Ideal for hand-painted botanical roses."
                      className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white"
                    />
                  </div>

                  <div className="sm:col-span-3 bg-white p-3 rounded-2xl border border-[#FCE7EB]">
                    <ImageUploader
                      uploadImage={handleUploadImage}
                      label="Fabric Preview Image"
                      description="Upload or paste the image shown on the fabric option card"
                      value={fabricForm.img || ''}
                      onChange={(url) => setFabricForm({ ...fabricForm, img: url as string })}
                      aspectRatio="landscape"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingFabric(false);
                      setEditingFabricIndex(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-[#FCE7EB] text-[#7A5A62] font-semibold hover:bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveFabric}
                    className="px-6 py-2 rounded-xl bg-[#BE185D] text-white font-bold hover:bg-[#831843] transition-colors cursor-pointer"
                  >
                    {editingFabricIndex !== null ? 'Update Fabric Option' : 'Save Fabric Option'}
                  </button>
                </div>
              </div>
            )}

            {/* Fabrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fabrics.map((f, idx) => (
                <div
                  key={f.id || idx}
                  className="bg-[#FFF8F9] rounded-2xl p-4 border border-[#FCE7EB] flex flex-col justify-between space-y-3 relative group shadow-2xs hover:shadow-md transition-all"
                >
                  {f.img && (
                    <img
                      src={f.img}
                      alt={f.name}
                      className="w-full h-32 rounded-xl object-cover border border-[#FCE7EB]"
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-[#FCE7EB] text-[#831843]">
                      {f.drapeBadge || 'Luxury Fabric'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEditFabric(idx)}
                        className="p-1.5 rounded-lg bg-white text-[#831843] hover:bg-[#FFF0F3] shadow-2xs cursor-pointer"
                        title="Edit Fabric"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFabric(idx)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 shadow-2xs cursor-pointer"
                        title="Delete Fabric"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-serif-luxury font-bold text-sm text-[#3D2C2E]">{f.name}</h5>
                    <p className="text-[11px] text-[#7A5A62] mt-1 line-clamp-3 leading-relaxed">{f.desc}</p>
                  </div>

                  <div className="text-xs font-bold text-[#831843] pt-2 border-t border-[#FCE7EB] flex items-center justify-between">
                    <span>Base Price</span>
                    <span>Rs. {f.priceOffset.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Curated Dupatta Styles Manager */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-serif-luxury text-lg font-bold text-[#831843] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#BE185D]" />
                  <span>Curated Dupatta Styles ({banners.length})</span>
                </h4>
                <p className="text-xs text-[#7A5A62] mt-1">These images and details appear in the bespoke page style carousel.</p>
              </div>
              <button
                type="button"
                onClick={handleStartAddBanner}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#BE185D] text-white text-xs font-bold hover:bg-[#831843]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Style</span>
              </button>
            </div>

            {(isAddingBanner || editingBannerIndex !== null) && (
              <div className="p-5 rounded-2xl bg-[#FFF0F3] border-2 border-[#BE185D]/30 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-[#831843] text-sm">
                    {editingBannerIndex !== null ? `Edit Style: ${bannerForm.title}` : 'Add Curated Style'}
                  </h5>
                  <button
                    type="button"
                    onClick={() => { setIsAddingBanner(false); setEditingBannerIndex(null); }}
                    className="p-1 rounded-full text-[#7A5A62] hover:bg-white"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Style Title *</label>
                    <input type="text" value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Badge</label>
                    <input type="text" value={bannerForm.badge || ''} onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })} className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#831843] mb-1">Subtitle</label>
                    <textarea rows={2} value={bannerForm.subtitle} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white" />
                  </div>
                  <div className="sm:col-span-2 bg-white p-3 rounded-2xl border border-[#FCE7EB]">
                    <ImageUploader
                      uploadImage={handleUploadImage}
                      label="Style Image *"
                      value={bannerForm.image_url}
                      onChange={(url) => setBannerForm({ ...bannerForm, image_url: url as string })}
                      aspectRatio="landscape"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Price Hint</label>
                    <input type="text" value={bannerForm.price_hint || ''} onChange={(e) => setBannerForm({ ...bannerForm, price_hint: e.target.value })} className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Button Text</label>
                    <input type="text" value={bannerForm.cta_text || ''} onChange={(e) => setBannerForm({ ...bannerForm, cta_text: e.target.value })} className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Fabric Preset</label>
                    <input type="text" value={bannerForm.fabric_preset || ''} onChange={(e) => setBannerForm({ ...bannerForm, fabric_preset: e.target.value })} className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Technique Preset</label>
                    <input type="text" value={bannerForm.technique_preset || ''} onChange={(e) => setBannerForm({ ...bannerForm, technique_preset: e.target.value })} className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Color Preset</label>
                    <input type="text" value={bannerForm.color_preset || ''} onChange={(e) => setBannerForm({ ...bannerForm, color_preset: e.target.value })} className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { setIsAddingBanner(false); setEditingBannerIndex(null); }} className="px-4 py-2 rounded-xl border border-[#FCE7EB] text-[#7A5A62] font-semibold hover:bg-white">Cancel</button>
                  <button type="button" onClick={handleSaveBanner} className="px-6 py-2 rounded-xl bg-[#BE185D] text-white font-bold hover:bg-[#831843]">{editingBannerIndex !== null ? 'Update Style' : 'Save Style'}</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {banners.map((banner, idx) => (
                <div key={banner.id || idx} className="bg-[#FFF8F9] rounded-2xl p-3 border border-[#FCE7EB] space-y-3">
                  <img src={banner.image_url} alt={banner.title} className="w-full h-36 rounded-xl object-cover" />
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h5 className="font-serif-luxury font-bold text-sm text-[#3D2C2E] line-clamp-2">{banner.title}</h5>
                      <p className="text-[11px] text-[#7A5A62] mt-1 line-clamp-2">{banner.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => handleStartEditBanner(idx)} className="p-1.5 rounded-lg bg-white text-[#831843] shadow-2xs" title="Edit Style"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => handleDeleteBanner(idx)} className="p-1.5 rounded-lg bg-red-50 text-red-600 shadow-2xs" title="Delete Style"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Techniques, Colors, Sizes, and Trims */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Craft Techniques */}
            <div className="bg-white p-6 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-luxury text-base font-bold text-[#831843] flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-[#BE185D]" />
                  <span>Craft Techniques ({techniques.length})</span>
                </h4>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Handcrafted Gotta Patti..."
                  value={newTechnique}
                  onChange={(e) => setNewTechnique(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnique())}
                  className="flex-1 p-2 rounded-xl border border-[#FCE7EB] text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTechnique}
                  className="px-4 py-2 bg-[#BE185D] text-white rounded-xl text-xs font-bold hover:bg-[#831843]"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {techniques.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF8F9] border border-[#FCE7EB] text-xs"
                  >
                    <span className="font-medium text-[#3D2C2E]">{t}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTechnique(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Colors Palette */}
            <div className="bg-white p-6 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-luxury text-base font-bold text-[#831843] flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#BE185D]" />
                  <span>Curated Color Chips ({colors.length})</span>
                </h4>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Gulabi Blush Pink..."
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                  className="flex-1 p-2 rounded-xl border border-[#FCE7EB] text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-4 py-2 bg-[#BE185D] text-white rounded-xl text-xs font-bold hover:bg-[#831843]"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
                {colors.map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF8F9] border border-[#FCE7EB] text-xs text-[#5C3A42] font-medium"
                  >
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteColor(idx)}
                      className="text-red-400 hover:text-red-600 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Length / Cut Sizes */}
            <div className="bg-white p-6 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-luxury text-base font-bold text-[#831843]">
                  Length / Cut Sizes ({sizes.length})
                </h4>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Standard 2.5 Meters..."
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                  className="flex-1 p-2 rounded-xl border border-[#FCE7EB] text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="px-4 py-2 bg-[#BE185D] text-white rounded-xl text-xs font-bold hover:bg-[#831843]"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {sizes.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF8F9] border border-[#FCE7EB] text-xs"
                  >
                    <span className="font-medium text-[#3D2C2E]">{s}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSize(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Border & Trims */}
            <div className="bg-white p-6 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-luxury text-base font-bold text-[#831843]">
                  Border & Tassels Options ({trims.length})
                </h4>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Four-Sided Golden Kiran Lace..."
                  value={newTrim}
                  onChange={(e) => setNewTrim(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTrim())}
                  className="flex-1 p-2 rounded-xl border border-[#FCE7EB] text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTrim}
                  className="px-4 py-2 bg-[#BE185D] text-white rounded-xl text-xs font-bold hover:bg-[#831843]"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {trims.map((trim, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF8F9] border border-[#FCE7EB] text-xs"
                  >
                    <span className="font-medium text-[#3D2C2E]">{trim}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTrim(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bespoke Showcase Lookbook */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-6">
            <div>
              <h4 className="font-serif-luxury text-lg font-bold text-[#831843] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#BE185D]" />
                <span>Bespoke Masterpieces Lookbook</span>
              </h4>
              <p className="text-xs text-[#7A5A62] mt-1">Edit the lookbook heading and the creations displayed below the customizer.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#831843] mb-1">Lookbook Heading</label>
                <input
                  type="text"
                  value={content.bespoke_showcase_title || ''}
                  onChange={(e) => onChange({ ...content, bespoke_showcase_title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#831843] mb-1">Lookbook Subheading</label>
                <input
                  type="text"
                  value={content.bespoke_showcase_subtitle || ''}
                  onChange={(e) => onChange({ ...content, bespoke_showcase_subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <h5 className="font-bold text-sm text-[#831843]">Lookbook Creations ({showcaseItems.length})</h5>
                <p className="text-xs text-[#7A5A62]">Add, edit, or remove the bespoke gallery cards.</p>
              </div>
              <button
                type="button"
                onClick={handleStartAddShowcase}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#BE185D] text-white text-xs font-bold hover:bg-[#831843]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Creation</span>
              </button>
            </div>

            {(isAddingShowcase || editingShowcaseIndex !== null) && (
              <div className="p-5 rounded-2xl bg-[#FFF0F3] border-2 border-[#BE185D]/30 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-[#831843] text-sm">
                    {editingShowcaseIndex !== null ? `Edit Creation: ${showcaseForm.title}` : 'Add Lookbook Creation'}
                  </h5>
                  <button
                    type="button"
                    onClick={() => { setIsAddingShowcase(false); setEditingShowcaseIndex(null); }}
                    className="p-1 rounded-full text-[#7A5A62] hover:bg-white"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Creation Title *</label>
                    <input
                      type="text"
                      value={showcaseForm.title}
                      onChange={(e) => setShowcaseForm({ ...showcaseForm, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Caption</label>
                    <input
                      type="text"
                      value={showcaseForm.caption || ''}
                      onChange={(e) => setShowcaseForm({ ...showcaseForm, caption: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2 bg-white p-3 rounded-2xl border border-[#FCE7EB]">
                    <ImageUploader
                      uploadImage={handleUploadImage}
                      label="Creation Image *"
                      value={showcaseForm.image_url}
                      onChange={(url) => setShowcaseForm({ ...showcaseForm, image_url: url as string })}
                      aspectRatio="portrait"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsAddingShowcase(false); setEditingShowcaseIndex(null); }}
                    className="px-4 py-2 rounded-xl border border-[#FCE7EB] text-[#7A5A62] font-semibold hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveShowcase}
                    className="px-6 py-2 rounded-xl bg-[#BE185D] text-white font-bold hover:bg-[#831843]"
                  >
                    {editingShowcaseIndex !== null ? 'Update Creation' : 'Save Creation'}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {showcaseItems.map((item, idx) => (
                <div key={item.id || idx} className="bg-[#FFF8F9] rounded-2xl p-3 border border-[#FCE7EB] space-y-3">
                  <img src={item.image_url} alt={item.title} className="w-full h-36 rounded-xl object-cover" />
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h5 className="font-serif-luxury font-bold text-sm text-[#3D2C2E] line-clamp-2">{item.title}</h5>
                      {item.caption && <p className="text-[11px] text-[#7A5A62] mt-1 line-clamp-2">{item.caption}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => handleStartEditShowcase(idx)} className="p-1.5 rounded-lg bg-white text-[#831843] shadow-2xs" title="Edit Creation">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => handleDeleteShowcase(idx)} className="p-1.5 rounded-lg bg-red-50 text-red-600 shadow-2xs" title="Delete Creation">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Bottom Save Bar for Bespoke Customizer */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FFF0F3] via-white to-[#FCE7EB] border-2 border-[#F3C5D4] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-serif-luxury text-lg font-bold text-[#831843] flex items-center gap-2">
                <Save className="w-5 h-5 text-[#BE185D]" />
                <span>Save Bespoke Customizer Settings</span>
              </h4>
              <p className="text-xs text-[#7A5A62] mt-1">
                Persists all custom fabric tiers, color options, craft techniques, and story texts to the database and site immediately.
              </p>
            </div>
            <button
              type="button"
              onClick={handleTriggerSave}
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#831843] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Bespoke Page Settings Now'}</span>
            </button>
          </div>

        </div>
      )}

      {/* 2. HOME PAGE & FEATURES EDITOR */}
      {activeSection === 'home' && (
        <div className="space-y-8">
          
          {/* Hero Content */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
            <h4 className="font-serif-luxury text-lg font-bold text-[#831843] flex items-center gap-2">
              <Home className="w-5 h-5 text-[#BE185D]" />
              <span>Homepage Hero 3D Banner Content</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#831843] mb-1">Hero Pill Badge</label>
                <input
                  type="text"
                  value={content.hero_badge || ''}
                  onChange={(e) => onChange({ ...content, hero_badge: e.target.value })}
                  placeholder="e.g. Boutique Handcrafted Dupattas"
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#831843] mb-1">Banner Title (H1)</label>
                <input
                  type="text"
                  value={content.banner_title || ''}
                  onChange={(e) => onChange({ ...content, banner_title: e.target.value, hero_title: e.target.value })}
                  placeholder="e.g. Handmade Dupattas, Crafted With Love"
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#831843] mb-1">Hero Tagline</label>
                <input
                  type="text"
                  value={content.banner_tagline || ''}
                  onChange={(e) => onChange({ ...content, banner_tagline: e.target.value })}
                  placeholder="e.g. Artisanal Hand-Painted & Embroidered Bespoke Creations by Sania"
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#831843] mb-1">Hero Subtitle Story</label>
                <textarea
                  rows={2}
                  value={content.banner_subtitle || ''}
                  onChange={(e) => onChange({ ...content, banner_subtitle: e.target.value, hero_subtitle: e.target.value })}
                  placeholder="e.g. Every brushstroke tells a story..."
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#831843] mb-1">Top Announcement Ribbon Text</label>
                <input
                  type="text"
                  value={content.announcement_text || ''}
                  onChange={(e) => onChange({ ...content, announcement_text: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div className="sm:col-span-2 bg-[#FFF8F9] p-4 rounded-2xl border border-[#FCE7EB]">
                <ImageUploader
                  uploadImage={handleUploadImage}
                  label="Hero 3D Drape Photo"
                  description="Upload or paste image URL showing luxury drape for homepage hero"
                  value={content.hero_image_url || ''}
                  onChange={(url) => onChange({ ...content, hero_image_url: url as string })}
                />
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-6">
            <div>
              <h4 className="font-serif-luxury text-lg font-bold text-[#831843]">
                "Why Choose Brush n Fabric" Section
              </h4>
              <p className="text-xs text-[#7A5A62]">
                Configure the artisanal craftsmanship feature cards on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#831843] mb-1">Section Badge</label>
                <input
                  type="text"
                  value={content.home_why_badge || ''}
                  onChange={(e) => onChange({ ...content, home_why_badge: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#831843] mb-1">Section Heading</label>
                <input
                  type="text"
                  value={content.home_why_title || ''}
                  onChange={(e) => onChange({ ...content, home_why_title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#831843] mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={content.home_why_subtitle || ''}
                  onChange={(e) => onChange({ ...content, home_why_subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>
            </div>

            {/* 4 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Feature 1 */}
              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB] space-y-2">
                <span className="font-bold text-[#BE185D]">Feature 1</span>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Title</label>
                  <input
                    type="text"
                    value={content.home_feature1_title || ''}
                    onChange={(e) => onChange({ ...content, home_feature1_title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Description</label>
                  <textarea
                    rows={2}
                    value={content.home_feature1_desc || ''}
                    onChange={(e) => onChange({ ...content, home_feature1_desc: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB] space-y-2">
                <span className="font-bold text-[#BE185D]">Feature 2</span>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Title</label>
                  <input
                    type="text"
                    value={content.home_feature2_title || ''}
                    onChange={(e) => onChange({ ...content, home_feature2_title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Description</label>
                  <textarea
                    rows={2}
                    value={content.home_feature2_desc || ''}
                    onChange={(e) => onChange({ ...content, home_feature2_desc: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB] space-y-2">
                <span className="font-bold text-[#BE185D]">Feature 3</span>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Title</label>
                  <input
                    type="text"
                    value={content.home_feature3_title || ''}
                    onChange={(e) => onChange({ ...content, home_feature3_title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Description</label>
                  <textarea
                    rows={2}
                    value={content.home_feature3_desc || ''}
                    onChange={(e) => onChange({ ...content, home_feature3_desc: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB] space-y-2">
                <span className="font-bold text-[#BE185D]">Feature 4</span>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Title</label>
                  <input
                    type="text"
                    value={content.home_feature4_title || ''}
                    onChange={(e) => onChange({ ...content, home_feature4_title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Description</label>
                  <textarea
                    rows={2}
                    value={content.home_feature4_desc || ''}
                    onChange={(e) => onChange({ ...content, home_feature4_desc: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. ABOUT PAGE & STORY EDITOR */}
      {activeSection === 'about' && (
        <div className="space-y-8">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
            <h4 className="font-serif-luxury text-lg font-bold text-[#831843] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#BE185D]" />
              <span>Sania's Story & Artisanal Brand Heritage</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#831843] mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={content.about_badge || ''}
                  onChange={(e) => onChange({ ...content, about_badge: e.target.value })}
                  placeholder="e.g. The Artisan's Journey"
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#831843] mb-1">Page Headline (H1)</label>
                <input
                  type="text"
                  value={content.about_title || ''}
                  onChange={(e) => onChange({ ...content, about_title: e.target.value })}
                  placeholder="e.g. The Art of Handmade Drapes"
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#831843] mb-1">Story Narrative (Use double newline for new paragraphs)</label>
                <textarea
                  rows={5}
                  value={content.about_story || ''}
                  onChange={(e) => onChange({ ...content, about_story: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#831843] mb-1">Highlight Bullet 1</label>
                <input
                  type="text"
                  value={content.about_highlight_1 || ''}
                  onChange={(e) => onChange({ ...content, about_highlight_1: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#831843] mb-1">Highlight Bullet 2</label>
                <input
                  type="text"
                  value={content.about_highlight_2 || ''}
                  onChange={(e) => onChange({ ...content, about_highlight_2: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#831843] mb-1">Highlight Bullet 3</label>
                <input
                  type="text"
                  value={content.about_highlight_3 || ''}
                  onChange={(e) => onChange({ ...content, about_highlight_3: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div className="sm:col-span-2 bg-[#FFF8F9] p-4 rounded-2xl border border-[#FCE7EB] space-y-3">
                <ImageUploader
                  uploadImage={handleUploadImage}
                  label="Studio Portrait Photo"
                  description="Upload high-res portrait of Sania or atelier workshop"
                  value={content.about_image_url || ''}
                  onChange={(url) => onChange({ ...content, about_image_url: url as string })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Overlay Caption Title</label>
                    <input
                      type="text"
                      value={content.about_studio_caption_title || ''}
                      onChange={(e) => onChange({ ...content, about_studio_caption_title: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#831843] mb-1">Overlay Caption Subtitle</label>
                    <input
                      type="text"
                      value={content.about_studio_caption_subtitle || ''}
                      onChange={(e) => onChange({ ...content, about_studio_caption_subtitle: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-6">
            <div>
              <h4 className="font-serif-luxury text-lg font-bold text-[#831843]">
                Studio Core Values Section
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#831843] mb-1">Values Header Title</label>
                <input
                  type="text"
                  value={content.about_values_title || ''}
                  onChange={(e) => onChange({ ...content, about_values_title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#831843] mb-1">Values Header Subtitle</label>
                <input
                  type="text"
                  value={content.about_values_subtitle || ''}
                  onChange={(e) => onChange({ ...content, about_values_subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Value 1 */}
              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB] space-y-2">
                <span className="font-bold text-[#BE185D]">Value 1</span>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Title</label>
                  <input
                    type="text"
                    value={content.about_value1_title || ''}
                    onChange={(e) => onChange({ ...content, about_value1_title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Description</label>
                  <textarea
                    rows={2}
                    value={content.about_value1_desc || ''}
                    onChange={(e) => onChange({ ...content, about_value1_desc: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
              </div>

              {/* Value 2 */}
              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB] space-y-2">
                <span className="font-bold text-[#BE185D]">Value 2</span>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Title</label>
                  <input
                    type="text"
                    value={content.about_value2_title || ''}
                    onChange={(e) => onChange({ ...content, about_value2_title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Description</label>
                  <textarea
                    rows={2}
                    value={content.about_value2_desc || ''}
                    onChange={(e) => onChange({ ...content, about_value2_desc: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
              </div>

              {/* Value 3 */}
              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB] space-y-2">
                <span className="font-bold text-[#BE185D]">Value 3</span>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Title</label>
                  <input
                    type="text"
                    value={content.about_value3_title || ''}
                    onChange={(e) => onChange({ ...content, about_value3_title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#9D7983]">Description</label>
                  <textarea
                    rows={2}
                    value={content.about_value3_desc || ''}
                    onChange={(e) => onChange({ ...content, about_value3_desc: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#FCE7EB] bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 4. CONTACT & FAQS EDITOR */}
      {activeSection === 'contact_faqs' && (
        <div className="space-y-8">
          
          {/* Contact Header */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-4">
            <h4 className="font-serif-luxury text-lg font-bold text-[#831843] flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#BE185D]" />
              <span>Contact Page Top Headers</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#831843] mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={content.contact_badge || ''}
                  onChange={(e) => onChange({ ...content, contact_badge: e.target.value })}
                  placeholder="e.g. Get in Touch With Sania"
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#831843] mb-1">Page Title (H1)</label>
                <input
                  type="text"
                  value={content.contact_title || ''}
                  onChange={(e) => onChange({ ...content, contact_title: e.target.value })}
                  placeholder="e.g. We’d Love to Hear From You"
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#831843] mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  value={content.contact_subtitle || ''}
                  onChange={(e) => onChange({ ...content, contact_subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#831843] mb-1">WhatsApp Order Desk Card Title</label>
                <input
                  type="text"
                  value={content.contact_desk_title || ''}
                  onChange={(e) => onChange({ ...content, contact_desk_title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#831843] mb-1">WhatsApp Order Desk Subtitle</label>
                <input
                  type="text"
                  value={content.contact_desk_desc || ''}
                  onChange={(e) => onChange({ ...content, contact_desk_desc: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#FCE7EB]"
                />
              </div>
            </div>
          </div>

          {/* FAQs List Manager */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FCE7EB] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-serif-luxury text-lg font-bold text-[#831843] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#BE185D]" />
                  <span>Frequently Asked Questions ({faqs.length})</span>
                </h4>
                <p className="text-xs text-[#7A5A62]">
                  Add, edit, or remove customer FAQs shown on the Contact page.
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartAddFaq}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#BE185D] text-white text-xs font-bold shadow-xs hover:bg-[#831843] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New FAQ</span>
              </button>
            </div>

            {/* Inline FAQ Form */}
            {(isAddingFaq || editingFaqIndex !== null) && (
              <div className="p-5 rounded-2xl bg-[#FFF0F3] border-2 border-[#BE185D]/30 space-y-3 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-[#831843] text-sm">
                    {editingFaqIndex !== null ? 'Edit FAQ Item' : 'Add New FAQ Item'}
                  </h5>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingFaq(false);
                      setEditingFaqIndex(null);
                    }}
                    className="p-1 rounded-full text-[#7A5A62] hover:bg-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-[#831843] mb-1">Question (Q) *</label>
                  <input
                    type="text"
                    required
                    value={faqForm.q}
                    onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })}
                    placeholder="e.g. How long does a customized handmade dupatta take to craft?"
                    className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#831843] mb-1">Answer (A) *</label>
                  <textarea
                    rows={3}
                    required
                    value={faqForm.a}
                    onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })}
                    placeholder="e.g. Standard hand-painted dupattas take approximately 4–7 business days..."
                    className="w-full p-2.5 rounded-xl border border-[#FCE7EB] bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingFaq(false);
                      setEditingFaqIndex(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-[#FCE7EB] text-[#7A5A62] font-semibold hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveFaq}
                    className="px-6 py-2 rounded-xl bg-[#BE185D] text-white font-bold hover:bg-[#831843] transition-colors"
                  >
                    {editingFaqIndex !== null ? 'Update FAQ' : 'Save FAQ'}
                  </button>
                </div>
              </div>
            )}

            {/* FAQs List */}
            <div className="space-y-3">
              {faqs.map((f, idx) => (
                <div
                  key={f.id || idx}
                  className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#FCE7EB] flex items-start justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="font-serif-luxury font-bold text-sm text-[#3D2C2E] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#BE185D] text-white text-[10px] flex items-center justify-center shrink-0">
                        Q
                      </span>
                      <span>{f.q}</span>
                    </div>
                    <p className="text-xs text-[#7A5A62] pl-7 leading-relaxed">{f.a}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleStartEditFaq(idx)}
                      className="p-1.5 text-[#831843] hover:bg-white rounded-lg transition-colors"
                      title="Edit FAQ"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(idx)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
