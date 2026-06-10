'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function AdminSettingsPage() {
  const { userInfo } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState({
    storeName: 'LUMIÈRE',
    storeEmail: 'contact@lumiere.com',
    currency: 'PKR',
    taxRate: 18,
    shippingCost: 250,
    freeShippingThreshold: 5000,
    enableReviews: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Store Settings</h1>
          <p className="admin-page-sub">Configure global store preferences and operations.</p>
        </div>
      </div>

      {success && <div className="admin-alert admin-alert-success">Settings saved successfully!</div>}

      <div className="admin-card" style={{ maxWidth: 800 }}>
        <form onSubmit={handleSave} className="admin-card-body">
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1c1917', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid #f5f4f1' }}>General Settings</h3>
          
          <div className="admin-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">Store Name</label>
              <input type="text" className="admin-input" value={settings.storeName} onChange={(e) => setSettings({...settings, storeName: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Support Email</label>
              <input type="email" className="admin-input" value={settings.storeEmail} onChange={(e) => setSettings({...settings, storeEmail: e.target.value})} />
            </div>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1c1917', marginBottom: 20, marginTop: 20, paddingBottom: 10, borderBottom: '1px solid #f5f4f1' }}>Finance & Shipping</h3>
          
          <div className="admin-grid-3">
            <div className="admin-form-group">
              <label className="admin-label">Currency</label>
              <select className="admin-select" style={{ width: '100%' }} value={settings.currency} onChange={(e) => setSettings({...settings, currency: e.target.value})}>
                <option value="PKR">PKR (₨)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Tax Rate (%)</label>
              <input type="number" className="admin-input" value={settings.taxRate} onChange={(e) => setSettings({...settings, taxRate: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Flat Shipping Rate</label>
              <input type="number" className="admin-input" value={settings.shippingCost} onChange={(e) => setSettings({...settings, shippingCost: e.target.value})} />
            </div>
          </div>

          <div className="admin-form-group" style={{ maxWidth: '33%' }}>
            <label className="admin-label">Free Shipping Threshold</label>
            <input type="number" className="admin-input" value={settings.freeShippingThreshold} onChange={(e) => setSettings({...settings, freeShippingThreshold: e.target.value})} />
            <span style={{ fontSize: 11, color: '#78716c', marginTop: 4, display: 'block' }}>Orders above this amount get free shipping.</span>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1c1917', marginBottom: 20, marginTop: 20, paddingBottom: 10, borderBottom: '1px solid #f5f4f1' }}>Features</h3>
          
          <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" className="admin-checkbox" id="reviews" checked={settings.enableReviews} onChange={(e) => setSettings({...settings, enableReviews: e.target.checked})} />
            <label htmlFor="reviews" style={{ fontSize: 13, fontWeight: 500, color: '#44403c', cursor: 'pointer' }}>Enable Product Reviews</label>
          </div>

          <div style={{ marginTop: 30, paddingTop: 20, borderTop: '1px solid #f5f4f1', textAlign: 'right' }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
