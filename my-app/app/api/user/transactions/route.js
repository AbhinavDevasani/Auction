import connectDB from "@/lib/db";
import Transaction from "@/models/Transaction";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const user = await verifyToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await Transaction.find({ user: user.id })
      .sort({ createdAt: -1 }); // Natively sorts newest chronological logs top-down directly matching array layouts perfectly!

    return NextResponse.json({ transactions });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
