import crypto from "crypto";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const sessionUser = await verifyToken();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = await req.json();

    // Secure webhook HMAC checking dynamically confirming Razorpay identity over network injection! 
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Connect to native DB
    await connectDB();

    // Authenticate and Atomic Operation specifically preventing concurrency/race locks via exact math native.
    const user = await User.findByIdAndUpdate(
      sessionUser.id,
      { $inc: { balance: amount } }, 
      { new: true }
    ).select("-password");

    // Persist History Logs securely tracking Payment intent payloads mapped across exact timelines implicitly!
    await Transaction.create({
      user: sessionUser.id,
      type: "Deposit via Razorpay",
      amount: amount,
      reference: razorpay_order_id,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Payment verified successfully", 
      balance: user.balance 
    });
    
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: "Transaction Verification Failed. Contact Support." }, { status: 500 });
  }
}
