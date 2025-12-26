#!/bin/bash

# ==========================================
# SAAS LOGIC & CODE POPULATOR
# ==========================================
# Purpose: Fills the empty folders with actual functional code (Middleware, AI, Pages).
# Run this AFTER 'scaffold_saas_architecture.sh' and 'inject_design_system.sh'.

echo "🧠 Injecting Functional Code (Security, AI, Pages)..."

# ==========================================
# 1. MIDDLEWARE (The Security Guard)
# ==========================================
echo "Writing Middleware..."

cat <<EOF > apps/web/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const token = request.cookies.get('auth-token')?.value // In real app, verify this JWT

  // 1. PUBLIC ROUTES (Skip Auth)
  if (url.pathname.startsWith('/_next') || 
      url.pathname.startsWith('/api') || 
      url.pathname.startsWith('/static') ||
      url.pathname === '/' || 
      url.pathname === '/login' || 
      url.pathname === '/register') {
    return NextResponse.next()
  }

  // 2. AUTH GUARD
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 3. ROLE BASED ROUTING (Mock Logic)
  // Real app main token decode karke role check hoga
  const userRole = 'CLIENT' // Mock role

  if (url.pathname.startsWith('/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/client', request.url)) // Kick to client dashboard
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
EOF

# ==========================================
# 2. STATE MANAGEMENT (Zustand Store)
# ==========================================
echo "Creating 3D State Store..."

cat <<EOF > apps/web/stores/use-store.ts
import { create } from 'zustand'

interface AppState {
  is3DReady: boolean
  activeModel: string | null
  voiceStatus: 'listening' | 'processing' | 'speaking' | 'idle'
  setVoiceStatus: (status: 'listening' | 'processing' | 'speaking' | 'idle') => void
  loadModel: (modelUrl: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  is3DReady: false,
  activeModel: null,
  voiceStatus: 'idle',
  setVoiceStatus: (status) => set({ voiceStatus: status }),
  loadModel: (url) => set({ activeModel: url, is3DReady: true }),
}))
EOF

# ==========================================
# 3. LANDING PAGE (Voice Enabled)
# ==========================================
echo "Building Landing Page..."

cat <<EOF > apps/web/app/\(marketing\)/page.tsx
'use client'
import { VoiceController } from '@/components/visitor-experience/VoiceController'
import { Logo } from '@/components/ui/logo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-border bg-glass backdrop-blur-xs">
        <Logo />
        <div className="flex gap-4 text-sm font-medium">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="/login" className="text-primary">Login</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center mt-20 text-center px-4">
        <div className="bg-neon-blue/10 text-neon-blue px-3 py-1 rounded-full text-xs mb-4 border border-neon-blue/20">
          AI Architecture v1.0 Live
        </div>
        <h1 className="text-6xl font-heading font-bold tracking-tight mb-6">
          Speak to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">SaaS</span>.
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg mb-8">
          The first multi-tenant platform controlled entirely by voice and 3D gestures.
          Try saying "Scroll to Pricing".
        </p>
        
        <div className="flex gap-4">
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:opacity-90 transition">
            Get Started
          </button>
          <button className="bg-muted text-foreground px-8 py-3 rounded-lg font-bold hover:bg-muted/80">
            View Demo
          </button>
        </div>

        {/* 3D Placeholder */}
        <div className="w-full max-w-4xl h-96 mt-16 bg-glass border border-white/10 rounded-xl flex items-center justify-center">
          <span className="text-muted-foreground animate-pulse">Initializing 3D Neural Network...</span>
        </div>
      </main>

      {/* The Real Logic */}
      <VoiceController />
    </div>
  )
}
EOF

# ==========================================
# 4. CLIENT DASHBOARD (The Product)
# ==========================================
echo "Building Client Dashboard..."

cat <<EOF > apps/web/app/\(dashboards\)/client/page.tsx
'use client'
import { useAppStore } from '@/stores/use-store'

export default function ClientDashboard() {
  const { voiceStatus, setVoiceStatus } = useAppStore()

  return (
    <div className="h-full flex flex-col relative">
      {/* 3D Workspace */}
      <div className="flex-1 bg-black/20 rounded-xl border border-white/5 m-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] opacity-10 pointer-events-none">
           {/* Grid Lines simulation */}
           <div className="col-span-1 border-r border-white h-full"></div>
        </div>
        <h2 className="text-2xl font-bold text-white/50">3D Canvas Area</h2>
      </div>

      {/* Voice Control Bar */}
      <div className="h-24 bg-glass border-t border-white/10 flex items-center justify-center gap-6 px-8">
        <button 
          onClick={() => setVoiceStatus('listening')}
          className={\`w-16 h-16 rounded-full flex items-center justify-center transition-all \${
            voiceStatus === 'listening' ? 'bg-red-500 shadow-neon animate-pulse' : 'bg-primary'
          }\`}
        >
          🎤
        </button>
        <div className="flex flex-col">
          <span className="text-sm font-bold">AI Voice Command</span>
          <span className="text-xs text-muted-foreground">
            {voiceStatus === 'listening' ? 'Listening...' : 'Click mic to speak'}
          </span>
        </div>
      </div>
    </div>
  )
}
EOF

# ==========================================
# 5. AI ENGINE (Backend Logic)
# ==========================================
echo "Writing AI Backend Logic..."

# Main Entry
cat <<EOF > apps/ai-engine/main.py
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from sockets.s2s_handler import speech_to_speech_endpoint
import uvicorn

app = FastAPI()

# Allow Next.js to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "AI Engine Online", "gpu_status": "mock_enabled"}

@app.websocket("/ws/s2s")
async def websocket_endpoint(websocket: WebSocket):
    await speech_to_speech_endpoint(websocket)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
EOF

# S2S Handler Logic
cat <<EOF > apps/ai-engine/sockets/s2s_handler.py
from fastapi import WebSocket
import asyncio
import json

async def speech_to_speech_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected via WebSocket")
    
    try:
        while True:
            # 1. Receive Audio/Text
            # In real production, this would be bytes. For scaffold demo, we use text.
            data = await websocket.receive_text()
            print(f"Received: {data}")

            # 2. Mock AI Processing Delay
            await asyncio.sleep(0.5) 

            # 3. Determine Intent (Mock LLM)
            response = {"type": "text", "content": f"I heard you say: {data}"}
            
            if "pricing" in data.lower():
                 response = {"type": "command", "action": "NAVIGATE", "target": "#pricing"}
            elif "scroll" in data.lower():
                 response = {"type": "command", "action": "SCROLL", "value": 500}

            # 4. Send Response
            await websocket.send_json(response)
            
    except Exception as e:
        print(f"Connection closed: {e}")
EOF

echo "✅ All Functional Files Populated!"
echo "👉 Ab 'npm run dev' aur 'python main.py' chalayen to app khali nahi hogi."