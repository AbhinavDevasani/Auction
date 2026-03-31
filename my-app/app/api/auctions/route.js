import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { NextResponse } from "next/server";
import "@/models/User";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  let auctions;

  if (query && query.trim() !== "") {
    auctions = await Auction.find({
      title: { $regex: query, $options: "i" },
    });
  } else {
    auctions = await Auction.find();
  }

  auctions = await Auction.find()
    .sort({ createdAt: -1 })
    .populate("highestBidder", "name");

  return NextResponse.json({ auctions });
}