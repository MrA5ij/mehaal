'use client'
import { useAppStore } from '@/stores/use-store'

export default function ClientDashboard() {
  const { voiceStatus, setVoiceStatus } = useAppStore()

  return (
    <div className="h-full flex flex-col relative">
      {/* 3D Workspace Area */}
      <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 m-6 flex items-center justify-center relative overflow-hidden shadow-inner">
        {/* Grid Simulation */}
        <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px' 
        }}></div>
        
        <h2 className="text-3xl font-heading font-bold text-white/20 z-10">Active 3D Workspace</h2>
      </div>

      {/* Voice Command Bar */}
      <div className="h-24 bg-background/80 border-t border-white/10 flex items-center justify-center gap-8 backdrop-blur-lg">
        <button 
          onClick={() => setVoiceStatus(voiceStatus === 'idle' ? 'listening' : 'idle')}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            voiceStatus === 'listening' ? 'bg-red-500 shadow-neon' : 'bg-primary hover:bg-primary/80'
          }`}
        >
          🎤
        </button>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground">AI Voice Assistant</span>
          <span className="text-xs text-muted-foreground">
            {voiceStatus === 'listening' ? 'Listening to commands...' : 'Tap to speak commands like "Rotate Model"'}
          </span>
        </div>
      </div>
    </div>
  )
}
