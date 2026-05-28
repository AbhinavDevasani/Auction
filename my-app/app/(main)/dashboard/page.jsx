import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { Search, Gavel } from "lucide-react";
import Image from "next/image";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import LineGraph from "@/components/LineGraph";
import Link from "next/link";
import DashboardHeaderClient from "@/components/DashboardHeaderClient";
import "@/models/User"; // Ensure User model is loaded

export default async function DashboardPage() {
  await connectDB();

  const decoded = await verifyToken();
  if (!decoded) {
    return (
      <div className="bg-gray-100 min-h-screen px-8 py-12 flex items-center justify-center text-[#1F2937]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
          <p className="text-gray-500">Please sign in to view your dashboard.</p>
          <Link href="/signin">
            <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 cursor-pointer">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // 1. Fetch user profile
  const user = await User.findById(decoded.userId || decoded.id || decoded._id).select("-password").lean();

  // 2. Fetch active auctions (first one will be the featured one)
  const auctions = await Auction.find({})
    .sort({ endTime: -1, createdAt: -1 })
    .lean();

  // 3. Fetch top bidders
  const topBidders = await Auction.aggregate([
    { $unwind: "$bids" },
    {
      $group: {
        _id: "$bids.user",
        totalAmount: { $sum: "$bids.amount" },
      },
    },
    { $sort: { totalAmount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        name: "$user.name",
        totalAmount: 1,
      },
    },
  ]);

  // 4. Fetch completed/won auctions
  const currentTime = new Date();
  const completedAuctions = await Auction.find({
    highestBidder: user?._id,
    $or: [
      { status: "ended" },
      { endTime: { $lte: currentTime } }
    ]
  })
    .sort({ endTime: -1 })
    .populate("highestBidder", "name")
    .lean();

  const featuredAuction = auctions.length > 0 ? auctions[0] : null;

  // Serialize Mongoose outputs
  const serializedUser = user ? JSON.parse(JSON.stringify(user)) : null;
  const serializedAuctions = JSON.parse(JSON.stringify(auctions));
  const serializedTopBidders = JSON.parse(JSON.stringify(topBidders));
  const serializedCompletedAuctions = JSON.parse(JSON.stringify(completedAuctions));
  const serializedFeaturedAuction = featuredAuction ? JSON.parse(JSON.stringify(featuredAuction)) : null;

  return (
    <div className="flex-1 bg-gray-100 min-h-screen p-8 text-[#1F2937]">
      <StaggerGrid className="space-y-10">

        {/* TOP BAR */}
        <StaggerItem>
          <DashboardHeaderClient initialUser={serializedUser} />
        </StaggerItem>

        {/* MAIN GRID */}
        <StaggerItem>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* FEATURED AUCTION */}
            <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow p-4">
              {serializedFeaturedAuction ? (
                <>
                  <Image
                    src={serializedFeaturedAuction.image}
                    width={800}
                    height={350}
                    alt={serializedFeaturedAuction.title}
                    className="rounded-xl h-56 w-full object-cover mb-4"
                  />

                  <h2 className="text-lg font-semibold">
                    {serializedFeaturedAuction.title}
                  </h2>

                  <p className="text-gray-500 text-sm mb-4">
                    Seller: {serializedFeaturedAuction.seller}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-gray-500 text-sm">Current Bid</p>
                      <p className="font-bold text-lg">
                        ₹{serializedFeaturedAuction.currentBid || serializedFeaturedAuction.startingPrice}
                      </p>
                    </div>

                    <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-[#1F2937]">
                      Ends:{" "}
                      {new Date(
                        serializedFeaturedAuction.endTime
                      ).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/auction/${serializedFeaturedAuction._id}`}>
                      <button className="border px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                        View Auction
                      </button>
                    </Link>

                    <Link href={`/auction/${serializedFeaturedAuction._id}`}>
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 cursor-pointer">
                        <Gavel size={16} />
                        Place Bid
                      </button>
                    </Link>
                  </div>
                </>
              ) : (
                <p>No auctions found</p>
              )}
            </div>

            {/* TOP BIDDERS */}
            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="font-semibold mb-4 text-[#1F2937]">Top Bidders</h3>

              {serializedTopBidders.map((bidder, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-3 p-1 hover:bg-gray-100 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(bidder.name)}`}
                      width={32}
                      height={32}
                      alt={bidder.name}
                      className="rounded-full object-cover"
                    />

                    <span className="text-sm">{bidder.name}</span>
                  </div>

                  <span className="text-xs text-gray-500">
                    ₹{bidder.totalAmount}
                  </span>
                </div>
              ))}
            </div>

            {/* AUCTION STATS */}
            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="font-semibold mb-4 text-[#1F2937]">Auction Stats</h3>

              <div className="h-32 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-lg mb-4">
                <LineGraph />
              </div>

              <div className="space-y-2 text-sm text-[#1F2937]">
                <div className="flex justify-between">
                  <span>Auctions Won</span>
                  <span>{serializedCompletedAuctions.length}</span>
                </div>

                <div className="flex justify-between">
                  <span>Active Bids</span>
                  <span>
                    {serializedAuctions.filter(item => 
                      item.bids?.some(b => (b.user?._id || b.user || "").toString() === serializedUser?._id)
                    ).length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Total Spent</span>
                  <span>₹{serializedCompletedAuctions.reduce((sum, item) => sum + (item.currentBid || 0), 0)}</span>
                </div>
              </div>
            </div>

          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="text-black">
            <h2 className="text-xl font-semibold mb-6">
              Your Completed Auctions
            </h2>

            {serializedCompletedAuctions.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                <p className="text-lg font-medium text-gray-700">No completed auctions</p>
                <p className="text-sm">You haven't won any auctions yet.</p>
              </div>
            ) : (
              <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {serializedCompletedAuctions.map((auction) => (
                  <StaggerItem
                    key={auction._id}
                    className="bg-white rounded-xl shadow p-3
            transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Image
                      src={auction.image}
                      width={400}
                      height={200}
                      alt={auction.title}
                      className="rounded-lg h-32 w-full object-cover mb-3"
                    />

                    <p className="text-sm text-gray-500">
                      {auction.title}
                    </p>

                    <p className="font-semibold text-sm">
                      Final Bid: ₹{auction.currentBid}
                    </p>

                    <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                      <span>{auction.bids?.length || 0} bids</span>

                      <span>
                        Winner: {auction.highestBidder?.name || "N/A"}
                      </span>
                    </div>
                    <Link href={`/auction/${auction._id}`}>
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 mt-3 w-full justify-center cursor-pointer">
                        View Auction
                      </button>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            )}
          </div>
        </StaggerItem>
      </StaggerGrid>
    </div>
  );
}