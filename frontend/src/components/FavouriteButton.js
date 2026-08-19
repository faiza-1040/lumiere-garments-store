'use client';
import { useSelector, useDispatch } from 'react-redux';
import { addFavourite, removeFavourite, setFavourites } from '@/store/favouritesSlice';
import { Heart } from 'lucide-react';

const API = 'http://localhost:5000';

export default function FavouriteButton({ product, size = 20, className = '' }) {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.favourites);
  const { userInfo } = useSelector((s) => s.auth);
  const isFav = items.some((p) => p._id === product._id);

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (userInfo) {
      // Logged-in: sync with backend
      try {
        const method = isFav ? 'DELETE' : 'POST';
        const res = await fetch(`${API}/api/favourites/${product._id}`, {
          method,
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        if (res.ok) {
          const updated = await res.json();
          dispatch(setFavourites(updated));
        }
      } catch (err) {
        console.error('Favourites sync error:', err);
      }
    } else {
      // Guest: sessionStorage only
      if (isFav) {
        dispatch(removeFavourite(product._id));
      } else {
        dispatch(addFavourite(product));
      }
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
      className={className}
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(4px)',
        border: 'none',
        borderRadius: '50%',
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, background 0.15s ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <Heart
        size={size}
        strokeWidth={1.5}
        fill={isFav ? '#be185d' : 'none'}
        color={isFav ? '#be185d' : '#44403c'}
        style={{ transition: 'all 0.2s ease' }}
      />
    </button>
  );
}
