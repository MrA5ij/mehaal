import { create } from 'zustand'

interface AppState {
  // 3D Scene State
  is3DReady: boolean
  activeModel: string | null
  cameraPosition: [number, number, number]
  
  // Voice Engine State
  voiceStatus: 'listening' | 'processing' | 'speaking' | 'idle'
  lastTranscript: string
  
  // Actions
  setVoiceStatus: (status: 'listening' | 'processing' | 'speaking' | 'idle') => void
  setTranscript: (text: string) => void
  loadModel: (url: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  is3DReady: false,
  activeModel: null,
  cameraPosition: [0, 0, 5],
  
  voiceStatus: 'idle',
  lastTranscript: '',
  
  setVoiceStatus: (status) => set({ voiceStatus: status }),
  setTranscript: (text) => set({ lastTranscript: text }),
  loadModel: (url) => set({ activeModel: url, is3DReady: true }),
}))
