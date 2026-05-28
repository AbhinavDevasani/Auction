"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Pusher from "pusher-js";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { Clock, Gavel, Coins, User as UserIcon, Bookmark, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function AuctionDetailClient({ initialAuction, initialUser, initialIsSaved }) {
  const [auction, setAuction] = useState(initialAuction);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [user, setUser] = useState(initialUser);
  const [timeLeft, setTimeLeft] = useState("");
  const [bid, setBid] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);
  const [collectLoading, setCollectLoading] = useState(false);
  const [collected, setCollected] = useState(initialAuction?.collected || false);
  const [collectConfirm, setCollectConfirm] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const pusherRef = useRef(null);

  useEffect(() => {
    if (!auction?._id) return;

    Pusher.logToConsole = false;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
    pusherRef.current = pusher;

    const auctionChannel = pusher.subscribe(`auction-${auction._id}`);
    auctionChannel.bind("bidUpdate", (data) => {
      if (data.auction) {
        setAuction(data.auction);
        setCollected(data.auction.collected || false);
      }
    });

    return () => {
      pusher.unsubscribe(`auction-${auction._id}`);
      pusher.disconnect();
      pusherRef.current = null;
    };
  }, [auction?._id]);

  useEffect(() => {
    const handleBalanceEvent = async (e) => {
      if (e.detail && e.detail.newBalance !== undefined) {
        setUser((prev) => prev ? { ...prev, balance: e.detail.newBalance } : prev);
      } else {
        try {
          const resUser = await fetch("/api/user");
          if (resUser.ok) {
            const userData = await resUser.json();
            setUser(userData.user);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    };

    window.addEventListener("balanceUpdated", handleBalanceEvent);
    return () => window.removeEventListener("balanceUpdated", handleBalanceEvent);
  }, []);

  useEffect(() => {
    if (!user?._id || !pusherRef.current) return;

    const userChannel = pusherRef.current.subscribe(`user-${user._id}`);
    userChannel.bind("outbidNotification", (data) => {
      if (data.auctionId === auction._id) {
        toast.warning(`You have been outbid! ₹${data.newBid}`);
        window.dispatchEvent(new CustomEvent("balanceUpdated"));
      }
    });

    return () => {
      pusherRef.current?.unsubscribe(`user-${user._id}`);
    };
  }, [user?._id, auction?._id]);

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
        toast.success(data.isSaved ? "Item saved successfully" : "Item removed from saved list");
      } else {
        toast.error(data.error || "Failed to modify saved item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
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

    if (!pusherRef.current) {
      setBidError("Real-time connection not established. Try refreshing.");
      return;
    }

    try {
      const res = await fetch("/api/auctions/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auctionId: auction._id, amount: bidAmount }),
      });
      const response = await res.json();

      if (!res.ok) {
        setBidError(response.error || "Failed to place bid");
      } else {
        setBid("");
        setBidSuccess(true);
        if (response.balance !== undefined) {
          setUser((prev) => (prev ? { ...prev, balance: response.balance } : prev));
          window.dispatchEvent(new CustomEvent("balanceUpdated", { detail: { newBalance: response.balance } }));
        }
        setTimeout(() => setBidSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setBidError("Network error while placing bid.");
    }
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
        window.dispatchEvent(new CustomEvent("balanceUpdated", { detail: { newBalance: data.balance } }));
        setAuction((prev) => {
          if (!prev) return prev;
          const newLockedAmounts = prev.lockedAmounts?.map(entry => 
            (entry.user === user._id || entry.user?._id === user._id) 
              ? { ...entry, amount: 0 } 
              : entry
          ) || [];
          return { ...prev, lockedAmounts: newLockedAmounts };
        });
        toast.success(`₹${data.refundAmount} has been credited to your wallet!`);
      } else {
        toast.error(data.error || "Failed to collect credits");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setCollectLoading(false);
    }
  };

  const currentBid = auction?.currentBid || auction?.startingPrice || 0;
  const highestBidder = auction?.highestBidder?.name || "No bids yet";
  const isAuctionEnded =
    auction && (auction.status === "ended" || new Date() > new Date(auction.endTime));
  const isWinner =
    user && auction?.highestBidder?._id === user._id;

  const userLockedAmount = user && auction?.lockedAmounts 
    ? auction.lockedAmounts.find(entry => 
        entry.user === user._id || entry.user?._id === user._id
      )?.amount || 0 
    : 0;

  const canCollect = userLockedAmount > 0 && !isWinner;

  // Carousel preparation
  const images = auction.images && auction.images.length > 0 ? auction.images : [auction.image];
  const showCarousel = images.length > 1;

  const handlePrevImage = () => {
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">
      <div className="max-w-7xl mx-auto">
        <StaggerItem>
          <h1 className="text-3xl font-bold mb-2">Auction Item</h1>
          <p className="text-gray-500 mb-8">Viewing auction: {auction.title}</p>
        </StaggerItem>

        <StaggerGrid className="grid md:grid-cols-2 gap-8">
          {/* IMAGE CAROUSEL SECTION */}
          <StaggerItem>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between h-full">
              <div className="relative group overflow-hidden rounded-lg flex items-center justify-center bg-gray-50 h-[380px] w-full">
                <Image
                  src={images[activeImgIndex]}
                  width={600}
                  height={400}
                  alt={`Auction item ${activeImgIndex + 1}`}
                  priority
                  style={{ width: "100%", height: "100%" }}
                  className="rounded-lg object-contain transition duration-300"
                />

                {showCarousel && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition cursor-pointer"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition cursor-pointer"
                    >
                      <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 px-3 py-1 rounded-full">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImgIndex(idx)}
                          className={`w-2 h-2 rounded-full transition ${
                            idx === activeImgIndex ? "bg-white scale-110" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {showCarousel && (
                <div className="flex gap-2 mt-4 overflow-x-auto justify-center py-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`relative w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${
                        idx === activeImgIndex ? "border-orange-500 scale-105 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`thumbnail-${idx}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
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
                      className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    />

                    <button
                      onClick={handleBid}
                      className="bg-orange-500 text-white px-6 rounded-lg hover:bg-orange-600 transition cursor-pointer"
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

              {/* Collect Credits Button — available for outbid users with locked funds */}
              {collectConfirm ? (
                <div className="border border-orange-300 bg-orange-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-orange-800">
                    Collect <span className="font-bold">₹{userLockedAmount}</span> refunded credits to your wallet?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCollect}
                      disabled={collectLoading}
                      className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 text-sm font-medium cursor-pointer"
                    >
                      {collectLoading ? "Collecting..." : "Yes, Collect Credits"}
                    </button>
                    <button
                      onClick={() => setCollectConfirm(false)}
                      className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                canCollect && (
                  <button
                    onClick={() => {
                      if (!collected) {
                        setCollectConfirm(true);
                      }
                    }}
                    disabled={collected}
                    className={`w-full border py-3 rounded-lg flex items-center justify-center gap-2 transition
                      ${collected
                        ? "bg-green-50 border-green-300 text-green-600 cursor-not-allowed"
                        : "border-orange-500 text-orange-500 hover:bg-orange-50 cursor-pointer"
                      }`}
                  >
                    {collected ? (
                      <>
                        <CheckCircle2 size={18} />
                        Refund Collected
                      </>
                    ) : (
                      <>
                        <Coins size={18} />
                        Collect Refund (₹{userLockedAmount})
                      </>
                    )}
                  </button>
                )
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
