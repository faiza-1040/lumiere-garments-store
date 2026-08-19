"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "@/store/authSlice";
import { clearFavourites } from "@/store/favouritesSlice";
import { User, Package, Heart, LogOut, Mail, Shield, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const favourites = useSelector((state) => state.favourites.items);
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearFavourites());
    router.push("/");
  };

  if (!mounted) return null;

  if (!userInfo) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 min-h-[80vh]">
        <div className="border border-secondary p-8 md:p-10 text-center">
          <h1 className="text-3xl font-light font-poppins tracking-tight mb-3">Your account</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-8">
            Sign in to see your orders, save favourites, and manage your profile in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/login" className="border border-primary text-primary px-6 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition">
              Sign In
            </Link>
            <Link href="/register" className="bg-primary text-primary-foreground px-6 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-primary/90 transition">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fullName = `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim();

  return (
    <div className="max-w-4xl mx-auto px-6 py-28 min-h-[80vh]">
      <div className="mb-12">
        <h1 className="text-3xl font-light font-poppins tracking-tight mb-2">
          Welcome, {userInfo.firstName || "there"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, orders, and preferences
        </p>
      </div>

      <div className="border border-secondary p-8 mb-8">
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-secondary">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold flex-shrink-0">
            {userInfo.firstName?.charAt(0) || "U"}{userInfo.lastName?.charAt(0) || "S"}
          </div>
          <div>
            <h2 className="text-lg font-medium">{fullName || "Member"}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <Mail size={14} /> {userInfo.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Full Name</span>
            <span className="text-sm font-medium">{fullName || "Member"}</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Email Address</span>
            <span className="text-sm font-medium">{userInfo.email}</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Account Status</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
              <Shield size={12} /> Verified Member
            </span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Saved Items</span>
            <span className="text-sm font-medium">{favourites.length} {favourites.length === 1 ? 'item' : 'items'} in favourites</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href="/order-history" className="group border border-secondary p-6 hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package size={20} strokeWidth={1.5} className="text-muted-foreground" />
              <span className="text-sm font-medium uppercase tracking-wider">Order History</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link href="/favourites" className="group border border-secondary p-6 hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart size={20} strokeWidth={1.5} className="text-muted-foreground" />
              <span className="text-sm font-medium uppercase tracking-wider">My Favourites</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <button onClick={handleLogout} className="group border border-secondary p-6 hover:border-red-200 transition-all text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogOut size={20} strokeWidth={1.5} className="text-red-900/60" />
              <span className="text-sm font-medium uppercase tracking-wider text-red-900/70">Sign Out</span>
            </div>
            <ChevronRight size={16} className="text-red-900/40 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
}
