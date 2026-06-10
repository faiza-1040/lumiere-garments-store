'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products?featured=true');
        setTrending(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch trending products", error);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full bg-secondary flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#e7e5e4]">
          <Image 
            src="/images/valna-studio-mU88MlEFcoU-unsplash.jpg" 
            alt="Hero Banner" 
            fill 
            sizes="100vw"
            className="object-cover opacity-80 mix-blend-multiply" 
            priority
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="uppercase tracking-[0.3em] text-sm font-medium mb-6 block text-primary/70">
            Spring / Summer Collection
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8 font-poppins text-primary">
            Elegance in Every <br className="hidden md:block"/> Detail.
          </h1>
          <p className="text-lg md:text-xl text-primary/80 mb-10 max-w-xl mx-auto font-light">
            Discover the new standard of modern luxury. Minimalist aesthetics for the contemporary wardrobe.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/shop?gender=Women">
              <button className="bg-primary text-primary-foreground px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-primary/90 transition-all duration-300">
                Shop Women
              </button>
            </Link>
            <Link href="/shop?gender=Men">
              <button className="bg-transparent border border-primary text-primary px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-white/20 backdrop-blur-sm">
                Shop Men
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-light font-poppins">Curated Collections</h2>
          <Link href="/shop" className="uppercase tracking-widest text-xs font-semibold pb-1 border-b border-primary hover:text-muted-foreground transition-colors">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Women', subtitle: 'Refined Silhouettes', link: '/shop?gender=Women', img: '/images/milada-vigerova-p8Drpg_duLw-unsplash.jpg' },
            { title: 'Men', subtitle: 'Tailored Essentials', link: '/shop?gender=Men', img: '/images/justin-buisson-JU5_bUxr5Rg-unsplash.jpg' },
            { title: 'Accessories', subtitle: 'Modern Comfort', link: '/shop?category=Accessories', img: '/images/mediamodifier-7cERndkOyDw-unsplash.jpg' }
          ].map((cat, i) => (
            <Link href={cat.link} key={i}>
              <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] bg-secondary mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-all duration-500 z-10" />
                  <Image 
                    src={cat.img} 
                    alt={cat.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                <h3 className="text-xl font-medium font-poppins">{cat.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{cat.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-24 bg-secondary px-6 w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-light font-poppins text-center mb-16">Trending Now</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {trending.length === 0 ? (
              <p className="col-span-4 text-center text-muted-foreground">More products arriving soon...</p>
            ) : trending.map((item) => (
              <div key={item._id} className="group flex flex-col">
                <Link href={`/product/${item._id}`}>
                  <div className="relative aspect-[3/4] bg-[#e7e5e4] mb-4 overflow-hidden cursor-pointer">
                   <Image 
                     src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} 
                     alt={item.name} 
                     fill 
                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" 
                     className="object-cover scale-100 group-hover:scale-105 transition-transform duration-500" 
                   />
                  </div>
                </Link>
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/product/${item._id}`}>
                      <h3 className="text-sm font-medium hover:underline cursor-pointer truncate max-w-[180px]">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
                  </div>
                  <span className="text-sm font-medium">PKR {item.price?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Brand Story / Banner */}
      <section className="relative py-48 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/anomaly-WWesmHEgXDs-unsplash.jpg" alt="Brand Story" fill sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-white/60" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl font-light font-poppins mb-6">The Art of Minimalism</h2>
          <p className="text-lg text-primary/80 font-medium leading-relaxed">
            We believe in creating pieces that transcend seasonal trends. 
            Our focus is on premium materials, ethical manufacturing, and 
            silhouettes that offer both comfort and refined elegance. 
            Every stitch is purposeful, every fabric carefully selected.
          </p>
        </div>
      </section>
    </div>
  );
}
