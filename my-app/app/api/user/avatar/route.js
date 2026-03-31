import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const tokenUser = await verifyToken();
    if (!tokenUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar");

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Upload to Cloudinary
    const cloudinary = (await import("@/lib/cloudinary")).default;
    
    const buffer = await file.arrayBuffer();
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "avatars",
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

    const secureUrl = result.secure_url;
    const user = await User.findByIdAndUpdate(
      tokenUser.id,
      { avatar: secureUrl },
      { new: true }
    ).select("-password");

    return NextResponse.json({ user, success: true });
  } catch (error) {
    console.error("Avatar Upload Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update avatar" },
      { status: 500 }
    );
  }
}
