'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function AdminInventoryPage() {
  const { userInfo } = useSelector((s) => s.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState({});
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  const showMsg = (text, type) => { setMsg(text); setMsgType(type); setTimeout(() => setMsg(''), 3000); };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/inventory/low-stock', {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setProducts(data || []);
    } catch { setProducts([]); showMsg('Failed to load inventory', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInventory(); }, [userInfo]);

  const adjust = async (id, delta) => {
    setAdjusting(a => ({ ...a, [id]: true }));
    try {
      const res = await fetch(`http://localhost:5000/api/admin/inventory/${id}/adjust`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo?.token}` },
        body: JSON.stringify({ adjustment: delta }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(p => p.map(prod => prod._id === id ? { ...prod, countInStock: data.countInStock } : prod));
      showMsg('Stock updated', 'success');
    } catch { showMsg('Failed to adjust stock', 'error'); }
    finally { setAdjusting(a => ({ ...a, [id]: false })); }
  };

  const [manualInput, setManualInput] = useState({});
  const applyManual = async (id) => {
    const val = parseInt(manualInput[id]);
    if (isNaN(val)) return;
    await adjust(id, val);
    setManualInput(m => ({ ...m, [id]: '' }));
  };

  const getStockColor = (count) => {
    if (count === 0) return '#991b1b';
    if (count <= 3) return '#c2410c';
    if (count <= 10) return '#92400e';
    return '#166534';
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Inventory</h1>
          <p className="admin-page-sub">Products with stock ≤ 10 units — monitor and adjust</p>
        </div>
        <button onClick={fetchInventory} className="btn-secondary">↻ Refresh</button>
      </div>

      {msg && <div className={`admin-alert admin-alert-${msgType}`}>{msg}</div>}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Out of Stock', color: '#991b1b', bg: '#fee2e2' },
          { label: 'Critical (≤ 3)', color: '#c2410c', bg: '#ffedd5' },
          { label: 'Low (≤ 10)', color: '#92400e', bg: '#fef3c7' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: s.bg, padding: '6px 14px', borderRadius: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-spinner"><div className="spinner-dot" /><div className="spinner-dot" /><div className="spinner-dot" /></div>
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon" style={{ color: '#166534' }}>✓</div>
            <p className="admin-empty-text">All products are well stocked!</p>
            <p className="admin-empty-sub">No items below 10 units currently</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Gender</th>
                  <th>Price</th>
                  <th>Stock Level</th>
                  <th style={{ minWidth: 220 }}>Adjust Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {p.image && (
                          <img src={p.image.startsWith('http') ? p.image : `http://localhost:5000${p.image}`} alt="" style={{ width: 38, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #e7e5e4' }} onError={e => e.target.style.display = 'none'} />
                        )}
                        <span style={{ fontWeight: 600, color: '#1c1917', fontSize: 13 }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{p.category}</td>
                    <td style={{ fontSize: 13 }}>{p.gender}</td>
                    <td style={{ fontWeight: 600 }}>PKR {p.price?.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 60, height: 6, background: '#f5f4f1', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 3, background: getStockColor(p.countInStock), width: `${Math.min((p.countInStock / 10) * 100, 100)}%`, transition: 'width 0.4s ease' }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 15, color: getStockColor(p.countInStock), minWidth: 28 }}>{p.countInStock}</span>
                        {p.countInStock === 0 && <span className="badge badge-out">Out</span>}
                        {p.countInStock > 0 && p.countInStock <= 3 && <span className="badge badge-low">Critical</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => adjust(p._id, -1)} disabled={adjusting[p._id] || p.countInStock === 0}
                          style={{ width: 30, height: 30, border: '1px solid #e7e5e4', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#44403c' }}>−</button>
                        <input
                          type="number"
                          value={manualInput[p._id] || ''}
                          onChange={e => setManualInput(m => ({ ...m, [p._id]: e.target.value }))}
                          placeholder="+/−"
                          style={{ width: 56, padding: '5px 8px', border: '1px solid #d6d3d1', borderRadius: 5, fontSize: 12, textAlign: 'center', outline: 'none' }}
                          onKeyDown={e => e.key === 'Enter' && applyManual(p._id)}
                        />
                        <button onClick={() => adjust(p._id, 1)} disabled={adjusting[p._id]}
                          style={{ width: 30, height: 30, border: '1px solid #e7e5e4', borderRadius: 5, background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#44403c' }}>+</button>
                        <button onClick={() => applyManual(p._id)} disabled={!manualInput[p._id] || adjusting[p._id]} className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>
                          Apply
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
