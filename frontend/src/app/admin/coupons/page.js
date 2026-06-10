'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function AdminCouponsPage() {
  const { userInfo } = useSelector((s) => s.auth);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ code: '', discount: '', expiryDate: '', isActive: true });

  useEffect(() => {
    fetchCoupons();
  }, [userInfo]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/coupons', {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setCoupons(data);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingId(coupon._id);
      setFormData({
        code: coupon.code,
        discount: coupon.discount,
        expiryDate: coupon.expiryDate.split('T')[0],
        isActive: coupon.isActive
      });
    } else {
      setEditingId(null);
      setFormData({ code: '', discount: '', expiryDate: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      if (editingId) {
        await axios.put(`http://localhost:5000/api/coupons/${editingId}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/coupons', formData, config);
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (e) {
      alert(e.response?.data?.message || 'Error saving coupon');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await axios.delete(`http://localhost:5000/api/coupons/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        fetchCoupons();
      } catch (e) {
        alert(e.response?.data?.message || 'Error deleting coupon');
      }
    }
  };

  if (loading) return <div className="admin-spinner"><div className="spinner-dot" /><div className="spinner-dot" /><div className="spinner-dot" /></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Coupons & Promotions</h1>
          <p className="admin-page-sub">Manage discount codes and promotional offers.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">+ Create Coupon</button>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount (%)</th>
                <th>Status</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600, color: '#1c1917', letterSpacing: '1px' }}>{c.code}</td>
                  <td>{c.discount}% OFF</td>
                  <td>
                    <span className={`badge ${c.isActive ? 'badge-active' : 'badge-inactive'}`}>
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>{new Date(c.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-edit" onClick={() => handleOpenModal(c)}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(c._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-empty">
                    <div className="admin-empty-icon">🏷️</div>
                    <div className="admin-empty-text">No coupons found</div>
                    <div className="admin-empty-sub">Create your first discount code above.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">{editingId ? 'Edit Coupon' : 'Create New Coupon'}</h2>
              <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-label">Coupon Code</label>
                  <input type="text" required className="admin-input" placeholder="e.g. SUMMER20" style={{ textTransform: 'uppercase' }} value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Discount Percentage</label>
                  <input type="number" required min="1" max="100" className="admin-input" placeholder="e.g. 20" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Expiry Date</label>
                  <input type="date" required className="admin-input" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} />
                </div>
                <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" className="admin-checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
                  <label htmlFor="isActive" style={{ fontSize: 13, fontWeight: 500, color: '#44403c', cursor: 'pointer' }}>Coupon is Active</label>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editingId ? 'Save Changes' : 'Create Coupon'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
