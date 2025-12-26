# **SAAS MASTER ARCHITECTURE BLUEPRINT (AI, 3D, Speech)**

Project Type: Multi-Tenant AI SaaS Platform  
Tech Stack: Next.js (Frontend), Python FastAPI (AI Engine), PostgreSQL (DB), Redis (Queue), Three.js (3D).  
Author: System Architect

## **1\. THE MONOREPO STRUCTURE (VS Code Setup)**

Hum **Turborepo** use karenge taake Frontend aur AI Backend ek hi Git Repo main rahay lekin isolated ho.

/Mehaal (ROOT)  
├── /apps  
│   ├── /web                     \<-- Next.js 14 (App Router) \- The User Interface  
│   │   ├── /app                 \<-- Routing Logic (See Section 3\)  
│   │   ├── /components          \<-- 3D Canvas & UI Elements  
│   │   │   ├── /ui              \<-- Reusable Atoms (Buttons, Sliders, Cards)  
│   │   │   └── /visitor-experience \<-- Real AI Experience for Visitors  
│   │   ├── /content             \<-- MDX Files for Blog/Docs (Git-based CMS)  
│   │   ├── /lib                 \<-- Zod Schemas, Utils  
│   │   └── /stores              \<-- Zustand Stores (3D State)  
│   │  
│   └── /ai-engine               \<-- Python FastAPI \- The Brain  
│       ├── /core                \<-- PyTorch/TensorFlow Models  
│       ├── /sockets             \<-- Real-time Speech WebSocket Handlers  
│       └── /workers             \<-- Redis BullMQ Processors (Heavy AI Tasks)  
│  
├── /packages (Shared Code)  
│   ├── /database                \<-- Prisma Schema & Migrations  
│   ├── /ui                      \<-- Design System (Shadcn \+ Tailwind)  
│   └── /config                  \<-- Shared TypeScript/Eslint Configs  
│  
├── /infrastructure              \<-- Terraform/Docker Files  
│   ├── /k8s                     \<-- Kubernetes Manifests (Production)  
│   └── docker-compose.yml       \<-- Local Development Setup  
│  
└── .github  
    └── /workflows               \<-- CI/CD Pipelines (Build & Deploy)

## **2\. DATABASE & SECURITY KERNEL (Prisma Schema)**

Ye database design 5 roles aur multi-tenancy (Franchise System) ko handle karega.

// /packages/database/schema.prisma

datasource db {  
  provider \= "postgresql"  
  url      \= env("DATABASE\_URL")  
}

// 1\. THE 5 ROLES (The core of RBAC)  
enum Role {  
  CLIENT      // End user (AI/3D consumer)  
  FRANCHISE   // Reseller (White-label manager)  
  PARTNER     // B2B Partner (API access)  
  OPERATOR    // Internal Staff (Manual AI training/ops)  
  ADMIN       // Super User (System Control)  
}

// 2\. TENANT SYSTEM (For Franchises & Partners)  
model Tenant {  
  id          String   @id @default(cuid())  
  name        String  
  slug        String   @unique // Subdomain logic (franchise-a.saas.com)  
    
  // Dynamic Theming Secrets  
  primaryColor String  @default("\#000000")   
  logoUrl      String?  
  fontFamily   String  @default("Inter")

  users       User\[\]  
  apiKeys     ApiKey\[\]  
}

// 3\. USER MODEL  
model User {  
  id        String  @id @default(cuid())  
  email     String  @unique  
  password  String  // Hashed  
  role      Role    @default(CLIENT)  
    
  tenantId  String?  
  tenant    Tenant? @relation(fields: \[tenantId\], references: \[id\])

  // AI Usage Limits  
  credits   Int     @default(100)  
}

## **3\. ROUTING ARCHITECTURE (Next.js App Router)**

Hum Route Groups () ka istimal kar kay pages ko organize karenge.  
Marketing Strategy: Public pages ko SEO aur Voice-Navigation ke liye optimize kiya gaya hai.  
**Folder Path:** /apps/web/app/

