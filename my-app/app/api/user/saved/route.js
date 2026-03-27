import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Auction from "@/models/Auction";

export async function GET(req) {
  try {
    const decoded = await verifyToken();
    if (!decoded) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findById(decoded.userId || decoded.id || decoded._id).populate("savedItems");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ savedItems: user.savedItems });
  } catch (error) {
    console.error("Error fetching saved items:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const decoded = await verifyToken();
    if (!decoded) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { auctionId } = await req.json();

    if (!auctionId) {
      return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(decoded.userId || decoded.id || decoded._id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const isSaved = user.savedItems.includes(auctionId);

    if (isSaved) {
      user.savedItems = user.savedItems.filter(id => id.toString() !== auctionId.toString());
    } else {
      user.savedItems.push(auctionId);
    }

    await user.save();

    return NextResponse.json({ success: true, isSaved: !isSaved, message: isSaved ? "Item removed from saved" : "Item saved successfully" });
  } catch (error) {
    console.error("Error saving item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
