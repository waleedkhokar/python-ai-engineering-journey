import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Category, CustomizationRequest, GalleryItem, SiteContent, ContactMessage, AdminCredentials } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_GALLERY,
  INITIAL_SITE_CONTENT,
  INITIAL_CUSTOMIZATION_REQUESTS,
} from '../data/seedData';

// Supabase environment keys
const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
);

export let supabase: SupabaseClient | null = null;
const SITE_IMAGES_BUCKET = 'site-images';

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
  }
}

export async function uploadSiteImage(imageDataUrl: string, folder = 'bespoke'): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before uploading images.');
  }
  const response = await fetch(imageDataUrl);
  const blob = await response.blob();
  const path = `${folder}/${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from(SITE_IMAGES_BUCKET).upload(path, blob, {
    contentType: 'image/jpeg',
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
  const { data } = supabase.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(path);
  if (!data.publicUrl) throw new Error('Image uploaded but no public URL was returned.');
  return data.publicUrl;
}

function getSiteImagePaths(content: SiteContent): string[] {
  const urls: string[] = [];
  const collect = (value: unknown) => {
    if (typeof value === 'string' && value.includes(`/storage/v1/object/public/${SITE_IMAGES_BUCKET}/`)) urls.push(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  collect(content);
  return urls;
}

async function deleteReplacedSiteImages(previous: SiteContent | null, current: SiteContent) {
  if (!supabase || !previous) return;
  const currentUrls = new Set(getSiteImagePaths(current));
  const oldPaths = getSiteImagePaths(previous)
    .filter((url) => !currentUrls.has(url))
    .map((url) => url.split(`/storage/v1/object/public/${SITE_IMAGES_BUCKET}/`)[1])
    .filter(Boolean);
  if (oldPaths.length > 0) {
    await supabase.storage.from(SITE_IMAGES_BUCKET).remove(oldPaths);
  }
}

// Local Storage Keys for offline-first resilient mode
const LS_PRODUCTS_KEY = 'bnf_products_v1';
const LS_DELETED_PRODUCTS_KEY = 'bnf_deleted_product_ids_v1';
const LS_CATEGORIES_KEY = 'bnf_categories_v1';
const LS_DELETED_CATEGORIES_KEY = 'bnf_deleted_category_ids_v1';
const LS_GALLERY_KEY = 'bnf_gallery_v1';
const LS_DELETED_GALLERY_KEY = 'bnf_deleted_gallery_ids_v1';
const LS_SITE_CONTENT_KEY = 'bnf_site_content_v1';
const IDB_SITE_CONTENT_DB = 'bnf_site_content_db';
const IDB_SITE_CONTENT_STORE = 'content';

function readIndexedSiteContent(): Promise<Partial<SiteContent>> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve({});
      return;
    }
    const request = indexedDB.open(IDB_SITE_CONTENT_DB, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(IDB_SITE_CONTENT_STORE);
    };
    request.onsuccess = () => {
      const transaction = request.result.transaction(IDB_SITE_CONTENT_STORE, 'readonly');
      const getRequest = transaction.objectStore(IDB_SITE_CONTENT_STORE).get('site_content');
      getRequest.onsuccess = () => resolve((getRequest.result as Partial<SiteContent>) || {});
      getRequest.onerror = () => resolve({});
    };
    request.onerror = () => resolve({});
  });
}

function writeIndexedSiteContent(content: SiteContent): Promise<void> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve();
      return;
    }
    const request = indexedDB.open(IDB_SITE_CONTENT_DB, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(IDB_SITE_CONTENT_STORE);
    };
    request.onsuccess = () => {
      const transaction = request.result.transaction(IDB_SITE_CONTENT_STORE, 'readwrite');
      transaction.objectStore(IDB_SITE_CONTENT_STORE).put(content, 'site_content');
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    };
    request.onerror = () => resolve();
  });
}
const LS_REQUESTS_KEY = 'bnf_custom_requests_v1';
const LS_DELETED_REQUESTS_KEY = 'bnf_deleted_request_ids_v1';
const LS_MESSAGES_KEY = 'bnf_messages_v1';
const LS_ADMIN_SESSION_KEY = 'bnf_admin_logged_in_v1';
const LS_ADMIN_CREDENTIALS_KEY = 'bnf_admin_credentials_v1';
const LS_ADMIN_ACTIVE_EMAIL_KEY = 'bnf_admin_active_email_v1';
export const DEFAULT_ADMIN_EMAIL = 'brushnfabric@gmail.com';
export const DEFAULT_ADMIN_PASSWORD = 'sania123';
const LS_WISHLIST_KEY = 'bnf_wishlist_ids_v1';

function getDeletedSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function addToDeletedSet(key: string, id: string) {
  try {
    const set = getDeletedSet(key);
    set.add(id);
    localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn('Failed to update deleted set:', e);
  }
}

function removeFromDeletedSet(key: string, id: string) {
  try {
    const set = getDeletedSet(key);
    if (set.has(id)) {
      set.delete(id);
      localStorage.setItem(key, JSON.stringify(Array.from(set)));
    }
  } catch (e) {
    console.warn('Failed to remove from deleted set:', e);
  }
}

// Seed initial data if localStorage is empty
function initLocalStorage() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(LS_PRODUCTS_KEY)) {
    localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(LS_CATEGORIES_KEY)) {
    localStorage.setItem(LS_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(LS_GALLERY_KEY)) {
    localStorage.setItem(LS_GALLERY_KEY, JSON.stringify(INITIAL_GALLERY));
  }
  if (!localStorage.getItem(LS_SITE_CONTENT_KEY)) {
    localStorage.setItem(LS_SITE_CONTENT_KEY, JSON.stringify(INITIAL_SITE_CONTENT));
  }
  if (!localStorage.getItem(LS_REQUESTS_KEY)) {
    localStorage.setItem(LS_REQUESTS_KEY, JSON.stringify(INITIAL_CUSTOMIZATION_REQUESTS));
  }
}

initLocalStorage();

// --- PRODUCTS API ---
export async function getProducts(): Promise<Product[]> {
  const deletedSet = getDeletedSet(LS_DELETED_PRODUCTS_KEY);
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return (data as Product[]).filter(p => !deletedSet.has(p.id));
      }
    } catch (e) {
      console.error('Supabase getProducts error:', e);
    }
  }
  // Fallback to local storage
  try {
    const raw = localStorage.getItem(LS_PRODUCTS_KEY);
    const list: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
    return list.filter(p => !deletedSet.has(p.id));
  } catch {
    return INITIAL_PRODUCTS.filter(p => !deletedSet.has(p.id));
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id || p.slug === id) || null;
}

export async function saveProduct(product: Product): Promise<Product> {
  removeFromDeletedSet(LS_DELETED_PRODUCTS_KEY, product.id);
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').upsert(product).select().single();
      if (error) {
        throw new Error(`Product save failed: ${error.message}`);
      }
      if (!data) throw new Error('Product save failed: no product was returned.');
      updateLocalProducts(data as Product);
      return data as Product;
    } catch (e) {
      console.error('Supabase saveProduct error:', e);
      throw e instanceof Error ? e : new Error('Product save failed.');
    }
  }
  updateLocalProducts(product);
  return product;
}

function updateLocalProducts(product: Product) {
  const products = getLocalProducts().filter(p => p.id !== product.id);
  products.unshift(product);
  localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(products));
}

function getLocalProducts(): Product[] {
  const deletedSet = getDeletedSet(LS_DELETED_PRODUCTS_KEY);
  try {
    const raw = localStorage.getItem(LS_PRODUCTS_KEY);
    const list: Product[] = raw ? JSON.parse(raw) : [...INITIAL_PRODUCTS];
    return list.filter(p => !deletedSet.has(p.id));
  } catch {
    return INITIAL_PRODUCTS.filter(p => !deletedSet.has(p.id));
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw new Error(`Product delete failed: ${error.message}`);
    } catch (e) {
      console.error('Supabase deleteProduct error:', e);
      throw e instanceof Error ? e : new Error('Product delete failed.');
    }
  }
  addToDeletedSet(LS_DELETED_PRODUCTS_KEY, id);
  const products = getLocalProducts().filter(p => p.id !== id);
  localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(products));
  return true;
}

// --- CATEGORIES API ---
export async function getCategories(): Promise<Category[]> {
  const deletedSet = getDeletedSet(LS_DELETED_CATEGORIES_KEY);
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('order_index', { ascending: true });
      if (!error && data && data.length > 0) {
        return (data as Category[]).filter(c => !deletedSet.has(c.id));
      }
    } catch (e) {
      console.error('Supabase getCategories error:', e);
    }
  }
  try {
    const raw = localStorage.getItem(LS_CATEGORIES_KEY);
    const list: Category[] = raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
    return list.filter(c => !deletedSet.has(c.id));
  } catch {
    return INITIAL_CATEGORIES.filter(c => !deletedSet.has(c.id));
  }
}

export async function saveCategory(category: Category): Promise<Category> {
  removeFromDeletedSet(LS_DELETED_CATEGORIES_KEY, category.id);
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').upsert(category).select().single();
      if (error) throw new Error(`Collection save failed: ${error.message}`);
      if (!data) throw new Error('Collection save failed: no collection was returned.');
      updateLocalCategory(data as Category);
      return data as Category;
    } catch (e) {
      console.error('Supabase saveCategory error:', e);
      throw e instanceof Error ? e : new Error('Collection save failed.');
    }
  }
  updateLocalCategory(category);
  return category;
}

function updateLocalCategory(category: Category) {
  const cats = getLocalCategories().filter(c => c.id !== category.id);
  cats.push(category);
  localStorage.setItem(LS_CATEGORIES_KEY, JSON.stringify(cats));
}

function getLocalCategories(): Category[] {
  const deletedSet = getDeletedSet(LS_DELETED_CATEGORIES_KEY);
  try {
    const raw = localStorage.getItem(LS_CATEGORIES_KEY);
    const list: Category[] = raw ? JSON.parse(raw) : [...INITIAL_CATEGORIES];
    return list.filter(c => !deletedSet.has(c.id));
  } catch {
    return INITIAL_CATEGORIES.filter(c => !deletedSet.has(c.id));
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw new Error(`Collection delete failed: ${error.message}`);
    } catch (e) {
      console.error('Supabase deleteCategory error:', e);
      throw e instanceof Error ? e : new Error('Collection delete failed.');
    }
  }
  addToDeletedSet(LS_DELETED_CATEGORIES_KEY, id);
  const cats = getLocalCategories().filter(c => c.id !== id);
  localStorage.setItem(LS_CATEGORIES_KEY, JSON.stringify(cats));
  return true;
}

// --- CUSTOMIZATION REQUESTS & ORDER LOG API ---
export async function getCustomizationRequests(): Promise<CustomizationRequest[]> {
  const deletedSet = getDeletedSet(LS_DELETED_REQUESTS_KEY);
  if (supabase) {
    try {
      const { data, error } = await supabase.from('customization_requests').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return (data as CustomizationRequest[]).filter(r => !deletedSet.has(r.id));
      }
    } catch (e) {
      console.error('Supabase getRequests error:', e);
    }
  }
  try {
    const raw = localStorage.getItem(LS_REQUESTS_KEY);
    const list: CustomizationRequest[] = raw ? JSON.parse(raw) : INITIAL_CUSTOMIZATION_REQUESTS;
    return list.filter(r => !deletedSet.has(r.id));
  } catch {
    return INITIAL_CUSTOMIZATION_REQUESTS.filter(r => !deletedSet.has(r.id));
  }
}

export async function logCustomizationRequest(req: Omit<CustomizationRequest, 'id' | 'created_at'>): Promise<CustomizationRequest> {
  const newRecord: CustomizationRequest = {
    ...req,
    id: 'req-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('customization_requests').insert([newRecord]).select().single();
      if (error) throw new Error(`Request save failed: ${error.message}`);
      if (!data) throw new Error('Request save failed: no request was returned.');
      saveLocalRequest(data as CustomizationRequest);
      return data as CustomizationRequest;
    } catch (e) {
      console.error('Supabase logRequest error:', e);
      throw e instanceof Error ? e : new Error('Request save failed.');
    }
  }

  saveLocalRequest(newRecord);
  return newRecord;
}

function saveLocalRequest(req: CustomizationRequest) {
  removeFromDeletedSet(LS_DELETED_REQUESTS_KEY, req.id);
  const list = getLocalRequests().filter(r => r.id !== req.id);
  list.unshift(req);
  localStorage.setItem(LS_REQUESTS_KEY, JSON.stringify(list));
}

function getLocalRequests(): CustomizationRequest[] {
  const deletedSet = getDeletedSet(LS_DELETED_REQUESTS_KEY);
  try {
    const raw = localStorage.getItem(LS_REQUESTS_KEY);
    const list: CustomizationRequest[] = raw ? JSON.parse(raw) : [...INITIAL_CUSTOMIZATION_REQUESTS];
    return list.filter(r => !deletedSet.has(r.id));
  } catch {
    return INITIAL_CUSTOMIZATION_REQUESTS.filter(r => !deletedSet.has(r.id));
  }
}

export async function updateRequestStatus(id: string, status: CustomizationRequest['status']): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('customization_requests').update({ status }).eq('id', id);
      if (error) throw new Error(`Order status update failed: ${error.message}`);
    } catch (e) {
      console.error('Supabase updateRequestStatus error:', e);
      throw e instanceof Error ? e : new Error('Order status update failed.');
    }
  }
  const list = getLocalRequests();
  const item = list.find(r => r.id === id);
  if (item) {
    item.status = status;
    localStorage.setItem(LS_REQUESTS_KEY, JSON.stringify(list));
  }
  return true;
}

export const updateCustomizationRequestStatus = updateRequestStatus;

export async function deleteCustomizationRequest(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('customization_requests').delete().eq('id', id);
      if (error) throw new Error(`Request delete failed: ${error.message}`);
    } catch (e) {
      console.error('Supabase deleteRequest error:', e);
      throw e instanceof Error ? e : new Error('Request delete failed.');
    }
  }
  addToDeletedSet(LS_DELETED_REQUESTS_KEY, id);
  const list = getLocalRequests().filter(r => r.id !== id);
  localStorage.setItem(LS_REQUESTS_KEY, JSON.stringify(list));
  return true;
}

// --- GALLERY API ---
export async function getGalleryItems(): Promise<GalleryItem[]> {
  const deletedSet = getDeletedSet(LS_DELETED_GALLERY_KEY);
  if (supabase) {
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('order_index', { ascending: true });
      if (!error && data && data.length > 0) {
        return (data as GalleryItem[]).filter(g => !deletedSet.has(g.id));
      }
    } catch (e) {
      console.error('Supabase getGalleryItems error:', e);
    }
  }
  try {
    const raw = localStorage.getItem(LS_GALLERY_KEY);
    const list: GalleryItem[] = raw ? JSON.parse(raw) : INITIAL_GALLERY;
    return list.filter(g => !deletedSet.has(g.id));
  } catch {
    return INITIAL_GALLERY.filter(g => !deletedSet.has(g.id));
  }
}

export async function saveGalleryItem(item: GalleryItem): Promise<GalleryItem> {
  removeFromDeletedSet(LS_DELETED_GALLERY_KEY, item.id);
  if (supabase) {
    try {
      const { data, error } = await supabase.from('gallery').upsert(item).select().single();
      if (error) throw new Error(`Portfolio save failed: ${error.message}`);
      if (!data) throw new Error('Portfolio save failed: no portfolio item was returned.');
      updateLocalGallery(data as GalleryItem);
      return data as GalleryItem;
    } catch (e) {
      console.error('Supabase saveGalleryItem error:', e);
      throw e instanceof Error ? e : new Error('Portfolio save failed.');
    }
  }
  updateLocalGallery(item);
  return item;
}

function updateLocalGallery(item: GalleryItem) {
  const items = getLocalGallery().filter(g => g.id !== item.id);
  items.push(item);
  localStorage.setItem(LS_GALLERY_KEY, JSON.stringify(items));
}

function getLocalGallery(): GalleryItem[] {
  const deletedSet = getDeletedSet(LS_DELETED_GALLERY_KEY);
  try {
    const raw = localStorage.getItem(LS_GALLERY_KEY);
    const list: GalleryItem[] = raw ? JSON.parse(raw) : [...INITIAL_GALLERY];
    return list.filter(g => !deletedSet.has(g.id));
  } catch {
    return INITIAL_GALLERY.filter(g => !deletedSet.has(g.id));
  }
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw new Error(`Portfolio delete failed: ${error.message}`);
    } catch (e) {
      console.error('Supabase deleteGalleryItem error:', e);
      throw e instanceof Error ? e : new Error('Portfolio delete failed.');
    }
  }
  addToDeletedSet(LS_DELETED_GALLERY_KEY, id);
  const items = getLocalGallery().filter(g => g.id !== id);
  localStorage.setItem(LS_GALLERY_KEY, JSON.stringify(items));
  return true;
}

// In-memory cache to guarantee fast and synchronous continuity even if storage is constrained
let inMemorySiteContent: SiteContent | null = null;

// --- SITE CONTENT & SETTINGS API ---
export async function getSiteContent(): Promise<SiteContent> {
  let localData: Partial<SiteContent> = {};
  try {
    const raw = localStorage.getItem(LS_SITE_CONTENT_KEY);
    if (raw) {
      localData = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('LocalStorage read error for site content:', e);
  }
  localData = { ...localData, ...(await readIndexedSiteContent()) };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_content').select('*');
      if (!error && data && data.length > 0) {
        const mapped: Record<string, any> = {};
        data.forEach(row => {
          try {
            // Check if value is JSON stringified array or object
            if (typeof row.value === 'string' && (row.value.startsWith('[') || row.value.startsWith('{'))) {
              mapped[row.key] = JSON.parse(row.value);
            } else {
              mapped[row.key] = row.value;
            }
          } catch {
            mapped[row.key] = row.value;
          }
        });
        const merged = { ...INITIAL_SITE_CONTENT, ...mapped, ...localData, ...(inMemorySiteContent || {}) } as SiteContent;
        inMemorySiteContent = merged;
        return merged;
      }
    } catch (e) {
      console.warn('Supabase getSiteContent warning:', e);
    }
  }

  const merged = { ...INITIAL_SITE_CONTENT, ...localData, ...(inMemorySiteContent || {}) } as SiteContent;
  inMemorySiteContent = merged;
  return merged;
}

export async function updateSiteContent(content: SiteContent): Promise<SiteContent> {
  // Update in-memory reference immediately
  const previousContent = inMemorySiteContent;
  inMemorySiteContent = { ...content };

  // Persist to Supabase first when configured; browser caches must not mask a failed cloud save.
  if (supabase) {
    try {
      const rows = Object.entries(content)
        .filter(([key, value]) => key && value !== undefined)
        .map(([key, value]) => ({
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value ?? ''),
        }));

      if (rows.length > 0) {
        const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' });
        if (error) {
          inMemorySiteContent = previousContent;
          throw new Error(`Site content database update failed: ${error.message}`);
        }
      }
      await deleteReplacedSiteImages(previousContent, content);
    } catch (e) {
      console.warn('Supabase updateSiteContent warning:', e);
      inMemorySiteContent = previousContent;
      throw e;
    }
  }

  // Cache only after the cloud write succeeds, or when running in local-storage mode.
  await writeIndexedSiteContent(content);
  try {
    localStorage.setItem(LS_SITE_CONTENT_KEY, JSON.stringify(content));
  } catch (err) {
    console.warn('LocalStorage write warning for site content:', err);
  }

  return inMemorySiteContent;
}

export const saveSiteContent = updateSiteContent;

// --- CONTACT MESSAGES API ---
export async function sendContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    ...msg,
    id: 'msg-' + Date.now(),
    created_at: new Date().toISOString(),
    status: 'unread',
  };
  if (supabase) {
    try {
      const { data, error } = await supabase.from('contact_messages').insert([newMsg]).select().single();
      if (error) throw new Error(`Contact message save failed: ${error.message}`);
      if (!data) throw new Error('Contact message save failed: no message was returned.');
      return data as ContactMessage;
    } catch (e) {
      console.error('Supabase sendContactMessage error:', e);
      throw e instanceof Error ? e : new Error('Contact message save failed.');
    }
  }
  const messages: ContactMessage[] = getLocalMessages();
  messages.unshift(newMsg);
  localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(messages));
  return newMsg;
}

export function getLocalMessages(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(LS_MESSAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// --- WISHLIST API (Local storage based for customers) ---
export function getWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(productId: string): string[] {
  const list = getWishlist();
  const exists = list.includes(productId);
  const updated = exists ? list.filter(id => id !== productId) : [...list, productId];
  localStorage.setItem(LS_WISHLIST_KEY, JSON.stringify(updated));
  return updated;
}

// --- ADMIN AUTHENTICATION & CREDENTIALS (SUPABASE PERSISTED) ---

export async function getAdminCredentials(): Promise<AdminCredentials> {
  let cached: AdminCredentials = {
    email: DEFAULT_ADMIN_EMAIL,
    password: DEFAULT_ADMIN_PASSWORD,
  };

  try {
    const raw = localStorage.getItem(LS_ADMIN_CREDENTIALS_KEY);
    if (raw) {
      cached = { ...cached, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('LocalStorage error reading admin credentials:', e);
  }

  // If Supabase is connected, query Supabase database
  if (supabase) {
    try {
      // 1. First check dedicated admin_credentials table
      const { data, error } = await supabase
        .from('admin_credentials')
        .select('*')
        .eq('id', 'primary')
        .maybeSingle();

      if (!error && data && data.email && data.password) {
        const creds: AdminCredentials = {
          email: data.email,
          password: data.password,
          updated_at: data.updated_at,
        };
        try {
          localStorage.setItem(LS_ADMIN_CREDENTIALS_KEY, JSON.stringify(creds));
        } catch {
          // ignore
        }
        return creds;
      }

      // 2. Fallback check site_content table for admin_email / admin_password
      const { data: contentData } = await supabase
        .from('site_content')
        .select('*')
        .in('key', ['admin_email', 'admin_password']);

      if (contentData && contentData.length > 0) {
        let email = cached.email;
        let password = cached.password;
        contentData.forEach((row) => {
          if (row.key === 'admin_email' && row.value) email = row.value;
          if (row.key === 'admin_password' && row.value) password = row.value;
        });
        const creds: AdminCredentials = { email, password };
        try {
          localStorage.setItem(LS_ADMIN_CREDENTIALS_KEY, JSON.stringify(creds));
        } catch {
          // ignore
        }
        return creds;
      }
    } catch (e) {
      console.warn('Supabase getAdminCredentials error, using cached:', e);
    }
  }

  return cached;
}

export async function updateAdminCredentials(
  newEmail: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = newEmail.trim().toLowerCase();
  const cleanPassword = newPassword.trim();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid Gmail / Email address.' };
  }
  if (!cleanPassword || cleanPassword.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters long.' };
  }

  const updatedCreds: AdminCredentials = {
    email: cleanEmail,
    password: cleanPassword,
    updated_at: new Date().toISOString(),
  };

  // Persist to Supabase first when configured.
  if (supabase) {
    try {
      const { error: authError } = await supabase.auth.updateUser({
        email: cleanEmail,
        password: cleanPassword,
      });
      if (authError) throw new Error(`Authentication update failed: ${authError.message}`);

      const { error: credsError } = await supabase.from('admin_credentials').upsert(
        {
          id: 'primary',
          email: cleanEmail,
          password: cleanPassword,
          updated_at: updatedCreds.updated_at,
        },
        { onConflict: 'id' }
      );
      if (credsError) throw new Error(`Credential record update failed: ${credsError.message}`);

      const { error: contentError } = await supabase.from('site_content').upsert(
        [
          { key: 'admin_email', value: cleanEmail },
          { key: 'admin_password', value: cleanPassword },
        ],
        { onConflict: 'key' }
      );
      if (contentError) throw new Error(`Site credential update failed: ${contentError.message}`);
    } catch (e: any) {
      console.error('Supabase updateAdminCredentials error:', e);
      return {
        success: false,
        error: e?.message || 'Admin credentials could not be saved.',
      };
    }
  }

  try {
    localStorage.setItem(LS_ADMIN_CREDENTIALS_KEY, JSON.stringify(updatedCreds));
    localStorage.setItem(LS_ADMIN_ACTIVE_EMAIL_KEY, cleanEmail);
  } catch (e) {
    console.warn('LocalStorage error writing admin credentials:', e);
  }

  return { success: true };
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Please enter both Gmail / Email and Password.' };
  }

  if (!supabase) {
    return { success: false, error: 'Admin login is unavailable until Supabase is configured.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });
    if (!error && data.session) {
      localStorage.setItem(LS_ADMIN_SESSION_KEY, 'true');
      localStorage.setItem(LS_ADMIN_ACTIVE_EMAIL_KEY, cleanEmail);
      return { success: true };
    }
    return { success: false, error: error?.message || 'Incorrect email or password.' };
  } catch {
    return { success: false, error: 'Login failed. Please try again.' };
  }
}

export function isUserAdmin(): boolean {
  return false;
}

export function getActiveAdminEmail(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_EMAIL;
  return localStorage.getItem(LS_ADMIN_ACTIVE_EMAIL_KEY) || DEFAULT_ADMIN_EMAIL;
}

export function adminLogout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LS_ADMIN_SESSION_KEY);
    localStorage.removeItem(LS_ADMIN_ACTIVE_EMAIL_KEY);
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  }
}

// SQL Schema generator for user to copy/paste into their Supabase SQL editor
export const SUPABASE_SQL_SCHEMA = `-- Brush n Fabric by Sania - Database Schema
-- Run this in your Supabase SQL Editor:

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Products Table
create table if not exists products (
  id text primary key,
  name text not null,
  slug text not null,
  price numeric not null,
  original_price numeric,
  description text,
  full_description text,
  images text[] default array[]::text[],
  is_customizable boolean default true,
  category_id text,
  fabric_type text,
  work_type text,
  available_colors text[] default array[]::text[],
  stock_status text default 'made_to_order',
  occasion text default 'Festive',
  dimensions text,
  care_instructions text,
  is_featured boolean default false,
  rating numeric default 5.0,
  created_at timestamp with time zone default now()
);

