"use client";
import { useSelector } from "react-redux";
import Link from "next/link";

export default function OrderHistoryPage() {
  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <div className="max-w-5xl mx-auto px-6 py-28 min-h-[80vh]">
      <div className="border border-secondary p-8 md:p-10">
        <h1 className="text-3xl font-light font-poppins tracking-tight mb-3">Order history</h1>
        <p className="text-sm text-muted-foreground max-w-2xl mb-8">
          {userInfo
            ? `You’ll see your recent orders here once they’re placed.`
            : "Sign in to view your past orders and track new ones."}
        </p>

        {userInfo ? (
          <div className="rounded-sm border border-secondary/60 bg-secondary/30 p-6 text-sm text-muted-foreground">
            No orders yet. Start shopping to build your history.
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/login" className="border border-primary text-primary px-6 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition text-center">
              Sign In
            </Link>
            <Link href="/register" className="bg-primary text-primary-foreground px-6 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-primary/90 transition text-center">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
