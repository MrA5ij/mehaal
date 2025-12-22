// Hero Layout Rules
// Spacing & alignment rules

export const heroLayout = {
  // Container constraints
  container: {
    maxWidth: '1280px',
    padding: {
      desktop: '6rem 2rem',
      tablet: '4rem 1.5rem',
      mobile: '2rem 1rem',
    },
    margin: '0 auto',
  },

  // Grid / sections
  sections: {
    // Header spacing
    header: {
      height: '80px',
      padding: '1rem 2rem',
      gap: '2rem',
    },
    // Hero content area
    content: {
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '2rem',
    },
  },

  // Component spacing
  components: {
    // Announcement pill
    pill: {
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
    },
    // Headline
    headline: {
      maxWidth: '900px',
      margin: '0 auto',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    // Supporting text
    supporting: {
      maxWidth: '600px',
      margin: '0 auto',
      marginBottom: '2rem',
      textAlign: 'center',
    },
    // CTA group
    ctaGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '2rem',
    },
    // Button
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: 500,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  },

  // Visual anchor (arc/portal)
  visualAnchor: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    bottom: '-200px',
    right: '10%',
    zIndex: 0,
  },

  // Responsive breakpoints
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
};

export type HeroLayout = typeof heroLayout;
