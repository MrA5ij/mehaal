'use client'
import { useState } from 'react'

export default function AddonsManager() {
  const [addons, setAddons] = useState([
    { name: 'Udhar Book Keeper', active: true },
    { name: 'Expenses Keeper', active: false },
    { name: 'Events Notifier', active: false },
    { name: 'Mobile Call/Msg AI', active: true },
  ])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">🧩 Addons Management</h1>
      <div className="grid grid-cols-2 gap-4">
        {addons.map((addon, idx) => (
          <div key={idx} className="flex justify-between items-center p-4 border border-white/10 rounded bg-glass-gradient">
             <span className="font-bold">{addon.name}</span>
             <button className={`px-3 py-1 rounded text-sm ${addon.active ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
               {addon.active ? 'Disable' : 'Enable'}
             </button>
          </div>
        ))}
      </div>
    </div>
  )
}
