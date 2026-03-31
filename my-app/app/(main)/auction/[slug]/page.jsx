"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { Clock, Gavel, Coins, User, Bookmark } from "lucide-react";
export default function AuctionItemPage() {
  const { slug } = useParams();
  const [auction, setAuction] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [bid, setBid] = useState("");
  useEffect(() => {
    const fetchAuction = async () => {
      const res = await fetch(`/api/auctions/${slug}`);
      const data = await res.json();
      setAuction(data.auction);
      setIsSaved(data.isSaved || false);
    };

    if (slug) fetchAuction();
  }, [slug]);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/user/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auctionId: auction._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.isSaved);
      } else {
        alert(data.error || "Failed to modify saved item");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleBid = async () => {
    try {
      const res = await fetch("/api/auctions/bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auctionId: slug,
          amount: Number(bid),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }
      setAuction(data.auction);
      setBid("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };
  useEffect(() => {
    if (!auction?.endTime) return;

    const updateTime = () => {
      const now = Date.now();
      const end = new Date(auction.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [auction]);
  const currentBid = auction?.currentBid || auction?.startingPrice || 0;
  const highestBidder = auction?.highestBidder?.name || "No bids yet";
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
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{auction.title}</h2>
                <button
  onClick={handleSave}
  className={`p-2 rounded-full transition-all duration-200 cursor-pointer
    ${isSaved 
      ? "bg-orange-100 hover:bg-orange-200" 
      : "bg-gray-100 hover:bg-gray-200"
    }`}
>
                  <Bookmark
  className={`w-6 h-6 transition-all duration-200 ${
    isSaved
      ? "fill-orange-500 text-orange-500 scale-110"
      : "text-gray-400"
  }`}
/>
                </button>
              </div>

              <p className="text-gray-500">{auction.description}</p>

              <div className="flex items-center gap-3">
                <Gavel className="text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Current Bid</p>
                  <p className="text-2xl font-bold text-orange-500">
                    ₹{currentBid}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Highest Bidder</p>
                  <p className="text-lg font-semibold">{highestBidder}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Time Remaining</p>
                  <p className="font-semibold">{timeLeft}</p>
                </div>
              </div>

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
                    <span>₹{bidItem.amount}</span>
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
