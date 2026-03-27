import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import upload from "@/lib/multer";
// Convert multer middleware to work with Next.js
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export async function POST(req) {
  try {
    await connectDB();

    const user = await verifyToken();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Convert NextRequest to Node.js request for multer
    const { NextRequest } = await import("next/server");
    if (!(req instanceof NextRequest)) {
      // Create a mock response object for multer
      const mockRes = {};
      await runMiddleware(req, mockRes, upload.array("images", 5));
    }

    // Parse FormData
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const startingPrice = formData.get("startingPrice");
    const endTime = formData.get("endTime");
    const files = formData.getAll("images");

    if (!title || !startingPrice || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (isNaN(startingPrice) || startingPrice < 0) {
      return NextResponse.json(
        { error: "Invalid starting price" },
        { status: 400 }
      );
    }

    if (new Date(endTime) <= new Date()) {
      return NextResponse.json(
        { error: "End time must be in the future" },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    if (files.length > 5) {
      return NextResponse.json(
        { error: "Maximum 5 images allowed" },
        { status: 400 }
      );
    }

    // Upload files to Cloudinary
    const cloudinary = (await import("@/lib/cloudinary")).default;
    const imageUrls = [];

    for (const file of files) {
      try {
        const buffer = await file.arrayBuffer();
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "auctions",
              resource_type: "auto",
              format: "webp",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(Buffer.from(buffer));
        });
        imageUrls.push(result.secure_url);
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload image: " + error.message },
          { status: 500 }
        );
      }
    }

    const auction = await Auction.create({
      title,
      description,
      images: imageUrls,
      image: imageUrls[0], // First image as primary
      startingPrice: Number(startingPrice),
      currentBid: Number(startingPrice),
      seller: user.userId,
      endTime: new Date(endTime),
    });

    return NextResponse.json({ auction, success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create auction" },
      { status: 500 }
    );
  }
}