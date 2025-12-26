export default function Onboarding() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Let's set up your workspace</h1>
        <div className="grid grid-cols-2 gap-4 mt-8">
           <button className="p-6 border border-white/20 rounded-xl hover:bg-white/5">I am a Shop Owner</button>
           <button className="p-6 border border-white/20 rounded-xl hover:bg-white/5">I am a 3D Artist</button>
        </div>
      </div>
    </div>
  )
}
