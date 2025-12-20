import React, { useState, useEffect } from 'react';
import './admin.css';

interface PlatformSettings {
  colors: {
    primary: string;
    background: string;
    foreground: string;
    muted: string;
    surface: string;
  };
  typography: {
    heading: string;
    body: string;
    weights: {
      heading: number;
      body: number;
      bold: number;
    };
  };
  logo: {
    icon: string;
    wordmark: string;
    lockup: string;
  };
  hero: {
    layout: string;
    visual_style: string;
    background: string;
    effects: {
      blur: boolean;
      glow: boolean;
      noise: boolean;
    };
    animation: {
      type: string;
      duration: number;
      stagger: number;
    };
  };
  motion: any;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function PlatformSettingsAdmin() {
  const [settings, setSettings] = useState<PlatformSettings>({
    colors: {
      primary: '#6366F1',
      background: '#FFFFFF',
      foreground: '#0F172A',
      muted: '#64748B',
      surface: '#F8FAFC',
    },
    typography: {
      heading: 'Cabinet Grotesk',
      body: 'Inter',
      weights: {
        heading: 600,
        body: 400,
        bold: 700,
      },
    },
    logo: {
      icon: '/assets/logo-icon.svg',
      wordmark: '/assets/logo-wordmark.svg',
      lockup: '/assets/logo-lockup.svg',
    },
    hero: {
      layout: 'centered-display',
      visual_style: 'magnetic-field',
      background: 'gradient-mesh',
      effects: {
        blur: true,
        glow: true,
        noise: false,
      },
      animation: {
        type: 'fade-up',
        duration: 800,
        stagger: 100,
      },
    },
    motion: {
      spring: { tension: 170, friction: 26 },
      ease: 'easeOutCubic',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load existing settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/platform-settings`);
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings
  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/platform-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primary_color: settings.colors.primary,
          background_color: settings.colors.background,
          foreground_color: settings.colors.foreground,
          muted_color: settings.colors.muted,
          surface_color: settings.colors.surface,
          heading_font: settings.typography.heading,
          body_font: settings.typography.body,
          font_weights: settings.typography.weights,
          logo_icon: settings.logo.icon,
          logo_wordmark: settings.logo.wordmark,
          logo_lockup: settings.logo.lockup,
          hero_layout: settings.hero.layout,
          hero_visual_style: settings.hero.visual_style,
          hero_background: settings.hero.background,
          hero_effects: settings.hero.effects,
          hero_animation: settings.hero.animation,
          motion_profile: settings.motion,
        }),
      });

      if (response.ok) {
        setMessage('✅ Settings saved successfully!');
      } else {
        setMessage('❌ Failed to save settings');
      }
    } catch (error) {
      setMessage('❌ Error: ' + error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">
              ⚙️ Platform Settings
            </h1>
            <p className="text-gray-600">Founder-level global configuration</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : '💾 Save Platform Settings'}
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">{message}</div>
        )}

        {/* Brand Colors */}
        <section className="mb-10 pb-10 border-b">
          <h2 className="text-2xl font-semibold mb-6">🎨 Brand Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(settings.colors).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-2 capitalize">
                  {key.replace('_', ' ')}
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: { ...settings.colors, [key]: e.target.value },
                      })
                    }
                    className="h-12 w-20 rounded-lg border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: { ...settings.colors, [key]: e.target.value },
                      })
                    }
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mb-10 pb-10 border-b">
          <h2 className="text-2xl font-semibold mb-6">✏️ Typography</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Heading Font
              </label>
              <select
                value={settings.typography.heading}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    typography: {
                      ...settings.typography,
                      heading: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Cabinet Grotesk">Cabinet Grotesk</option>
                <option value="Inter">Inter</option>
                <option value="Geist">Geist</option>
                <option value="SF Pro Display">SF Pro Display</option>
                <option value="Helvetica Neue">Helvetica Neue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Body Font</label>
              <select
                value={settings.typography.body}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    typography: { ...settings.typography, body: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Inter">Inter</option>
                <option value="Geist">Geist</option>
                <option value="SF Pro Text">SF Pro Text</option>
                <option value="Helvetica Neue">Helvetica Neue</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {Object.entries(settings.typography.weights).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-2 capitalize">
                    {key} Weight
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        typography: {
                          ...settings.typography,
                          weights: {
                            ...settings.typography.weights,
                            [key]: parseInt(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    min="100"
                    max="900"
                    step="100"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logo Assets */}
        <section className="mb-10 pb-10 border-b">
          <h2 className="text-2xl font-semibold mb-6">🖼️ Logo Assets</h2>
          <div className="space-y-4">
            {Object.entries(settings.logo).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-2 capitalize">
                  {key}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      logo: { ...settings.logo, [key]: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="/assets/logo.svg"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Hero System */}
        <section className="mb-10 pb-10 border-b">
          <h2 className="text-2xl font-semibold mb-6">🎯 Hero System</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Layout</label>
              <select
                value={settings.hero.layout}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, layout: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="centered-display">Centered Display</option>
                <option value="left-aligned">Left Aligned</option>
                <option value="split-screen">Split Screen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Visual Style
              </label>
              <select
                value={settings.hero.visual_style}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, visual_style: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="magnetic-field">Magnetic Field</option>
                <option value="gradient-waves">Gradient Waves</option>
                <option value="geometric">Geometric</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Background</label>
              <select
                value={settings.hero.background}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, background: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="gradient-mesh">Gradient Mesh</option>
                <option value="solid">Solid Color</option>
                <option value="image">Background Image</option>
              </select>
            </div>

            {/* Effects */}
            <div>
              <label className="block text-sm font-medium mb-2">Effects</label>
              <div className="space-y-2">
                {Object.entries(settings.hero.effects).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          hero: {
                            ...settings.hero,
                            effects: {
                              ...settings.hero.effects,
                              [key]: e.target.checked,
                            },
                          },
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Animation */}
            <div>
              <label className="block text-sm font-medium mb-2">Animation Type</label>
              <select
                value={settings.hero.animation.type}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: {
                      ...settings.hero,
                      animation: {
                        ...settings.hero.animation,
                        type: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="fade-up">Fade Up</option>
                <option value="fade-in">Fade In</option>
                <option value="slide-right">Slide Right</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration (ms)
                </label>
                <input
                  type="number"
                  value={settings.hero.animation.duration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: {
                        ...settings.hero,
                        animation: {
                          ...settings.hero.animation,
                          duration: parseInt(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Stagger (ms)
                </label>
                <input
                  type="number"
                  value={settings.hero.animation.stagger}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero: {
                        ...settings.hero,
                        animation: {
                          ...settings.hero.animation,
                          stagger: parseInt(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Motion Profile */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">⚡ Motion Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Spring Tension
              </label>
              <input
                type="number"
                value={settings.motion.spring.tension}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    motion: {
                      ...settings.motion,
                      spring: {
                        ...settings.motion.spring,
                        tension: parseInt(e.target.value),
                      },
                    },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Spring Friction
              </label>
              <input
                type="number"
                value={settings.motion.spring.friction}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    motion: {
                      ...settings.motion,
                      spring: {
                        ...settings.motion.spring,
                        friction: parseInt(e.target.value),
                      },
                    },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-500">
            ⚠️ Founder-level access only
          </span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : '💾 Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
