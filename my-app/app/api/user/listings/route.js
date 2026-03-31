import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const decoded = await verifyToken();

    if (!decoded) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    console.log(decoded)
    const listings = await Auction.find({ seller: decoded.userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({ listings });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}