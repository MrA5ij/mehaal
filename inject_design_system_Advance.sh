#!/bin/bash

# ==========================================
# 2. SAAS DESIGN SYSTEM INJECTOR (ADVANCED)
# ==========================================
# Run this SECOND.
# Purpose: Injects Professional SVG Logo, Neon/Glass CSS, and Tailwind Config.

echo "🎨 Injecting Advanced Design System..."

# 1. PROFESSIONAL LOGO COMPONENT (SVG + Theme Logic)
mkdir -p apps/web/components/ui
cat <<EOF > apps/web/components/ui/logo.tsx
import React from 'react';

export const Logo = ({ className, theme = 'dark' }: { className?: string, theme?: 'dark' | 'light' }) => {
  return (
    <div className={\`font-bold text-xl flex items-center gap-2 \${className}\`}>
      {/* SVG Logo - Colors controlled by props */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill={theme === 'dark' ? '#fff' : '#000'} />
        <path d="M16 8L24 24H8L16 8Z" fill={theme === 'dark' ? '#000' : '#fff'} />
      </svg>
      <span className="tracking-tight">MySaaS</span>
    </div>
  );
};
EOF

# 2. ADVANCED GLOBAL CSS (Glassmorphism & Neon Variables)
cat <<EOF > apps/web/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* --- LIGHT MODE --- */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%; /* Default Blue */
    --primary-foreground: 210 40% 98%;
    
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
    --radius: 0.5rem;
  }

  .dark {
    /* --- DARK MODE (Default for AI SaaS) --- */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    
    /* Dark Mode Brand Color */
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --border: 217.2 32.6% 17.5%;
  }
}

body {
  @apply bg-background text-foreground;
}

/* 3D Canvas Clean-up */
canvas {
  touch-action: none;
}
EOF

# 3. TAILWIND CONFIG (Crucial for Custom Effects)
cat <<EOF > apps/web/tailwind.config.ts
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    '../../packages/ui/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        // AI & 3D Specific Colors
        neon: {
           blue: "#00f3ff",
           purple: "#bc13fe",
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 255, 0.5)',
      }
    },
  },
  plugins: [],
} satisfies Config

export default config
EOF

# 4. ROOT LAYOUT (Fonts & Globals)
cat <<EOF > apps/web/app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@repo/ui/theme-provider' 

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' })

export const metadata: Metadata = {
  title: 'My AI SaaS Platform',
  description: 'AI-powered 3D & Speech Architecture',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={\`\${inter.variable} \${spaceGrotesk.variable} font-sans antialiased\`}>
         <ThemeProvider tenant={{ primaryColor: '#000000' }}>
            {children}
         </ThemeProvider>
      </body>
    </html>
  )
}
EOF

# 5. DASHBOARD LAYOUT (Proper Sidebar Structure)
mkdir -p apps/web/app/\(dashboards\)
cat <<EOF > apps/web/app/\(dashboards\)/layout.tsx
import { Logo } from '@/components/ui/logo';

const Sidebar = () => (
  <div className="p-4 space-y-4">
    <div className="p-2 hover:bg-muted rounded cursor-pointer flex items-center gap-2"><span>📊</span> Dashboard</div>
    <div className="p-2 hover:bg-muted rounded cursor-pointer flex items-center gap-2"><span>🧠</span> AI Tools</div>
    <div className="p-2 hover:bg-muted rounded cursor-pointer flex items-center gap-2"><span>⚙️</span> Settings</div>
  </div>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* SIDEBAR with Glass Effect */}
      <aside className="w-64 hidden md:flex flex-col border-r border-border bg-glass-gradient backdrop-blur-xs">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Logo />
        </div>
        <Sidebar />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border flex items-center px-6 justify-between bg-background/50 backdrop-blur-md sticky top-0 z-10">
           <span className="text-sm font-medium text-muted-foreground">Welcome back</span>
           <div className="w-8 h-8 bg-primary rounded-full ring-2 ring-white/20"></div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 relative">
           {children}
        </main>
      </div>
    </div>
  )
}
EOF

echo "✅ Advanced Design System Injected (Logo, Tailwind, Glassmorphism)."