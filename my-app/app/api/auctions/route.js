import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { NextResponse } from "next/server";
import "@/models/User";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 8;
  const status = searchParams.get("status") || "all";

  const skip = (page - 1) * limit;
  const queryObj = {};

  if (query && query.trim() !== "") {
    queryObj.title = { $regex: query, $options: "i" };
  }

  if (status && status !== "all") {
    if (status === "active") {
      queryObj.endTime = { $gt: new Date() };
      queryObj.status = "active";
    } else if (status === "ended") {
      queryObj.$or = [
        { endTime: { $lte: new Date() } },
        { status: "ended" }
      ];
    }
  }

  const auctions = await Auction.find(queryObj)
    .sort({ endTime: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("highestBidder", "name");

  const totalCount = await Auction.countDocuments(queryObj);
  const totalPages = Math.ceil(totalCount / limit);

  return NextResponse.json({ auctions, totalPages, currentPage: page });
}