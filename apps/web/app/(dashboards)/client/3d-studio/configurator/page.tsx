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
                 className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 ${config.color === c ? 'border-white ring-2 ring-white/20' : 'border-transparent'}`}
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
                 className={`w-full text-left px-4 py-3 rounded-lg text-sm border transition-all ${config.texture === t ? 'bg-primary/20 border-primary text-primary' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
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
  );
}
