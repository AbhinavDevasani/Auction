import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    await connectDB();

    const user = verifyToken(req);
    const { auctionId, amount } = await req.json();
    if (!auctionId || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }
    if (auction.status !== "active" || new Date() > auction.endTime) {
      return NextResponse.json({ error: "Auction ended" }, { status: 400 });
    }
    if (auction.seller.toString() === user.userId) {
      return NextResponse.json(
        { error: "You cannot bid on your own auction" },
        { status: 400 }
      );
    }
    if (amount <= auction.currentBid) {
      return NextResponse.json(
        { error: "Bid must be higher than current bid" },
        { status: 400 }
      );
    }
    auction.currentBid = amount;
    auction.highestBidder = user.userId;

    auction.bids.push({
      user: user.userId,
      amount,
    });

    await auction.save();

    const updatedAuction = await Auction.findById(auctionId)
      .populate("highestBidder", "name")
      .populate("bids.user", "name");

    return NextResponse.json({ auction: updatedAuction });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}