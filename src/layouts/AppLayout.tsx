import React from 'react';
import { Link } from "react-router-dom";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6">
        <div className="mb-10 font-semibold text-lg">MEHAAL</div>
        <nav className="space-y-4 text-white/70 flex flex-col">
          <Link to="/app/dashboard" className="hover:text-white">Dashboard</Link>
          <Link to="/app/workspaces" className="hover:text-white">Workspaces</Link>
          <Link to="/app/usage" className="hover:text-white">Usage</Link>
          <Link to="/app/billing" className="hover:text-white">Billing</Link>
          <Link to="/app/settings" className="hover:text-white">Settings</Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
