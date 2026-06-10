"use client";
import { useEffect, useState, use } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export default function VerifyPage({ params }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  
  const [status, setStatus] = useState("Verifying your email...");
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
        setStatus(data.message);
        
        // Log the user in automatically
        dispatch(setCredentials(data));

        // Redirect to profile or home after 3 seconds
        setTimeout(() => {
          router.push("/profile");
        }, 3000);
      } catch (err) {
        setStatus(err.response?.data?.message || "Invalid or expired verification link.");
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, dispatch, router]);

  return (
    <div className="max-w-md mx-auto px-6 py-48 text-center min-h-[70vh]">
      <h1 className="text-2xl font-light tracking-widest mb-6 uppercase">Email Verification</h1>
      <p className="text-muted-foreground">{status}</p>
    </div>
  );
}
