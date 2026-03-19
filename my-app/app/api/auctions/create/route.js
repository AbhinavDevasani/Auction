import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
export async function POST(req) {
  await connectDB();

  const user = verifyToken(req);

  const { title, description, image, startingPrice, endTime } =
    await req.json();

  const auction = await Auction.create({
    title,
    description,
    image,
    startingPrice,
    currentBid: startingPrice,
    seller: user.userId,
    endTime,
  });

  return NextResponse.json({ auction });
}