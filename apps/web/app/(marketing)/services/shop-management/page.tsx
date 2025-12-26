export default function ShopManagementInfo() {
  return (
    <div className="py-20 px-4">
      <h1 className="text-5xl font-bold mb-6">AI Shop Management</h1>
      <p className="text-xl text-muted-foreground mb-8">Automate inventory, sales, and staff with AI.</p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h3 className="font-bold">Inventory Tracking</h3>
          <p className="text-sm mt-2 text-muted-foreground">Auto-deduct stock on sales.</p>
        </div>
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h3 className="font-bold">Staff AI</h3>
          <p className="text-sm mt-2 text-muted-foreground">Monitor attendance and performance.</p>
        </div>
      </div>
      <button className="mt-8 bg-primary px-8 py-3 rounded-lg font-bold">Start Managing</button>
    </div>
  )
}
