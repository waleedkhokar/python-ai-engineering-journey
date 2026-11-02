export interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  original_price?: number;
  description: string;
  full_description?: string;
  images: string[];
  is_customizable: boolean;
  category_id: string;
  fabric_type: string;
  work_type: string; // e.g. 'Hand-Painted Floral', 'Gotta Patti Needlework', 'Resham Embroidery', 'Block & Brush', 'Zari Border'
  available_colors: string[];
  stock_status?: 'in_stock' | 'made_to_order' | 'limited_edition';
  occasion?: 'Bridal' | 'Festive' | 'Partywear' | 'Casual' | 'Luxury' | string;
  dimensions?: string; // e.g. '2.5 Meters (Standard)'
  care_instructions?: string;
  is_featured?: boolean;
  in_stock?: boolean;
  rating?: number;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  order_index?: number;
}

export interface CustomizationRequest {
  id: string;
  product_id?: string | null;
  product_name?: string;
  customer_name: string;
  customer_contact: string; // phone / WhatsApp
  customer_email?: string;
  color_choice: string;
  fabric_choice: string;
  size_choice: string; // e.g. 'Standard 2.5m', '3.0m Grand Shawl', 'Custom Length'
  tassels_option?: string;
  notes: string;
  reference_image_url?: string;
  estimated_price?: number;
  status: 'new' | 'contacted' | 'in_production' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  whatsapp_sent: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  caption: string;
  category_tag: string;
  order_index?: number;
  created_at?: string;
}

export interface BespokeFabricTier {
  id?: string;
  name: string;
  desc: string;
  priceOffset: number;
  img?: string;
  drapeBadge?: string;
}

export interface BespokeDupattaBanner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  image_url: string;
  cta_text?: string;
  price_hint?: string;
  fabric_preset?: string;
  technique_preset?: string;
  color_preset?: string;
}

export interface BespokeShowcaseItem {
  id: string;
  title: string;
  image_url: string;
  caption?: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface SiteContent {
  // Global & Announcement
  announcement_text: string;
  whatsapp_number: string;
  display_whatsapp: string;
  email: string;
  instagram_url: string;
  tiktok_url: string;
  studio_location: string;

  // Home Page & Hero
  banner_title?: string;
  banner_tagline?: string;
  banner_subtitle?: string;
  hero_badge?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_url?: string;

  // Home Page "Why Choose Us" / Features
  home_why_badge?: string;
  home_why_title?: string;
  home_why_subtitle?: string;
  home_feature1_title?: string;
  home_feature1_desc?: string;
  home_feature2_title?: string;
  home_feature2_desc?: string;
  home_feature3_title?: string;
  home_feature3_desc?: string;
  home_feature4_title?: string;
  home_feature4_desc?: string;

  // Bespoke Custom Page
  bespoke_badge?: string;
  bespoke_title?: string;
  bespoke_subtitle?: string;
  bespoke_hero_image_url?: string;
  bespoke_form_heading?: string;
  bespoke_form_subheading?: string;
  bespoke_step1_title?: string;
  bespoke_step1_desc?: string;
  bespoke_step1_img?: string;
  bespoke_step2_title?: string;
  bespoke_step2_desc?: string;
  bespoke_step2_img?: string;
  bespoke_step3_title?: string;
  bespoke_step3_desc?: string;
  bespoke_step3_img?: string;
  bespoke_step4_title?: string;
  bespoke_step4_desc?: string;
  bespoke_step4_img?: string;
  bespoke_fabrics?: BespokeFabricTier[];
  bespoke_techniques?: string[];
  bespoke_colors?: string[];
  bespoke_sizes?: string[];
  bespoke_trims?: string[];
  bespoke_showcase_title?: string;
  bespoke_showcase_subtitle?: string;
  bespoke_showcase_images?: BespokeShowcaseItem[];
  bespoke_banners?: BespokeDupattaBanner[];

  // About Page
  about_badge?: string;
  about_title?: string;
  about_story?: string;
  about_highlight_1?: string;
  about_highlight_2?: string;
  about_highlight_3?: string;
  about_image_url?: string;
  about_studio_caption_title?: string;
  about_studio_caption_subtitle?: string;
  about_values_title?: string;
  about_values_subtitle?: string;
  about_value1_title?: string;
  about_value1_desc?: string;
  about_value2_title?: string;
  about_value2_desc?: string;
  about_value3_title?: string;
  about_value3_desc?: string;

  // Contact Page & FAQs
  contact_badge?: string;
  contact_title?: string;
  contact_subtitle?: string;
  contact_desk_title?: string;
  contact_desk_desc?: string;
  faqs?: FaqItem[];
}

export interface ContactMessage {
  id: string;
  name: string;
  contact: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: 'unread' | 'read' | 'replied';
}

export interface AdminCredentials {
  email: string;
  password: string;
  updated_at?: string;
}

export type PageView = 'home' | 'shop' | 'product' | 'product-detail' | 'customization' | 'gallery' | 'about' | 'contact' | 'admin';
