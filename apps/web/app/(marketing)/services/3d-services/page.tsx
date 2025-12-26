export default function ThreeDServicesInfo() {
  return (
    <div className="py-20 px-4">
      <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
        3D Services Suite
      </h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
        Bring your products to life with our 3D Catalogue and Configurator modules.
        Perfect for Ecommerce, Showrooms, and Custom Brands.
      </p>

      {/* Modules Section */}
      <section className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="border border-white/10 p-8 rounded-2xl bg-glass-gradient">
           <h2 className="text-3xl font-bold mb-4">3D Product Catalogue</h2>
           <p className="text-muted-foreground mb-4">Upload your models and let customers rotate, zoom, and inspect every detail in real-time.</p>
           <ul className="list-disc pl-5 space-y-2 text-sm">
             <li>360° Inspection</li>
             <li>High Fidelity Textures</li>
             <li>Embed on your website</li>
           </ul>
        </div>
        <div className="border border-white/10 p-8 rounded-2xl bg-glass-gradient">
           <h2 className="text-3xl font-bold mb-4">Product Configurator</h2>
           <p className="text-muted-foreground mb-4">Allow customers to change colors, materials, and variants instantly.</p>
           <ul className="list-disc pl-5 space-y-2 text-sm">
             <li>Real-time Color Swapping</li>
             <li>Material Switching (Leather/Fabric)</li>
             <li>Save Configurations</li>
           </ul>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Who It's For</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
           <div className="p-6 bg-white/5 rounded-xl">🛍️ Ecommerce Stores</div>
           <div className="p-6 bg-white/5 rounded-xl">🛋️ Furniture Brands</div>
           <div className="p-6 bg-white/5 rounded-xl">🚗 Auto Showrooms</div>
        </div>
      </section>

      <div className="text-center">
        <button className="bg-primary px-8 py-4 rounded-full font-bold shadow-neon hover:scale-105 transition">
          Try 3D Studio
        </button>
      </div>
    </div>
  )
}
