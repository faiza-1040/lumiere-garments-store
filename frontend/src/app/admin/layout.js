'use client';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { logout } from '@/store/authSlice';
import { useDispatch } from 'react-redux';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/products', label: 'Products', icon: '◈' },
  { href: '/admin/orders', label: 'Orders', icon: '◉' },
  { href: '/admin/users', label: 'Users', icon: '◎' },
  { href: '/admin/inventory', label: 'Inventory', icon: '◫' },
  { href: '/admin/coupons', label: 'Coupons', icon: '◆' },
  { href: '/admin/reviews', label: 'Reviews', icon: '◇' },
  { href: '/admin/settings', label: 'Settings', icon: '◌' },
];

export default function AdminLayout({ children }) {
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!userInfo || !userInfo.isAdmin) {
      router.push('/login');
    }
  }, [userInfo, router]);
  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div className="admin-shell">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-logo">
          <span className="admin-logo-text">LUMIÈRE</span>
          <span className="admin-logo-sub">Admin Console</span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {userInfo?.firstName?.[0] || 'A'}{userInfo?.lastName?.[0] || 'D'}
            </div>
            <div>
              <p className="admin-user-name">{userInfo?.firstName || 'Admin'} {userInfo?.lastName || 'User'}</p>
              <p className="admin-user-role">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Overlay for mobile ──────────────────────────── */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main Content ────────────────────────────────── */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className="admin-topbar-title">
            {navItems.find(n => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label || 'Dashboard'}
          </div>
          <Link href="/" className="admin-view-store-btn" target="_blank">
            View Store ↗
          </Link>
        </header>

        {/* Page content */}
        <main className="admin-content">
          {children}
        </main>
      </div>

      <style jsx global>{`
        /* ── Reset for admin shell ── */
        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: #f5f4f1;
          font-family: var(--font-sans), 'Inter', sans-serif;
        }

        /* ── Sidebar ── */
        .admin-sidebar {
          width: 260px;
          min-height: 100vh;
          background: #1c1917;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 100;
          transition: transform 0.3s ease;
        }

        .admin-logo {
          padding: 32px 24px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .admin-logo-text {
          display: block;
          color: #fafaf9;
          font-size: 20px;
          font-weight: 300;
          letter-spacing: 6px;
          font-family: var(--font-poppins), sans-serif;
        }
        .admin-logo-sub {
          display: block;
          color: #78716c;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .admin-nav {
          flex: 1;
          padding: 20px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 6px;
          color: #a8a29e;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.3px;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .admin-nav-item:hover {
          background: rgba(255,255,255,0.06);
          color: #fafaf9;
        }
        .admin-nav-item.active {
          background: rgba(250,250,249,0.1);
          color: #fafaf9;
          border-left: 2px solid #d6d3d1;
        }
        .admin-nav-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .admin-sidebar-footer {
          padding: 20px 16px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .admin-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .admin-user-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #292524;
          border: 1px solid #44403c;
          color: #d6d3d1;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          text-transform: uppercase;
        }
        .admin-user-name {
          color: #e7e5e4;
          font-size: 13px;
          font-weight: 500;
          margin: 0;
        }
        .admin-user-role {
          color: #78716c;
          font-size: 11px;
          margin: 2px 0 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .admin-logout-btn {
          width: 100%;
          padding: 9px;
          background: transparent;
          border: 1px solid #44403c;
          color: #a8a29e;
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.15s ease;
        }
        .admin-logout-btn:hover {
          border-color: #78716c;
          color: #fafaf9;
        }

        /* ── Main Content ── */
        .admin-main {
          margin-left: 260px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .admin-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 60px;
          background: #ffffff;
          border-bottom: 1px solid #e7e5e4;
          display: flex;
          align-items: center;
          padding: 0 28px;
          gap: 16px;
        }
        .admin-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #292524;
          padding: 4px 8px;
        }
        .admin-topbar-title {
          font-size: 15px;
          font-weight: 600;
          color: #292524;
          letter-spacing: 0.5px;
          flex: 1;
        }
        .admin-view-store-btn {
          font-size: 12px;
          color: #78716c;
          text-decoration: none;
          letter-spacing: 1px;
          border: 1px solid #e7e5e4;
          padding: 6px 14px;
          border-radius: 4px;
          transition: all 0.15s;
        }
        .admin-view-store-btn:hover {
          border-color: #292524;
          color: #292524;
        }

        .admin-content {
          padding: 28px;
          flex: 1;
        }

        /* ── Overlay (mobile) ── */
        .admin-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 99;
        }

        /* ── Admin shared components ── */
        .admin-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .admin-page-title {
          font-size: 32px;
          font-weight: 300;
          font-family: var(--font-poppins), sans-serif;
          color: #1c1917;
          letter-spacing: -0.5px;
        }
        .admin-page-sub {
          font-size: 13px;
          color: #78716c;
          margin-top: 3px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Cards */
        .admin-card {
          background: #ffffff;
          border: 1px solid #e7e5e4;
          border-radius: 10px;
          overflow: hidden;
        }
        .admin-card-header {
          padding: 18px 22px;
          border-bottom: 1px solid #f5f4f1;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin-card-title {
          font-size: 16px;
          font-weight: 500;
          font-family: var(--font-poppins), sans-serif;
          color: #1c1917;
          letter-spacing: 0.5px;
        }
        .admin-card-body {
          padding: 22px;
        }

        /* Stats */
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .admin-stat-card {
          background: #ffffff;
          border: 1px solid #e7e5e4;
          border-radius: 10px;
          padding: 22px;
          position: relative;
          overflow: hidden;
        }
        .admin-stat-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #78716c;
          margin-bottom: 10px;
        }
        .admin-stat-value {
          font-size: 26px;
          font-weight: 700;
          color: #1c1917;
          line-height: 1;
          font-family: var(--font-poppins), sans-serif;
        }
        .admin-stat-sub {
          font-size: 12px;
          color: #a8a29e;
          margin-top: 6px;
        }
        .admin-stat-accent {
          position: absolute;
          top: 0; right: 0;
          width: 4px;
          height: 100%;
          border-radius: 0 10px 10px 0;
        }

        /* Table */
        .admin-table-wrapper {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .admin-table th {
          text-align: left;
          padding: 12px 16px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #78716c;
          background: #faf9f6;
          border-bottom: 1px solid #e7e5e4;
          white-space: nowrap;
        }
        .admin-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f5f4f1;
          color: #44403c;
          vertical-align: middle;
        }
        .admin-table tr:last-child td {
          border-bottom: none;
        }
        .admin-table tr:hover td {
          background: #faf9f6;
        }

        /* Badges */
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
          text-transform: capitalize;
        }
        .badge-pending   { background: #fef9c3; color: #854d0e; }
        .badge-processing { background: #dbeafe; color: #1e40af; }
        .badge-shipped   { background: #e0e7ff; color: #3730a3; }
        .badge-delivered { background: #dcfce7; color: #166534; }
        .badge-cancelled { background: #fee2e2; color: #991b1b; }
        .badge-admin     { background: #fce7f3; color: #9d174d; }
        .badge-user      { background: #f5f4f1; color: #44403c; }
        .badge-active    { background: #dcfce7; color: #166534; }
        .badge-inactive  { background: #fee2e2; color: #991b1b; }
        .badge-low       { background: #fef3c7; color: #92400e; }
        .badge-out       { background: #fee2e2; color: #991b1b; }
        .badge-instock   { background: #dcfce7; color: #166534; }

        /* Buttons */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          background: #1c1917;
          color: #fafaf9;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          letter-spacing: 0.3px;
          text-decoration: none;
        }
        .btn-primary:hover { background: #292524; }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: transparent;
          color: #44403c;
          border: 1px solid #d6d3d1;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          text-decoration: none;
        }
        .btn-secondary:hover { border-color: #78716c; color: #1c1917; }

        .btn-danger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: #fee2e2;
          color: #991b1b;
          border: none;
          border-radius: 5px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-danger:hover { background: #fecaca; }

        .btn-edit {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: #f5f4f1;
          color: #44403c;
          border: none;
          border-radius: 5px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-edit:hover { background: #e7e5e4; }

        /* Forms */
        .admin-input {
          width: 100%;
          padding: 9px 13px;
          border: 1px solid #d6d3d1;
          border-radius: 6px;
          font-size: 13px;
          color: #1c1917;
          background: #fff;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .admin-input:focus { border-color: #292524; }
        .admin-input::placeholder { color: #a8a29e; }

        .admin-select {
          padding: 9px 13px;
          border: 1px solid #d6d3d1;
          border-radius: 6px;
          font-size: 13px;
          color: #1c1917;
          background: #fff;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .admin-select:focus { border-color: #292524; }

        .admin-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #44403c;
          margin-bottom: 7px;
        }

        .admin-form-group {
          margin-bottom: 18px;
        }

        /* Modal */
        .admin-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .admin-modal {
          background: #fff;
          border-radius: 12px;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px rgba(0,0,0,0.15);
        }
        .admin-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #f5f4f1;
        }
        .admin-modal-title {
          font-size: 16px;
          font-weight: 700;
          color: #1c1917;
        }
        .admin-modal-close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #78716c;
          line-height: 1;
          padding: 0 4px;
        }
        .admin-modal-body {
          padding: 24px;
        }
        .admin-modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #f5f4f1;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        /* Search bar */
        .admin-search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .admin-search-input-wrap {
          position: relative;
          flex: 1;
          min-width: 220px;
        }
        .admin-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #a8a29e;
          font-size: 14px;
        }
        .admin-search-input {
          width: 100%;
          padding: 9px 13px 9px 36px;
          border: 1px solid #d6d3d1;
          border-radius: 6px;
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .admin-search-input:focus { border-color: #292524; }

        /* Pagination */
        .admin-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 22px;
          border-top: 1px solid #f5f4f1;
          font-size: 13px;
          color: #78716c;
        }
        .admin-pagination-btns {
          display: flex;
          gap: 6px;
        }
        .admin-page-btn {
          padding: 6px 12px;
          border: 1px solid #e7e5e4;
          border-radius: 5px;
          background: #fff;
          font-size: 13px;
          cursor: pointer;
          color: #44403c;
          transition: all 0.15s;
        }
        .admin-page-btn:hover:not(:disabled) { border-color: #292524; color: #1c1917; }
        .admin-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .admin-page-btn.active { background: #1c1917; color: #fff; border-color: #1c1917; }

        /* Charts */
        .chart-bar-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .chart-bar-label {
          font-size: 12px;
          color: #78716c;
          width: 80px;
          flex-shrink: 0;
        }
        .chart-bar-track {
          flex: 1;
          height: 8px;
          background: #f5f4f1;
          border-radius: 4px;
          overflow: hidden;
        }
        .chart-bar-fill {
          height: 100%;
          border-radius: 4px;
          background: #292524;
          transition: width 0.6s ease;
        }
        .chart-bar-value {
          font-size: 12px;
          color: #44403c;
          font-weight: 600;
          width: 80px;
          text-align: right;
          flex-shrink: 0;
        }

        /* Loading spinner */
        .admin-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: #78716c;
          font-size: 14px;
          gap: 10px;
        }
        .spinner-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #292524;
          animation: pulse 1.2s ease-in-out infinite;
        }
        .spinner-dot:nth-child(2) { animation-delay: 0.2s; }
        .spinner-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Empty state */
        .admin-empty {
          text-align: center;
          padding: 60px 20px;
          color: #78716c;
        }
        .admin-empty-icon {
          font-size: 40px;
          margin-bottom: 16px;
          opacity: 0.4;
        }
        .admin-empty-text { font-size: 15px; font-weight: 500; color: #44403c; }
        .admin-empty-sub { font-size: 13px; margin-top: 6px; }

        /* Checkbox */
        .admin-checkbox {
          width: 16px; height: 16px;
          cursor: pointer;
          accent-color: #292524;
        }

        /* Two column grid */
        .admin-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .admin-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        /* Alerts */
        .admin-alert {
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 13px;
          margin-bottom: 16px;
        }
        .admin-alert-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .admin-alert-error   { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

        /* Responsive */
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-overlay { display: block; }
          .admin-main { margin-left: 0; }
          .admin-menu-btn { display: block; }
          .admin-grid-2, .admin-grid-3 { grid-template-columns: 1fr; }
          .admin-stats-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 520px) {
          .admin-content { padding: 16px; }
          .admin-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
