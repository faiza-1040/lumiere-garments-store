'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const CATEGORIES = [
  'Shirt', 'T-Shirt', 'Polo Shirt', 'Jeans', 'Trouser', 'Shorts',
  'Jacket', 'Coat', 'Sweater', 'Hoodie', 'Sweatshirt',
  'Dress', 'Skirt', 'Kurta', 'Shalwar Kameez', 'Suit', 'Blazer',
  'Tracksuit', 'Pajamas', 'Underwear', 'Socks', 'Swimwear',
  'Shoes', 'Bag', 'Accessories', 'Other',
];

const PRESET_COLORS = [
  { name: 'Black',       hex: '#0a0a0a' },
  { name: 'White',       hex: '#f5f5f5' },
  { name: 'Ivory',       hex: '#fffff0' },
  { name: 'Cream',       hex: '#fffdd0' },
  { name: 'Beige',       hex: '#f5f0e8' },
  { name: 'Camel',       hex: '#c19a6b' },
  { name: 'Tan',         hex: '#d2b48c' },
  { name: 'Brown',       hex: '#795548' },
  { name: 'Chocolate',   hex: '#3d1c02' },
  { name: 'Olive',       hex: '#708238' },
  { name: 'Khaki',       hex: '#c3b091' },
  { name: 'Forest Green',hex: '#228b22' },
  { name: 'Sage',        hex: '#b2beb5' },
  { name: 'Mint',        hex: '#98ff98' },
  { name: 'Teal',        hex: '#008080' },
  { name: 'Navy',        hex: '#001f5b' },
  { name: 'Royal Blue',  hex: '#4169e1' },
  { name: 'Sky Blue',    hex: '#87ceeb' },
  { name: 'Grey',        hex: '#9e9e9e' },
  { name: 'Charcoal',    hex: '#36454f' },
  { name: 'Burgundy',    hex: '#800020' },
  { name: 'Rust',        hex: '#b7410e' },
  { name: 'Mustard',     hex: '#ffdb58' },
  { name: 'Blush Pink',  hex: '#ffb6c1' },
  { name: 'Rose',        hex: '#ff007f' },
  { name: 'Lilac',       hex: '#c8a2c8' },
  { name: 'Purple',      hex: '#800080' },
];

export default function EditProductPage() {
  const { userInfo } = useSelector((s) => s.auth);
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [form, setForm] = useState(null);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#000000');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setForm({
          name: data.name || '', brand: data.brand || 'Lumière',
          category: data.category || '', gender: data.gender || 'Men',
          description: data.description || '',
          price: data.price || '', discountPrice: data.discountPrice || '',
          isSale: data.isSale || false, isFeatured: data.isFeatured || false,
          countInStock: data.countInStock || '', 
          modelSize: data.modelSize || '',
          images: [
            data.images?.[0] || data.image || '',
            data.images?.[1] || '',
            data.images?.[2] || '',
            data.images?.[3] || ''
          ],
          sizes: data.sizes || [], colors: data.colors || [],
        });
      } catch {
        setMsg('Failed to load product'); setMsgType('error');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const toggleArr = (field, val) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val]
    }));
  };

  const addCustomColor = () => {
    const name = customColorName.trim() || customColorHex;
    if (!form.colors.includes(name)) {
      set('colors', [...form.colors, name]);
    }
    setCustomColorName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: 'PUT',
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
      setMsg('Product updated!'); setMsgType('success');
      setTimeout(() => router.push('/admin/products'), 1200);
    } catch (e) {
      setMsg(e.message); setMsgType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-spinner"><div className="spinner-dot" /><div className="spinner-dot" /><div className="spinner-dot" /></div>;
  if (!form) return <div className="admin-alert admin-alert-error">{msg}</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit Product</h1>
          <p className="admin-page-sub">{form.name}</p>
        </div>
        <button onClick={() => router.back()} className="btn-secondary">← Back</button>
      </div>

      {msg && <div className={`admin-alert admin-alert-${msgType}`}>{msg}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="admin-card">
              <div className="admin-card-header"><span className="admin-card-title">Basic Information</span></div>
              <div className="admin-card-body">
                <div className="admin-form-group">
                  <label className="admin-label">Product Name *</label>
                  <input className="admin-input" required value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Category *</label>
                  <select className="admin-select" style={{ width: '100%' }} required value={form.category} onChange={e => set('category', e.target.value)}>
                    <option value="">— Select Category —</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Description *</label>
                  <textarea className="admin-input" required rows={4} value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>

            {/* Sizes & Model Size */}
            <div className="admin-card">
              <div className="admin-card-header"><span className="admin-card-title">Sizes</span></div>
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
                  <label className="admin-label">Model is Wearing Size</label>
                  <select className="admin-select" style={{ width: '100%' }} value={form.modelSize} onChange={e => set('modelSize', e.target.value)}>
                    <option value="">— Not specified —</option>
                    {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <p style={{ fontSize: 11, color: '#a8a29e', marginTop: 5 }}>Shown on product page to help customers size themselves.</p>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="admin-card">
              <div className="admin-card-header"><span className="admin-card-title">Colors</span></div>
              <div className="admin-card-body">
                <label className="admin-label" style={{ marginBottom: 10 }}>Preset Colors</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {PRESET_COLORS.map(c => {
                    const selected = form.colors.includes(c.name);
                    return (
                      <button
                        key={c.name} type="button"
                        onClick={() => toggleArr('colors', c.name)}
                        title={c.name}
                        style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: c.hex,
                          border: selected ? '3px solid #1c1917' : '2px solid #e7e5e4',
                          cursor: 'pointer',
                          boxShadow: selected ? '0 0 0 2px #fff, 0 0 0 4px #1c1917' : 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                          transition: 'all 0.15s',
                          transform: selected ? 'scale(1.15)' : 'scale(1)',
                        }}
                      />
                    );
                  })}
                </div>

                {form.colors.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {form.colors.map(c => (
                      <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: '#f5f4f1', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                        {c}
                        <button type="button" onClick={() => toggleArr('colors', c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c', fontWeight: 700, fontSize: 13, lineHeight: 1, padding: 0 }}>×</button>
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ borderTop: '1px solid #f5f4f1', paddingTop: 16 }}>
                  <label className="admin-label">Custom Color</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="color" value={customColorHex} onChange={e => setCustomColorHex(e.target.value)}
                      style={{ width: 40, height: 36, border: '1px solid #d6d3d1', borderRadius: 6, cursor: 'pointer', padding: 2, background: '#fff' }} />
                    <input className="admin-input" value={customColorName} onChange={e => setCustomColorName(e.target.value)}
                      placeholder="Color name (e.g. Ocean Blue)" style={{ flex: 1 }}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomColor())} />
                    <button type="button" onClick={addCustomColor} className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>+ Add</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                  <input className="admin-input" type="number" required min="0" value={form.price} onChange={e => set('price', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Sale Price (PKR)</label>
                  <input className="admin-input" type="number" min="0" value={form.discountPrice} onChange={e => set('discountPrice', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Stock Quantity *</label>
                  <input className="admin-input" type="number" required min="0" value={form.countInStock} onChange={e => set('countInStock', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header"><span className="admin-card-title">Images</span></div>
              <div className="admin-card-body">
                {[0, 1, 2, 3].map((index) => (
                  <ImageUploader
                    key={index}
                    index={index}
                    label={`Image ${index + 1}`}
                    required={index === 0}
                    value={form.images[index]}
                    onChange={(url) => {
                      const newImages = [...form.images];
                      newImages[index] = url;
                      set('images', newImages);
                    }}
                  />
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

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
