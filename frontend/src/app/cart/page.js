"use client";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { removeFromCart, updateQty } from "@/store/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 w-full min-h-[70vh]">
      <h1 className="text-3xl font-light font-poppins mb-12">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 border border-secondary">
          <p className="text-muted-foreground mb-6">Your cart is currently empty.</p>
          <Link href="/shop">
            <button className="bg-primary text-primary-foreground px-8 py-3 uppercase tracking-widest text-xs font-semibold">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-grow">
            <div className="border-b border-secondary pb-4 mb-4 hidden md:flex text-sm text-muted-foreground uppercase tracking-wider">
              <div className="w-1/2">Product</div>
              <div className="w-1/4 text-center">Quantity</div>
              <div className="w-1/4 text-right">Total</div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row items-center border-b border-secondary py-6 gap-6">
                <div className="w-full md:w-1/2 flex gap-6 items-center">
                  <div className="relative w-24 h-32 bg-secondary flex-shrink-0">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    {item.selectedSize && <p className="text-xs text-muted-foreground mt-1">Size: {item.selectedSize}</p>}
                    <p className="text-sm text-muted-foreground mt-1">${item.price}</p>
                    <button 
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-xs text-red-900/70 mt-4 uppercase tracking-widest hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-1/4 flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-sm text-muted-foreground">Quantity</span>
                  <div className="flex items-center border border-secondary">
                    <button 
                      onClick={() => dispatch(updateQty({ id: item.id, qty: Math.max(1, item.qty - 1) }))}
                      className="px-3 py-1 hover:bg-secondary transition"
                    >-</button>
                    <span className="px-4 text-sm">{item.qty}</span>
                    <button 
                      onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}
                      className="px-3 py-1 hover:bg-secondary transition"
                    >+</button>
                  </div>
                </div>

                <div className="w-full md:w-1/4 flex justify-between md:justify-end items-center">
                  <span className="md:hidden text-sm text-muted-foreground">Total</span>
                  <span className="font-medium">${item.price * item.qty}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full md:w-80 bg-secondary/50 p-8 h-fit">
            <h2 className="text-xl font-medium font-poppins mb-6">Order Summary</h2>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t border-secondary pt-4 mt-4 flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-medium text-lg">${subtotal}</span>
            </div>
            
            <Link href="/checkout">
              <button className="w-full bg-primary text-primary-foreground py-4 mt-8 uppercase tracking-widest text-xs font-semibold hover:bg-primary/90 transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
