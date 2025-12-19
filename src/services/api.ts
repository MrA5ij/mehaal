// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating?: number;
}

export interface PricingPreview {
  id: string;
  plan: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export interface CallToAction {
  heading: string;
  description: string;
  button_text: string;
  button_url: string;
}

export interface HomePageSections {
  feature_grid: Feature[];
  pricing_preview: PricingPreview[];
  testimonials: Testimonial[];
  call_to_action: CallToAction;
}

export interface HomePage {
  id: number;
  hero_title: string;
  hero_subtitle?: string;
  hero_cta_text?: string;
  hero_cta_url?: string;
  hero_media_id?: string;
  sections: HomePageSections;
  seo_title?: string;
  seo_description?: string;
  seo_image?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type HomePageCreate = Omit<HomePage, 'id' | 'created_at' | 'updated_at'>;
export type HomePageUpdate = Partial<HomePageCreate>;

// API Functions
class HomePageAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Get published home page (public endpoint)
  async getPublished(): Promise<HomePage> {
    const response = await fetch(`${this.baseUrl}/api/home-page/published`);
    if (!response.ok) {
      throw new Error(`Failed to fetch published home page: ${response.statusText}`);
    }
    return response.json();
  }

  // Get home page (admin endpoint)
  async get(): Promise<HomePage> {
    const response = await fetch(`${this.baseUrl}/api/home-page/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch home page: ${response.statusText}`);
    }
    return response.json();
  }

  // Create home page
  async create(data: HomePageCreate): Promise<HomePage> {
    const response = await fetch(`${this.baseUrl}/api/home-page/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create home page');
    }

    return response.json();
  }

  // Update home page
  async update(id: number, data: HomePageUpdate): Promise<HomePage> {
    const response = await fetch(`${this.baseUrl}/api/home-page/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update home page');
    }

    return response.json();
  }

  // Publish home page
  async publish(id: number): Promise<HomePage> {
    const response = await fetch(`${this.baseUrl}/api/home-page/${id}/publish`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to publish home page');
    }

    return response.json();
  }

  // Delete home page
  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/home-page/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete home page');
    }
  }
}

// Export singleton instance
export const homePageApi = new HomePageAPI();

// React Hook (optional)
import { useState, useEffect } from 'react';

export function useHomePage() {
  const [data, setData] = useState<HomePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await homePageApi.getPublished();
        setData(response);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await homePageApi.getPublished();
      setData(response);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Usage example:
// const { data, loading, error } = useHomePage();