/app  
├── /(marketing)                 \<-- Public Pages (Voice Enabled & SEO Optimized)  
│   ├── layout.tsx               \<-- Global Marketing Nav (Voice Status Indicator)  
│   ├── page.tsx                 \<-- Homepage (AI Hero, Social Proof, 3D Demo)  
│   │  
│   ├── /product                 \<-- Acquisition Layer  
│   │   ├── /features/page.tsx   \<-- Deep dive into AI/3D Tech  
│   │   ├── /solutions           \<-- Industry Specific LPs  
│   │   │   └── /\[industry\]/page.tsx (Dynamic: /solutions/healthcare, /solutions/gaming)  
│   │   ├── /pricing/page.tsx    \<-- Subscription Plans (Stripe Integration)  
│   │   ├── /integrations/page.tsx  
│   │   └── /case-studies/page.tsx  
│   │  
│   ├── /resources               \<-- Content & Engagement (MDX Powered)  
│   │   ├── /blog/\[slug\]/page.tsx  
│   │   ├── /webinars/page.tsx  
│   │   └── /newsletter/page.tsx  
│   │  
│   ├── /company                 \<-- Trust & Info  
│   │   ├── /about/page.tsx  
│   │   ├── /careers/page.tsx  
│   │   └── /contact/page.tsx    \<-- Enterprise Sales Form  
│   │  
│   └── /legal                   \<-- Compliance (Static Generation)  
│       ├── /privacy/page.tsx  
│       ├── /terms/page.tsx  
│       └── /security/page.tsx  
│  
├── /(auth)                      \<-- Conversion Points  
│   ├── /login/page.tsx  
│   ├── /register/page.tsx       \<-- Free Trial Entry Point  
│   └── /demo-request/page.tsx   \<-- Enterprise Gate  
│  
├── /(dashboards)                \<-- SECURED AREA (Middleware Protected)  
│   ├── layout.tsx               \<-- Checks Auth Token & Role  
│   │  
│   ├── /client                  \<-- ROLE: CLIENT (The Product)  
│   │   ├── layout.tsx           \<-- Focus Mode  
│   │   └── page.tsx             \<-- 3D Editor & Speech-to-Speech  
│   │  
│   ├── /franchise               \<-- ROLE: FRANCHISE  
│   ├── /partner                 \<-- ROLE: PARTNER  
│   ├── /operator                \<-- ROLE: OPERATOR (Support/Ops)  
│   └── /admin                   \<-- ROLE: ADMIN  
│  
└── /status                      \<-- EXTERNAL REDIRECT (Don't host status page on same server)

## **4\. THEME & LAYOUT ENGINE (The "Secret" Sauce)**

Dynamic branding ke liye hum CSS Variables ko runtime par inject karenge.

**File:** /packages/ui/theme-provider.tsx

'use client'

export function ThemeProvider({ tenant, children }) {  
  // Database se laye gaye colors ko CSS variables main convert karna  
  const styles \= {  
    '--primary': tenant?.primaryColor || '\#000000',  
    '--radius': '0.5rem',  
  } as React.CSSProperties;

  return (  
    \<div style={styles} className="theme-wrapper"\>  
      {/\* 3D Context aur Auth Context yahan wrap hongay \*/}  
      {children}  
    \</div\>  
  )  
}

## **5\. AI, 3D & SPEECH INTEGRATION (The Tech Stack)**

### **A. 3D Implementation (React Three Fiber)**

* **Performance Rule:** 3D Canvas ko Page level par nahi, Template level par load karna taake navigation par Model reload na ho.  
* **State:** Use **Zustand** store to sync 3D scene with React UI.

### **B. Real-time Speech-to-Speech (S2S) Pipeline**

Yahan hum "Full Duplex" audio stream use karenge. Latency kam karne ke liye STT (Whisper), LLM (Llama/GPT), aur TTS (ElevenLabs/XTTS) ko stream karna parega.

Architecture Flow:  
Audio In \-\> WebSocket \-\> STT \-\> Text \-\> LLM \-\> Response Text \-\> TTS \-\> Audio Out \-\> WebSocket \-\> Client Speaker

### **C. THE LIVE VISITOR EXPERIENCE (Voice-First Marketing)**

Marketing pages par "Voice Navigation" active rahegi.

**Logic Flow:**

1. Visitor says: *"Do you have integration with Slack?"*  
2. **AI Action:**  
   * Context: Visitor is on Homepage.  
   * Decision: Redirect to /product/integrations and highlight "Slack".  
3. **TTS Response:** *"Yes, we support full Slack bi-directional sync. Taking you to the integrations page now."*

**Security Raaz:**

* **Rate Limiting (Real):** Visitor IP ko Redis main track kia jata hai. 5 commands ke baad, AI softly bolti hai: *"To continue using my full capabilities, please sign up."*

**Frontend Implementation:**

// /apps/web/components/visitor-experience/VoiceController.tsx  
const handleVoiceCommand \= (intent: any) \=\> {  
  // Unified Command Handler for Marketing Site  
  if (intent.action \=== 'NAVIGATE') {  
    // E.g., intent.target \= '/product/pricing'  
    router.push(intent.target);  
  }  
}

**Server Side (Python FastAPI \- Unified Logic):**

\# /apps/ai-engine/sockets/s2s\_handler.py

@app.websocket("/ws/s2s")  
async def speech\_to\_speech\_endpoint(websocket: WebSocket, client\_type: str \= "visitor"):  
    await websocket.accept()  
      
    \# "Visitor" context loads Marketing Knowledge Base (Pricing, FAQs, etc.)  
    system\_prompt \= load\_system\_prompt(client\_type)   
      
    while True:  
        \# 1\. Receive Audio Chunk  
        audio\_chunk \= await websocket.receive\_bytes()  
          
        \# 2\. Transcribe (Real Production Model)  
        user\_text \= stt\_model.transcribe\_stream(audio\_chunk)  
          
        if user\_text.is\_complete\_sentence():  
            \# 3\. LLM Processing (Real Brain)  
            ai\_decision \= llm\_chain.decide\_action(user\_text, context=system\_prompt)

            if ai\_decision.is\_command:  
                 await websocket.send\_json({"type": "command", "data": ai\_decision.command})

            \# 4\. Generate Audio (Real TTS)  
            audio\_stream \= tts\_engine.generate\_stream(ai\_decision.response\_text)  
              
            for chunk in audio\_stream:  
                await websocket.send\_bytes(chunk)

## **6\. DEVELOPMENT TO PRODUCTION PIPELINE**

### **Phase 1: Local Development**

* **Docker Compose:** Ek command docker-compose up se Postgres, Redis, Python API aur Next.js sab chal jayen.  
* **Mocking:** AI API ko locally mock karen taake GPU ki zarurat na paray UI banatay waqt.

### **Phase 2: CI/CD (GitHub Actions)**

Jese hi code push ho, yeh steps chalain:

1. **Lint & Type Check:** TypeScript errors check.  
2. **Test:** Unit tests run.  
3. **Build Docker:** /apps/ai-engine ka Docker Image banay aur GHCR (GitHub Container Registry) main push karay.

### **Phase 3: Deployment Strategy**

* **Frontend (Next.js):** Vercel par deploy hoga (Edge Networks for fast 3D asset loading).  
* **Backend (Python):** Railway ya AWS ECS par deploy hoga (GPU Enabled Instances).  
* **Database:** Supabase ya AWS RDS.  
* **Status Page:** Hosted separately (e.g., Atlassian Statuspage or independent static site) to ensure availability during outages.

## **7\. VISUAL ENGINEERING SYSTEM (Animations, Effects & Sliders)**

Code likhne se pehlay "Design System" define hota hai. Ye wo jagah hai jahan Effects aur Animations rehti hain.

### **A. The Animation Engine (Framer Motion)**

Hum CSS animations nahi use karenge (complex hoti hain). Hum **Framer Motion** use karenge for React.

* **Location:** /apps/web/components/ui/motion  
* **Strategy:** Reusable Animation Wrapper.  
  // Usage: \<FadeIn delay={0.2}\> \<Card /\> \</FadeIn\>  
  export const FadeIn \= ({ children }) \=\> (  
    \<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}\>  
      {children}  
    \</motion.div\>  
  )

