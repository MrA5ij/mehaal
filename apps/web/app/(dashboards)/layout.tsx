import { Logo } from '@/components/ui/logo';

const Sidebar = () => (
  <div className="p-4 space-y-4">
    <div className="p-2 hover:bg-muted rounded cursor-pointer flex items-center gap-2"><span>📊</span> Dashboard</div>
    <div className="p-2 hover:bg-muted rounded cursor-pointer flex items-center gap-2"><span>🧠</span> AI Tools</div>
    <div className="p-2 hover:bg-muted rounded cursor-pointer flex items-center gap-2"><span>⚙️</span> Settings</div>
  </div>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* SIDEBAR with Glass Effect */}
      <aside className="w-64 hidden md:flex flex-col border-r border-border bg-glass-gradient backdrop-blur-xs">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Logo />
        </div>
        <Sidebar />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border flex items-center px-6 justify-between bg-background/50 backdrop-blur-md sticky top-0 z-10">
           <span className="text-sm font-medium text-muted-foreground">Welcome back</span>
           <div className="w-8 h-8 bg-primary rounded-full ring-2 ring-white/20"></div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 relative">
           {children}
        </main>
      </div>
    </div>
  )
}
