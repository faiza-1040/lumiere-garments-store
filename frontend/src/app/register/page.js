"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError("You must agree to the Terms and Conditions to create an account.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/register", formData);
      setSuccess(data.message);
      // clear form
      setFormData({ firstName: "", lastName: "", phone: "", email: "", password: "" });
      setAgreed(false);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-32 w-full min-h-[80vh] flex flex-col justify-center text-center">
      <h1 className="text-xl font-light tracking-widest mb-6 uppercase">Create Account</h1>
      
      <p className="text-sm mb-12 font-medium">
        Already a member? <span className="mx-1">▸</span> 
        <Link href="/login" className="underline hover:text-muted-foreground transition">Sign in</Link>
      </p>

      {error && <p className="text-red-600 text-sm mb-6">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-6 p-4 border border-green-200 bg-green-50">{success}</p>}

      <form onSubmit={handleRegister} className="flex flex-col gap-8 text-left">
        <div>
          <label className="text-sm block mb-2">First name</label>
          <input 
            type="text" 
            name="firstName"
            autoComplete="given-name"
            autoCorrect="off"
            spellCheck={false}
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border-b border-secondary pb-2 bg-transparent outline-none focus:border-primary transition"
          />
        </div>

        <div>
          <label className="text-sm block mb-2">Last name</label>
          <input 
            type="text" 
            name="lastName"
            autoComplete="family-name"
            autoCorrect="off"
            spellCheck={false}
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border-b border-secondary pb-2 bg-transparent outline-none focus:border-primary transition"
          />
        </div>

        <div>
          <label className="text-sm block mb-2">Phone</label>
          <input 
            type="tel" 
            name="phone"
            autoComplete="tel"
            autoCorrect="off"
            spellCheck={false}
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full border-b border-secondary pb-2 bg-transparent outline-none focus:border-primary transition"
          />
        </div>

        <div>
          <label className="text-sm block mb-2">Email</label>
          <input 
            type="email" 
            name="email"
            autoComplete="email"
            autoCorrect="off"
            spellCheck={false}
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border-b border-secondary pb-2 bg-transparent outline-none focus:border-primary transition"
          />
        </div>

        <div>
          <label className="text-sm block mb-2">Password</label>
          <input 
            type="password" 
            name="password"
            autoComplete="new-password"
            autoCorrect="off"
            spellCheck={false}
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full border-b border-secondary pb-2 bg-transparent outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex items-start gap-3 mt-2">
          <input 
            type="checkbox" 
            id="terms" 
            className="mt-1 w-4 h-4"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
            By signing up I agree to the LUMIÈRE Terms and Conditions and confirm that I have read and understood the Privacy Policy
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full border border-secondary text-primary py-4 mt-6 uppercase tracking-widest text-sm font-medium hover:bg-secondary transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "CREATE"}
        </button>
      </form>
    </div>
  );
}
