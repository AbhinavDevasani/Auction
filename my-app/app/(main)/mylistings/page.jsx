"use client"

import Image from "next/image"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"
import { useState, useEffect } from "react"

export default function MyListingsPage() {
  const [listings, setListings] = useState([])

  const getListings = async () => {
    try {
      const res = await fetch("/api/user/listings")
      const data = await res.json()
      setListings(data.listings || [])
    } catch (err) {
      console.error("Failed to fetch listings", err)
    }
  }

  useEffect(() => {
    getListings()
  }, [])
  console.log(listings)
  return (
    <div className="flex-1 bg-[#F9FAFB] min-h-screen p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]">
          My Listings
        </h1>
        <p className="text-sm text-gray-500">
          Manage and track your auctions
        </p>
      </div>

      {/* Grid */}
      <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {listings.map((item) => {

          const isLocked = item.bids?.length > 0

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
                <div className="flex items-center mt-2 text-xs">
                  {!isLocked && item.status !== "ended" ? (
                    <>
                      <button className="text-orange-500 hover:underline">
                        Edit
                      </button>
                      <button className="text-red-500 ml-2 hover:underline">
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

                  <button className="ml-auto text-gray-600 hover:underline">
                    View
                  </button>
                </div>

              </div>
            </StaggerItem>
          )
        })}
      </StaggerGrid>
    </div>
  )
}