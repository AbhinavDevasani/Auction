import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { NextResponse } from "next/server";
export async function GET(req, { params }) {
  await connectDB();

  const auction = await Auction.findById(params.id)
    .populate("highestBidder", "name")
    .populate("bids.user", "name");

  return NextResponse.json({ auction });
}