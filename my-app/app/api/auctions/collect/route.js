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

    if (auction.highestBidder?.toString() === userId) {
      return NextResponse.json(
        { error: "You are the highest bidder. You cannot collect credits now." },
        { status: 403 }
      );
    }

    const lockedEntry = auction.lockedAmounts?.find(
      (entry) => entry.user.toString() === userId
    );
    const refundAmount = lockedEntry ? lockedEntry.amount : 0;

    if (refundAmount <= 0) {
      return NextResponse.json(
        { error: "You have no credits to collect for this auction" },
        { status: 400 }
      );
    }

    // Refund the locked amount to the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { balance: refundAmount } },
      { new: true }
    );

    // Set the locked amount to 0 for this user
    await Auction.findOneAndUpdate(
      { _id: auctionId, "lockedAmounts.user": userId },
      { $set: { "lockedAmounts.$.amount": 0 } }
    );

    await Transaction.create({
      user: userId,
      type: "Outbid Refund Collected",
      amount: refundAmount,
      reference: auctionId,
    });

    return NextResponse.json({
      message: "Credits collected successfully",
      balance: updatedUser.balance,
      collected: true,
      refundAmount,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
