import React, { useState, useEffect, ChangeEvent } from 'react';
import './admin.css';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface CallToAction {
  heading: string;
  description: string;
  button_text: string;
  button_url: string;
}

interface HomePageData {
  id?: number;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_url: string;
  hero_media_id: string | null;
  sections: {
    feature_grid: Feature[];
    pricing_preview: any[];
    testimonials: any[];
    call_to_action: CallToAction;
  };
  seo_title: string;
  seo_description: string;
  seo_image: string | null;
  is_published: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function HomePageEditor() {
  const [pageData, setPageData] = useState<HomePageData>({
    hero_title: '',
    hero_subtitle: '',
    hero_cta_text: '',
    hero_cta_url: '',
    hero_media_id: null,
    sections: {
      feature_grid: [],
      pricing_preview: [],
      testimonials: [],
      call_to_action: {
        heading: '',
        description: '',
        button_text: '',
        button_url: '',
      },
    },
    seo_title: '',
    seo_description: '',
    seo_image: null,
    is_published: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home-page/`);
        if (response.ok) {
          const data = await response.json();
          setPageData(data);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const method = pageData.id ? 'PUT' : 'POST';
      const url = pageData.id ? `${API_BASE_URL}/api/home-page/${pageData.id}` : `${API_BASE_URL}/api/home-page/`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });
      if (response.ok) {
        const data = await response.json();
        setPageData(data);
        setMessage('✅ Saved successfully!');
      } else {
        setMessage('❌ Failed to save');
      }
    } catch (error) {
      setMessage('❌ Error: ' + error);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!pageData.id) {
      setMessage('⚠️ Save first before publishing');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/home-page/${pageData.id}/publish`, { method: 'PATCH' });
      if (response.ok) {
        setPageData({ ...pageData, is_published: true });
        setMessage('✅ Published successfully!');
      }
    } catch (error) {
      setMessage('❌ Failed to publish');
    }
  };

  const addFeature = () => {
    const newFeature: Feature = {
      id: `f${Date.now()}`,
      title: 'New Feature',
      description: 'Feature description',
      icon: '⭐',
    };
    setPageData({
      ...pageData,
      sections: {
        ...pageData.sections,
        feature_grid: [...pageData.sections.feature_grid, newFeature],
      },
    });
  };

  const removeFeature = (id: string) => {
    setPageData({
      ...pageData,
      sections: {
        ...pageData.sections,
        feature_grid: pageData.sections.feature_grid.filter((f: Feature) => f.id !== id),
      },
    });
  };

