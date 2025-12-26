'use client'
export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-glass-gradient border border-white/10 rounded-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-muted-foreground text-center mb-8">Login to access your AI Tools</p>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 bg-black/50 border border-white/10 rounded" />
          <input type="password" placeholder="Password" className="w-full p-3 bg-black/50 border border-white/10 rounded" />
          <button className="w-full bg-primary py-3 rounded font-bold text-white hover:bg-primary/80">Login</button>
        </form>
      </div>
    </div>
  )
}
