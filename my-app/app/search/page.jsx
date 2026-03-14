"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"

const auctions = [
  {
    title: "Nike Air Jordan 1",
    price: "$320",
    img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    category: "Shoes"
  },
  {
    title: "Apple iPad Pro",
    price: "$720",
    img: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28",
    category: "Electronics"
  },
  {
    title: "Vintage Rolex Watch",
    price: "$1,250",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    category: "Accessories"
  },
  {
    title: "Apple TV 4K",
    price: "$95",
    img: "https://images.unsplash.com/photo-1593784991095-a205069470b6",
    category: "Electronics"
  }
]

export default function SearchPage() {
  const [query, setQuery] = useState("")

  const filtered = auctions.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">

      <div className="max-w-7xl mx-auto">

        <StaggerGrid className="space-y-10">

          {/* PAGE TITLE */}
          <StaggerItem>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Search Auctions
              </h1>
              <p className="text-gray-500">
                Find items you want to bid on.
              </p>
            </div>
          </StaggerItem>

          {/* SEARCH BAR */}
          <StaggerItem>

            <div className="bg-white rounded-xl shadow px-4 py-3 flex items-center gap-3">

              <Search size={20} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search auctions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="outline-none w-full text-sm"
              />

            </div>

          </StaggerItem>

          {/* FILTERS */}
          <StaggerItem>

            <div className="flex gap-3 flex-wrap">

              {["All", "Electronics", "Shoes", "Accessories"].map((cat) => (
                <button
                  key={cat}
                  className="px-4 py-2 bg-white rounded-lg shadow text-sm
                  hover:bg-gray-100 transition"
                >
                  {cat}
                </button>
              ))}

            </div>

          </StaggerItem>

          {/* RESULTS GRID */}
          <StaggerItem>

            <StaggerGrid className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {filtered.map((item, index) => (

                <StaggerItem key={index}>

                  <div className="bg-white rounded-xl shadow p-4
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]">

                    <div className="overflow-hidden rounded-lg">

                      <Image
                        src={item.img}
                        width={400}
                        height={250}
                        alt={item.title}
                        className="object-cover h-40 w-full transition duration-300 hover:scale-105"
                      />

                    </div>

                    <h3 className="mt-3 font-semibold">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      Current Bid
                    </p>

                    <p className="font-bold">
                      {item.price}
                    </p>

                    <button className="mt-3 w-full bg-orange-600 text-white py-2 rounded-lg
                    transition hover:bg-orange-700 hover:shadow-md">
                      View Auction
                    </button>

                  </div>

                </StaggerItem>

              ))}

            </StaggerGrid>

          </StaggerItem>

        </StaggerGrid>

      </div>

    </div>
  )
}