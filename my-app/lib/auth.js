import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyToken() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) return null;

    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}