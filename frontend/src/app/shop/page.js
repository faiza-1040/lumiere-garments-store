"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

function ShopContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const gender = searchParams.get("gender");
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (gender) params.set('gender', gender);
        if (searchQuery) params.set('search', searchQuery);

        const { data } = await axios.get(`http://localhost:5000/api/products?${params}`);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, gender, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 w-full min-h-screen">
      <div className="mb-12 border-b border-secondary pb-8">
        <h1 className="text-4xl font-light font-poppins tracking-tight">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : gender
            ? `${gender}'s Collection`
            : category
            ? `${category}'s Collection`
            : "All Collections"}
        </h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest mt-2">
          {products.length} Products Found
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center text-muted-foreground">Loading collections...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
          {products.map((product) => (
            <div key={product._id} className="group flex flex-col relative">
              <Link href={`/product/${product._id}`}>
                <div className="relative aspect-[3/4] bg-[#e7e5e4] mb-4 overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-all duration-500 z-10" />
                  <Image
                    src={product.image?.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </Link>
              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <Link href={`/product/${product._id}`}>
                    <h3 className="text-[13px] uppercase tracking-wider font-medium hover:underline cursor-pointer truncate max-w-[180px]">
                      {product.name}
                    </h3>
                  </Link>
                  <span className="text-sm font-medium">PKR {product.price?.toLocaleString()}</span>
                </div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  {product.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="py-40 text-center">
          <p className="text-lg text-muted-foreground font-light">
            No products found in this collection.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading Collections...</div>}>
      <ShopContent />
    </Suspense>
  );
}
