'use client'
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

export default function SiteEditor() {
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState({
    title_start: '',
    title_gradient: '',
    subtitle: ''
  })

  // 1. Fetch Current Content from DB
  useEffect(() => {
    async function load() {
      try {
        const data = await apiClient.request('/cms/config/landing_hero')
        setContent(data)
      } catch (e) {
        console.error("Failed to load config", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // 2. Save Updates to DB
  const handleSave = async () => {
    setLoading(true)
    await apiClient.request('/cms/config', {
      method: 'POST',
      body: JSON.stringify({
        key: 'landing_hero',
        value: content
      })
    })
    alert('Website Updated! Go check the homepage.')
    setLoading(false)
  }

  if (loading) return <div className="p-8">Loading Editor...</div>

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Website Content Editor</h1>
      <div className="bg-glass-gradient border border-white/10 p-8 rounded-xl space-y-6">
        
        {/* Title Start */}
        <div>
          <label className="block text-sm font-bold mb-2">Hero Title (Start)</label>
          <input 
            type="text" 
            value={content.title_start}
            onChange={(e) => setContent({...content, title_start: e.target.value})}
            className="w-full p-3 bg-black/50 border border-white/20 rounded"
          />
        </div>

        {/* Gradient Text */}
        <div>
          <label className="block text-sm font-bold mb-2">Hero Title (Highlighted)</label>
          <input 
            type="text" 
            value={content.title_gradient}
            onChange={(e) => setContent({...content, title_gradient: e.target.value})}
            className="w-full p-3 bg-black/50 border border-white/20 rounded text-neon-blue"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-bold mb-2">Subtitle Description</label>
          <textarea 
            value={content.subtitle}
            onChange={(e) => setContent({...content, subtitle: e.target.value})}
            className="w-full p-3 h-32 bg-black/50 border border-white/20 rounded"
          />
        </div>

        <button 
          onClick={handleSave}
          className="bg-primary px-8 py-3 rounded font-bold text-white hover:opacity-90 w-full"
        >
          {loading ? 'Saving...' : 'Publish Changes to Live Site'}
        </button>

      </div>
    </div>
  )
}
