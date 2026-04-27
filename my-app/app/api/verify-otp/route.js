import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const existingOtp = await Otp.findOne({ email });

    if (!existingOtp) {
      return NextResponse.json({ error: "OTP has expired or was not requested." }, { status: 400 });
    }

    if (existingOtp.attempts >= 3) {
      await Otp.deleteOne({ email }); // Delete after max attempts
      return NextResponse.json({ error: "Maximum verification attempts reached. Please request a new OTP." }, { status: 400 });
    }

    if (existingOtp.otp !== otp) {
      existingOtp.attempts += 1;
      await existingOtp.save();
      return NextResponse.json({ error: "Invalid OTP code." }, { status: 400 });
    }

    // Success! Clean up the OTP
    await Otp.deleteOne({ email });

    await User.findOneAndUpdate({ email }, { isVerified: true });

    return NextResponse.json({ success: true, message: "Email verified successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
