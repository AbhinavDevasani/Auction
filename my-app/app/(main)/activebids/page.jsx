import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import Image from "next/image";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import Link from "next/link";
import "@/models/User"; // Ensure User model is loaded

export default async function ActiveBidsPage() {
  await connectDB();
  const decoded = await verifyToken();

  if (!decoded) {
    return (
      <div className="bg-gray-100 min-h-screen px-8 py-12 flex items-center justify-center text-[#1F2937]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
          <p className="text-gray-500">Please sign in to view your active bids.</p>
          <Link href="/signin">
            <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 cursor-pointer">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const user = await User.findById(decoded.userId || decoded.id || decoded._id).lean();

  const auctions = await Auction.find({
    "bids.user": user?._id,
  })
    .populate("bids.user", "name _id")
    .populate("highestBidder", "name _id")
    .lean();

  const serializedAuctions = JSON.parse(JSON.stringify(auctions));
  const serializedUser = user ? JSON.parse(JSON.stringify(user)) : null;

  const getTimeLeft = (endTime) => {
    const diff = new Date(endTime) - new Date();

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">Active Bids</h1>

        <p className="text-gray-500 mb-8">
          Auctions where you have placed a bid
        </p>

        {/* Grid */}
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {serializedAuctions.map((auction, index) => {
            const userId = serializedUser?._id;
            const yourBid = auction.bids
              ?.filter((b) => (b.user?._id || b.user || "").toString() === userId)
              ?.sort((a, b) => b.amount - a.amount)[0]?.amount;

            const isWinning =
              (auction.highestBidder?._id || auction.highestBidder || "").toString() === userId;
            const isEnded = auction.status === "ended" || new Date(auction.endTime) <= new Date();

            return (
              <StaggerItem key={index}>
                <div
                  className="bg-white rounded-xl shadow p-4 
                  transition-all duration-300 
                  hover:-translate-y-1 hover:shadow-xl"
                >
                  <Image
                    src={auction.image}
                    width={400}
                    height={250}
                    alt={auction.title}
                    className="rounded-lg object-cover h-44 w-full"
                  />

                  <h3 className="mt-3 font-semibold">
                    {auction.title}
                  </h3>

                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>
                      Current Bid:
                      <span className="font-bold ml-2">
                        ₹{auction.currentBid}
                      </span>
                    </p>

                    <p>
                      Your Bid:
                      <span className="font-bold ml-2 text-orange-500">
                        {yourBid ? `₹${yourBid}` : "—"}
                      </span>
                    </p>

                    <p>
                      Time Remaining:
                      <span className="ml-2">
                        {getTimeLeft(auction.endTime)}
                      </span>
                    </p>

                    {/* 🔥 Winning status */}
                    <p
                      className={`font-semibold ${
                        isWinning
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {isEnded ? (isWinning ? "Won" : "Lost") : (isWinning ? "Winning" : "Outbid")}
                    </p>
                  </div>

                  <Link href={`/auction/${auction._id}`}>
                    <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 cursor-pointer">
                      View Auction
                    </button>
                  </Link>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        {/* Empty state */}
        {serializedAuctions.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            You have not placed any bids yet.
          </p>
        )}
      </div>
    </div>
  );
}