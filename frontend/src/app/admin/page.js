'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

export default function AdminDashboard() {
  const { userInfo } = useSelector((s) => s.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        if (!res.ok) throw new Error('Failed to load stats');
        const data = await res.json();
        setStats(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo?.token) fetchStats();
  }, [userInfo]);

  if (loading) return (
    <div className="admin-spinner">
      <div className="spinner-dot" /><div className="spinner-dot" /><div className="spinner-dot" />
    </div>
  );
  if (error) return <div className="admin-alert admin-alert-error">{error}</div>;
  if (!stats) return null;

  const maxRevenue = Math.max(...stats.monthlyChart.map(m => m.revenue), 1);

  const statusCards = [
    { label: 'Pending',    value: stats.orders.pending,    color: '#854d0e', bg: '#fef9c3' },
    { label: 'Processing', value: stats.orders.processing, color: '#1e40af', bg: '#dbeafe' },
    { label: 'Shipped',    value: stats.orders.shipped,    color: '#3730a3', bg: '#e0e7ff' },
    { label: 'Delivered',  value: stats.orders.delivered,  color: '#166534', bg: '#dcfce7' },
    { label: 'Cancelled',  value: stats.orders.cancelled,  color: '#991b1b', bg: '#fee2e2' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Welcome back, {userInfo?.firstName}. Here's what's happening.</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">+ Add Product</Link>
      </div>

      {/* ── KPI Stats ── */}
      <div className="admin-stats-grid">
        {[
          { label: 'Total Revenue',   value: `PKR ${stats.revenue.total.toLocaleString()}`, sub: `Today: PKR ${stats.revenue.today.toLocaleString()}`, accent: '#166534' },
          { label: 'Monthly Revenue', value: `PKR ${stats.revenue.monthly.toLocaleString()}`, sub: 'This month', accent: '#1e40af' },
          { label: 'Total Orders',    value: stats.orders.total, sub: `${stats.orders.pending} pending`, accent: '#854d0e' },
          { label: 'Total Users',     value: stats.users.total, sub: `${stats.users.newToday} joined today`, accent: '#6d28d9' },
          { label: 'Products',        value: stats.products.total, sub: `${stats.products.lowStock} low stock`, accent: '#0369a1' },
          { label: 'Out of Stock',    value: stats.products.outOfStock, sub: 'Need restocking', accent: '#991b1b' },
        ].map((s) => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-accent" style={{ background: s.accent }} />
            <p className="admin-stat-label">{s.label}</p>
            <p className="admin-stat-value">{s.value}</p>
            <p className="admin-stat-sub">{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* ── Revenue Chart ── */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Revenue – Last 6 Months</span>
          </div>
          <div className="admin-card-body">
            {stats.monthlyChart.map((m) => (
              <div key={m.month} className="chart-bar-row">
                <span className="chart-bar-label">{m.month}</span>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${(m.revenue / maxRevenue) * 100}%` }} />
                </div>
                <span className="chart-bar-value">PKR {m.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Order Status Breakdown ── */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Order Status Breakdown</span>
            <Link href="/admin/orders" style={{ fontSize: 12, color: '#78716c', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div className="admin-card-body">
            {statusCards.map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                  <span style={{ fontSize: 13, color: '#44403c' }}>{s.label}</span>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: s.color, background: s.bg, padding: '2px 10px', borderRadius: 20, fontSize: 13 }}>{s.value}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f5f4f1', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#78716c' }}>Total Orders</span>
              <span style={{ fontWeight: 700, color: '#1c1917' }}>{stats.orders.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* ── Best Selling Products ── */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Best Selling Products</span>
            <Link href="/admin/products" style={{ fontSize: 12, color: '#78716c', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sales</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {stats.bestSelling.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: 30, color: '#a8a29e' }}>No sales data yet</td></tr>
                ) : stats.bestSelling.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 500, color: '#1c1917' }}>{p.name}</td>
                    <td>{p.totalSales || 0}</td>
                    <td>PKR {p.price?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Recent Orders ── */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Recent Orders</span>
            <Link href="/admin/orders" style={{ fontSize: 12, color: '#78716c', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr><th>Customer</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {stats.recentOrders.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: 30, color: '#a8a29e' }}>No orders yet</td></tr>
                ) : stats.recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td>
                      <div style={{ fontWeight: 500, color: '#1c1917', fontSize: 13 }}>
                        {o.shippingAddress?.firstName} {o.shippingAddress?.lastName}
                      </div>
                      <div style={{ fontSize: 11, color: '#a8a29e' }}>{o.contactEmail}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>PKR {o.totalPrice?.toLocaleString()}</td>
                    <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
