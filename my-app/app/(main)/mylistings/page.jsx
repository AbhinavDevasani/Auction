"use client"

import Image from "next/image"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MyListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState([])

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this auction?")) {
      try {
        const res = await fetch(`/api/auctions/${id}`, { method: 'DELETE' })
        const data = await res.json()
        if (data.success) {
          setListings(prev => prev.filter(item => item._id !== id))
        } else {
          alert(data.error || "Failed to delete")
        }
      } catch (error) {
        console.error(error)
        alert("Failed to delete")
      }
    }
  }

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
                <div className="flex items-center w-full mt-2 text-xs">
                  {!isLocked && item.status !== "ended" ? (
                    <>
                      <button onClick={() => router.push(`/mylistings/edit/${item._id}`)} className="text-orange-500 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="text-red-500 ml-2 hover:underline">
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

                  <button onClick={() => router.push(`/auction/${item._id}`)} className="ml-auto text-gray-600 hover:underline">
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