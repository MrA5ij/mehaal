import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './hero/Hero';
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
          
          {/* Admin Routes */}
          <Route path="/admin/home-page" element={<HomePageEditor />} />
          <Route path="/admin/platform-settings" element={<PlatformSettingsAdmin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
