"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { Clock, Gavel, Coins, User } from "lucide-react";

export default function AuctionItemPage() {
  const { slug } = useParams(); 
  const [auction, setAuction] = useState(null);
  const [bid, setBid] = useState("");
  const [currentBid, setCurrentBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState("");
useEffect(() => {
  const fetchAuction = async () => {
    const res = await fetch(`/api/auctions/${slug}`);
    const data = await res.json();

    setAuction(data.auction);
  };

  if (slug) fetchAuction();
}, [slug]);

  const handleBid = () => {
    if (Number(bid) > currentBid) {
      setCurrentBid(Number(bid));
      setHighestBidder("You");
      setBid("");
    } else {
      alert("Bid must be higher than current bid");
    }
  };

  if (!auction) return <p className="p-10">Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">
      <div className="max-w-7xl mx-auto">
        <StaggerItem>
          <h1 className="text-3xl font-bold mb-2">Auction Item</h1>
          <p className="text-gray-500 mb-8">Viewing auction: {auction.title}</p>
        </StaggerItem>

        <StaggerGrid className="grid md:grid-cols-2 gap-8">

          <StaggerItem>
            <div className="bg-white rounded-xl shadow p-6">
              <Image
                src={auction.image}
                width={600}
                height={400}
                alt="Auction item"
                className="rounded-lg object-cover"
              />
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white rounded-xl shadow p-8 space-y-6">
              <h2 className="text-2xl font-semibold">
                {auction.title}
              </h2>

              <p className="text-gray-500">
                {auction.description}
              </p>

              <div className="flex items-center gap-3">
                <Gavel className="text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Current Bid</p>
                  <p className="text-2xl font-bold text-orange-500">
                    ${currentBid}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Highest Bidder</p>
                  <p className="text-lg font-semibold">
                    {highestBidder}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Time Remaining</p>
                  <p className="font-semibold">2h 15m</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Enter Your Bid
                </label>

                <div className="flex gap-3 mt-2">
                  <input
                    type="number"
                    value={bid}
                    onChange={(e) => setBid(e.target.value)}
                    placeholder="Enter amount"
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />

                  <button
                    onClick={handleBid}
                    className="bg-orange-500 text-white px-6 rounded-lg hover:bg-orange-600 transition"
                  >
                    Place Bid
                  </button>
                </div>
              </div>

              <button className="w-full border border-orange-500 text-orange-500 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-50">
                <Coins size={18} />
                Collect Auction Credits
              </button>
            </div>
          </StaggerItem>
        </StaggerGrid>

        <StaggerItem>
          <div className="bg-white rounded-xl shadow p-8 mt-10">
            <h2 className="text-xl font-semibold mb-6">Bid History</h2>

            <div className="space-y-3 text-sm text-gray-600">
              {auction.bids?.length > 0 ? (
                auction.bids.map((bidItem, index) => (
                  <div
                    key={index}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>{bidItem.user?.name}</span>
                    <span>${bidItem.amount}</span>
                  </div>
                ))
              ) : (
                <p>No bids yet</p>
              )}
            </div>
          </div>
        </StaggerItem>
      </div>
    </div>
  );
}