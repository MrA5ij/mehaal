'use client'
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export default function ShopAIApp() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const data = await apiClient.syncInventory();
    setInventory(data);
    setLoading(false);
  }

  useEffect(() => { refresh() }, []);

  const handleSale = async (id: number) => {
    await apiClient.processSale(id);
    refresh(); // Refresh list after sale
  };

  return (
    <div className="h-full flex flex-col p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏪 Shop Management AI</h1>
        <button onClick={refresh} className="bg-white/10 px-4 py-2 rounded text-sm">Refresh Data</button>
      </header>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
           <h3 className="font-bold mb-4">Live Inventory (From Python Backend)</h3>
           {loading ? <p>Syncing...</p> : (
             <div className="space-y-2">
               {inventory.map((item: any) => (
                 <div key={item.id} className="flex justify-between p-3 bg-white/5 rounded hover:bg-white/10 transition">
                   <span>{item.name} (${item.price})</span>
                   <div className="flex gap-4 items-center">
                     <span className={item.stock < 10 ? "text-red-400" : "text-green-400"}>{item.stock} in stock</span>
                     <button onClick={() => handleSale(item.id)} className="bg-primary px-3 py-1 rounded text-xs">Sell</button>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
