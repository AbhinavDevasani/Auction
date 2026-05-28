import connectDB from "@/lib/db";
import User from "@/models/User";
import Auction from "@/models/Auction";
import { verifyToken } from "@/lib/auth";
import ProfileClient from "@/components/ProfileClient";
import Link from "next/link";
import "@/models/User"; // Ensure User model is loaded
import "@/models/Auction"; // Ensure Auction model is loaded

export default async function ProfilePage() {
  await connectDB();
  const decoded = await verifyToken();

  if (!decoded) {
    return (
      <div className="bg-gray-100 min-h-screen px-8 py-12 flex items-center justify-center text-[#1F2937]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
          <p className="text-gray-500">Please sign in to view your profile.</p>
          <Link href="/signin">
            <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 cursor-pointer">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const user = await User.findById(decoded.userId || decoded.id || decoded._id).select("-password").lean();

  if (!user) {
    return (
      <div className="bg-gray-100 min-h-screen px-8 py-12 flex items-center justify-center text-[#1F2937]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-gray-500">User account not found.</p>
        </div>
      </div>
    );
  }

  // Fetch counts server-side
  const currentTime = new Date();
  
  const wonAuctionsCount = await Auction.countDocuments({
    highestBidder: user._id,
    $or: [
      { status: "ended" },
      { endTime: { $lte: currentTime } }
    ]
  });

  const activeBidsCount = await Auction.countDocuments({
    "bids.user": user._id,
  });

  const createdAuctionsCount = await Auction.countDocuments({
    seller: user._id,
  });

  const serializedUser = JSON.parse(JSON.stringify(user));
  const stats = {
    wonAuctions: wonAuctionsCount,
    activeBids: activeBidsCount,
    createdAuctions: createdAuctionsCount,
  };

  return (
    <ProfileClient
      initialUser={serializedUser}
      initialStats={stats}
    />
  );
}