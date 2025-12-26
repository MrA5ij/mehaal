const AI_ENGINE_URL = process.env.NEXT_PUBLIC_AI_ENGINE_URL || 'http://localhost:8000';

export const apiClient = {
  // Generic Fetch Wrapper
  request: async (endpoint: string, options: RequestInit = {}) => {
    // Get Token from Cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const res = await fetch(`${AI_ENGINE_URL}/api${endpoint}`, { ...options, headers });
    if (!res.ok) throw new Error('API Request Failed');
    return res.json();
  },

  // --- AUTH ---
  login: async (credentials: any) => {
    return apiClient.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // --- SHOP ---
  syncInventory: async () => {
    return apiClient.request('/shop/inventory');
  },
  processSale: async (itemId: number) => {
    return apiClient.request('/shop/sale', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, quantity: 1 })
    });
  },

  // --- ADMIN ---
  getUsers: async () => {
    return apiClient.request('/admin/users');
  },
  banUser: async (userId: string) => {
    return apiClient.request(`/admin/users/${userId}/ban`, { method: 'POST' });
  },

  // --- CMS ---
  createPost: async (data: any) => {
    return apiClient.request('/cms/posts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
