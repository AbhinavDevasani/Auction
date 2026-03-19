"use client"

import Image from "next/image"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"

const listings = [
  {
    id: 1,
    name: "Nike Air Jordan 1 Retro",
    currentBid: 320,
    bids: 0,
    timeLeft: "2h 15m",
    status: "Active",
    image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6",
  },
  {
    id: 2,
    name: "iPhone 13 Pro",
    currentBid: 780,
    bids: 6,
    timeLeft: "5h 40m",
    status: "Active",
    image: "https://images.unsplash.com/photo-1632661674596-618e1d47f3d9",
  },
  {
    id: 3,
    name: "Gaming Laptop",
    currentBid: 1200,
    bids: 12,
    timeLeft: "Ended",
    status: "Ended",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  },
]

export default function MyListingsPage() {
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

      {/* GRID FIX */}
      <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {listings.map((item) => {
          const isLocked = item.bids > 0

          return (
            <StaggerItem key={item.id}>
              <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition">

                {/* Image */}
                <div className="relative w-full h-32 mb-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                {/* Title */}
                <h2 className="text-sm font-semibold text-[#1F2937] line-clamp-1">
                  {item.name}
                </h2>

                {/* Info */}
                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                  <p>
                    Bid:{" "}
                    <span className="text-black font-medium">
                      ${item.currentBid}
                    </span>
                  </p>
                  <p>{item.bids} bids</p>
                  <p className="text-orange-500">{item.timeLeft}</p>
                </div>

                {/* Status */}
                <div className="mt-2">
                  {item.status === "Ended" ? (
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
                  {!isLocked && item.status !== "Ended" ? (
                    <>
                      <button className="text-orange-500">Edit</button>
                      <button className="text-red-500 ml-2">Delete</button>
                    </>
                  ) : null}

                  <button className="ml-auto text-gray-600">
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