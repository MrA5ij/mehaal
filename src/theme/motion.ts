export const motionPresets = {
  "slow-fade-scale": {
    from: { opacity: 0, transform: "scale(0.98)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 80, friction: 20 }
  },
  "subtle-float": {
    loop: true,
    from: { transform: "translateY(0px)" },
    to: { transform: "translateY(-6px)" },
    config: { duration: 4000 }
  },
  "soft-pulse": {
    loop: true,
    from: { opacity: 0.9 },
    to: { opacity: 1 },
    config: { duration: 1800 }
  },
  "quick-fade": {
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 600 }
  }
};

export type MotionPreset = keyof typeof motionPresets;
