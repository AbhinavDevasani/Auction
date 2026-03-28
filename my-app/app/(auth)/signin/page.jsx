"use client"

import { Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const router = useRouter();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert(res.error);
      return;
    }
    
    alert("Login successful");
    window.location.href = "/dashboard";
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-[#1F2937]">
      
      {/* Title */}
      <div className="flex items-center gap-3 mb-6 ">
          <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-gavel-icon lucide-gavel"
            >
              <path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381" />
              <path d="m16 16 6-6" />
              <path d="m21.5 10.5-8-8" />
              <path d="m8 8 6-6" />
              <path d="m8.5 7.5 8 8" />
            </svg>
          </div>
          <p className="text-[25px] font-semibold text-black">BidHub</p>
        </div>
      <p className="text-gray-500 mb-6">
        Sign in to continue to your dashboard
      </p>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Options */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" />
            Remember me
          </label>

          <Link href="#" className="text-orange-500 hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg transition-all"
        >
          Sign In
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="px-3 text-gray-400 text-sm">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google Button */}
      <button 
        type="button" 
        onClick={() => signIn("google", { callbackUrl: "/auction" })}
        className="w-full border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition"
      >
        Continue with Google
      </button>

      {/* Signup Link */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-orange-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}