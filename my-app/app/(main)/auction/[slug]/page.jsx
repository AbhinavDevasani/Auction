import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import AuctionDetailClient from "@/components/AuctionDetailClient";
import "@/models/User"; // Ensure User model is loaded

export default async function AuctionItemPage({ params }) {
  const { slug } = await params;

  await connectDB();

  const auction = await Auction.findById(slug)
    .populate("highestBidder", "name")
    .populate("bids.user", "name")
    .lean();

  if (!auction) {
    return (
      <div className="bg-gray-100 min-h-screen px-8 py-12 flex items-center justify-center text-[#1F2937]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Auction Not Found</h1>
          <p className="text-gray-500">The auction you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const decoded = await verifyToken();
  let user = null;
  let isSaved = false;

  if (decoded) {
    user = await User.findById(decoded.userId || decoded.id || decoded._id).lean();
    if (user) {
      isSaved = user.savedItems?.some(
        (itemId) => itemId.toString() === auction._id.toString()
      ) || false;
    }
  }

  return (
    <AuctionDetailClient
      initialAuction={JSON.parse(JSON.stringify(auction))}
      initialUser={user ? JSON.parse(JSON.stringify(user)) : null}
      initialIsSaved={isSaved}
    />
  );
}
