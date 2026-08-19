"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { clearCart } from "@/store/cartSlice";

const PAKISTAN_CITIES = [
  "Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar",
  "Quetta","Sialkot","Gujranwala","Hyderabad","Bahawalpur","Sargodha","Sukkur",
  "Larkana","Sheikhupura","Rahim Yar Khan","Jhang","Dera Ghazi Khan","Gujrat",
  "Mardan","Kasur","Mingora","Nawabshah","Sahiwal","Mirpur Khas","Okara","Abbottabad",
];

// SVG icons
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6" />
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const SHIPPING_METHODS = [
  { id: "cod", label: "FLAT SHIPPING 298 PKR + FBR POS FEE 1 PKR", sublabel: "Cash on Delivery (COD)", price: 299 },
  { id: "card", label: "FREE SHIPPING + FBR POS FEE 1 PKR", sublabel: "Debit / Credit Card", price: 1, originalPrice: 299 },
];

export default function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const router = useRouter();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("cod");
  const [billingOption, setBillingOption] = useState("same");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState({ text: '', type: '' });
  const [couponLoading, setCouponLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    emailOffers: true,
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "Pakistan",
    postalCode: "",
  });
  const [cardData, setCardData] = useState({
    cardNumber: "", expiry: "", cvv: "", cardName: "",
  });

  const shippingPrice = SHIPPING_METHODS.find((m) => m.id === selectedShipping)?.price || 299;
  const totalPrice = Math.max(0, subtotal + shippingPrice - discountAmount);

  const applyDiscount = async () => {
    if (!discountCode.trim()) return;
    setCouponLoading(true);
    setCouponMsg({ text: '', type: '' });
    try {
      const res = await fetch('http://localhost:5000/api/admin/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode.trim().toUpperCase(), orderValue: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDiscountAmount(data.discount);
      setCouponMsg({ text: `✓ Coupon applied! You saved PKR ${data.discount.toLocaleString()}`, type: 'success' });
    } catch (err) {
      setDiscountAmount(0);
      setCouponMsg({ text: err.message, type: 'error' });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.city) { setError("Please select a city."); return; }
    if (selectedShipping === "card") {
      if (!cardData.cardNumber || !cardData.expiry || !cardData.cvv || !cardData.cardName) {
        setError("Please fill in all card details."); return;
      }
    }
    setLoading(true);
    try {
      const paymentMethod = selectedShipping === "cod" ? "Cash on Delivery (COD)" : "Debit - Credit Card";
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name, qty: item.qty, image: item.image,
          price: item.price, selectedSize: item.selectedSize || "N/A", product: item.id,
        })),
        shippingAddress: {
          firstName: formData.firstName, lastName: formData.lastName,
          address: formData.address, city: formData.city,
          postalCode: formData.postalCode, country: formData.country,
        },
        contactEmail: formData.email,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice,
        discountAmount,
        couponCode: discountCode || '',
        totalPrice,
      };
      const { data } = await axios.post("http://localhost:5000/api/orders", orderData);
      dispatch(clearCart());
      router.push(`/order/${data._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Error placing order. Ensure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-24">
        <p className="text-muted-foreground text-lg mb-6">Your cart is empty.</p>
        <Link href="/shop" className="bg-primary text-primary-foreground px-8 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-primary/90 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-light tracking-[6px] uppercase font-poppins">Lumière</h1>
          <nav className="text-xs text-muted-foreground mt-3 flex justify-center gap-2 flex-wrap">
            <Link href="/cart" className="hover:text-primary transition hover:underline">Cart</Link>
            <span>›</span>
            <span className="text-primary font-medium">Information</span>
            <span>›</span>
            <span>Shipping</span>
            <span>›</span>
            <span>Payment</span>
          </nav>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-16">

            {/* ── LEFT COLUMN ─────────────────────────────── */}
            <div className="flex-1 order-2 lg:order-1">

              {/* Contact */}
              <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-semibold text-foreground">Contact</h2>
                  {!userInfo && (
                    <Link href="/login?redirect=/checkout" className="text-xs text-blue-600 hover:underline">
                      Sign in
                    </Link>
                  )}
                </div>
                <div className="border border-secondary rounded-sm overflow-hidden">
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="Email" required
                    className="w-full p-4 outline-none text-sm bg-background text-foreground placeholder:text-muted-foreground border-b border-secondary"
                  />
                  <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-secondary/20 transition">
                    <input type="checkbox" name="emailOffers" checked={formData.emailOffers} onChange={handleChange} className="accent-blue-600 w-4 h-4" />
                    <span className="text-sm text-foreground">Email me with news and offers</span>
                  </label>
                </div>
              </section>

              {/* Delivery */}
              <section className="mb-8">
                <h2 className="text-base font-semibold text-foreground mb-4">Delivery</h2>
                <div className="border border-secondary rounded-sm overflow-hidden">
                  {/* Country */}
                  <div className="relative border-b border-secondary">
                    <span className="absolute left-4 top-1 text-[10px] text-muted-foreground">Country/Region</span>
                    <select name="country" value={formData.country} onChange={handleChange}
                      className="w-full pt-5 pb-3 px-4 pr-10 outline-none text-sm bg-background text-foreground appearance-none">
                      <option value="Pakistan">Pakistan</option>
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">▾</div>
                  </div>
                  {/* City */}
                  <div className="relative border-b border-secondary">
                    {formData.city && <span className="absolute left-4 top-1 text-[10px] text-muted-foreground">City</span>}
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      required
                      className={`w-full px-4 pr-10 outline-none text-sm bg-background text-foreground appearance-none ${formData.city ? "pt-5 pb-3" : "py-4"}`}>
                      <option value="" disabled>Select city from dropdown</option>
                      {PAKISTAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">▾</div>
                  </div>
                  {/* Name row */}
                  <div className="flex border-b border-secondary">
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                      placeholder="First name" required
                      className="flex-1 p-4 outline-none text-sm bg-background text-foreground placeholder:text-muted-foreground border-r border-secondary" />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                      placeholder="Last name" required
                      className="flex-1 p-4 outline-none text-sm bg-background text-foreground placeholder:text-muted-foreground" />
                  </div>
                  <input type="text" name="address" value={formData.address} onChange={handleChange}
                    placeholder="Address" required
                    className="w-full p-4 outline-none text-sm bg-background text-foreground placeholder:text-muted-foreground border-b border-secondary block" />
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange}
                    placeholder="Postal code (optional)"
                    className="w-full p-4 outline-none text-sm bg-background text-foreground placeholder:text-muted-foreground block" />
                </div>
              </section>

              {/* Shipping method */}
              <section className="mb-8">
                <h2 className="text-base font-semibold text-foreground mb-4">Shipping method</h2>
                <div className="border border-secondary rounded-sm overflow-hidden divide-y divide-secondary">
                  {SHIPPING_METHODS.map((method) => (
                    <label key={method.id}
                      className={`flex items-center justify-between p-4 cursor-pointer transition ${selectedShipping === method.id ? "bg-blue-50 dark:bg-blue-900/10" : "hover:bg-secondary/20"}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shippingMethod" value={method.id} checked={selectedShipping === method.id}
                          onChange={() => setSelectedShipping(method.id)} className="accent-blue-600 w-4 h-4" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{method.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                            <TruckIcon />{method.sublabel}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {method.originalPrice && <p className="text-xs text-muted-foreground line-through">Rs {method.originalPrice}.00</p>}
                        <p className="text-sm font-semibold text-foreground">Rs {method.price}.00</p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* Payment */}
              <section className="mb-8">
                <h2 className="text-base font-semibold text-foreground mb-1">Payment</h2>
                <p className="text-xs text-green-600 mb-4 flex items-center gap-1">
                  <LockIcon />All transactions are secure and encrypted.
                </p>
                <div className="border border-secondary rounded-sm overflow-hidden">
                  {/* COD option */}
                  <label className={`flex items-center justify-between p-4 cursor-pointer transition border-b border-secondary ${selectedShipping === "cod" ? "bg-blue-50 dark:bg-blue-900/10" : "hover:bg-secondary/20"}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="paymentDisplay" checked={selectedShipping === "cod"}
                        onChange={() => setSelectedShipping("cod")} className="accent-blue-600 w-4 h-4" />
                      <span className="text-sm text-foreground">Cash on Delivery (COD)</span>
                    </div>
                  </label>

                  {/* Card option */}
                  <div>
                    <label className={`flex items-center justify-between p-4 cursor-pointer transition ${selectedShipping === "card" ? "bg-blue-50 dark:bg-blue-900/10" : "hover:bg-secondary/20"} ${selectedShipping === "card" ? "" : "border-b-0"}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="paymentDisplay" checked={selectedShipping === "card"}
                          onChange={() => setSelectedShipping("card")} className="accent-blue-600 w-4 h-4" />
                        <div className="flex items-center gap-2">
                          <CreditCardIcon />
                          <span className="text-sm text-foreground">Debit / Credit Card</span>
                        </div>
                      </div>
                      {/* Card network badges */}
                      <div className="flex gap-1.5 items-center">
                        <svg className="h-5 w-8" viewBox="0 0 48 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="30" rx="3" fill="#1A1F71"/>
                          <text x="24" y="21" textAnchor="middle" fill="#F7B600" fontSize="12" fontWeight="bold" fontFamily="Arial">VISA</text>
                        </svg>
                        <svg className="h-5 w-8" viewBox="0 0 48 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="30" rx="3" fill="#fff" stroke="#e5e7eb"/>
                          <circle cx="18" cy="15" r="9" fill="#EB001B"/>
                          <circle cx="30" cy="15" r="9" fill="#F79E1B"/>
                          <path d="M24 8.27A9 9 0 0 1 27.73 15 9 9 0 0 1 24 21.73 9 9 0 0 1 20.27 15 9 9 0 0 1 24 8.27z" fill="#FF5F00"/>
                        </svg>
                      </div>
                    </label>

                    {/* Card details — shown when card is selected */}
                    {selectedShipping === "card" && (
                      <div className="border-t border-secondary bg-secondary/10 p-4 space-y-3">
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Card Number</label>
                          <input
                            type="text" name="cardNumber" value={cardData.cardNumber} onChange={handleCardChange}
                            placeholder="1234 5678 9012 3456" maxLength={19}
                            className="w-full border border-secondary rounded-sm p-3 text-sm outline-none focus:border-blue-500 bg-background text-foreground placeholder:text-muted-foreground transition"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Name on Card</label>
                          <input
                            type="text" name="cardName" value={cardData.cardName} onChange={handleCardChange}
                            placeholder="Full name as on card"
                            className="w-full border border-secondary rounded-sm p-3 text-sm outline-none focus:border-blue-500 bg-background text-foreground placeholder:text-muted-foreground transition"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Expiry Date</label>
                            <input
                              type="text" name="expiry" value={cardData.expiry} onChange={handleCardChange}
                              placeholder="MM / YY" maxLength={7}
                              className="w-full border border-secondary rounded-sm p-3 text-sm outline-none focus:border-blue-500 bg-background text-foreground placeholder:text-muted-foreground transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Security Code (CVV)</label>
                            <input
                              type="password" name="cvv" value={cardData.cvv} onChange={handleCardChange}
                              placeholder="CVV" maxLength={4}
                              className="w-full border border-secondary rounded-sm p-3 text-sm outline-none focus:border-blue-500 bg-background text-foreground placeholder:text-muted-foreground transition"
                            />
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                          <LockIcon />Your card information is encrypted and secure.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Billing Address */}
              <section className="mb-8">
                <h2 className="text-base font-semibold text-foreground mb-4">Billing address</h2>
                <div className="border border-secondary rounded-sm overflow-hidden divide-y divide-secondary">
                  {[
                    { val: "same", label: "Same as shipping address" },
                    { val: "different", label: "Use a different billing address" },
                  ].map((opt) => (
                    <label key={opt.val}
                      className={`flex items-center gap-3 p-4 cursor-pointer transition ${billingOption === opt.val ? "bg-blue-50 dark:bg-blue-900/10" : "hover:bg-secondary/20"}`}>
                      <input type="radio" name="billingOption" value={opt.val} checked={billingOption === opt.val}
                        onChange={() => setBillingOption(opt.val)} className="accent-blue-600 w-4 h-4" />
                      <span className="text-sm text-foreground">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </section>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold uppercase tracking-widest transition rounded-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <><CheckIcon /> Complete order</>
                )}
              </button>

              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground mt-8 pb-8">
                <Link href="/returns" className="hover:text-primary transition">Refund policy</Link>
                <Link href="/shipping" className="hover:text-primary transition">Shipping policy</Link>
                <Link href="/contact" className="hover:text-primary transition">Privacy policy</Link>
                <Link href="/contact" className="hover:text-primary transition">Terms of service</Link>
              </div>
            </div>

            {/* ── RIGHT COLUMN – Order Summary ─────────────── */}
            <div className="w-full lg:w-[400px] order-1 lg:order-2 bg-secondary/20 border-b lg:border-b-0 lg:border-l border-secondary px-6 py-8 mb-8 lg:mb-0">
              {/* Items */}
              <div className="flex flex-col gap-5 mb-6 pb-6 border-b border-secondary">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-16 h-20 bg-secondary rounded flex-shrink-0 border border-secondary overflow-hidden">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />}
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      {item.selectedSize && <p className="text-xs text-muted-foreground mt-0.5">{item.selectedSize}</p>}
                    </div>
                    <span className="text-sm font-medium text-foreground flex-shrink-0">
                      Rs {(item.price * item.qty).toLocaleString()}.00
                    </span>
                  </div>
                ))}
              </div>

              {/* Discount code */}
              <div className="mb-6 pb-6 border-b border-secondary">
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="Discount code or gift card" value={discountCode}
                    onChange={(e) => { setDiscountCode(e.target.value); setDiscountAmount(0); setCouponMsg({ text: '', type: '' }); }}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyDiscount())}
                    className="flex-1 border border-secondary rounded-sm px-4 py-3 text-sm outline-none focus:border-primary transition bg-background text-foreground placeholder:text-muted-foreground" />
                  <button type="button" onClick={applyDiscount} disabled={couponLoading}
                    className="px-5 py-3 border border-secondary rounded-sm text-sm font-medium hover:bg-secondary/40 transition text-foreground disabled:opacity-50">
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {couponMsg.text && (
                  <p className={`text-xs mt-1 ${couponMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{couponMsg.text}</p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">Rs {subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">Rs {shippingPrice.toLocaleString()}.00</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="flex items-center gap-1">🏷 Discount ({discountCode.toUpperCase()})</span>
                    <span className="font-medium">− Rs {discountAmount.toLocaleString()}.00</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-secondary">
                  <span className="text-foreground font-semibold">Total</span>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground mr-2">PKR</span>
                    <span className="text-xl font-bold text-foreground">Rs {totalPrice.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
