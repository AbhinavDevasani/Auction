import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();

    const user = await verifyToken();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const currentTime = new Date();
    const auctions = await Auction.find({
      highestBidder: user.id,
      $or: [
        { status: "ended" },
        { endTime: { $lte: currentTime } }
      ]
    })
      .sort({ endTime: -1 })
      .populate("highestBidder", "name");

    return NextResponse.json({ auctions });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}