'use client'
import { VoiceController } from '@/components/visitor-experience/VoiceController'
import { Logo } from '@/components/ui/logo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative selection:bg-neon-blue/30">
      {/* Navbar with Glass Effect */}
      <nav className="flex justify-between items-center p-6 border-b border-white/10 bg-glass-gradient backdrop-blur-md sticky top-0 z-50">
        <Logo />
        <div className="flex gap-6 text-sm font-medium items-center">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          <a href="/login" className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all">Login</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center mt-20 text-center px-4 relative z-10">
        <div className="bg-neon-blue/10 text-neon-blue px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-neon-blue/20 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
          ✨ V1.0 Architecture Live
        </div>
        
        <h1 className="text-7xl font-heading font-bold tracking-tight mb-6 max-w-4xl leading-[1.1]">
          Control your SaaS with <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-500 animate-pulse-slow">
            Voice & 3D Gestures
          </span>
        </h1>
        
        <p className="text-muted-foreground max-w-2xl text-xl mb-10 leading-relaxed">
          The first multi-tenant architecture designed for the spatial web. 
          Just say <strong>"Show me the Enterprise Plan"</strong> and watch it react.
        </p>
        
        <div className="flex gap-4 items-center">
          <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-neon">
            Start Free Trial
          </button>
          <button className="px-8 py-4 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2">
            <span>▶</span> Watch Demo
          </button>
        </div>

        {/* 3D Canvas Placeholder */}
        <div className="w-full max-w-5xl h-[500px] mt-20 bg-glass-gradient border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          <span className="text-muted-foreground/50 group-hover:text-neon-blue transition-colors font-mono">
            [ System: Initializing Neural 3D Grid... ]
          </span>
        </div>
      </main>

      {/* The Brain: Voice Controller Component */}
      <VoiceController />
    </div>
  )
}
