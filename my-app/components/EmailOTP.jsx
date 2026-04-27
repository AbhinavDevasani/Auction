"use client";

import { useState, useEffect } from "react";
import { Mail, ShieldCheck, Loader2, ArrowRight } from "lucide-react";

export default function EmailOTP({ initialEmail = "", onVerified }) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(initialEmail ? 1 : 1); // 1: Email, 2: OTP, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Handle cooldown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Automatically send OTP if initialEmail is provided on mount
  useEffect(() => {
    if (initialEmail && step === 1) {
      handleSendOTP();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendOTP = async (e) => {
    e?.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setSuccess("OTP sent successfully! Please check your inbox.");
      setStep(2);
      setCooldown(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      setSuccess("Email verified successfully!");
      setStep(3);
      if (onVerified) onVerified(email);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          {step === 3 ? <ShieldCheck size={32} /> : <Mail size={32} />}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {step === 1 && "Verify your Email"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Verified!"}
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          {step === 1 && "We'll send a one-time password to your email."}
          {step === 2 && `We've sent a 6-digit code to ${email}`}
          {step === 3 && "Your email has been successfully verified."}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
          {error}
        </div>
      )}
      
      {success && step !== 3 && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100 text-center">
          {success}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition disabled:opacity-70 font-semibold"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit OTP</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // Only allow numbers
              placeholder="000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-center text-xl tracking-[0.5em] font-mono"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition disabled:opacity-70 font-semibold"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify OTP"}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={cooldown > 0 || loading}
              className="text-sm text-orange-500 font-medium hover:text-orange-600 disabled:text-gray-400 transition"
            >
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              if (onVerified) onVerified(email);
              else window.location.href = '/dashboard';
            }}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition font-semibold"
          >
            {onVerified ? "Done" : "Go to Dashboard"} <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
