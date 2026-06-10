'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

const STATUS_OPTIONS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const { userInfo } = useSelector((s) => s.auth);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (search) params.set('search', search);
      const res = await fetch(`http://localhost:5000/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setOrders(data.orders || []); setTotal(data.total || 0); setPages(data.pages || 1);
    } catch { setOrders([]); showMsg('Failed to load orders', 'error'); }
    finally { setLoading(false); }
  }, [userInfo, page, filterStatus, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const showMsg = (text, type) => { setMsg(text); setMsgType(type); setTimeout(() => setMsg(''), 3000); };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo?.token}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      showMsg('Order status updated', 'success');
      fetchOrders();
      if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
    } catch { showMsg('Failed to update order', 'error'); }
    finally { setUpdatingId(null); }
  };

  const deleteOrder = async (id) => {
    if (!confirm('Delete this order permanently?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      if (!res.ok) throw new Error();
      showMsg('Order deleted', 'success');
      setSelected(null); fetchOrders();
    } catch { showMsg('Failed to delete order', 'error'); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-sub">{total} total orders</p>
        </div>
      </div>

      {msg && <div className={`admin-alert admin-alert-${msgType}`}>{msg}</div>}

      {/* Status tab filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
            style={{ padding: '7px 16px', borderRadius: 20, border: '1.5px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', letterSpacing: '0.3px', transition: 'all 0.15s', background: filterStatus === s ? '#1c1917' : '#fff', color: filterStatus === s ? '#fafaf9' : '#44403c', borderColor: filterStatus === s ? '#1c1917' : '#e7e5e4' }}
          >{s}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>
        {/* ── Orders Table ── */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Orders List</span>
            <div className="admin-search-input-wrap" style={{ maxWidth: 240 }}>
              <span className="admin-search-icon">⌕</span>
              <input className="admin-search-input" placeholder="Search by email or name..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>
          {loading ? (
            <div className="admin-spinner"><div className="spinner-dot" /><div className="spinner-dot" /><div className="spinner-dot" /></div>
          ) : orders.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">◉</div>
              <p className="admin-empty-text">No orders found</p>
            </div>
          ) : (
            <>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id} style={{ cursor: 'pointer', background: selected?._id === o._id ? '#faf9f6' : '' }}>
                        <td onClick={() => setSelected(o)}>
                          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#78716c' }}>#{o._id.slice(-8).toUpperCase()}</span>
                        </td>
                        <td onClick={() => setSelected(o)}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: '#1c1917' }}>{o.shippingAddress?.firstName} {o.shippingAddress?.lastName}</div>
                          <div style={{ fontSize: 11, color: '#a8a29e' }}>{o.contactEmail}</div>
                        </td>
                        <td onClick={() => setSelected(o)} style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                          {new Date(o.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td onClick={() => setSelected(o)} style={{ fontWeight: 700 }}>PKR {o.totalPrice?.toLocaleString()}</td>
                        <td onClick={() => setSelected(o)}>
                          <span style={{ fontSize: 11 }}>{o.paymentMethod?.replace('Cash on Delivery (COD)', 'COD')}</span>
                        </td>
                        <td onClick={() => setSelected(o)}><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <select
                              className="admin-select"
                              style={{ fontSize: 11, padding: '5px 8px' }}
                              value={o.status}
                              disabled={updatingId === o._id}
                              onChange={e => updateStatus(o._id, e.target.value)}
                              onClick={e => e.stopPropagation()}
                            >
                              {STATUS_OPTIONS.filter(s => s !== 'all').map(s => (
                                <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                              ))}
                            </select>
                            <button className="btn-danger" style={{ padding: '5px 10px' }} onClick={() => deleteOrder(o._id)}>✕</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="admin-pagination">
                <span>Showing {orders.length} of {total}</span>
                <div className="admin-pagination-btns">
                  <button className="admin-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                  <button className="admin-page-btn active">{page}</button>
                  <button className="admin-page-btn" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Order Detail Panel ── */}
        {selected && (
          <div className="admin-card" style={{ alignSelf: 'start', position: 'sticky', top: 80 }}>
            <div className="admin-card-header">
              <span className="admin-card-title">Order #{selected._id.slice(-8).toUpperCase()}</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#78716c' }}>✕</button>
            </div>
            <div className="admin-card-body" style={{ padding: 0 }}>
              {/* Status */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f5f4f1' }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#78716c', marginBottom: 8 }}>Status</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {STATUS_OPTIONS.filter(s => s !== 'all').map(s => (
                    <button key={s} onClick={() => updateStatus(selected._id, s)}
                      style={{ padding: '5px 12px', borderRadius: 14, border: '1.5px solid', fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s', background: selected.status === s ? '#1c1917' : '#fff', color: selected.status === s ? '#fafaf9' : '#44403c', borderColor: selected.status === s ? '#1c1917' : '#e7e5e4' }}
                    >{s}</button>
                  ))}
                </div>
              </div>

              {/* Customer */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f5f4f1' }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#78716c', marginBottom: 8 }}>Customer</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1c1917', margin: '0 0 2px' }}>{selected.shippingAddress?.firstName} {selected.shippingAddress?.lastName}</p>
                <p style={{ fontSize: 12, color: '#78716c', margin: 0 }}>{selected.contactEmail}</p>
              </div>

              {/* Shipping */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f5f4f1' }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#78716c', marginBottom: 8 }}>Shipping Address</p>
                <p style={{ fontSize: 13, color: '#44403c', lineHeight: 1.7, margin: 0 }}>
                  {selected.shippingAddress?.address}<br />
                  {selected.shippingAddress?.city}{selected.shippingAddress?.postalCode ? `, ${selected.shippingAddress.postalCode}` : ''}<br />
                  {selected.shippingAddress?.country || 'Pakistan'}
                </p>
              </div>

              {/* Items */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f5f4f1' }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#78716c', marginBottom: 10 }}>Order Items</p>
                {selected.orderItems?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 13 }}>
                    <div>
                      <span style={{ fontWeight: 500, color: '#1c1917' }}>{item.name}</span>
                      {item.selectedSize && item.selectedSize !== 'N/A' && (
                        <span style={{ fontSize: 11, color: '#78716c', marginLeft: 6 }}>({item.selectedSize})</span>
                      )}
                      <span style={{ fontSize: 11, color: '#a8a29e', marginLeft: 6 }}>×{item.qty}</span>
                    </div>
                    <span style={{ fontWeight: 600 }}>PKR {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f5f4f1' }}>
                {[
                  { label: 'Subtotal', value: selected.itemsPrice },
                  { label: 'Shipping', value: selected.shippingPrice },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, color: '#78716c' }}>
                    <span>{row.label}</span><span>PKR {row.value?.toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#1c1917', borderTop: '1px solid #f5f4f1', paddingTop: 10, marginTop: 6 }}>
                  <span>Total</span><span>PKR {selected.totalPrice?.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: '14px 20px', display: 'flex', gap: 8 }}>
                <button className="btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => deleteOrder(selected._id)}>Delete Order</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