### **B. Sliders & Carousels (Embla Carousel)**

Sliders ke liye heavy plugins (Swiper) mat use karna. **Embla Carousel** best hai kyunkeh ye headless hai aur 3D feel deta hai.

* **Location:** /apps/web/components/ui/carousel.tsx (Shadcn UI compatible).  
* **Use Case:** Testimonials, Feature Showcase.

### **C. Glassmorphism & Neon Effects (Tailwind Config)**

3D aur AI look ke liye "Glass" effect zaroori hai. Isay har file main repeat mat karna.

* **Location:** /apps/web/tailwind.config.ts  
* **Implementation:**  
  theme: {  
    extend: {  
      backgroundImage: {  
        'glass-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',  
      },  
      backdropBlur: {  
        'xs': '2px',  
      },  
      boxShadow: {  
        'neon': '0 0 20px rgba(0, 255, 255, 0.5)',  
      }  
    }  
  }

* **Usage:** Class main bas bg-glass-gradient shadow-neon backdrop-blur-md likhna hoga.

## **8\. EXECUTION CHECKLIST (Start Here)**

1. npx create-turbo@latest chalao.  
2. Upar diye gaye folders /apps/web aur /apps/ai-engine banao.  
3. /(marketing) folder ke andar sabhi sub-pages (/product, /company, /legal) create karo.  
4. Tailwind config main "Glassmorphism" utilities add karo.  
5. Landing Page ke liye VoiceController component banao (connected to Real WebSocket).  
6. GitHub par push karo aur Vercel connect karo.