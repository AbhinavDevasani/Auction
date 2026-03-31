import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const topBidders = await Auction.aggregate([
    { $unwind: "$bids" },

    {
      $group: {
        _id: "$bids.user",
        totalAmount: { $sum: "$bids.amount" },
      },
    },

    { $sort: { totalAmount: -1 } },
    { $limit: 5 },

    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },

    { $unwind: "$user" },

    {
      $project: {
        _id: 0,
        name: "$user.name",
        totalAmount: 1,
      },
    },
  ]);

  return NextResponse.json({ topBidders });
}