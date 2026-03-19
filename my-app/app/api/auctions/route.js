import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { NextResponse } from "next/server";
import "@/models/User";
export async function GET() {
  await connectDB();

  const auctions = await Auction.find()
    .sort({ createdAt: -1 })
    .populate("highestBidder", "name");

  return NextResponse.json({ auctions });
}