import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import { sendOTPEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check rate limit (30 seconds)
    const existingOtp = await Otp.findOne({ email });
    if (existingOtp) {
      const timeElapsed = Date.now() - existingOtp.createdAt.getTime();
      if (timeElapsed < 30 * 1000) {
        return NextResponse.json(
          { error: `Please wait ${Math.ceil((30 * 1000 - timeElapsed) / 1000)}s before requesting a new OTP.` },
          { status: 429 }
        );
      }
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store/Update OTP in DB
    await Otp.findOneAndUpdate(
      { email },
      { otp: otpCode, attempts: 0, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Send email
    const emailResult = await sendOTPEmail(email, otpCode);

    if (!emailResult.success) {
      return NextResponse.json({ error: emailResult.error || "Failed to send email. Check your SMTP credentials." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
