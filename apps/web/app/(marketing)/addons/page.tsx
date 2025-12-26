export default function AddonsMarketplace() {
  const addons = [
    { name: 'Udhar Book Keeper', desc: 'Track credits and debts' },
    { name: 'Expenses Keeper', desc: 'Daily expense logging' },
    { name: 'Computer Operator', desc: 'Automated data entry' },
    { name: 'Events Notifier', desc: 'SMS alerts for dates' },
    { name: 'Call/Msg AI', desc: 'Automated client communication' }
  ]
  return (
    <div className="py-20 px-4">
      <h1 className="text-4xl font-bold mb-10">Power-Up Addons</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {addons.map(addon => (
          <div key={addon.name} className="border border-white/10 p-6 rounded-xl bg-glass-gradient hover:border-primary/50 transition">
            <h3 className="text-xl font-bold">{addon.name}</h3>
            <p className="text-sm text-muted-foreground mt-2">{addon.desc}</p>
            <button className="mt-4 text-primary underline text-sm">Learn More</button>
          </div>
        ))}
      </div>
    </div>
  )
}
