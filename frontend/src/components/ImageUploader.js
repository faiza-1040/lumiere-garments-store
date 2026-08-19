'use client';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

/**
 * ImageUploader
 * Props:
 *   value       — current image URL string
 *   onChange    — callback(url: string)
 *   label       — label text
 *   required    — whether the field is required
 *   index       — slot index number for display
 */
export default function ImageUploader({ value, onChange, label, required = false, index = 0 }) {
  const { userInfo } = useSelector((s) => s.auth);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userInfo?.token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      // Reset so same file can be re-selected
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label className="admin-label">{label} {required && '*'}</label>

      {/* Hidden native file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      {/* Upload trigger button */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '9px 18px',
            background: uploading ? '#e7e5e4' : '#1c1917',
            color: uploading ? '#78716c' : '#fafaf9',
            border: 'none',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: uploading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.5px',
            transition: 'all 0.15s',
            textTransform: 'uppercase',
          }}
        >
          {uploading ? (
            <>
              <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #a8a29e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Uploading...
            </>
          ) : (
            <>
              <span style={{ fontSize: 16 }}>↑</span>
              {value ? 'Replace Image' : 'Upload Image'}
            </>
          )}
        </button>

        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{ padding: '9px 14px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            ✕ Remove
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p style={{ color: '#991b1b', fontSize: 12, marginBottom: 8 }}>⚠ {error}</p>
      )}

      {/* Image preview */}
      {value && (
        <div style={{ position: 'relative', width: '100%', height: 160, borderRadius: 8, overflow: 'hidden', border: '1px solid #e7e5e4', background: '#f5f4f1' }}>
          <img
            src={value}
            alt={`Image ${index + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.opacity = 0.3; }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
            padding: '20px 10px 8px',
            color: '#fff', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
            fontWeight: 600
          }}>
            ✓ Uploaded to Cloudinary
          </div>
        </div>
      )}

      {/* Empty state */}
      {!value && (
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            width: '100%', height: 120, border: '2px dashed #d6d3d1', borderRadius: 8,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 6, cursor: 'pointer', background: '#faf9f6', transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#78716c'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#d6d3d1'}
        >
          <span style={{ fontSize: 28, opacity: 0.3 }}>🖼</span>
          <span style={{ fontSize: 11, color: '#a8a29e', letterSpacing: 0.5 }}>Click to upload or drag & drop</span>
          <span style={{ fontSize: 10, color: '#c4bfba' }}>PNG, JPG, WEBP up to 10MB</span>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
