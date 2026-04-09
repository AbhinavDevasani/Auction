"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { io } from "socket.io-client";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { Clock, Gavel, Coins, User as UserIcon, Bookmark, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AuctionItemPage() {
  const { slug } = useParams();
  const [auction, setAuction] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [bid, setBid] = useState("");
  const [user, setUser] = useState(null);
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);
  const [collectLoading, setCollectLoading] = useState(false);
  const [collected, setCollected] = useState(false);
  const [collectConfirm, setCollectConfirm] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [resUser, resAuction] = await Promise.all([
          fetch("/api/user"),
          fetch(`/api/auctions/${slug}`)
        ]);

        if (resUser.ok) {
          const userData = await resUser.json();
          setUser(userData.user);
        }

        if (resAuction.ok) {
          const auctionData = await resAuction.json();
          setAuction(auctionData.auction);
          setIsSaved(auctionData.isSaved);
          setCollected(auctionData.auction.collected || false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (slug) fetchInitialData();
  }, [slug]);

  useEffect(() => {
    let socket;

    const setupSocket = async () => {
      // Warm up the Next.js API route to initialize the global socket object on res.socket.server.io
      await fetch("/api/socket");

      // DO NOT force transports: ["websocket"] explicitly. Allow negotiation to prevent 400 Bad Request
      socket = io({
        path: "/api/socket",
        addTrailingSlash: false,
        withCredentials: true,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("✅ Connected:", socket.id);
        socket.emit("joinAuction", slug);
      });

      socket.on("bidUpdate", (data) => {
        if (data.auction) {
          setAuction(data.auction);
          setCollected(data.auction.collected || false);
        }
      });

      socket.on("outbidNotification", (data) => {
        alert(`You have been outbid! ₹${data.newBid}`);
      });
      
      socket.on("connect_error", (err) => {
        console.error("Socket error", err);
      });
    };

    if (slug) setupSocket();

    return () => {
      if (socket) socket.disconnect();
    };
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
    setBidError("");
    setBidSuccess(false);

    const bidAmount = Number(bid);

    if (!bid || isNaN(bidAmount) || bidAmount <= 0) {
      setBidError("Please enter a valid bid amount.");
      return;
    }

    if (user && user.balance < bidAmount) {
      setBidError(
        `Insufficient balance. Your wallet has ₹${user.balance}. Please add funds.`
      );
      return;
    }

    if (!socketRef.current) {
      setBidError("Real-time connection not established. Try refreshing.");
      return;
    }

    socketRef.current.emit(
      "placeBid",
      { auctionId: slug, amount: bidAmount },
      (response) => {
        if (response && response.error) {
          setBidError(response.error);
        } else if (response && response.success) {
          setBid("");
          setBidSuccess(true);
          // Only the user who placed the bid updates their balance
          if (response.balance !== undefined) {
            setUser((prev) => (prev ? { ...prev, balance: response.balance } : prev));
          }
          setTimeout(() => setBidSuccess(false), 3000);
        }
      }
    );
  };

  const handleCollect = async () => {
    setCollectConfirm(false);
    setCollectLoading(true);
    try {
      const res = await fetch("/api/auctions/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auctionId: auction._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setCollected(true);
        setUser((prev) => prev ? { ...prev, balance: data.balance } : prev);
        alert(`₹${auction.currentBid} has been credited to your wallet!`);
      } else {
        alert(data.error || "Failed to collect credits");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setCollectLoading(false);
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
  const isAuctionEnded =
    auction && (auction.status === "ended" || new Date() > new Date(auction.endTime));
  const isWinner =
    user && auction?.highestBidder?._id === user._id;

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
                priority
                style={{ width: "100%", height: "auto" }}
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
                <UserIcon className="text-orange-500" />
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

              {/* Balance display */}
              {user && (
                <div className="text-sm text-gray-500">
                  Your Wallet Balance:{" "}
                  <span className="font-semibold text-[#1F2937]">
                    ₹{user.balance}
                  </span>
                </div>
              )}

              {/* Bid Input */}
              {!isAuctionEnded && (
                <div>
                  <label className="text-sm text-gray-500">Enter Your Bid</label>

                  <div className="flex gap-3 mt-2">
                    <input
                      type="number"
                      value={bid}
                      onChange={(e) => {
                        setBid(e.target.value);
                        setBidError("");
                        setBidSuccess(false);
                      }}
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

                  {/* Error message */}
                  {bidError && (
                    <div className="mt-2 flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <span>{bidError}</span>
                    </div>
                  )}

                  {/* Success message */}
                  {bidSuccess && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span>Bid placed successfully!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Collect Credits Button — always visible, functional only for winner */}
              {collectConfirm ? (
                <div className="border border-orange-300 bg-orange-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-orange-800">
                    Collect <span className="font-bold">₹{currentBid}</span> auction credits to your wallet?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCollect}
                      disabled={collectLoading}
                      className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 text-sm font-medium"
                    >
                      {collectLoading ? "Collecting..." : "Yes, Collect Credits"}
                    </button>
                    <button
                      onClick={() => setCollectConfirm(false)}
                      className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (isAuctionEnded && isWinner && !collected) {
                      setCollectConfirm(true);
                    }
                  }}
                  disabled={collected || !isAuctionEnded || !isWinner}
                  className={`w-full border py-3 rounded-lg flex items-center justify-center gap-2 transition
                    ${collected
                      ? "bg-green-50 border-green-300 text-green-600 cursor-not-allowed"
                      : isAuctionEnded && isWinner
                      ? "border-orange-500 text-orange-500 hover:bg-orange-50 cursor-pointer"
                      : "border-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {collected ? (
                    <>
                      <CheckCircle2 size={18} />
                      Credits Collected
                    </>
                  ) : (
                    <>
                      <Coins size={18} />
                      Collect Auction Credits
                    </>
                  )}
                </button>
              )}
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
