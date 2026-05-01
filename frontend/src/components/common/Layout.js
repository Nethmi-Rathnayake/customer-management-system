import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Layout.css';

const NAV_SECTIONS = [
  {
    label: 'MAIN',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: DashIcon },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { path: '/customers', label: 'Customers', icon: PeopleIcon },
      { path: '/bulk-upload', label: 'Bulk Upload', icon: UploadIcon },
    ],
  },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard' || location.pathname === '/customers'
      : location.pathname.startsWith(path);

  return (
    <div className={`layout ${collapsed ? 'layout--collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#2563EB"/>
              <path d="M6 8h12M6 12h8M6 16h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          {!collapsed && (
            <div>
              <div className="sidebar-brand-name">NexusCRM</div>
            </div>
          )}
          <button className="sidebar-collapse-btn" onClick={() => setCollapsed(c => !c)} title="Toggle sidebar">
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_SECTIONS.map(section => (
            <div key={section.label} className="sidebar-section">
              {!collapsed && <div className="sidebar-section-label">{section.label}</div>}
              {section.items.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="nav-icon"><item.icon /></span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div
            className="nav-item nav-item--danger"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
            title={collapsed ? 'Logout' : undefined}
          >
            <span className="nav-icon"><LogoutIcon /></span>
            {!collapsed && <span className="nav-label">Logout</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrap">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-title">{getPageTitle(location.pathname)}</div>
          <div className="topbar-right">
            <div className="topbar-user">
              <div className="topbar-user-info">
                <div className="topbar-user-name">Admin User</div>
                <div className="topbar-user-role">Super Admin</div>
              </div>
              <div className="topbar-avatar">AD</div>
            </div>
          </div>
        </header>

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

function getPageTitle(path) {
  if (path === '/dashboard' || path === '/customers') return 'Dashboard Overview';
  if (path.includes('/customers/new')) return 'Add New Customer';
  if (path.includes('/edit')) return 'Edit Customer';
  if (path.includes('/customers/')) return 'Customer Details';
  if (path.includes('/bulk-upload')) return 'Bulk Upload';
  return 'NexusCRM';
}

// ── SVG Icons ──────────────────────────────────────────────
function DashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}