-- 3. Categories Table
create table if not exists categories (
  id text primary key,
  name text not null,
  slug text not null,
  description text,
  image_url text,
  order_index integer default 0
);

-- 4. Customization Requests & Orders Log
create table if not exists customization_requests (
  id text primary key,
  product_id text,
  product_name text,
  customer_name text not null,
  customer_contact text not null,
  customer_email text,
  color_choice text,
  fabric_choice text,
  size_choice text,
  tassels_option text,
  notes text,
  reference_image_url text,
  estimated_price numeric,
  status text default 'new',
  created_at timestamp with time zone default now(),
  whatsapp_sent boolean default true
);

-- 5. Gallery Table
create table if not exists gallery (
  id text primary key,
  title text not null,
  image_url text not null,
  caption text,
  category_tag text,
  order_index integer default 0,
  created_at timestamp with time zone default now()
);

-- 6. Site Content Table
create table if not exists site_content (
  key text primary key,
  value text
);

-- 6b. Permanent admin image storage
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read site images" on storage.objects;
create policy "Public can read site images"
on storage.objects for select
using (bucket_id = 'site-images');

drop policy if exists "Admin app can upload site images" on storage.objects;
create policy "Admin app can upload site images"
on storage.objects for insert
with check (bucket_id = 'site-images');

