import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './hero/Hero';
import AdminLayout from './src/admin/AdminLayout';
import Dashboard from './src/admin/Dashboard';
import HomePageEditor from './src/admin/HomePageEditor';
import PlatformSettingsAdmin from './src/admin/PlatformSettingsAdmin';
import CMSPagesAdmin from './src/admin/CMSPagesAdmin';
import CMSNavigationAdmin from './src/admin/CMSNavigationAdmin';
import BrandAssetsAdmin from './src/admin/BrandAssetsAdmin';

// App Pages
import DashboardApp from './src/pages/app/dashboard/Dashboard';
import Workspaces from './src/pages/app/workspaces/Workspaces';
import Usage from './src/pages/app/usage/Usage';
import Billing from './src/pages/app/billing/Billing';
import GeneralSettings from './src/pages/app/settings/General';
import SecuritySettings from './src/pages/app/settings/Security';
import SSOSettings from './src/pages/app/settings/SSO';
import SCIMSettings from './src/pages/app/settings/SCIM';
import ApiKeysSettings from './src/pages/app/settings/ApiKeys';
import AuditLogsSettings from './src/pages/app/settings/AuditLogs';
import NotificationsSettings from './src/pages/app/settings/Notifications';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Hero />} />
          
          {/* App Routes (Enterprise Base) */}
          <Route path="/app/dashboard" element={<DashboardApp />} />
          <Route path="/app/workspaces" element={<Workspaces />} />
          <Route path="/app/usage" element={<Usage />} />
          <Route path="/app/billing" element={<Billing />} />
          
          {/* Settings Routes */}
          <Route path="/app/settings" element={<GeneralSettings />} />
          <Route path="/app/settings/general" element={<GeneralSettings />} />
          <Route path="/app/settings/security" element={<SecuritySettings />} />
          <Route path="/app/settings/sso" element={<SSOSettings />} />
          <Route path="/app/settings/scim" element={<SCIMSettings />} />
          <Route path="/app/settings/api-keys" element={<ApiKeysSettings />} />
          <Route path="/app/settings/notifications" element={<NotificationsSettings />} />
          <Route path="/app/settings/audit-logs" element={<AuditLogsSettings />} />

          {/* Admin Routes with Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="home-page" element={<HomePageEditor />} />
            <Route path="platform-settings" element={<PlatformSettingsAdmin />} />
            <Route path="pages" element={<CMSPagesAdmin />} />
            <Route path="navigation" element={<CMSNavigationAdmin />} />
            <Route path="brand-assets" element={<BrandAssetsAdmin />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
