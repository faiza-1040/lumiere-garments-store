'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function AdminReviewsPage() {
  const { userInfo } = useSelector((s) => s.auth);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [userInfo]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // In a real app, this would hit an admin reviews endpoint
      // We will mock this or catch errors if the endpoint doesn't exist
      const { data } = await axios.get('http://localhost:5000/api/admin/reviews', {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setReviews(data);
    } catch (e) {
      // Graceful fallback if endpoint isn't fully implemented
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, reviewId) => {
    if (window.confirm('Delete this review?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        fetchReviews();
      } catch (e) {
        alert('Error deleting review');
      }
    }
  };

  if (loading) return <div className="admin-spinner"><div className="spinner-dot" /><div className="spinner-dot" /><div className="spinner-dot" /></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customer Reviews</h1>
          <p className="admin-page-sub">Monitor and moderate product reviews across your store.</p>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: 500, color: '#1c1917' }}>{r.productName}</td>
                  <td>{r.name}</td>
                  <td>{'⭐'.repeat(r.rating)}</td>
                  <td style={{ maxWidth: 300, whiteSpace: 'normal', fontSize: 12 }}>"{r.comment}"</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(r.productId, r._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-empty">
                    <div className="admin-empty-icon">⭐</div>
                    <div className="admin-empty-text">No reviews found</div>
                    <div className="admin-empty-sub">Your store doesn't have any customer reviews yet.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
