"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { use } from "react";

export default function EditListingPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [endTime, setEndTime] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await fetch(`/api/auctions/${id}`);
        const data = await res.json();
        
        if (data.error) {
          setError(data.error);
          return;
        }

        const auction = data.auction;
        if (auction.bids && auction.bids.length > 0) {
          setError("Cannot edit an auction that has already received bids.");
        }

        setTitle(auction.title || "");
        setDescription(auction.description || "");
        setStartingPrice(auction.startingPrice || "");
        
        if (auction.endTime) {
          const dateObj = new Date(auction.endTime);
  
          const formattedDate = dateObj.toISOString().slice(0, 16);
          setEndTime(formattedDate);
        }
      } catch (err) {
        console.error("Failed to fetch auction", err);
        setError("Failed to fetch auction");
      } finally {
        setFetching(false);
      }
    };
    
    fetchAuction();
  }, [id]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (!title || !startingPrice || !endTime) {
        setError("Please fill all required fields");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/auctions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          startingPrice: Number(startingPrice),
          endTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update auction");
      }

      alert("Auction updated successfully!");
      router.push("/mylistings");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 md:p-10 bg-[#F9FAFB] min-h-screen text-[#1F2937]">
      <StaggerGrid className="max-w-3xl mx-auto space-y-8">
        <StaggerItem>
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-black">
              &larr; Back
            </button>
            <h1 className="text-3xl font-bold text-[#111827]">Edit Listing</h1>
          </div>
          <p className="text-gray-500 mt-1">Update the details of your auction. Images cannot be changed.</p>
        </StaggerItem>

        <StaggerItem>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Item Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. iPhone 13 Pro"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item..."
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Starting Price (₹)</label>
                <input
                  type="number"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  placeholder="Starting Price ₹"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || error === "Cannot edit an auction that has already received bids."}
              className={`w-full font-semibold py-3 rounded-xl transition ${
                loading || error === "Cannot edit an auction that has already received bids."
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {loading ? "Updating..." : "Update Listing"}
            </button>
          </div>
        </StaggerItem>
      </StaggerGrid>
    </div>
  );
}