drop policy if exists "Admin app can replace site images" on storage.objects;
create policy "Admin app can replace site images"
on storage.objects for delete
using (bucket_id = 'site-images');

-- 7. Contact Messages Table
create table if not exists contact_messages (
  id text primary key,
  name text not null,
  contact text,
  email text,
  subject text,
  message text not null,
  created_at timestamp with time zone default now(),
  status text default 'unread'
);

-- 8. Admin Credentials Table (Gmail and Password managed by admin in Supabase)
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

-- Row Level Security (RLS) policies
alter table products enable row level security;
alter table categories enable row level security;
alter table customization_requests enable row level security;
alter table gallery enable row level security;
alter table site_content enable row level security;
alter table contact_messages enable row level security;
alter table admin_credentials enable row level security;

-- Public read access
create policy "Public read products" on products for select using (true);
create policy "Public read categories" on categories for select using (true);
create policy "Public read gallery" on gallery for select using (true);
create policy "Public read site_content" on site_content for select using (true);

-- Public insert customization requests & messages
create policy "Public insert requests" on customization_requests for insert with check (true);
create policy "Public insert messages" on contact_messages for insert with check (true);

-- Admin full access
create policy "Allow all for authenticated users on products" on products for all using (true) with check (true);
create policy "Allow all for authenticated users on categories" on categories for all using (true) with check (true);
create policy "Allow all for authenticated users on customization_requests" on customization_requests for all using (true) with check (true);
create policy "Allow all for authenticated users on gallery" on gallery for all using (true) with check (true);
create policy "Allow all for authenticated users on site_content" on site_content for all using (true) with check (true);
create policy "Allow all on admin_credentials" on admin_credentials for all using (true) with check (true);
`;
