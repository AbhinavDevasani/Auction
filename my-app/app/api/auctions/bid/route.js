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

    // Find the user's previously locked amount
    const lockedEntry = auction.lockedAmounts?.find(
      (entry) => entry.user.toString() === userId
    );
    const lockedAmount = lockedEntry ? lockedEntry.amount : 0;
    
    // Amount the user actually needs to pay is the difference
    const amountToPay = bidAmount - lockedAmount;

    if (dbUser.balance < amountToPay) {
      return NextResponse.json(
        { error: `Insufficient balance. You need ₹${amountToPay} more to place this bid.` },
        { status: 400 }
      );
    }

    // Debit the required amount from the current bidder's wallet
    if (amountToPay > 0) {
      await User.findByIdAndUpdate(userId, { $inc: { balance: -amountToPay } });

      await Transaction.create({
        user: userId,
        type: "Bid Placed",
        amount: -amountToPay,
        reference: auctionId,
      });
    }

    // Update the lockedAmounts array
    const updateDoc = {
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
    };

    if (lockedEntry) {
      const lockedIndex = auction.lockedAmounts.findIndex(
        (entry) => entry.user.toString() === userId
      );
      if (lockedIndex !== -1) {
        updateDoc.$set[`lockedAmounts.${lockedIndex}.amount`] = bidAmount;
      }
    } else {
      updateDoc.$push.lockedAmounts = { user: userId, amount: bidAmount };
    }

    // Update auction
    const updatedAuction = await Auction.findOneAndUpdate(
      {
        _id: auctionId,
        currentBid: { $lt: bidAmount },
      },
      updateDoc,
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