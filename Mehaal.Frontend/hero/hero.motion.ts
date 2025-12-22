// Hero Motion & Animation Config
// Animation presets for react-spring

export const heroMotion = {
  // Fade-in animation
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  },

  // Slide-up animation
  slideUp: {
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 800 },
  },

  // Staggered entrance
  staggerContainer: {
    delay: 200,
  },

  // CTA button pulse (hover effect)
  buttonPulse: {
    scale: {
      from: 1,
      to: 1.05,
      config: { tension: 300, friction: 10 },
    },
    shadow: {
      from: { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.4)' },
      to: { boxShadow: '0 0 20px 0 rgba(139, 92, 246, 0.6)' },
      config: { duration: 600 },
    },
  },

  // Text underline grow
  underlineGrow: {
    from: { scaleX: 0 },
    to: { scaleX: 1 },
    config: { duration: 400 },
    transformOrigin: 'center',
  },

  // Image tilt (parallax on mouse move)
  imageTilt: {
    config: { tension: 300, friction: 10 },
  },

  // Scroll-triggered reveals
  scrollReveal: {
    triggerOnce: true,
    threshold: 0.1,
  },

  // Custom cursor trail (if implemented)
  cursorTrail: {
    decay: 0.95,
    size: 8,
  },

  // Parallax background
  parallax: {
    y: {
      from: 0,
      to: 50,
      config: { duration: 2000 },
    },
  },

  // Timing presets
  timing: {
    fast: { duration: 300 },
    normal: { duration: 600 },
    slow: { duration: 1000 },
    verySlow: { duration: 1500 },
  },

  // Easing functions
  easing: {
    easeInOut: { tension: 280, friction: 60 },
    easeOut: { tension: 170, friction: 26 },
    smooth: { tension: 280, friction: 120 },
  },
};

export type HeroMotion = typeof heroMotion;
