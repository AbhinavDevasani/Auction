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

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    let decoded = await verifyToken();
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, startingPrice, endTime } = await req.json();

    const auction = await Auction.findById(id);

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    if (auction.seller.toString() !== (decoded.userId || decoded.id || decoded._id).toString()) {
      return NextResponse.json({ error: "Forbidden: Not your auction" }, { status: 403 });
    }

    if (auction.bids && auction.bids.length > 0) {
      return NextResponse.json({ error: "Cannot edit an auction that has already received bids" }, { status: 400 });
    }

    auction.title = title || auction.title;
    auction.description = description || auction.description;
    if (startingPrice) {
      auction.startingPrice = startingPrice;
      auction.currentBid = startingPrice;
    }
    if (endTime) {
      auction.endTime = new Date(endTime);
    }

    await auction.save();

    return NextResponse.json({ success: true, auction });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    let decoded = await verifyToken();
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auction = await Auction.findById(id);

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    if (auction.seller.toString() !== (decoded.userId || decoded.id || decoded._id).toString()) {
      return NextResponse.json({ error: "Forbidden: Not your auction" }, { status: 403 });
    }

    if (auction.bids && auction.bids.length > 0) {
      return NextResponse.json({ error: "Cannot delete an auction that has already received bids" }, { status: 400 });
    }

    await Auction.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Auction deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}