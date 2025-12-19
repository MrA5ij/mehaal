import React, { useState, useEffect, ChangeEvent } from 'react';

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

  // Load existing data
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

  // Save data
  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const method = pageData.id ? 'PUT' : 'POST';
      const url = pageData.id
        ? `${API_BASE_URL}/api/home-page/${pageData.id}`
        : `${API_BASE_URL}/api/home-page/`;

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

  // Publish
  const handlePublish = async () => {
    if (!pageData.id) {
      setMessage('⚠️ Save first before publishing');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/home-page/${pageData.id}/publish`,
        { method: 'PATCH' }
      );

      if (response.ok) {
        setPageData({ ...pageData, is_published: true });
        setMessage('✅ Published successfully!');
      }
    } catch (error) {
      setMessage('❌ Failed to publish');
    }
  };

  // Add feature
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

  // Remove feature
  const removeFeature = (id: string) => {
    setPageData({
      ...pageData,
      sections: {
        ...pageData.sections,
        feature_grid: pageData.sections.feature_grid.filter((f: Feature) => f.id !== id),
      },
    });
  };

  // Update feature
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

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🏠 Home Page CMS
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : '💾 Save'}
            </button>
            <button
              onClick={handlePublish}
              disabled={!pageData.id}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              🚀 Publish
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">{message}</div>
        )}

        {/* Hero Section */}
        <section className="mb-8 border-b pb-8">
          <h2 className="text-2xl font-bold mb-4">🎯 Hero Section</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={pageData.hero_title}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPageData({ ...pageData, hero_title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Welcome to Mehaal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <textarea
                value={pageData.hero_subtitle}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setPageData({ ...pageData, hero_subtitle: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                placeholder="Build amazing websites with ease"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={pageData.hero_cta_text}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPageData({ ...pageData, hero_cta_text: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Get Started"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  CTA Button URL
                </label>
                <input
                  type="text"
                  value={pageData.hero_cta_url}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPageData({ ...pageData, hero_cta_url: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="/signup"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-8 border-b pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">✨ Features</h2>
            <button
              onClick={addFeature}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              ➕ Add Feature
            </button>
          </div>

          <div className="space-y-4">
            {pageData.sections.feature_grid.map((feature) => (
              <div key={feature.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={feature.icon}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateFeature(feature.id, 'icon', e.target.value)
                    }
                    className="w-16 px-2 py-1 border rounded text-center text-2xl"
                    placeholder="🎯"
                  />
                  <button
                    onClick={() => removeFeature(feature.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️ Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateFeature(feature.id, 'title', e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                  placeholder="Feature Title"
                />
                <textarea
                  value={feature.description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    updateFeature(feature.id, 'description', e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  placeholder="Feature description"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-8 border-b pb-8">
          <h2 className="text-2xl font-bold mb-4">📣 Call to Action</h2>
          
          <div className="space-y-4">
            <input
              type="text"
              value={pageData.sections.call_to_action.heading}
              onChange={(e) =>
                setPageData({
                  ...pageData,
                  sections: {
                    ...pageData.sections,
                    call_to_action: {
                      ...pageData.sections.call_to_action,
                      heading: e.target.value,
                    },
                  },
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Ready to get started?"
            />
            <textarea
              value={pageData.sections.call_to_action.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setPageData({
                  ...pageData,
                  sections: {
                    ...pageData.sections,
                    call_to_action: {
                      ...pageData.sections.call_to_action,
                      description: e.target.value,
                    },
                  },
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
              rows={2}
              placeholder="Join thousands of happy customers"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={pageData.sections.call_to_action.button_text}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPageData({
                    ...pageData,
                    sections: {
                      ...pageData.sections,
                      call_to_action: {
                        ...pageData.sections.call_to_action,
                        button_text: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Start Free Trial"
              />
              <input
                type="text"
                value={pageData.sections.call_to_action.button_url}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPageData({
                    ...pageData,
                    sections: {
                      ...pageData.sections,
                      call_to_action: {
                        ...pageData.sections.call_to_action,
                        button_url: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="/signup"
              />
            </div>
          </div>
        </section>

        {/* SEO Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🔍 SEO Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={pageData.seo_title}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPageData({ ...pageData, seo_title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Mehaal - Modern CMS Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                SEO Description
              </label>
              <textarea
                value={pageData.seo_description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setPageData({ ...pageData, seo_description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                placeholder="The easiest way to build and manage your website"
              />
            </div>
          </div>
        </section>

        {/* Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="font-medium">Status: </span>
            <span
              className={
                pageData.is_published ? 'text-green-600' : 'text-yellow-600'
              }
            >
              {pageData.is_published ? '✅ Published' : '⏳ Draft'}
            </span>
          </div>
          {pageData.id && (
            <span className="text-sm text-gray-500">ID: {pageData.id}</span>
          )}
        </div>
      </div>
    </div>
  );
}
