import { Mail, Lock, User } from "lucide-react"
import Link from "next/link"
export default function SignUpPage() {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-[#1F2937]">
      <div className="flex items-center gap-3 mb-6 justify-center">
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
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Create Account
      </h1>
      <p className="text-gray-500 mb-6">
        Sign up to start bidding and selling
      </p>

      {/* Form */}
      <form className="space-y-4">

        {/* Name */}
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Full name"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="email"
            placeholder="Email address"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        {/* Button */}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg transition-all"
        >
          Create Account
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="px-3 text-gray-400 text-sm">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google Button */}
      <button className="w-full border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition">
        Sign up with Google
      </button>

      {/* Sign In Link */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <Link href="/signin" className="text-orange-500 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}