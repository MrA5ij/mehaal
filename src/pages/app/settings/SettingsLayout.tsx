import React from 'react';
import AppLayout from "../../../layouts/AppLayout";
import { Link } from "react-router-dom";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Settings</h1>
      <div className="flex space-x-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
        <Link to="/app/settings/general" className="hover:text-white opacity-70 hover:opacity-100 whitespace-nowrap">General</Link>
        <Link to="/app/settings/security" className="hover:text-white opacity-70 hover:opacity-100 whitespace-nowrap">Security</Link>
        <Link to="/app/settings/sso" className="hover:text-white opacity-70 hover:opacity-100 whitespace-nowrap">SSO</Link>
        <Link to="/app/settings/scim" className="hover:text-white opacity-70 hover:opacity-100 whitespace-nowrap">SCIM</Link>
        <Link to="/app/settings/api-keys" className="hover:text-white opacity-70 hover:opacity-100 whitespace-nowrap">API Keys</Link>
        <Link to="/app/settings/notifications" className="hover:text-white opacity-70 hover:opacity-100 whitespace-nowrap">Notifications</Link>
        <Link to="/app/settings/audit-logs" className="hover:text-white opacity-70 hover:opacity-100 whitespace-nowrap">Audit Logs</Link>
      </div>
      {children}
    </AppLayout>
  );
}
