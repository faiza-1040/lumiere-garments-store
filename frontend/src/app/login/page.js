"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/authSlice";
import axios from "axios";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/profile";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      dispatch(setCredentials(data));
      if (data.isAdmin && !searchParams.get("redirect")) {
        router.push("/admin");
      } else {
        router.push(redirect);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-32 w-full min-h-[80vh] flex flex-col justify-center text-center">
      <h1 className="text-xl font-light tracking-widest mb-6">SIGN IN</h1>
      
      <p className="text-sm mb-12 font-medium">
        Not a member yet? <span className="mx-1">▸</span> 
        <Link href="/register" className="underline hover:text-muted-foreground transition">Create Account</Link>
      </p>

      {error && <p className="text-red-600 text-sm mb-6">{error}</p>}

      <form onSubmit={handleLogin} className="flex flex-col gap-8 text-left">
        <div>
          <label className="text-sm block mb-2">Email</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-secondary pb-2 bg-transparent outline-none focus:border-primary transition"
          />
        </div>

        <div>
          <label className="text-sm block mb-2">Password</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-secondary pb-2 bg-transparent outline-none focus:border-primary transition"
          />
          <div className="text-right mt-3">
            <a href="#" className="text-sm hover:underline text-muted-foreground">Forgot your password?</a>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full border border-secondary text-primary py-4 mt-8 uppercase tracking-widest text-sm font-medium hover:bg-secondary transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
