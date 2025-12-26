#!/bin/bash

# ==========================================
# 🎨 THEME ENFORCER (VISUAL FIX)
# ==========================================
# Purpose: Ensures 'globals.css' is imported in Root Layout.
# This fixes the "Plain White Page" issue.

echo "🎨 Checking Visual Theme Integration..."

# 1. ENSURE GLOBAL CSS EXISTS
mkdir -p apps/web/app
cat <<EOF > apps/web/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 224 71% 4%;
    --foreground: 210 40% 98%;
    --primary: 263 70% 50%;
    --radius: 0.75rem;
  }
}

body {
  @apply bg-background text-foreground antialiased;
  background-image: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #020617 70%);
  min-height: 100vh;
}
EOF

# 2. INJECT CSS INTO ROOT LAYOUT (The Critical Step)
# Agar ye line nahi hogi, to Tailwind load hi nahi hoga.
cat <<EOF > apps/web/app/layout.tsx
import './globals.css' // <--- YE LINE ZAROORI HAI
import { Inter, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@repo/ui/theme-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' })

export const metadata = {
  title: 'My AI SaaS',
  description: 'AI-powered Architecture',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={\`\${inter.variable} \${spaceGrotesk.variable} font-sans antialiased\`}>
         <ThemeProvider tenant={{ primaryColor: '#7c3aed' }}>
            {children}
         </ThemeProvider>
      </body>
    </html>
  )
}
EOF

echo "✅ THEME CONNECTED."
echo "👉 Ab page refresh karen. Background Dark Blue/Black hona chahiye."