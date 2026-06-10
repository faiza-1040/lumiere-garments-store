"use client";
import { Truck, Globe, Clock, ShieldCheck } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32 space-y-24">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-light font-poppins tracking-tight">Shipping & Logistics</h1>
        <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs">Exquisite handling for every order</p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <Truck className="text-primary" size={32} strokeWidth={1} />
            <h2 className="text-2xl font-light">Domestic Shipping</h2>
          </div>
          <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
            <p>We offer complimentary standard shipping on all domestic orders over $500. For orders under $500, a flat rate of $15 applies.</p>
            <p><span className="font-semibold text-foreground">Standard Delivery:</span> 3 - 5 Business Days</p>
            <p><span className="font-semibold text-foreground">Express Delivery:</span> 1 - 2 Business Days ($35)</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <Globe className="text-primary" size={32} strokeWidth={1} />
            <h2 className="text-2xl font-light">International Shipping</h2>
          </div>
          <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
            <p>Lumière ships to over 150 countries worldwide. International shipping rates are calculated at checkout based on weight and destination.</p>
            <p><span className="font-semibold text-foreground">International Economy:</span> 7 - 14 Business Days</p>
            <p><span className="font-semibold text-foreground">International Priority:</span> 3 - 5 Business Days</p>
          </div>
        </div>
      </div>

      <div className="bg-secondary/20 p-12 space-y-8">
        <h2 className="text-3xl font-light text-center">Order Processing</h2>
        <div className="grid sm:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-background flex items-center justify-center rounded-full mx-auto shadow-sm">
              <Clock size={20} className="text-muted-foreground" />
            </div>
            <h3 className="text-xs uppercase tracking-widest font-bold">Quick Prep</h3>
            <p className="text-[13px] text-muted-foreground font-light">Orders are typically processed within 24 hours.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-background flex items-center justify-center rounded-full mx-auto shadow-sm">
              <ShieldCheck size={20} className="text-muted-foreground" />
            </div>
            <h3 className="text-xs uppercase tracking-widest font-bold">Quality Check</h3>
            <p className="text-[13px] text-muted-foreground font-light">Every garment undergoes a rigorous inspection before shipping.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-background flex items-center justify-center rounded-full mx-auto shadow-sm">
              <Truck size={20} className="text-muted-foreground" />
            </div>
            <h3 className="text-xs uppercase tracking-widest font-bold">Secure Transit</h3>
            <p className="text-[13px] text-muted-foreground font-light">Premium packaging ensures your items arrive in pristine condition.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
