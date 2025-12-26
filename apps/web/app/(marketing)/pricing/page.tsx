export default function PricingPage() {
  return (
    <div className="py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-10">Choose Your Plan</h1>
      <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {['Free', 'Basic', 'Pro', 'Business'].map(plan => (
          <div key={plan} className="border border-white/10 p-6 rounded-xl bg-glass-gradient">
            <h2 className="text-2xl font-bold">{plan}</h2>
            <ul className="mt-4 text-left space-y-2 text-muted-foreground text-sm">
              <li>✓ AI Access</li>
              <li>✓ 3D Previews (Pro+)</li>
              <li>✓ Basic Support</li>
            </ul>
            <button className="w-full mt-6 bg-primary py-2 rounded font-bold">Select {plan}</button>
          </div>
        ))}
      </div>
    </div>
  )
}
