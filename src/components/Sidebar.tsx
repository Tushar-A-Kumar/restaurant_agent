'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: '◈' },
  { label: 'Prep Intelligence', href: '/prep', icon: '◎' },
  { label: 'Inventory Agent', href: '/inventory', icon: '◉' },
  { label: 'Labour Tracker', href: '/labour', icon: '◐' },
  { label: 'Settings', href: '/settings', icon: '◌' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar glass">
      <div className="logo">
        <span className="logo-accent">Kitchen</span>OS
        <span className="version">v1.0</span>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${active ? 'active' : ''}`}>
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="bottom">
        <div className="status-indicator">
          <div className="dot"></div>
          <div className="status-text">
            <span className="status-label">Agent Live</span>
            <span className="status-model">Claude 3.5 Sonnet</span>
          </div>
        </div>
        <div className="restaurant-name">The Grand Plate</div>
      </div>

      <style jsx>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          padding: 28px 20px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          border-left: none;
          border-top: none;
          border-bottom: none;
          background: rgba(8, 8, 10, 0.85);
          border-right: 1px solid rgba(255, 255, 255, 0.06);
        }

        .logo {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -1px;
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .logo-accent { color: var(--primary); }

        .version {
          font-size: 10px;
          font-weight: 500;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          border: 1px solid var(--border);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          padding: 11px 14px;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          transition: all 0.18s;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--foreground);
        }

        .nav-item.active {
          background: var(--primary-glow);
          color: var(--primary);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        .bottom {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: rgba(16, 185, 129, 0.04);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: var(--radius-md);
        }

        .dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 8px var(--primary);
          animation: pulse 2s infinite;
        }

        .status-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .status-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--primary);
        }

        .status-model {
          font-size: 10px;
          color: var(--text-muted);
        }

        .restaurant-name {
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
          padding: 6px;
          border-top: 1px solid var(--border);
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
