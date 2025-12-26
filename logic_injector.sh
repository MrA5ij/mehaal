#!/bin/bash

# ==========================================
# 5. SAAS LOGIC INJECTOR (THE DEVELOPER'S TOUCH)
# ==========================================
# Purpose: Replaces "Dummy UI" with "Functional React Logic" (State, API, 3D Canvas).
# Focus: Shop AI & 3D Configurator Wiring.
# Run this AFTER 'inject_all_pages.sh'.

echo "🔌 Wiring the Architecture... Connecting UI to Logic..."

# ==========================================
# 1. THE API BRIDGE (Network Layer)
# ==========================================
# Developer Note: Har page par fetch() likhna paap hai. Hum centralized client banayenge.
echo "👉 Creating API Bridge..."

mkdir -p apps/web/lib
cat <<EOF > apps/web/lib/api-client.ts
// The Core Bridge between Next.js and Python AI Engine
const AI_ENGINE_URL = process.env.NEXT_PUBLIC_AI_ENGINE_URL || 'http://localhost:8000';

export const apiClient = {
  // Generic GET
  get: async (endpoint: string) => {
    const res = await fetch(\`\${AI_ENGINE_URL}\${endpoint}\`);
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },

  // Generic POST (for AI Jobs)
  post: async (endpoint: string, data: any) => {
    const res = await fetch(\`\${AI_ENGINE_URL}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Shop Specific: Sync Inventory
  syncInventory: async (shopId: string) => {
    // In production, this hits Redis/DB. Here we mock for speed.
    return [
      { id: 1, name: 'Wireless Headset', stock: 45, price: 99 },
      { id: 2, name: 'Mechanical Keyboard', stock: 12, price: 150 },
      { id: 3, name: 'Gaming Mouse', stock: 28, price: 60 },
    ];
  }
};
EOF

# ==========================================
# 2. SHOP AI (Real Inventory Logic)
# ==========================================
# Developer Note: Ab hum "Hardcoded HTML" hata kar "React State" lagayenge.
echo "👉 Wiring Shop AI Logic..."

cat <<'EOF' > "apps/web/app/(dashboards)/client/shop-ai/page.tsx"
'use client'
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export default function ShopAIApp() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [salesLog, setSalesLog] = useState<string[]>([]);

  // 1. Load Data on Mount
  useEffect(() => {
    async function loadData() {
      // Simulating API Call
      const data = await apiClient.syncInventory('shop_123');
      setInventory(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // 2. Logic: Handle Sale (Update State)
  const handleSale = (id: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id && item.stock > 0) {
        setSalesLog(logs => [\`Sold 1x \${item.name}\`, ...logs]);
        return { ...item, stock: item.stock - 1 };
      }
      return item;
    }));
  };

  return (
    <div className="h-full flex flex-col p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">🏪 Live Shop Manager</h1>
          <p className="text-xs text-green-400 font-mono">● SYSTEM ONLINE</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => alert('AI Forecasting Report Generating...')} className="bg-white/10 px-4 py-2 rounded text-sm hover:bg-white/20">
            📊 AI Forecast
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6 flex-1">
        {/* INVENTORY PANEL */}
        <div className="col-span-2 bg-black/40 border border-white/10 rounded-xl p-6 overflow-hidden flex flex-col">
           <h3 className="font-bold mb-4 flex justify-between">
             <span>Live Inventory</span>
             {loading && <span className="animate-pulse text-xs">Syncing...</span>}
           </h3>
           
           <div className="space-y-2 overflow-y-auto flex-1 pr-2">
             {inventory.map(item => (
               <div key={item.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-primary/30 transition">
                 <div>
                   <div className="font-bold">{item.name}</div>
                   <div className="text-xs text-muted-foreground">\${item.price}</div>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className={\`text-sm font-bold \${item.stock < 15 ? 'text-red-400' : 'text-green-400'}\`}>
                     {item.stock} left
                   </div>
                   <button 
                     onClick={() => handleSale(item.id)}
                     disabled={item.stock === 0}
                     className="bg-primary px-3 py-1 rounded text-xs font-bold disabled:opacity-50 hover:scale-105 transition"
                   >
                     Sell (-1)
                   </button>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* AI INSIGHTS / LOGS */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col">
           <h3 className="font-bold mb-4">AI Activity Log</h3>
           <div className="flex-1 bg-black/50 rounded-lg p-4 font-mono text-xs text-muted-foreground overflow-y-auto border border-white/5">
              {salesLog.length === 0 ? <span className="opacity-50">No recent activity...</span> : salesLog.map((log, i) => (
                <div key={i} className="mb-2 border-b border-white/5 pb-1">
                  <span className="text-neon-blue">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
           </div>
           
           <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
             <h4 className="text-blue-400 font-bold text-xs mb-1">💡 AI Tip</h4>
             <p className="text-xs text-muted-foreground">"Mechanical Keyboards" are selling fast. Re-order recommended.</p>
           </div>
        </div>
      </div>
    </div>
  )
}
EOF

# ==========================================
# 3. 3D CONFIGURATOR (Real Three.js Engine)
# ==========================================
# Developer Note: Ab hum asli 3D Component banayenge.
echo "👉 Wiring 3D Engine..."

# 3a. Create the Reusable 3D Viewer Component
mkdir -p apps/web/components/3d
cat <<EOF > apps/web/components/3d/ProductViewer.tsx
'use client'
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'

// The Actual 3D Mesh
function Model({ color, texture }: { color: string, texture: string }) {
  const meshRef = useRef<any>(null);
  
  // Auto-rotate animation
  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      {/* Simple Cube for Demo (Replace with useGLTF for real models) */}
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color={color} 
        roughness={texture === 'Leather' ? 0.8 : 0.2} 
        metalness={texture === 'Metal' ? 0.8 : 0}
      />
    </mesh>
  )
}

export default function ProductViewer({ config }: { config: any }) {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
        <Stage environment="city" intensity={0.6}>
          <Model color={config.color} texture={config.texture} />
        </Stage>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  )
}
EOF

# 3b. Wire the Configurator Page to State
cat <<'EOF' > "apps/web/app/(dashboards)/client/3d-studio/configurator/page.tsx"
'use client'
import { useState } from 'react';
import ProductViewer from '@/components/3d/ProductViewer'; // The real engine

export default function Configurator() {
  // State Management for 3D Properties
  const [config, setConfig] = useState({
    color: '#ef4444', // Default Red
    texture: 'Metal'
  });

  return (
    <div className="h-full flex">
      {/* SIDEBAR CONTROLS */}
      <div className="w-80 border-r border-white/10 p-6 bg-glass-gradient backdrop-blur-md flex flex-col z-10">
         <h2 className="text-xl font-bold mb-6">⚙️ Configuration</h2>
         
         {/* Material Color Selector */}
         <div className="mb-8">
           <label className="text-sm font-bold text-muted-foreground block mb-3">Base Color</label>
           <div className="grid grid-cols-4 gap-3">
             {['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff', '#1f2937'].map(c => (
               <button
                 key={c}
                 onClick={() => setConfig({ ...config, color: c })}
                 className={\`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 \${config.color === c ? 'border-white ring-2 ring-white/20' : 'border-transparent'}\`}
                 style={{ backgroundColor: c }}
               />
             ))}
           </div>
         </div>

         {/* Texture Logic */}
         <div className="mb-8">
           <label className="text-sm font-bold text-muted-foreground block mb-3">Material Type</label>
           <div className="space-y-2">
             {['Leather', 'Fabric', 'Metal'].map(t => (
               <button
                 key={t}
                 onClick={() => setConfig({ ...config, texture: t })}
                 className={\`w-full text-left px-4 py-3 rounded-lg text-sm border transition-all \${config.texture === t ? 'bg-primary/20 border-primary text-primary' : 'bg-black/20 border-white/5 hover:bg-white/5'}\`}
               >
                 {t}
               </button>
             ))}
           </div>
         </div>

         <div className="mt-auto">
            <button className="w-full bg-primary py-4 rounded-xl font-bold shadow-neon hover:opacity-90 transition">
              💾 Save Configuration
            </button>
         </div>
      </div>

      {/* 3D VIEWPORT (Live Render) */}
      <div className="flex-1 bg-gradient-to-br from-gray-900 to-black relative">
         <div className="absolute top-4 left-4 z-10">
           <span className="bg-black/50 text-white/50 text-xs px-2 py-1 rounded border border-white/10">
             LIVE RENDERER v2.0
           </span>
         </div>
         
         {/* The Real Engine Component */}
         <ProductViewer config={config} />
         
         <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 pointer-events-none">
            <div className="bg-black/60 px-4 py-2 rounded-full text-xs text-white/70 backdrop-blur pointer-events-auto">
              🖱️ Drag to Rotate • 🤏 Pinch to Zoom
            </div>
         </div>
      </div>
    </div>
  )
}
EOF

echo "✅ LOGIC INJECTED SUCCESSFULLY."
echo "👉 1. Shop AI: Real inventory deduction & state updates."
echo "👉 2. 3D Studio: Real Three.js Canvas with interactive controls."
echo "👉 3. API Bridge: Ready for backend connection."