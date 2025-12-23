/**
 * CMS API Service
 * Handles all interactions with the backend CMS endpoints
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export interface CMSBlock {
  type: string;
  data: Record<string, any>;
}

export interface CMSPage {
  id: number;
  slug: string;
  title: string;
  content: {
    blocks: CMSBlock[];
  };
  status: 'draft' | 'published';
  seo_title?: string;
  seo_description?: string;
  seo_image?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface CMSNavItem {
  id: number;
  label: string;
  slug: string;
  position: number;
  parent_id: number | null;
  is_active: boolean;
  children?: CMSNavItem[];
}

export interface BrandAsset {
  id: number;
  asset_key: string;
  file_path: string;
  asset_type: string;
  description?: string;
}

// ===== PUBLIC CMS ENDPOINTS =====

export const cmsService = {
  // Pages
  async getPageBySlug(slug: string): Promise<CMSPage> {
    const response = await fetch(`${API_BASE}/cms/pages/${slug}`);
    if (!response.ok) throw new Error(`Page not found: ${slug}`);
    return response.json();
  },

  async listPublishedPages(): Promise<CMSPage[]> {
    const response = await fetch(`${API_BASE}/cms/pages`);
    if (!response.ok) throw new Error('Failed to fetch pages');
    return response.json();
  },

  // Navigation
  async getNavigation(): Promise<CMSNavItem[]> {
    const response = await fetch(`${API_BASE}/cms/navigation`);
    if (!response.ok) throw new Error('Failed to fetch navigation');
    return response.json();
  },

  // Brand Assets
  async getBrandAsset(assetKey: string): Promise<BrandAsset> {
    const response = await fetch(`${API_BASE}/cms/brand-assets/${assetKey}`);
    if (!response.ok) throw new Error(`Brand asset not found: ${assetKey}`);
    return response.json();
  },

  // ===== ADMIN ENDPOINTS =====

  // Admin Pages
  async adminListPages(): Promise<CMSPage[]> {
    const response = await fetch(`${API_BASE}/cms/admin/pages`);
    if (!response.ok) throw new Error('Failed to fetch pages');
    return response.json();
  },

  async adminGetPage(slug: string): Promise<CMSPage> {
    const response = await fetch(`${API_BASE}/cms/admin/pages/${slug}`);
    if (!response.ok) throw new Error(`Page not found: ${slug}`);
    return response.json();
  },

  async adminCreatePage(page: Partial<CMSPage>): Promise<CMSPage> {
    const response = await fetch(`${API_BASE}/cms/admin/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page),
    });
    if (!response.ok) throw new Error('Failed to create page');
    return response.json();
  },

  async adminUpdatePage(slug: string, page: Partial<CMSPage>): Promise<CMSPage> {
    const response = await fetch(`${API_BASE}/cms/admin/pages/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page),
    });
    if (!response.ok) throw new Error('Failed to update page');
    return response.json();
  },

  async adminPublishPage(slug: string, status: 'draft' | 'published'): Promise<CMSPage> {
    const response = await fetch(`${API_BASE}/cms/admin/pages/${slug}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to publish page');
    return response.json();
  },

  async adminDeletePage(slug: string): Promise<void> {
    const response = await fetch(`${API_BASE}/cms/admin/pages/${slug}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete page');
  },

  // Admin Navigation
  async adminListNavigation(): Promise<CMSNavItem[]> {
    const response = await fetch(`${API_BASE}/cms/admin/navigation`);
    if (!response.ok) throw new Error('Failed to fetch navigation');
    return response.json();
  },

  async adminCreateNavItem(item: Partial<CMSNavItem>): Promise<CMSNavItem> {
    const response = await fetch(`${API_BASE}/cms/admin/navigation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create navigation item');
    return response.json();
  },

  async adminUpdateNavItem(id: number, item: Partial<CMSNavItem>): Promise<CMSNavItem> {
    const response = await fetch(`${API_BASE}/cms/admin/navigation/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to update navigation item');
    return response.json();
  },

  async adminDeleteNavItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/cms/admin/navigation/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete navigation item');
  },

  // Admin Brand Assets
  async adminListBrandAssets(): Promise<BrandAsset[]> {
    const response = await fetch(`${API_BASE}/cms/admin/brand-assets`);
    if (!response.ok) throw new Error('Failed to fetch brand assets');
    return response.json();
  },

  async adminCreateBrandAsset(asset: Partial<BrandAsset>): Promise<BrandAsset> {
    const response = await fetch(`${API_BASE}/cms/admin/brand-assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset),
    });
    if (!response.ok) throw new Error('Failed to create brand asset');
    return response.json();
  },

  async adminDeleteBrandAsset(assetKey: string): Promise<void> {
    const response = await fetch(`${API_BASE}/cms/admin/brand-assets/${assetKey}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete brand asset');
  },
};

export default cmsService;
