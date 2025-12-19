# Mehaal Frontend Prototype v3.0

## 🎯 Overview

This is the **Hero Section prototype** for Mehaal — a modern SaaS landing page starter with cutting-edge animations and design.

**Status:** ✅ Prototype Ready for Animation Phase

---

## 📁 Project Structure

```
frontend/
├── hero/
│   ├── Hero.jsx              # Main hero component
│   ├── Hero.css              # Hero styles
│   ├── hero.theme.ts         # Color, typography, gradient tokens
│   ├── hero.layout.ts        # Spacing & alignment rules
│   ├── hero.motion.ts        # Animation presets (react-spring)
│   └── index.ts              # Exports
├── assets/                   # Static assets (images, icons, etc.)
├── App.jsx                   # App wrapper
├── App.css                   # App styles
├── index.css                 # Global styles
├── main.jsx                  # Entry point
├── package.json
├── vite.config.js            # Vite config
├── tsconfig.json             # TypeScript config
├── index.html                # HTML template
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:3000`

### Build

```bash
npm run build
npm run preview
```

---

## 🎨 Key Features

### ✨ Hero Section Components

1. **Background Layers**
   - Dark gradient base
   - Radial glow effect
   - Arc glow accent
   - Subtle noise texture

2. **Header (Visual Only)**
   - Logo placeholder
   - Navigation links with hover underline animation
   - Sign-in CTA button

3. **Hero Content**
   - Announcement pill
   - Large, confident headline with gradient text
   - Supporting subheadline
   - Dual CTA buttons (Primary + Secondary)

4. **Visual Anchor**
   - Rotating portal/arc shape
   - Subtle blur effect
   - Positioned bottom-right

### 🎭 Animations (via react-spring)

- **Fade-in:** Main container fades in smoothly
- **Slide-up:** Headlines, text, and CTAs slide up with stagger
- **Button Pulse:** Hover effect with glow and scale
- **Parallax Portal:** Continuous rotation on visual anchor
- **Responsive:** Adapts to all screen sizes

### 🎨 Theme System

All colors, spacing, and typography are defined in centralized token files:

- `hero.theme.ts` — Colors, gradients, typography
- `hero.layout.ts` — Spacing, alignment, responsive breakpoints
- `hero.motion.ts` — Animation presets and timing

**Easy to customize:** Change tokens once, updates everywhere.

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **Vite** — Lightning-fast build tool
- **@react-spring/web** — Smooth animations
- **TypeScript** — Type safety (optional)
- **CSS** — Modern, responsive styling

---

## 📱 Responsive Design

- **Desktop** (1024px+) — Full hero with portal effect
- **Tablet** (768px - 1023px) — Scaled content
- **Mobile** (< 768px) — Optimized layout, stacked navigation

---

## ✅ Rules & Principles

### Hero Design Rules
1. **Isolation:** Hero is NOT coupled to any app logic
2. **Reusability:** Can be used as a standalone module
3. **Performance:** No data fetching, no API calls
4. **Animation Purpose:** Every animation enhances content, doesn't overshadow it

### Animation Principles
- **Speed & Consistency:** All animations follow the same timing
- **Content First:** Message loads immediately, animation enhances
- **Purposeful Motion:** Every movement guides user attention

---

## 🎬 Next Steps (Roadmap)

- [ ] CMS binding (dynamic headline, copy)
- [ ] Page routing system
- [ ] Additional landing page sections
- [ ] Backend integration (C# / Python)
- [ ] Advanced parallax effects
- [ ] Custom cursor implementation
- [ ] Scroll-triggered animations

---

## 🔧 Customization

### Change Colors
Edit `hero.theme.ts`:
```typescript
colors: {
  accent: {
    primary: '#YOUR_COLOR', // Change primary accent
  },
}
```

### Change Animation Speed
Edit `hero.motion.ts`:
```typescript
timing: {
  normal: { duration: 600 }, // Adjust duration
}
```

### Adjust Spacing
Edit `hero.layout.ts`:
```typescript
components: {
  button: {
    padding: '1rem 2rem', // Your spacing
  },
}
```

---

## 📚 File Descriptions

| File | Purpose |
|------|---------|
| `Hero.jsx` | React component with animation logic |
| `Hero.css` | All styling for hero section |
| `hero.theme.ts` | Design tokens (colors, typography) |
| `hero.layout.ts` | Spacing & layout constants |
| `hero.motion.ts` | Animation presets for react-spring |
| `index.ts` | Clean exports for easy imports |

---

## 🚫 What's NOT Included

- ❌ API calls / data fetching
- ❌ CMS logic
- ❌ Authentication
- ❌ Routing / page system
- ❌ State management
- ❌ Complex animation physics

**Why?** Keeping hero focused and reusable. Add these layers to parent app as needed.

---

## 💡 Tips

1. **Test animations:** Use browser dev tools to slow down animations for review
2. **Accessibility:** All buttons support keyboard navigation and focus states
3. **Performance:** Portal effect uses CSS rotation (GPU-accelerated)
4. **Mobile:** Animations still smooth on mobile, no jank

---

## 📞 Support

For questions or issues, refer to the architectural decisions in this README or check component comments.

---

**Status:** ✅ Hero locked. Ready for phase 2 (CMS, Routing, Backend)

Happy building! 🚀
