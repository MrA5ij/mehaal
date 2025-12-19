import React, { useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { heroTheme } from './hero.theme';
import { heroLayout } from './hero.layout';
import { heroMotion } from './hero.motion';
import './Hero.css';

const Hero = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  // Fade-in animation for main container
  const fadeInSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
  });

  // Slide-up animation for headline
  const headlineSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 200,
    config: config.wobbly,
  });

  // Slide-up animation for subheadline
  const subheadlineSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 400,
    config: config.wobbly,
  });

  // Slide-up animation for CTA buttons
  const ctaSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 600,
    config: config.wobbly,
  });

  // Button hover effect
  const getButtonSpring = (buttonId) => {
    return useSpring({
      transform: hoveredButton === buttonId ? 'scale(1.05)' : 'scale(1)',
      boxShadow:
        hoveredButton === buttonId
          ? `0 0 20px 0 rgba(139, 92, 246, 0.6)`
          : `0 0 0 0 rgba(139, 92, 246, 0.4)`,
      config: config.gentle,
    });
  };

  const primaryButtonSpring = getButtonSpring('primary');
  const secondaryButtonSpring = getButtonSpring('secondary');

  return (
    <animated.div style={fadeInSpring} className="hero-wrapper">
      {/* Background layers */}
      <div className="hero-background">
        {/* Base dark surface */}
        <div className="hero-bg-base"></div>

        {/* Radial glow effect */}
        <div className="hero-bg-radial-glow"></div>

        {/* Arc glow effect */}
        <div className="hero-bg-arc-glow"></div>

        {/* Noise/grain texture (optional) */}
        <div className="hero-bg-noise"></div>
      </div>

      {/* Header (Visual only) */}
      <header className="hero-header">
        <div className="hero-header-logo">
          <span className="logo-placeholder">Mehaal</span>
        </div>
        <nav className="hero-header-nav">
          <a href="#" className="nav-placeholder">
            Features
          </a>
          <a href="#" className="nav-placeholder">
            Pricing
          </a>
          <a href="#" className="nav-placeholder">
            About
          </a>
        </nav>
        <button className="hero-header-cta">Sign In</button>
      </header>

      {/* Hero Content */}
      <animated.div style={headlineSpring} className="hero-content">
        {/* Announcement pill */}
        <div className="hero-announcement-pill">
          <span className="announcement-text">✨ Welcome to the future</span>
        </div>

        {/* Primary headline */}
        <animated.h1 className="hero-headline">
          Build Something <span className="highlight">Extraordinary</span>
        </animated.h1>

        {/* Supporting sentence */}
        <animated.p style={subheadlineSpring} className="hero-supporting">
          Craft beautiful, performant web experiences with cutting-edge tools
          and modern design principles.
        </animated.p>

        {/* CTA group */}
        <animated.div style={ctaSpring} className="hero-cta-group">
          <animated.button
            className="hero-btn hero-btn-primary"
            style={primaryButtonSpring}
            onMouseEnter={() => setHoveredButton('primary')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Get Started
          </animated.button>
          <animated.button
            className="hero-btn hero-btn-secondary"
            style={secondaryButtonSpring}
            onMouseEnter={() => setHoveredButton('secondary')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Learn More
          </animated.button>
        </animated.div>
      </animated.div>

      {/* Visual anchor - Abstract arc/portal shape */}
      <div className="hero-visual-anchor">
        <div className="hero-portal-shape"></div>
      </div>
    </animated.div>
  );
};

export default Hero;
