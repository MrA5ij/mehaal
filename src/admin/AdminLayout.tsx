import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

interface NavItem {
  path: string;
  icon: string;
  label: string;
  badge?: number;
}

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems: NavItem[] = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/home-page', icon: '🏠', label: 'Home Page' },
    { path: '/admin/platform-settings', icon: '⚙️', label: 'Platform Settings' },
    { path: '/admin/media', icon: '🖼️', label: 'Media Library' },
    { path: '/admin/pages', icon: '📄', label: 'Pages' },
    { path: '/admin/analytics', icon: '📈', label: 'Analytics' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        {/* Logo */}
        <div className="admin-logo">
          <div className="logo-icon">⚡</div>
          {sidebarOpen && <span className="logo-text">Mehaal Admin</span>}
        </div>

        {/* Navigation */}
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sidebar-toggle"
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-header">
          <div className="header-left">
            <h1 className="page-title">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="header-right">
            {/* Quick Actions */}
            <button className="header-btn" title="Preview Site">
              <span>👁️</span>
            </button>
            <button className="header-btn" title="Notifications">
              <span>🔔</span>
            </button>
            <div className="user-menu">
              <img 
                src="/assets/avatar-placeholder.svg" 
                alt="User" 
                className="user-avatar"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="avatar-fallback" style={{ display: 'none' }}>
                👤
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        /* Admin Layout Styles */
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #0a0612;
          color: #f3f4f6;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
        }

        /* Sidebar */
        .admin-sidebar {
          width: 260px;
          background: linear-gradient(180deg, #1a1424 0%, #0f0a18 100%);
          border-right: 1px solid rgba(139, 92, 246, 0.1);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          transition: width 0.3s ease;
          z-index: 100;
        }

        .admin-sidebar.closed {
          width: 80px;
        }

        /* Logo */
        .admin-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px;
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Navigation */
        .admin-nav {
          flex: 1;
          padding: 20px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          color: #d1d5db;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(139, 92, 246, 0.1);
          color: #f3f4f6;
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%);
          color: #f3f4f6;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 24px;
          background: linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%);
          border-radius: 0 4px 4px 0;
        }

        .nav-icon {
          font-size: 20px;
          min-width: 20px;
        }

        .nav-label {
          font-size: 14px;
          font-weight: 500;
        }

        .nav-badge {
          margin-left: auto;
          background: #7c3aed;
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 12px;
        }

        /* Sidebar Footer */
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(139, 92, 246, 0.1);
        }

        .sidebar-toggle {
          width: 100%;
          padding: 10px;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 8px;
          color: #a78bfa;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-toggle:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.3);
        }

        /* Main Content */
        .admin-main {
          flex: 1;
          margin-left: 260px;
          transition: margin-left 0.3s ease;
        }

        .admin-sidebar.closed + .admin-main {
          margin-left: 80px;
        }

        /* Header */
        .admin-header {
          height: 70px;
          background: rgba(26, 20, 36, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-btn {
          width: 40px;
          height: 40px;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 18px;
        }

        .header-btn:hover {
          background: rgba(139, 92, 246, 0.2);
          transform: translateY(-2px);
        }

        .user-menu {
          position: relative;
        }

        .user-avatar, .avatar-fallback {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 2px solid rgba(139, 92, 246, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .avatar-fallback {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .user-avatar:hover, .avatar-fallback:hover {
          border-color: rgba(139, 92, 246, 0.6);
          transform: translateY(-2px);
        }

        /* Content Area */
        .admin-content {
          padding: 32px;
          min-height: calc(100vh - 70px);
        }

        /* Scrollbar */
        .admin-nav::-webkit-scrollbar {
          width: 6px;
        }

        .admin-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .admin-nav::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }

        .admin-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .admin-sidebar {
            width: 80px;
          }
          
          .admin-sidebar .logo-text,
          .admin-sidebar .nav-label,
          .admin-sidebar .nav-badge {
            display: none;
          }

          .admin-main {
            margin-left: 80px;
          }
        }
      `}</style>
    </div>
  );
}
