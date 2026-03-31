import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    const tokenUser = await verifyToken();  

    if (!tokenUser) {
      return NextResponse.json({ user: null });
    }

    await connectDB();
    const user = await User.findById(tokenUser.id).select("-password");

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}