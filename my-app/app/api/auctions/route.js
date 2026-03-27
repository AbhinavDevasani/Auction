import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { NextResponse } from "next/server";
import "@/models/User";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const query = searchParams.get("q") || "";
  const auctions = await Auction.find({
    title: { $regex: query, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .populate("highestBidder", "name");

  return NextResponse.json({ auctions });
}