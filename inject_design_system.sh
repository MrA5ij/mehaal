#!/bin/bash

# ==========================================
# 2. SAAS DESIGN SYSTEM INJECTOR
# ==========================================
# Run this SECOND.
# Purpose: Injects Logo, CSS Variables, and Root Layouts.

echo "🎨 Injecting Design System..."

# 1. LOGO COMPONENT
mkdir -p apps/web/components/ui
cat <<EOF > apps/web/components/ui/logo.tsx
import React from 'react';
export const Logo = ({ className }: { className?: string }) => (
  <div className={\`font-bold text-xl flex items-center gap-2 \${className}\`}>
    <span>MySaaS</span>
  </div>
);
EOF

# 2. GLOBAL CSS
cat <<EOF > apps/web/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
  }
}
body { @apply bg-background text-foreground; }
EOF

# 3. ROOT LAYOUT
cat <<EOF > apps/web/app/layout.tsx
import './globals.css'
import { ThemeProvider } from '@repo/ui/theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
         <ThemeProvider tenant={{ primaryColor: '#000000' }}>
            {children}
         </ThemeProvider>
      </body>
    </html>
  )
}
EOF

echo "✅ Design System Injected."