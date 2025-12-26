# **SAAS VISUAL IMPLEMENTATION GUIDE (VS Code)**

Ye guide batati hai keh aapnay Architecture Plan ko follow kartay hue **Theme** aur **Layout** ko kahan aur kaise code karna hai.

## **STEP 1: THEME DNA (Tailwind Config)**

File Location: /apps/web/tailwind.config.ts  
Raaz: Colors ko hardcode mat karen. "Semantic Names" use karen (e.g., primary, destructive) taake Theme change karna asaan ho.  
import type { Config } from "tailwindcss"

const config \= {  
  darkMode: \["class"\],  
  content: \[  
    './pages/\*\*/\*.{ts,tsx}',  
    './components/\*\*/\*.{ts,tsx}',  
    './app/\*\*/\*.{ts,tsx}',  
  \],  
  theme: {  
    container: {  
      center: true,  
      padding: "2rem",  
      screens: {  
        "2xl": "1400px",  
      },  
    },  
    extend: {  
      // 1\. COLORS (Linked to CSS Variables for Runtime Theming)  
      colors: {  
        border: "hsl(var(--border))",  
        background: "hsl(var(--background))",  
        foreground: "hsl(var(--foreground))",  
        primary: {  
          DEFAULT: "hsl(var(--primary))", // Ye wo color hai jo Database se change hoga  
          foreground: "hsl(var(--primary-foreground))",  
        },  
        muted: {  
          DEFAULT: "hsl(var(--muted))",  
          foreground: "hsl(var(--muted-foreground))",  
        },  
        // AI & 3D Specific Colors  
        neon: {  
           blue: "\#00f3ff",  
           purple: "\#bc13fe",  
        }  
      },  
      // 2\. GLASSMORPHISM & EFFECTS (The "SaaS Look")  
      backgroundImage: {  
        'glass': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',  
      },  
      backdropBlur: {  
        'xs': '2px',  
      },  
      // 3\. ANIMATIONS (Framer Motion is preferred, but these are for simple CSS needs)  
      animation: {  
        "accordion-down": "accordion-down 0.2s ease-out",  
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1\) infinite",  
      },  
    },  
  },  
  plugins: \[require("tailwindcss-animate")\],  
} satisfies Config

export default config

## **STEP 2: CSS VARIABLES (The Switchboard)**

File Location: /apps/web/app/globals.css  
Raaz: Yahan hum default colors set karte hain. ThemeProvider inhi variables ko Javascript ke zariye override karta hai jab koi Franchise login karti hai.  
@tailwind base;  
@tailwind components;  
@tailwind utilities;  
   
@layer base {  
  :root {  
    /\* Default Light Mode \*/  
    \--background: 0 0% 100%;  
    \--foreground: 222.2 84% 4.9%;  
    \--primary: 221.2 83.2% 53.3%; /\* Default Blue \*/  
    \--primary-foreground: 210 40% 98%;  
    \--radius: 0.5rem;  
  }  
   
  .dark {  
    /\* Dark Mode (AI SaaS Default) \*/  
    \--background: 222.2 84% 4.9%;  
    \--foreground: 210 40% 98%;  
    \--primary: 217.2 91.2% 59.8%;  
    \--primary-foreground: 222.2 47.4% 11.2%;  
  }  
}  
   
/\* 3D Canvas Reset \*/  
canvas {  
  touch-action: none; /\* Mobile par scroll block na kare \*/  
}

## **STEP 3: THE LAYOUT SKELETON (Sidebar Logic)**

File Location: /apps/web/app/(dashboards)/layout.tsx  
Raaz: Layout file decide karti hai keh Sidebar kahan hoga aur Page content kahan render hoga.  
import { Sidebar } from "@/components/ui/sidebar"  
import { Header } from "@/components/ui/header"

export default function DashboardLayout({  
  children, // Ye aapka page.tsx hai  
}: {  
  children: React.ReactNode  
}) {  
  return (  
    \<div className="flex h-screen overflow-hidden bg-background"\>  
      {/\* 1\. SIDEBAR (Fixed Width) \*/}  
      \<aside className="w-64 hidden md:block border-r border-border bg-glass backdrop-blur-md"\>  
        \<Sidebar /\>  
      \</aside\>

      {/\* 2\. MAIN CONTENT AREA \*/}  
      \<div className="flex-1 flex flex-col"\>  
        {/\* Sticky Header \*/}  
        \<header className="h-16 border-b border-border flex items-center px-6 justify-between"\>  
            \<Header /\> {/\* User Profile, Notifications \*/}  
        \</header\>

        {/\* Scrollable Page Content \*/}  
        \<main className="flex-1 overflow-y-auto p-6 relative"\>  
           {/\* 3D Background Layer (Optional) \*/}  
           \<div className="absolute inset-0 \-z-10 opacity-20 pointer-events-none"\>  
              {/\* \<Particles /\> or \<ThreeJsBackground /\> \*/}  
           \</div\>

           {children}  
        \</main\>  
      \</div\>  
    \</div\>  
  )  
}

## **AB KYA KARNA HAI? (Action Plan)**

1. **Tailwind Setup:** Upar wala tailwind.config.ts code copy karen aur apni file replace karen.  
2. **Colors Define:** globals.css main jakar \--primary ki value change karen aur dekhen puri site ka rang badal jayega.  
3. **Sidebar Structure:** layout.tsx wala code copy karen. Ab jab bhi aap koi naya page banayenge, wo automatically Sidebar aur Header ke sath aayega.

Ye hai wo tareeka jis se aap Theme aur Layout ko **Control** karte hain, na ke har page par dubara banatay hain.