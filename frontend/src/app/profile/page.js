"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/store/authSlice";

export default function ProfilePage() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
  }, [userInfo, router]);

  if (!userInfo) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-32 min-h-[80vh]">
      <h1 className="text-3xl font-light tracking-widest mb-12 uppercase">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 flex flex-col gap-4">
          <button className="text-left py-2 border-b border-foreground font-medium uppercase tracking-widest text-sm">Dashboard</button>
          <button className="text-left py-2 text-muted-foreground hover:text-foreground transition uppercase tracking-widest text-sm">Order History</button>
          <button className="text-left py-2 text-muted-foreground hover:text-foreground transition uppercase tracking-widest text-sm">Addresses</button>
          <button className="text-left py-2 text-muted-foreground hover:text-foreground transition uppercase tracking-widest text-sm">Account Details</button>
          <button 
            onClick={() => dispatch(logout())}
            className="text-left py-2 text-red-900/70 hover:text-red-900 transition uppercase tracking-widest text-sm mt-8"
          >
            Sign Out
          </button>
        </div>

        <div className="md:col-span-2">
          <div className="border border-secondary p-8 mb-8">
            <h2 className="text-lg font-medium mb-6 uppercase tracking-widest text-sm">Profile Details</h2>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <span className="text-muted-foreground">Name</span>
              <span>{userInfo.firstName} {userInfo.lastName}</span>
              
              <span className="text-muted-foreground">Email</span>
              <span>{userInfo.email}</span>
              
              <span className="text-muted-foreground">Status</span>
              <span className="text-green-600">Verified Member</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
