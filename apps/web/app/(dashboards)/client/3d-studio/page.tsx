'use client'
import Link from 'next/link'

export default function ThreeDStudioDashboard() {
  return (
    <div className="p-6 h-full">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🧊 3D Studio Hub</h1>
        <Link href="/client/3d-studio/upload" className="bg-primary px-6 py-2 rounded font-bold">
          + Upload New Model
        </Link>
      </header>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
         <Link href="/client/3d-studio/catalogue" className="p-6 bg-glass-gradient border border-white/10 rounded-xl hover:border-primary/50">
            <h3 className="text-xl font-bold mb-2">📚 Catalogue</h3>
            <p className="text-sm text-muted-foreground">Manage your 3D product library.</p>
         </Link>
         <Link href="/client/3d-studio/configurator" className="p-6 bg-glass-gradient border border-white/10 rounded-xl hover:border-primary/50">
            <h3 className="text-xl font-bold mb-2">🎨 Configurator</h3>
            <p className="text-sm text-muted-foreground">Setup color/material variants.</p>
         </Link>
         <div className="p-6 bg-glass-gradient border border-white/10 rounded-xl">
            <h3 className="text-xl font-bold mb-2">👁️ Total Views</h3>
            <p className="text-3xl font-bold">12.5k</p>
         </div>
      </div>

      <div className="border border-white/10 rounded-xl p-6">
        <h3 className="font-bold mb-4">Recent Renders</h3>
        <div className="h-32 bg-black/20 rounded flex items-center justify-center text-muted-foreground">
           No recent renders found.
        </div>
      </div>
    </div>
  )
}
