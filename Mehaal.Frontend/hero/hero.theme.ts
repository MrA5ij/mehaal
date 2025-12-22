// Hero Theme Tokens
// Colors, gradients, typography intent

export const heroTheme = {
  colors: {
    // Base background
    background: {
      primary: '#0a0612', // near-black violet
      secondary: '#1a1424',
    },
    // Primary accent - violet/purple glow
    accent: {
      primary: '#8b5cf6', // vibrant violet
      light: '#a78bfa',
      glow: '#7c3aed',
    },
    // Secondary accent - soft blue highlights
    secondary: {
      blue: '#60a5fa',
      lightBlue: '#93c5fd',
    },
    // Text colors
    text: {
      primary: '#f3f4f6', // off-white
      secondary: '#d1d5db',
      muted: '#9ca3af',
      dim: 'rgba(243, 244, 246, 0.6)',
    },
  },

  // Gradients
  gradients: {
    // Radial glow effect
    radialGlow: `radial-gradient(
      circle at 50% 50%,
      rgba(139, 92, 246, 0.3) 0%,
      rgba(139, 92, 246, 0.1) 25%,
      transparent 70%
    )`,
    // Arc glow
    arcGlow: `conic-gradient(
      from 0deg,
      rgba(139, 92, 246, 0.4) 0deg,
      rgba(96, 165, 250, 0.2) 90deg,
      transparent 180deg
    )`,
  },

  // Typography (Intent only)
  typography: {
    headline: {
      fontSize: '4rem', // large, confident
      fontWeight: 700,
      letterSpacing: '-0.02em', // tight tracking
      lineHeight: 1.1,
    },
    subheadline: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    body: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0',
      lineHeight: 1.6,
    },
    small: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.02em',
      lineHeight: 1.5,
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  // Z-index scale
  zIndex: {
    background: 0,
    content: 10,
    overlay: 20,
  },
};

export type HeroTheme = typeof heroTheme;
