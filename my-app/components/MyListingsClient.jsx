"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { toast } from "sonner";

export default function MyListingsClient({ initialListings }) {
  const router = useRouter();
  const [listings, setListings] = useState(initialListings);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this auction?")) {
      try {
        const res = await fetch(`/api/auctions/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setListings((prev) => prev.filter((item) => item._id !== id));
          toast.success("Listing deleted successfully");
        } else {
          toast.error(data.error || "Failed to delete");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete");
      }
    }
  };

  return (
    <>
      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 w-full col-span-full">
          <p className="text-xl font-medium mb-1">No listings found</p>
          <p className="text-sm">You haven't created any auctions yet.</p>
        </div>
      ) : (
        <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {listings.map((item) => {
            const isLocked = item.bids?.length > 0;

            return (
              <StaggerItem key={item._id}>
                <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition">
                  {/* Image */}
                  <div className="relative w-full h-32 mb-2">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  {/* Title */}
                  <h2 className="text-sm font-semibold text-[#1F2937] line-clamp-1">
                    {item.title}
                  </h2>

                  {/* Info */}
                  <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                    <p>
                      Bid:{" "}
                      <span className="text-black font-medium">
                        ₹{item.currentBid || item.startingPrice}
                      </span>
                    </p>

                    <p>{item.bids?.length || 0} bids</p>

                    <p className="text-orange-500">
                      {item.status === "ended" ? "Ended" : "Active"}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="mt-2">
                    {item.status === "ended" ? (
                      <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded">
                        Ended
                      </span>
                    ) : isLocked ? (
                      <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                        Locked
                      </span>
                    ) : (
                      <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center w-full mt-2 text-xs">
                    {!isLocked && item.status !== "ended" ? (
                      <>
                        <button
                          onClick={() => router.push(`/mylistings/edit/${item._id}`)}
                          className="text-orange-500 hover:underline cursor-pointer bg-transparent border-0 p-0 text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 ml-2 hover:underline cursor-pointer bg-transparent border-0 p-0 text-left"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">
                        {item.status === "ended"
                          ? "Auction ended"
                          : "Locked after first bid"}
                      </span>
                    )}

                    <button
                      onClick={() => router.push(`/auction/${item._id}`)}
                      className="ml-auto text-gray-600 hover:underline cursor-pointer bg-transparent border-0 p-0 text-right"
                    >
                      View
                    </button>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      )}
    </>
  );
}
