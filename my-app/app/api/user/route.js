import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const user = verifyToken(req);

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user });
}