import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
export async function GET(req) {
  try {
    await connectDB();

    const user = verifyToken(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const auctions = await Auction.find({
      "bids.user": user.userId,
    })
      .populate("bids.user", "name _id")
      .populate("highestBidder", "name _id");

    return NextResponse.json({ auctions });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}