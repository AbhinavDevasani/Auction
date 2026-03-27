import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const user = await verifyToken();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { auctionId, amount } = await req.json();

    if (!auctionId || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const bidAmount = Number(amount);

    if (isNaN(bidAmount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
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

    const minBid = auction.currentBid || auction.startingPrice;

    if (bidAmount <= minBid) {
      return NextResponse.json(
        { error: "Bid must be higher than current bid" },
        { status: 400 }
      );
    }

    const updatedAuction = await Auction.findOneAndUpdate(
      {
        _id: auctionId,
        currentBid: { $lt: bidAmount },
      },
      {
        $set: {
          currentBid: bidAmount,
          highestBidder: user.userId,
        },
        $push: {
          bids: {
            user: user.userId,
            amount: bidAmount,
          },
        },
      },
      { new: true }
    )
      .populate("highestBidder", "name")
      .populate("bids.user", "name");

    if (!updatedAuction) {
      return NextResponse.json(
        { error: "Bid must be higher than current bid" },
        { status: 400 }
      );
    }

    return NextResponse.json({ auction: updatedAuction });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}