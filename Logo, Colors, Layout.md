# **🎨 DESIGN CONTROL ROOM (Logo, Colors, Layout)**

Ye file aapkay SaaS ki "Look and Feel" set karnay ka manual hai. Aapko bas in 4 files ko edit karna hai.

## **1\. LOGO KAHA RAKHNA HAI? (The Identity)**

SaaS main Logo koi .png file nahi hoti, ye ek **Component** hota hai taake wo Dark/Light mode main color change kar sakay.

**Action:** Nayi file banayen: /apps/web/components/ui/logo.tsx

// File: apps/web/components/ui/logo.tsx  
import Image from 'next/image';

export const Logo \= ({ className, theme \= 'dark' }: { className?: string, theme?: 'dark' | 'light' }) \=\> {  
  // Esoteric Secret: SVG Code use karen bajaye Image URL kay, taake color CSS say control ho sakay.  
  return (  
    \<div className={\`font-bold text-xl flex items-center gap-2 ${className}\`}\>  
      {/\* Yahan apna SVG Paste karen \*/}  
      \<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="\[http://www.w3.org/2000/svg\](http://www.w3.org/2000/svg)"\>  
        \<rect width="32" height="32" rx="8" fill={theme \=== 'dark' ? '\#fff' : '\#000'} /\>  
        \<path d="M16 8L24 24H8L16 8Z" fill={theme \=== 'dark' ? '\#000' : '\#fff'} /\>  
      \</svg\>  
      \<span\>MySaaS\</span\>  
    \</div\>  
  );  
};

* **Kese Use Karen:** Jahan bhi logo chahiye, bas \<Logo /\> likhen.

## **2\. COLORS KAHA DEFINE KARNAY HAIN? (The Palette)**

Colors **CSS Variables** kay zariye control hotay hain taake runtime par change ho saken (Themes).

**Action:** Edit karen: /apps/web/app/globals.css

/\* File: apps/web/app/globals.css \*/  
@layer base {  
  :root {  
    /\* \--- LIGHT MODE COLORS \--- \*/  
    \--background: 0 0% 100%;       /\* White \*/  
    \--foreground: 222.2 84% 4.9%;  /\* Black Text \*/  
      
    /\* AAPKA BRAND COLOR YAHAN HAI (HSL Format) \*/  
    \--primary: 221.2 83.2% 53.3%;  /\* Blue (Change this\!) \*/  
    \--primary-foreground: 210 40% 98%;  
      
    /\* AI/Neon Accents \*/  
    \--neon-blue: 180 100% 50%;  
  }  
   
  .dark {  
    /\* \--- DARK MODE COLORS (Default for AI SaaS) \--- \*/  
    \--background: 222.2 84% 4.9%;  /\* Dark Grey Background \*/  
    \--foreground: 210 40% 98%;     /\* White Text \*/  
      
    /\* Dark Mode Brand Color \*/  
    \--primary: 217.2 91.2% 59.8%;    
  }  
}

* **Secret:** HSL format (e.g., 221 83% 53%) use karen taake Tailwind opacity (bg-primary/50) ko handle kar sakay. Hex codes (\#000000) mat use karen.

## **3\. FONTS KAHA BADALNAY HAIN? (Typography)**

Next.js main Google Fonts optimize ho kar aatay hain.

**Action:** Edit karen: /apps/web/app/layout.tsx

// File: apps/web/app/layout.tsx  
import { Inter, Space\_Grotesk } from 'next/font/google' // \<-- Import Font  
import './globals.css'

// 1\. Font Setup  
const inter \= Inter({ subsets: \['latin'\], variable: '--font-inter' })  
const spaceGrotesk \= Space\_Grotesk({ subsets: \['latin'\], variable: '--font-heading' })

export default function RootLayout({ children }) {  
  return (  
    \<html lang="en"\>  
      {/\* 2\. Inject Variables \*/}  
      \<body className={\`${inter.variable} ${spaceGrotesk.variable} font-sans\`}\>  
        {children}  
      \</body\>  
    \</html\>  
  )  
}

* **Tailwind Config update:** /apps/web/tailwind.config.ts main fontFamily add karen:

theme: {  
  extend: {  
    fontFamily: {  
      sans: \["var(--font-inter)"\],  
      heading: \["var(--font-heading)"\],  
    }  
  }  
}

## **4\. LAYOUT KAHA EDIT KARNA HAI? (Sidebar & Header)**

Agar aap chahtay hain Sidebar right par ho, ya Header gayab ho jaye.

**Action:** Edit karen: /apps/web/app/(dashboards)/layout.tsx

export default function DashboardLayout({ children }) {  
  return (  
    \<div className="flex h-screen bg-background"\>  
      {/\* SIDEBAR: Width yahan set karen (w-64) \*/}  
      \<aside className="w-64 border-r bg-glass"\>  
        \<Sidebar /\> {/\* Import from components \*/}  
      \</aside\>

      \<div className="flex-1 flex flex-col"\>  
        {/\* HEADER: Height yahan set karen (h-16) \*/}  
        \<header className="h-16 border-b flex items-center px-6"\>  
           \<Logo /\> {/\* Logo yahan automatic aajayega \*/}  
        \</header\>  
          
        \<main className="flex-1 p-6 overflow-auto"\>  
          {children}  
        \</main\>  
      \</div\>  
    \</div\>  
  )  
}

## **SUMMARY CHECKLIST**

1. **Logo:** /apps/web/components/ui/logo.tsx main SVG paste karen.  
2. **Colors:** /apps/web/app/globals.css main \--primary change karen.  
3. **Fonts:** /apps/web/app/layout.tsx main Google Font import karen.  
4. **Structure:** /apps/web/app/(dashboards)/layout.tsx main divs ko hila kar layout badlen.