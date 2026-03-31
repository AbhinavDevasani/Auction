"use client";
import { Search, Gavel } from "lucide-react";
import Image from "next/image";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import LineGraph from "@/components/LineGraph";
import SearchInput from "@/components/SearchInput";
import Link from "next/link";
import NotificationsPanel from "@/components/NotificationsPanel";
import { useEffect, useState } from "react";

export default function DashboardContent() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topBidders, setTopBidders] = useState([]);
  const [completedAuctions, setCompletedAuctions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await fetch("/api/auctions");
        const data = await res.json();
        setAuctions(data.auctions);
      } catch (err) {
        console.error("Error fetching auctions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);
  useEffect(() => {
    const fetchTopBidders = async () => {
      const res = await fetch("/api/topbidders");
      const data = await res.json();
      setTopBidders(data.topBidders);
    };

    fetchTopBidders();
  }, []);
  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await fetch("/api/user/wonauctions");
        const data = await res.json();
        setCompletedAuctions(data.auctions || []);
      } catch (err) {
        console.error("Error fetching completed", err);
        setCompletedAuctions([]);
      }
    };

    fetchCompleted();
  }, []);
  const featuredAuction = auctions.length > 0 ? auctions[0] : null;
  console.log(completedAuctions)
  return (
    <div className="flex-1 bg-gray-100 min-h-screen p-8 text-[#1F2937]">
      <StaggerGrid className="space-y-10">

        {/* TOP BAR */}
        <StaggerItem>
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-white rounded-xl shadow px-4 py-2 w-[420px]">
              <Search className="text-gray-400 mr-2" size={18} />
              <SearchInput />
            </div>

            <div className="flex items-center gap-4">
              <NotificationsPanel />

              <Link href={"/wallet"}>
                <div className="bg-white px-4 py-2 rounded-xl shadow text-sm font-medium">
                  Wallet: ₹{user?.balance}
                </div>
              </Link>

              <Link href={"/profile"}>
                <img
                  src={user?.avatar || user?.image || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || "User Profile")}`}
                  width={36}
                  height={36}
                  alt="User"
                  className="rounded-full cursor-pointer object-cover"
                  referrerPolicy="no-referrer"
                />
              </Link>
            </div>
          </div>
        </StaggerItem>

        {/* MAIN GRID */}
        <StaggerItem>
          <div className="grid grid-cols-4 gap-6 ">

            {/* FEATURED AUCTION */}
            <div className="col-span-2 bg-white rounded-2xl shadow p-4">

              {loading ? (
                <div className="animate-pulse">
                  <div className="h-56 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 w-1/3"></div>
                </div>
              ) : featuredAuction ? (
                <>
                  <Image
                    src={featuredAuction.image}
                    width={800}
                    height={350}
                    alt={featuredAuction.title}
                    className="rounded-xl h-56 w-full object-cover mb-4"
                  />

                  <h2 className="text-lg font-semibold">
                    {featuredAuction.title}
                  </h2>

                  <p className="text-gray-500 text-sm mb-4">
                    Seller: {featuredAuction.seller}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-gray-500 text-sm">Current Bid</p>
                      <p className="font-bold text-lg">
                        ₹{featuredAuction.currentBid}
                      </p>
                    </div>

                    <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                      Ends:{" "}
                      {new Date(
                        featuredAuction.endTime
                      ).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
                      View Auction
                    </button>

                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2">
                      <Gavel size={16} />
                      Place Bid
                    </button>
                  </div>
                </>
              ) : (
                <p>No auctions found</p>
              )}
            </div>

            {/* TOP BIDDERS */}
            <div className="bg-white rounded-2xl shadow p-4">
              <h3 className="font-semibold mb-4">Top Bidders</h3>

              {topBidders.map((bidder, index) => (
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
              <h3 className="font-semibold mb-4">Auction Stats</h3>

              <div className="h-32 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-lg mb-4">
                <LineGraph />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Auctions Won</span>
                  <span>18</span>
                </div>

                <div className="flex justify-between">
                  <span>Active Bids</span>
                  <span>7</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Spent</span>
                  <span>₹3,420</span>
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

            <StaggerGrid className="grid grid-cols-4 gap-6">
              {completedAuctions?.map((auction) => (
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
                    <span>{auction.bids.length} bids</span>

                    <span>
                      Winner: {auction.highestBidder?.name || "N/A"}
                    </span>
                  </div>
                  <Link href={`/auction/${auction._id}`}>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2">
                      View Auction
                    </button>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </StaggerItem>
      </StaggerGrid>
    </div>
  );
}