import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { NextResponse } from "next/server";
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } =await  params;
    const auction = await Auction.findById(id)
      .populate("highestBidder", "name")
      .populate("bids.user", "name");
    if (!auction) {
      return NextResponse.json(
        { error: "Auction not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ auction });

  } catch (error) {

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}