"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

export default function OrderPage({ params }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-muted-foreground text-sm">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✗</div>
          <h2 className="text-xl font-medium mb-2">Order Not Found</h2>
          <p className="text-muted-foreground text-sm mb-6">Order not found or an error occurred. Ensure the backend is running on port 5000.</p>
          <Link href="/shop" className="bg-primary text-primary-foreground px-8 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-primary/90 transition inline-block">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { key: "pending", label: "Order Placed", icon: "📦" },
    { key: "processing", label: "Processing", icon: "⚙️" },
    { key: "shipped", label: "Shipped", icon: "🚚" },
    { key: "delivered", label: "Delivered", icon: "✅" },
  ];
  const currentStep = statusSteps.findIndex((s) => s.key === (order.status || "pending"));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12 lg:py-20">

        {/* ─── Success Header ─────────────────────────────── */}
        <div className="text-center mb-10">
          {/* Animated check */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-30" />
          </div>

          <p className="text-xs uppercase tracking-[4px] text-green-600 font-semibold mb-2">Order Confirmed</p>
          <h1 className="text-3xl lg:text-4xl font-light font-poppins text-foreground mb-4">
            Thank you, {order.shippingAddress.firstName}!
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Your order has been placed successfully. A confirmation email has been sent to{" "}
            <span className="font-semibold text-foreground">{order.contactEmail}</span>.
          </p>
        </div>

        {/* ─── Order ID Banner ─────────────────────────────── */}
        <div className="bg-green-50 border border-green-200 rounded-sm p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-xs text-green-700 uppercase tracking-wider font-semibold mb-0.5">Order Number</p>
            <p className="text-sm font-mono font-bold text-green-900 break-all">{order._id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-green-700 uppercase tracking-wider font-semibold mb-0.5">Date</p>
            <p className="text-sm text-green-900">{new Date(order.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>

        {/* ─── Status Tracker ──────────────────────────────── */}
        <div className="bg-secondary/30 border border-secondary rounded-sm p-6 mb-8">
          <h2 className="text-xs uppercase tracking-[3px] font-semibold text-foreground mb-6">Order Status</h2>
          <div className="flex items-center justify-between relative">
            {/* Progress bar */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-secondary" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-green-500 transition-all duration-700"
              style={{ width: `${(Math.max(currentStep, 0) / (statusSteps.length - 1)) * 100}%` }}
            />
            {statusSteps.map((step, idx) => (
              <div key={step.key} className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                  idx <= currentStep
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-background border-secondary text-muted-foreground"
                }`}>
                  {idx <= currentStep ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-base">{step.icon}</span>
                  )}
                </div>
                <p className={`text-[10px] uppercase tracking-wide font-medium text-center max-w-[60px] leading-tight ${
                  idx <= currentStep ? "text-green-700" : "text-muted-foreground"
                }`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Two Column: Order Items + Info ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Order Items */}
          <div className="border border-secondary rounded-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-secondary bg-secondary/20">
              <h2 className="text-xs uppercase tracking-[3px] font-semibold text-foreground">Items Ordered</h2>
            </div>
            <div className="divide-y divide-secondary">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4">
                  <div className="relative w-14 h-18 bg-secondary flex-shrink-0 rounded overflow-hidden">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    {item.selectedSize && item.selectedSize !== "N/A" && (
                      <p className="text-xs text-muted-foreground mt-0.5">Size: {item.selectedSize}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground flex-shrink-0">
                    PKR {(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4">
            {/* Pricing */}
            <div className="border border-secondary rounded-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-secondary bg-secondary/20">
                <h2 className="text-xs uppercase tracking-[3px] font-semibold text-foreground">Payment Summary</h2>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">PKR {order.itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">PKR {order.shippingPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="text-foreground text-right max-w-[140px]">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-secondary font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground text-base">PKR {order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border border-secondary rounded-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-secondary bg-secondary/20">
                <h2 className="text-xs uppercase tracking-[3px] font-semibold text-foreground">Shipping Address</h2>
              </div>
              <div className="p-5 text-sm text-foreground space-y-1">
                <p className="font-semibold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}
                  {order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ""}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.country || "Pakistan"}</p>
                <p className="text-muted-foreground mt-2">{order.contactEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Email Note ─────────────────────────────────── */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-sm mb-8 text-sm text-blue-800">
          <span className="text-lg flex-shrink-0">✉️</span>
          <p>A confirmation email with your order details and tracking information has been sent to <strong>{order.contactEmail}</strong>. Please check your inbox (and spam folder).</p>
        </div>

        {/* ─── CTA Buttons ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="flex-1 sm:flex-none text-center bg-primary text-primary-foreground px-10 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-primary/90 transition rounded-sm"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none text-center border border-secondary text-foreground px-10 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-secondary/40 transition rounded-sm"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
}
