import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest,NextResponse } from "next/server";
export async function POST(req) {
    try{
        await connectDB()
        const {name, email, password}=await req.json()
        const existingUser = await User.findOne({ email });
        if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
     const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
     return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
    }
    catch(err){
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}