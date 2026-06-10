'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const COLORS = ['Black', 'White', 'Navy', 'Grey', 'Beige', 'Cream', 'Brown', 'Olive', 'Burgundy', 'Camel'];

export default function NewProductPage() {
  const { userInfo } = useSelector((s) => s.auth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [form, setForm] = useState({
    name: '', brand: 'Lumière', category: '', gender: 'Men',
    description: '', price: '', discountPrice: '',
    isSale: false, isFeatured: false,
    countInStock: '', images: ['', '', '', ''],
    sizes: [], colors: [],
  });

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const toggleArr = (field, val) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo?.token}` },
        body: JSON.stringify({ 
          ...form, 
          image: form.images.find(img => img.trim() !== '') || '',
          images: form.images.filter(img => img.trim() !== ''),
          price: Number(form.price), 
          discountPrice: Number(form.discountPrice), 
          countInStock: Number(form.countInStock) 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg('Product created successfully!');
      setMsgType('success');
      setTimeout(() => router.push('/admin/products'), 1200);
    } catch (e) {
      setMsg(e.message); setMsgType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Add New Product</h1>
          <p className="admin-page-sub">Fill in the details below</p>
        </div>
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>
      </div>

      {msg && <div className={`admin-alert admin-alert-${msgType}`}>{msg}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          {/* ── Left column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="admin-card">
              <div className="admin-card-header"><span className="admin-card-title">Basic Information</span></div>
              <div className="admin-card-body">
                <div className="admin-form-group">
                  <label className="admin-label">Product Name *</label>
                  <input className="admin-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Slim Fit Linen Shirt" />
                </div>
                <div className="admin-grid-1">
                  <div className="admin-form-group">
                    <label className="admin-label">Category *</label>
                    <input className="admin-input" required value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Shirts, Jackets..." />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Description *</label>
                  <textarea className="admin-input" required rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detailed product description..." style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header"><span className="admin-card-title">Sizes & Colors</span></div>
              <div className="admin-card-body">
                <div className="admin-form-group">
                  <label className="admin-label">Available Sizes</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                    {SIZES.map(s => (
                      <button key={s} type="button" onClick={() => toggleArr('sizes', s)}
                        style={{ padding: '6px 14px', border: `1.5px solid ${form.sizes.includes(s) ? '#1c1917' : '#e7e5e4'}`, borderRadius: 4, background: form.sizes.includes(s) ? '#1c1917' : '#fff', color: form.sizes.includes(s) ? '#fafaf9' : '#44403c', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                      >{s}</button>
                    ))}
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Available Colors</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                    {COLORS.map(c => (
                      <button key={c} type="button" onClick={() => toggleArr('colors', c)}
                        style={{ padding: '6px 14px', border: `1.5px solid ${form.colors.includes(c) ? '#1c1917' : '#e7e5e4'}`, borderRadius: 4, background: form.colors.includes(c) ? '#1c1917' : '#fff', color: form.colors.includes(c) ? '#fafaf9' : '#44403c', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                      >{c}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="admin-card">
              <div className="admin-card-header"><span className="admin-card-title">Pricing & Stock</span></div>
              <div className="admin-card-body">
                <div className="admin-form-group">
                  <label className="admin-label">Gender *</label>
                  <select className="admin-select" style={{ width: '100%' }} value={form.gender} onChange={e => set('gender', e.target.value)}>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Price (PKR) *</label>
                  <input className="admin-input" type="number" required min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Sale Price (PKR)</label>
                  <input className="admin-input" type="number" min="0" value={form.discountPrice} onChange={e => set('discountPrice', e.target.value)} placeholder="0 (leave empty if no sale)" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Stock Quantity *</label>
                  <input className="admin-input" type="number" required min="0" value={form.countInStock} onChange={e => set('countInStock', e.target.value)} placeholder="0" />
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header"><span className="admin-card-title">Images</span></div>
              <div className="admin-card-body">
                {[0, 1, 2, 3].map((index) => (
                  <div className="admin-form-group" style={{ marginBottom: index === 3 ? 0 : 16 }} key={index}>
                    <label className="admin-label">Image URL {index + 1} {index === 0 && '*'}</label>
                    <input 
                      className="admin-input" 
                      required={index === 0} 
                      value={form.images[index]} 
                      onChange={e => {
                        const newImages = [...form.images];
                        newImages[index] = e.target.value;
                        set('images', newImages);
                      }} 
                      placeholder="https://... or /images/..." 
                    />
                    {form.images[index] && (
                      <img 
                        src={form.images[index]} 
                        alt="Preview" 
                        style={{ marginTop: 12, width: '100%', height: 120, objectFit: 'cover', borderRadius: 6, border: '1px solid #e7e5e4' }} 
                        onError={(e) => { e.target.style.display = 'none'; }} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header"><span className="admin-card-title">Flags</span></div>
              <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[{ field: 'isSale', label: 'Mark as On Sale' }, { field: 'isFeatured', label: 'Mark as Featured' }].map(({ field, label }) => (
                  <label key={field} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#44403c', fontWeight: 500 }}>
                    <input type="checkbox" className="admin-checkbox" checked={form[field]} onChange={e => set(field, e.target.checked)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
