import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './hero/Hero';
import AdminLayout from './src/admin/AdminLayout.tsx';
import Dashboard from './src/admin/Dashboard.tsx';
import HomePageEditor from './src/admin/HomePageEditor.tsx';
import PlatformSettingsAdmin from './src/admin/PlatformSettingsAdmin.tsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Hero />} />
          
          {/* Admin Routes with Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="home-page" element={<HomePageEditor />} />
            <Route path="platform-settings" element={<PlatformSettingsAdmin />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