  const updateFeature = (id: string, field: keyof Feature, value: string) => {
    setPageData({
      ...pageData,
      sections: {
        ...pageData.sections,
        feature_grid: pageData.sections.feature_grid.map((f: Feature) =>
          f.id === id ? { ...f, [field]: value } : f
        ),
      },
    });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading home page data...</p>
      </div>
    );
  }

  return (
    <div className="admin-page home-page-editor">
      <div className="admin-page-header">
        <div className="page-header-left">
          <h1 className="page-title">🏠 Home Page Editor</h1>
          <p className="page-subtitle">Customize your home page content and layout</p>
        </div>
        <div className="page-actions">
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
          <button onClick={handlePublish} disabled={!pageData.id} className="btn btn-success">
            🚀 Publish
          </button>
        </div>
      </div>

      {message && <div className="alert alert-success mb-6">{message}</div>}

      <section className="editor-card">
        <h2 className="card-title">🎯 Hero Section</h2>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input type="text" value={pageData.hero_title} onChange={(e: ChangeEvent<HTMLInputElement>) => setPageData({ ...pageData, hero_title: e.target.value })} className="form-input" placeholder="Welcome to Mehaal" />
        </div>
        <div className="form-group">
          <label className="form-label">Subtitle</label>
          <textarea value={pageData.hero_subtitle} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPageData({ ...pageData, hero_subtitle: e.target.value })} className="form-textarea" rows={3} placeholder="Build amazing websites" />
        </div>
        <div className="form-group">
          <label className="form-label">CTA Text</label>
          <input type="text" value={pageData.hero_cta_text} onChange={(e: ChangeEvent<HTMLInputElement>) => setPageData({ ...pageData, hero_cta_text: e.target.value })} className="form-input" placeholder="Get Started" />
        </div>
        <div className="form-group">
          <label className="form-label">CTA URL</label>
          <input type="text" value={pageData.hero_cta_url} onChange={(e: ChangeEvent<HTMLInputElement>) => setPageData({ ...pageData, hero_cta_url: e.target.value })} className="form-input" placeholder="/signup" />
        </div>
      </section>

      <section className="editor-card">
        <div className="card-header">
          <h2 className="card-title">✨ Features</h2>
          <button onClick={addFeature} className="btn btn-secondary">➕ Add Feature</button>
        </div>
        <div className="features-list">
          {pageData.sections.feature_grid.map((feature) => (
            <div key={feature.id} className="feature-item">
              <div className="feature-icon">
                <input type="text" value={feature.icon} onChange={(e: ChangeEvent<HTMLInputElement>) => updateFeature(feature.id, 'icon', e.target.value)} className="form-input" style={{ width: '60px', textAlign: 'center' }} placeholder="🎯" />
              </div>
              <div className="feature-content">
                <input type="text" value={feature.title} onChange={(e: ChangeEvent<HTMLInputElement>) => updateFeature(feature.id, 'title', e.target.value)} className="form-input" placeholder="Feature Title" style={{ marginBottom: '8px' }} />
                <textarea value={feature.description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateFeature(feature.id, 'description', e.target.value)} className="form-textarea" rows={2} placeholder="Description" />
              </div>
              <div className="feature-actions">
                <button onClick={() => removeFeature(feature.id)} className="btn btn-danger">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="editor-card">
        <h2 className="card-title">📣 Call to Action</h2>
        <div className="form-group">
          <label className="form-label">Heading</label>
          <input type="text" value={pageData.sections.call_to_action.heading} onChange={(e: ChangeEvent<HTMLInputElement>) => setPageData({ ...pageData, sections: { ...pageData.sections, call_to_action: { ...pageData.sections.call_to_action, heading: e.target.value } } })} className="form-input" placeholder="Ready?" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea value={pageData.sections.call_to_action.description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPageData({ ...pageData, sections: { ...pageData.sections, call_to_action: { ...pageData.sections.call_to_action, description: e.target.value } } })} className="form-textarea" rows={2} placeholder="Join us" />
        </div>
        <div className="form-group">
          <label className="form-label">Button Text</label>
          <input type="text" value={pageData.sections.call_to_action.button_text} onChange={(e: ChangeEvent<HTMLInputElement>) => setPageData({ ...pageData, sections: { ...pageData.sections, call_to_action: { ...pageData.sections.call_to_action, button_text: e.target.value } } })} className="form-input" placeholder="Start" />
        </div>
        <div className="form-group">
          <label className="form-label">Button URL</label>
          <input type="text" value={pageData.sections.call_to_action.button_url} onChange={(e: ChangeEvent<HTMLInputElement>) => setPageData({ ...pageData, sections: { ...pageData.sections, call_to_action: { ...pageData.sections.call_to_action, button_url: e.target.value } } })} className="form-input" placeholder="/signup" />
        </div>
      </section>

      <section className="editor-card">
        <h2 className="card-title">🔍 SEO Settings</h2>
        <div className="form-group">
          <label className="form-label">SEO Title</label>
          <input type="text" value={pageData.seo_title} onChange={(e: ChangeEvent<HTMLInputElement>) => setPageData({ ...pageData, seo_title: e.target.value })} className="form-input" placeholder="Mehaal - Modern CMS" />
        </div>
        <div className="form-group">
          <label className="form-label">SEO Description</label>
          <textarea value={pageData.seo_description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPageData({ ...pageData, seo_description: e.target.value })} className="form-textarea" rows={3} placeholder="Easy website management" />
        </div>
      </section>

      <div className="editor-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontWeight: 600 }}>Status: </span>
            <span className={pageData.is_published ? 'status-badge published' : 'status-badge draft'}>
              {pageData.is_published ? '✅ Published' : '⏳ Draft'}
            </span>
          </div>
          {pageData.id && <span style={{ fontSize: '14px', color: '#9ca3af' }}>ID: {pageData.id}</span>}
        </div>
      </div>
    </div>
  );
}
