'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

export default function AdminUsersPage() {
  const { userInfo } = useSelector((s) => s.auth);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selected, setSelected] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  const showMsg = (text, type) => { setMsg(text); setMsgType(type); setTimeout(() => setMsg(''), 3000); };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.set('search', search);
      if (filterRole) params.set('role', filterRole);
      const res = await fetch(`http://localhost:5000/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setUsers(data.users || []); setTotal(data.total || 0); setPages(data.pages || 1);
    } catch { setUsers([]); showMsg('Failed to load users', 'error'); }
    finally { setLoading(false); }
  }, [userInfo, page, search, filterRole]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openDetail = async (user) => {
    setSelected(user); setLoadingDetail(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${user._id}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      const data = await res.json();
      setSelectedOrders(data.orders || []);
    } catch { setSelectedOrders([]); }
    finally { setLoadingDetail(false); }
  };

  const toggleAdmin = async (user) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${user._id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo?.token}` },
        body: JSON.stringify({ isAdmin: !user.isAdmin }),
      });
      if (!res.ok) throw new Error();
      showMsg(`${user.firstName} role updated`, 'success');
      fetchUsers();
      if (selected?._id === user._id) setSelected(u => ({ ...u, isAdmin: !u.isAdmin }));
    } catch { showMsg('Failed to update role', 'error'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      showMsg('User deleted', 'success');
      setSelected(null); fetchUsers();
    } catch (e) { showMsg(e.message || 'Failed to delete user', 'error'); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-sub">{total} registered users</p>
        </div>
      </div>

      {msg && <div className={`admin-alert admin-alert-${msgType}`}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20 }}>
        {/* ── Users Table ── */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">All Users</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="admin-search-input-wrap" style={{ maxWidth: 220 }}>
                <span className="admin-search-icon">⌕</span>
                <input className="admin-search-input" placeholder="Search users..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
              </div>
              <select className="admin-select" value={filterRole} onChange={e => { setFilterRole(e.target.value); setPage(1); }}>
                <option value="">All Roles</option>
                <option value="admin">Admins</option>
                <option value="user">Customers</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="admin-spinner"><div className="spinner-dot" /><div className="spinner-dot" /><div className="spinner-dot" /></div>
          ) : users.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">◎</div>
              <p className="admin-empty-text">No users found</p>
            </div>
          ) : (
            <>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Verified</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} style={{ cursor: 'pointer', background: selected?._id === u._id ? '#faf9f6' : '' }}>
                        <td onClick={() => openDetail(u)}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#292524', color: '#fafaf9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                              {u.firstName?.[0]}{u.lastName?.[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13, color: '#1c1917' }}>{u.firstName} {u.lastName}</div>
                              <div style={{ fontSize: 11, color: '#a8a29e' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td onClick={() => openDetail(u)} style={{ fontSize: 13 }}>{u.phone}</td>
                        <td onClick={() => openDetail(u)}>
                          <span className={`badge badge-${u.isAdmin ? 'admin' : 'user'}`}>
                            {u.isAdmin ? 'Admin' : 'Customer'}
                          </span>
                        </td>
                        <td onClick={() => openDetail(u)}>
                          <span style={{ fontSize: 16 }}>{u.isVerified ? '✓' : '✕'}</span>
                        </td>
                        <td onClick={() => openDetail(u)} style={{ fontSize: 12, color: '#78716c', whiteSpace: 'nowrap' }}>
                          {new Date(u.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn-edit" style={{ fontSize: 11, padding: '5px 10px' }} onClick={() => toggleAdmin(u)}>
                              {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                            </button>
                            {u._id !== userInfo?._id && (
                              <button className="btn-danger" style={{ padding: '5px 10px' }} onClick={() => deleteUser(u._id)}>✕</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="admin-pagination">
                <span>Showing {users.length} of {total}</span>
                <div className="admin-pagination-btns">
                  <button className="admin-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                  <button className="admin-page-btn active">{page}</button>
                  <button className="admin-page-btn" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── User Detail Panel ── */}
        {selected && (
          <div className="admin-card" style={{ alignSelf: 'start', position: 'sticky', top: 80 }}>
            <div className="admin-card-header">
              <span className="admin-card-title">{selected.firstName} {selected.lastName}</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#78716c' }}>✕</button>
            </div>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f4f1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#292524', color: '#fafaf9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>
                  {selected.firstName?.[0]}{selected.lastName?.[0]}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#1c1917' }}>{selected.firstName} {selected.lastName}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#78716c' }}>{selected.email}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
                {[
                  { label: 'Phone', value: selected.phone },
                  { label: 'Role', value: selected.isAdmin ? 'Admin' : 'Customer' },
                  { label: 'Verified', value: selected.isVerified ? 'Yes' : 'No' },
                  { label: 'Joined', value: new Date(selected.createdAt).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#a8a29e' }}>{label}</p>
                    <p style={{ margin: '3px 0 0', color: '#1c1917', fontWeight: 500 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order history */}
            <div style={{ padding: '14px 20px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#78716c', marginBottom: 10 }}>
                Order History ({selectedOrders.length})
              </p>
              {loadingDetail ? (
                <div className="admin-spinner" style={{ padding: 20 }}><div className="spinner-dot" /><div className="spinner-dot" /><div className="spinner-dot" /></div>
              ) : selectedOrders.length === 0 ? (
                <p style={{ fontSize: 13, color: '#a8a29e', textAlign: 'center', padding: '16px 0' }}>No orders yet</p>
              ) : (
                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  {selectedOrders.map(o => (
                    <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f4f1', fontSize: 13 }}>
                      <div>
                        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#78716c' }}>#{o._id.slice(-8).toUpperCase()}</span>
                        <br />
                        <span style={{ fontSize: 11, color: '#a8a29e' }}>{new Date(o.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700 }}>PKR {o.totalPrice?.toLocaleString()}</div>
                        <span className={`badge badge-${o.status}`} style={{ fontSize: 10 }}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: '14px 20px', display: 'flex', gap: 8, borderTop: '1px solid #f5f4f1' }}>
              <button className="btn-edit" style={{ flex: 1, justifyContent: 'center' }} onClick={() => toggleAdmin(selected)}>
                {selected.isAdmin ? 'Remove Admin' : 'Make Admin'}
              </button>
              {selected._id !== userInfo?._id && (
                <button className="btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => deleteUser(selected._id)}>Delete</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
