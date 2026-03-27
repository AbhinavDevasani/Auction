import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } =await params; 

    const auction = await Auction.findById(id)
      .populate("highestBidder", "name")
      .populate("bids.user", "name");

    if (!auction) {
      return NextResponse.json(
        { error: "Auction not found" },
        { status: 404 }
      );
    }

    let decoded = await verifyToken();

    let isSaved = false;

    if (decoded) {
      const user = await User.findById(decoded.userId || decoded.id || decoded._id);

      if (user) {
        isSaved = user.savedItems.some(
          (itemId) => itemId.toString() === auction._id.toString()
        );
      }
    }

    return NextResponse.json({
      auction,
      isSaved,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}