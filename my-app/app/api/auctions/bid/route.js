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

    const { auctionId, amount } = await req.json();

    if (!auctionId || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const bidAmount = Number(amount);

    if (isNaN(bidAmount) || bidAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const dbUser = await User.findById(userId);
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (dbUser.balance < bidAmount) {
      return NextResponse.json(
        { error: "Insufficient balance. Please add funds to your wallet." },
        { status: 400 }
      );
    }

    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    if (auction.status !== "active" || new Date() > auction.endTime) {
      return NextResponse.json({ error: "Auction ended" }, { status: 400 });
    }

    if (auction.seller.toString() === userId) {
      return NextResponse.json(
        { error: "You cannot bid on your own auction" },
        { status: 400 }
      );
    }

    const minBid = auction.currentBid || auction.startingPrice;

    if (bidAmount <= minBid) {
      return NextResponse.json(
        { error: "Bid must be higher than current bid" },
        { status: 400 }
      );
    }

    // --- Previous highest bidder to refund ---
    const prevHighestBidder = auction.highestBidder
      ? auction.highestBidder.toString()
      : null;
    const prevBidAmount = auction.currentBid || 0;

    // Debit the bid amount from the current bidder's wallet
    await User.findByIdAndUpdate(userId, { $inc: { balance: -bidAmount } });

    await Transaction.create({
      user: userId,
      type: "Bid Placed",
      amount: -bidAmount,
      reference: auctionId,
    });

    // If there was a previous highest bidder (and it's a different user), refund them
    if (prevHighestBidder && prevHighestBidder !== userId && prevBidAmount > 0) {
      await User.findByIdAndUpdate(prevHighestBidder, {
        $inc: { balance: prevBidAmount },
      });

      await Transaction.create({
        user: prevHighestBidder,
        type: "Outbid Refund",
        amount: prevBidAmount,
        reference: auctionId,
      });
    }

    // If the same user is raising their own bid, refund their previous bid first
    if (prevHighestBidder && prevHighestBidder === userId && prevBidAmount > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { balance: prevBidAmount },
      });

      await Transaction.create({
        user: userId,
        type: "Previous Bid Refund",
        amount: prevBidAmount,
        reference: auctionId,
      });
    }

    // Update auction
    const updatedAuction = await Auction.findOneAndUpdate(
      {
        _id: auctionId,
        currentBid: { $lt: bidAmount },
      },
      {
        $set: {
          currentBid: bidAmount,
          highestBidder: userId,
        },
        $push: {
          bids: {
            user: userId,
            amount: bidAmount,
          },
        },
      },
      { new: true }
    )
      .populate("highestBidder", "name")
      .populate("bids.user", "name");

    if (!updatedAuction) {
      // Race condition: someone else placed a higher bid at the same time — refund this user
      await User.findByIdAndUpdate(userId, { $inc: { balance: bidAmount } });
      return NextResponse.json(
        { error: "Bid must be higher than current bid" },
        { status: 400 }
      );
    }

    // Return updated balance too
    const updatedUser = await User.findById(userId).select("balance");

    return NextResponse.json({
      auction: updatedAuction,
      balance: updatedUser.balance,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}