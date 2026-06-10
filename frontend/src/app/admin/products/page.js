'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

export default function AdminProductsPage() {
  const { userInfo } = useSelector((s) => s.auth);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.set('search', search);
      if (filterStatus) params.set('status', filterStatus);
      if (filterGender) params.set('gender', filterGender);

      const res = await fetch(`http://localhost:5000/api/admin/products?${params}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (e) {
      setProducts([]);
      showMsg('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [userInfo, page, search, filterStatus, filterGender]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const showMsg = (text, type) => {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product permanently?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      if (!res.ok) throw new Error();
      showMsg('Product deleted', 'success');
      fetchProducts();
    } catch {
      showMsg('Failed to delete product', 'error');
    }
  };

  const toggleFeatured = async (product) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${product._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${userInfo?.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !product.isFeatured }),
      });
      if (!res.ok) throw new Error();
      fetchProducts();
    } catch {
      showMsg('Failed to update', 'error');
    }
  };

  const getStockBadge = (count) => {
    if (count === 0) return <span className="badge badge-out">Out of Stock</span>;
    if (count <= 5) return <span className="badge badge-low">Low ({count})</span>;
    return <span className="badge badge-instock">{count} in stock</span>;
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-sub">{total} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">+ Add Product</Link>
      </div>

      {msg && <div className={`admin-alert admin-alert-${msgType}`}>{msg}</div>}

      {/* ── Filters ── */}
      <div className="admin-search-bar">
        <div className="admin-search-input-wrap">
          <span className="admin-search-icon">⌕</span>
          <input
            className="admin-search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="admin-select" value={filterGender} onChange={(e) => { setFilterGender(e.target.value); setPage(1); }}>
          <option value="">All Genders</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>
        <select className="admin-select" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="instock">In Stock</option>
          <option value="lowstock">Low Stock</option>
          <option value="outofstock">Out of Stock</option>
          <option value="featured">Featured</option>
          <option value="sale">On Sale</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-spinner"><div className="spinner-dot" /><div className="spinner-dot" /><div className="spinner-dot" /></div>
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">◈</div>
            <p className="admin-empty-text">No products found</p>
            <p className="admin-empty-sub">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Gender</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>Sale</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {p.image && (
                            <img
                              src={p.image.startsWith('http') ? p.image : `http://localhost:5000${p.image}`}
                              alt={p.name}
                              style={{ width: 44, height: 56, objectFit: 'cover', borderRadius: 4, border: '1px solid #e7e5e4', background: '#f5f4f1' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: 600, color: '#1c1917', fontSize: 13 }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: '#a8a29e' }}>{p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td>{p.gender}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>PKR {p.price?.toLocaleString()}</div>
                        {p.isSale && p.discountPrice > 0 && (
                          <div style={{ fontSize: 11, color: '#991b1b' }}>Sale: PKR {p.discountPrice?.toLocaleString()}</div>
                        )}
                      </td>
                      <td>{getStockBadge(p.countInStock)}</td>
                      <td>
                        <button
                          onClick={() => toggleFeatured(p)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: p.isFeatured ? '#f59e0b' : '#d6d3d1' }}
                          title={p.isFeatured ? 'Remove from featured' : 'Add to featured'}
                        >
                          ★
                        </button>
                      </td>
                      <td>
                        {p.isSale ? <span className="badge badge-active">Sale</span> : <span style={{ color: '#a8a29e', fontSize: 12 }}>—</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Link href={`/admin/products/${p._id}/edit`} className="btn-edit">Edit</Link>
                          <button className="btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="admin-pagination">
              <span>Showing {products.length} of {total}</span>
              <div className="admin-pagination-btns">
                <button className="admin-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <button className={`admin-page-btn active`}>{page}</button>
                <button className="admin-page-btn" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
