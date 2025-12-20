import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalPages: number;
  publishedPages: number;
  mediaFiles: number;
  totalViews: number;
}

interface RecentActivity {
  id: number;
  type: string;
  title: string;
  timestamp: string;
  user: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPages: 0,
    publishedPages: 0,
    mediaFiles: 0,
    totalViews: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalPages: 12,
        publishedPages: 8,
        mediaFiles: 45,
        totalViews: 15234,
      });
      
      setRecentActivity([
        { id: 1, type: 'edit', title: 'Home Page updated', timestamp: '2 hours ago', user: 'Admin' },
        { id: 2, type: 'upload', title: 'Logo uploaded', timestamp: '5 hours ago', user: 'Admin' },
        { id: 3, type: 'publish', title: 'Features page published', timestamp: '1 day ago', user: 'Admin' },
      ]);
      
      setLoading(false);
    }, 500);
  }, []);

  const statCards = [
    { label: 'Total Pages', value: stats.totalPages, icon: '📄', color: '#8b5cf6', link: '/admin/pages' },
    { label: 'Published', value: stats.publishedPages, icon: '✅', color: '#10b981', link: '/admin/pages?filter=published' },
    { label: 'Media Files', value: stats.mediaFiles, icon: '🖼️', color: '#60a5fa', link: '/admin/media' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: '👁️', color: '#f59e0b', link: '/admin/analytics' },
  ];

  const quickActions = [
    { label: 'Edit Home Page', icon: '🏠', link: '/admin/home-page', color: '#8b5cf6' },
    { label: 'Upload Media', icon: '📤', link: '/admin/media', color: '#60a5fa' },
    { label: 'Platform Settings', icon: '⚙️', link: '/admin/platform-settings', color: '#10b981' },
    { label: 'View Analytics', icon: '📊', link: '/admin/analytics', color: '#f59e0b' },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome back! 👋</h1>
          <p className="welcome-subtitle">Here's what's happening with your platform today.</p>
        </div>
        <button className="preview-btn">
          <span className="preview-icon">🚀</span>
          <span>Preview Site</span>
        </button>
      </section>

      {/* Stats Grid */}
      <section className="stats-grid">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link} className="stat-card" style={{ '--card-color': stat.color } as React.CSSProperties}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-details">
              <p className="stat-label">{stat.label}</p>
              <h2 className="stat-value">{stat.value}</h2>
            </div>
            <div className="stat-arrow">→</div>
          </Link>
        ))}
      </section>

      {/* Quick Actions & Recent Activity */}
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <section className="card quick-actions-card">
          <h3 className="card-title">⚡ Quick Actions</h3>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link 
                key={index} 
                to={action.link} 
                className="quick-action"
                style={{ '--action-color': action.color } as React.CSSProperties}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-label">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="card activity-card">
          <h3 className="card-title">📋 Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.length === 0 ? (
              <p className="activity-empty">No recent activity</p>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'edit' && '✏️'}
                    {activity.type === 'upload' && '📤'}
                    {activity.type === 'publish' && '✅'}
                  </div>
                  <div className="activity-details">
                    <p className="activity-title">{activity.title}</p>
                    <p className="activity-meta">
                      {activity.user} • {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* System Status */}
      <section className="card system-status">
        <h3 className="card-title">🔧 System Status</h3>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span className="status-label">API</span>
            <span className="status-value">Online</span>
          </div>
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span className="status-label">Database</span>
            <span className="status-value">Connected</span>
          </div>
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span className="status-label">Storage</span>
            <span className="status-value">78% Free</span>
          </div>
        </div>
      </section>

      <style>{`
        /* Dashboard Styles */
        .dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 16px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(139, 92, 246, 0.2);
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Welcome Section */
        .welcome-section {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .welcome-title {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-subtitle {
          font-size: 16px;
          color: #9ca3af;
          margin: 0;
        }

        .preview-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .preview-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
        }

        .preview-icon {
          font-size: 20px;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(26, 20, 36, 0.8) 0%, rgba(15, 10, 24, 0.8) 100%);
          border: 1px solid rgba(139, 92, 246, 0.1);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--card-color);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .stat-details {
          flex: 1;
        }

        .stat-label {
          font-size: 14px;
          color: #9ca3af;
          margin: 0 0 4px 0;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #f3f4f6;
          margin: 0;
        }

        .stat-arrow {
          font-size: 24px;
          color: #9ca3af;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .stat-card:hover .stat-arrow {
          opacity: 1;
          transform: translateX(4px);
        }

        /* Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .card {
          background: linear-gradient(135deg, rgba(26, 20, 36, 0.8) 0%, rgba(15, 10, 24, 0.8) 100%);
          border: 1px solid rgba(139, 92, 246, 0.1);
          border-radius: 16px;
          padding: 24px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #f3f4f6;
          margin: 0 0 20px 0;
        }

        /* Quick Actions */
        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .quick-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.1);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .quick-action:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.3);
          transform: translateY(-2px);
        }

        .action-icon {
          font-size: 32px;
        }

        .action-label {
          font-size: 14px;
          font-weight: 500;
          color: #d1d5db;
          text-align: center;
        }

        /* Activity List */
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .activity-item:hover {
          background: rgba(139, 92, 246, 0.1);
        }

        .activity-icon {
          font-size: 24px;
        }

        .activity-details {
          flex: 1;
        }

        .activity-title {
          font-size: 14px;
          font-weight: 500;
          color: #f3f4f6;
          margin: 0 0 4px 0;
        }

        .activity-meta {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
        }

        .activity-empty {
          text-align: center;
          color: #6b7280;
          padding: 32px 0;
          margin: 0;
        }

        /* System Status */
        .system-status {
          grid-column: 1 / -1;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 10px;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .status-indicator.online {
          background: #10b981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-label {
          font-size: 14px;
          color: #9ca3af;
          flex: 1;
        }

        .status-value {
          font-size: 14px;
          font-weight: 600;
          color: #10b981;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .welcome-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
