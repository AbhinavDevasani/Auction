"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { Clock, Gavel, Trophy, Coins, User } from "lucide-react";

export default function AuctionItemPage() {
  const { slug } = useParams();

  const [bid, setBid] = useState("");
  const [currentBid, setCurrentBid] = useState(120);
  const [highestBidder, setHighestBidder] = useState("User123");
  const [yourBid, setYourBid] = useState(115);
  const handleBid = () => {
    if (Number(bid) > currentBid) {
      setCurrentBid(Number(bid));
      setHighestBidder("You");
      setYourBid(Number(bid));
      setBid("");
    } else {
      alert("Bid must be higher than current bid");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <StaggerItem>
          <h1 className="text-3xl font-bold mb-2">Auction Item</h1>

          <p className="text-gray-500 mb-8">Viewing auction: {slug}</p>
        </StaggerItem>

        <StaggerGrid className="grid md:grid-cols-2 gap-8">
          {/* ITEM IMAGE */}
          <StaggerItem>
            <div className="bg-white rounded-xl shadow p-6">
              <Image
                src="https://res.cloudinary.com/dudjdf428/image/upload/v1773499373/piyush-haswani-gAVIw1zs1fU-unsplash_thqw5v.jpg"
                width={600}
                height={400}
                alt="Auction item"
                className="rounded-lg object-cover"
              />
            </div>
          </StaggerItem>

          {/* AUCTION DETAILS */}
          <StaggerItem>
            <div className="bg-white rounded-xl shadow p-8 space-y-6">
              <h2 className="text-2xl font-semibold">
                Nike Air Jordan 1 Retro
              </h2>

              <p className="text-gray-500">
                Classic Nike Air Jordan sneakers with premium leather and iconic
                design. Highly sought after by collectors.
              </p>

              {/* CURRENT BID */}
              <div className="flex items-center gap-3">
                <Gavel className="text-orange-500" />

                <div>
                  <p className="text-sm text-gray-500">Current Bid</p>

                  <p className="text-2xl font-bold text-orange-500">
                    ${currentBid}
                  </p>
                </div>
              </div>
              {/* HIGHEST BIDDER */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <User className="text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Highest Bidder</p>

                    <p className="text-2xl font-bold">{highestBidder}</p>
                  </div>
                </div>
              </div>
              {/* YOUR BID */}
              <div className="flex items-center gap-4 mt-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">
                    Y
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Your Bid</p>

                  <p className="font-semibold text-orange-500">${yourBid}</p>
                </div>
              </div>
              {/* TIME LEFT */}
              <div className="flex items-center gap-3">
                <Clock className="text-orange-500" />

                <div>
                  <p className="text-sm text-gray-500">Time Remaining</p>

                  <p className="font-semibold">2h 15m</p>
                </div>
              </div>

              {/* BID INPUT */}
              <div>
                <label className="text-sm text-gray-500">Enter Your Bid</label>

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

              {/* BUY NOW */}
              <button className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700">
                <Trophy size={18} />
                Buy Now — $300
              </button>

              {/* COLLECT CREDITS */}
              <button className="w-full border border-orange-500 text-orange-500 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-50">
                <Coins size={18} />
                Collect Auction Credits
              </button>
            </div>
          </StaggerItem>
        </StaggerGrid>

        {/* BID HISTORY */}
        <StaggerItem>
          <div className="bg-white rounded-xl shadow p-8 mt-10">
            <h2 className="text-xl font-semibold mb-6">Bid History</h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between border-b pb-2">
                <span>User123</span>
                <span>$120</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span>BidMaster</span>
                <span>$110</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span>Abhinav</span>
                <span>$100</span>
              </div>
            </div>
          </div>
        </StaggerItem>
      </div>
    </div>
  );
}
