'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/use-store';

export const VoiceController = () => {
  const router = useRouter();
  const { voiceStatus, setVoiceStatus } = useAppStore();
  
  // Real implementation would use WebSocket here
  const toggleVoice = () => {
    if (voiceStatus === 'listening') {
      setVoiceStatus('idle');
    } else {
      setVoiceStatus('listening');
      // Simulate "Listening" -> "Processing" flow
      setTimeout(() => {
        setVoiceStatus('processing');
        // Simulate Command Execution
        setTimeout(() => {
           setVoiceStatus('idle');
           alert("🤖 AI: I'm navigating you to the Pricing section.");
           // window.scrollTo(...)
        }, 1500);
      }, 2000);
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2">
       {voiceStatus !== 'idle' && (
         <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm border border-white/10 backdrop-blur mb-2 animate-fade-in">
            {voiceStatus === 'listening' ? 'Listening...' : 'Processing command...'}
         </div>
       )}
       
      <button 
        onClick={toggleVoice}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-2 ${
          voiceStatus === 'listening' 
            ? 'bg-red-500 border-red-400 scale-110 animate-pulse' 
            : 'bg-primary border-primary/50 hover:scale-105'
        }`}
      >
        <span className="text-2xl">🎤</span>
      </button>
    </div>
  )
}
