'use client';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import FavouriteButton from '@/components/FavouriteButton';

export default function FavouritesPage() {
  const { items } = useSelector((s) => s.favourites);
  const { userInfo } = useSelector((s) => s.auth);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen">
      {/* Page header */}
      <div className="mb-12 border-b border-secondary pb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart size={28} strokeWidth={1.5} fill={items.length > 0 ? '#be185d' : 'none'} color={items.length > 0 ? '#be185d' : '#1c1917'} />
          <h1 className="text-4xl font-light font-poppins tracking-tight">My Favourites</h1>
        </div>
        <p className="text-sm text-muted-foreground uppercase tracking-widest mt-2">
          {items.length} {items.length === 1 ? 'Item' : 'Items'} Saved
        </p>
        {!userInfo && items.length > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-2 rounded-full">
            <span>⚠</span>
            <span>You are browsing as a guest — favourites will be lost when you close the browser.</span>
            <Link href="/register" className="font-semibold underline ml-1">Create an account</Link>
            <span>to save them permanently.</span>
          </div>
        )}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="py-32 flex flex-col items-center text-center">
          <Heart size={64} strokeWidth={1} className="text-muted-foreground mb-6 opacity-30" />
          <h2 className="text-2xl font-light font-poppins mb-3">No favourites yet</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-md">
            Browse our collections and click the heart icon on any product to save it here.
            {!userInfo && ' Sign in to keep your favourites across sessions.'}
          </p>
          <div className="flex gap-4">
            <Link href="/shop">
              <button className="bg-primary text-primary-foreground px-8 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-primary/90 transition">
                Browse Collections
              </button>
            </Link>
            {!userInfo && (
              <Link href="/login">
                <button className="border border-primary text-primary px-8 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Products grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
          {items.map((product) => (
            <div key={product._id} className="group flex flex-col relative">
              <div className="relative aspect-[3/4] bg-[#e7e5e4] mb-4 overflow-hidden">
                <Link href={`/product/${product._id}`}>
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-all duration-500 z-10" />
                  <Image
                    src={product.image?.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                    onError={() => {}}
                  />
                </Link>
                {/* Heart remove button — always visible on favourites page */}
                <div className="absolute top-3 right-3 z-20">
                  <FavouriteButton product={product} size={16} />
                </div>
              </div>
              <div className="flex justify-between items-start mb-1">
                <Link href={`/product/${product._id}`}>
                  <h3 className="text-[13px] uppercase tracking-wider font-medium hover:underline truncate max-w-[180px]">
                    {product.name}
                  </h3>
                </Link>
                <span className="text-sm font-medium">PKR {product.price?.toLocaleString()}</span>
              </div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                {product.category}
              </p>
              <Link href={`/product/${product._id}`} className="mt-3">
                <button className="w-full border border-primary text-primary py-2.5 uppercase tracking-widest text-[11px] font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  View Product
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
