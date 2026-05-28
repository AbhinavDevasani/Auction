import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { verifyToken } from "@/lib/auth";
import MyListingsClient from "@/components/MyListingsClient";
import Link from "next/link";

export default async function MyListingsPage() {
  await connectDB();
  const decoded = await verifyToken();

  if (!decoded) {
    return (
      <div className="bg-gray-100 min-h-screen px-8 py-12 flex items-center justify-center text-[#1F2937]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
          <p className="text-gray-500">Please sign in to view your listings.</p>
          <Link href="/signin">
            <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 cursor-pointer">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const listings = await Auction.find({ seller: decoded.userId || decoded.id || decoded._id })
    .sort({ createdAt: -1 })
    .lean();

  const serializedListings = JSON.parse(JSON.stringify(listings));

  return (
    <div className="flex-1 bg-[#F9FAFB] min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]">
          My Listings
        </h1>
        <p className="text-sm text-gray-500">
          Manage and track your auctions
        </p>
      </div>

      <MyListingsClient initialListings={serializedListings} />
    </div>
  );
}