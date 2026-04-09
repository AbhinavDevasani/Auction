import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const tokenUser = await verifyToken();
    if (!tokenUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = tokenUser.userId || tokenUser.id;

    const { auctionId } = await req.json();
    if (!auctionId) {
      return NextResponse.json({ error: "Missing auctionId" }, { status: 400 });
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    if (auction.highestBidder?.toString() !== userId) {
      return NextResponse.json(
        { error: "You are not the winner of this auction" },
        { status: 403 }
      );
    }

    const isEnded =
      auction.status === "ended" || new Date() > new Date(auction.endTime);
    if (!isEnded) {
      return NextResponse.json(
        { error: "Auction has not ended yet" },
        { status: 400 }
      );
    }

    if (auction.collected) {
      return NextResponse.json(
        { error: "Credits have already been collected" },
        { status: 400 }
      );
    }
    const refundAmount = auction.currentBid;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { balance: refundAmount } },
      { new: true }
    );

    await Auction.findByIdAndUpdate(auctionId, { collected: true });

    await Transaction.create({
      user: userId,
      type: "Auction Win - Credit Collected",
      amount: refundAmount,
      reference: auctionId,
    });

    return NextResponse.json({
      message: "Credits collected successfully",
      balance: updatedUser.balance,
      collected: true,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
