import React, { useEffect, useState } from 'react';

// Types
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
  motion: {
    spring: {
      tension: number;
      friction: number;
    };
    ease: string;
  };
}

interface HeroCMS {
  headline: string;
  subheadline: string;
  cta_primary: string;
  cta_secondary: string;
}

interface HeroProps {
  platform?: PlatformSettings;
  content: HeroCMS;
}

const Hero: React.FC<HeroProps> = ({ platform, content }: HeroProps) => {
  const [settings, setSettings] = useState<PlatformSettings | null>(platform || null);
  const [loading, setLoading] = useState(!platform);

  useEffect(() => {
    if (!platform) {
      // Fetch platform settings from API
      const fetchSettings = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/platform-settings');
          if (response.ok) {
            const data = await response.json();
            setSettings(data);
          }
        } catch (error) {
          console.error('Failed to load platform settings:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSettings();
    }
  }, [platform]);

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Hero layout variants
  const layoutClasses = {
    'centered-display': 'text-center items-center',
    'left-aligned': 'text-left items-start',
    'split-screen': 'text-left items-center justify-between flex-row',
  };

  // Background styles
  const backgroundStyles = {
    'gradient-mesh': {
      background: `linear-gradient(135deg, ${settings.colors.primary}20 0%, ${settings.colors.surface} 100%)`,
    },
    'solid': {
      backgroundColor: settings.colors.background,
    },
    'image': {
      backgroundImage: 'url(/hero-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
  };

  return (
    <section
      style={{
        ...backgroundStyles[settings.hero.background as keyof typeof backgroundStyles],
        color: settings.colors.foreground,
        fontFamily: settings.typography.heading,
      }}
      className={`min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 ${
        layoutClasses[settings.hero.layout as keyof typeof layoutClasses] || layoutClasses['centered-display']
      }`}
    >
      <div className="max-w-6xl w-full mx-auto">
        {/* Headline */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight"
          style={{
            fontFamily: settings.typography.heading,
            fontWeight: settings.typography.weights.heading,
            animation: `${settings.hero.animation.type} ${settings.hero.animation.duration}ms ${settings.hero.animation.stagger}ms both`,
          }}
        >
          {content.headline}
        </h1>

        {/* Subheadline */}
        <p
          className="max-w-2xl text-lg md:text-xl opacity-70 mb-10"
          style={{
            fontFamily: settings.typography.body,
            fontWeight: settings.typography.weights.body,
            color: settings.colors.muted,
            animation: `${settings.hero.animation.type} ${settings.hero.animation.duration}ms ${settings.hero.animation.stagger * 2}ms both`,
          }}
        >
          {content.subheadline}
        </p>

        {/* CTA Buttons */}
        <div
          className="flex gap-4 flex-wrap"
          style={{
            animation: `${settings.hero.animation.type} ${settings.hero.animation.duration}ms ${settings.hero.animation.stagger * 3}ms both`,
          }}
        >
          <button
            style={{
              backgroundColor: settings.colors.primary,
              color: settings.colors.background,
              transition: `all ${settings.motion.ease} 0.3s`,
            }}
            className="px-8 py-4 rounded-lg font-medium hover:scale-105 transform"
          >
            {content.cta_primary}
          </button>
          
          <button
            style={{
              borderColor: settings.colors.foreground,
              color: settings.colors.foreground,
              transition: `all ${settings.motion.ease} 0.3s`,
            }}
            className="px-8 py-4 border-2 rounded-lg font-medium hover:bg-opacity-10 hover:bg-black"
          >
            {content.cta_secondary}
          </button>
        </div>

        {/* Visual Effects */}
        {settings.hero.effects.glow && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: settings.colors.primary }}
          ></div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
