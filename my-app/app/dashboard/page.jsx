"use client"

import { Search, Bell, MoreVertical } from "lucide-react"
import Image from "next/image"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"

export default function DashboardContent() {
  return (
    <div className="flex-1 bg-gray-100 min-h-screen p-8">

      {/* PAGE STAGGER */}
      <StaggerGrid className="space-y-10">

        {/* TOP BAR */}
        <StaggerItem>
          <div className="flex items-center justify-between">

            <div className="flex items-center bg-white rounded-xl shadow px-4 py-2 w-[420px]">
              <Search className="text-gray-400 mr-2" size={18} />
              <input
                placeholder="Search for transaction, item..."
                className="outline-none w-full text-black"
              />
            </div>

            <div className="flex items-center gap-4">

              <div className="bg-white px-4 py-2 rounded-xl shadow text-sm text-black font-medium transition hover:shadow-md">
                9.999 ETH
              </div>

              <button className="bg-white p-2 rounded-xl shadow text-black transition hover:shadow-md hover:-translate-y-[2px]">
                <Bell size={18} />
              </button>

              <Image
                src="https://i.pravatar.cc/40"
                width={36}
                height={36}
                alt="User Avatar"
                className="rounded-full cursor-pointer transition hover:scale-105"
              />

            </div>

          </div>
        </StaggerItem>

        {/* MAIN GRID */}
        <StaggerItem>
          <div className="grid grid-cols-4 gap-6">

            {/* FEATURED AUCTION */}
            <div className="col-span-2 bg-white rounded-2xl shadow p-4 text-black
              transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

              <Image
                src="https://images.unsplash.com/photo-1633356122544-f134324a6cee"
                width={800}
                height={350}
                alt="Auction Artwork"
                className="rounded-xl h-56 w-full object-cover mb-4"
              />

              <h2 className="text-lg font-semibold">
                Explosion of Colors #8
              </h2>

              <p className="text-gray-500 text-sm mb-4">
                by AIIV Collection
              </p>

              <div className="flex justify-between items-center mb-4">

                <div>
                  <p className="text-gray-500 text-sm">Current Bid</p>
                  <p className="font-bold">3.69 ETH</p>
                </div>

                <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                  15h : 32m : 17s
                </div>

              </div>

              <div className="flex gap-3">

                <button className="border px-4 py-2 rounded-lg transition hover:bg-gray-100">
                  View Artwork
                </button>

                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg transition hover:bg-purple-700 hover:shadow-lg">
                  Place Bid
                </button>

              </div>
            </div>

            {/* TOP CATEGORIES */}
            <div className="bg-white rounded-2xl shadow p-4 text-black
              transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

              <h3 className="font-semibold mb-4">
                Top Categories
              </h3>

              {["Adze", "Acuma", "Mamara", "Kokosa", "Tata"].map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-between mb-3 p-1 rounded-lg transition hover:bg-gray-100"
                >

                  <div className="flex items-center gap-2">

                    <Image
                      src={`https://i.pravatar.cc/40?u=${name}`}
                      width={32}
                      height={32}
                      alt={name}
                      className="rounded-full"
                    />

                    <span className="text-sm">{name}</span>

                  </div>

                  <button className="text-xs bg-purple-600 text-white px-3 py-1 rounded-lg transition hover:bg-purple-700">
                    Follow
                  </button>

                </div>
              ))}

            </div>

            {/* STATISTICS */}
            <div className="bg-white rounded-2xl shadow p-4 text-black
              transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

              <h3 className="font-semibold mb-4">
                Statistics
              </h3>

              <div className="h-32 bg-linear-to-r from-blue-200 to-purple-200 rounded-lg mb-4"></div>

              <div className="space-y-2 text-sm">

                <div className="flex justify-between">
                  <span>Artwork Sold</span>
                  <span>212</span>
                </div>

                <div className="flex justify-between">
                  <span>Artwork Cancel</span>
                  <span>212</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Earning</span>
                  <span>9.99 ETH</span>
                </div>

              </div>

            </div>

          </div>
        </StaggerItem>

        {/* COLLECTIONS */}
        <StaggerItem>
          <div className="text-black">

            <h2 className="text-xl font-semibold mb-6">
              Top Collections
            </h2>

            <StaggerGrid className="grid grid-cols-4 gap-6">

              {[1, 2, 3, 4].map((item) => (
                <StaggerItem
                  key={item}
                  className="bg-white rounded-xl shadow p-3
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]"
                >

                  <div className="flex justify-between mb-2">

                    <div className="flex items-center gap-2">

                      <Image
                        src="https://i.pravatar.cc/40"
                        width={28}
                        height={28}
                        alt="Creator"
                        className="rounded-full"
                      />

                      <span className="text-sm font-medium">
                        AdzeDesign
                      </span>

                    </div>

                    <MoreVertical size={16} className="cursor-pointer" />

                  </div>

                  <Image
                    src="https://images.unsplash.com/photo-1633356122544-f134324a6cee"
                    width={400}
                    height={200}
                    alt="Collection Artwork"
                    className="rounded-lg h-32 w-full object-cover mb-3"
                  />

                  <p className="text-sm text-gray-500">
                    Explosion of Color
                  </p>

                  <p className="font-semibold text-sm">
                    3.69 ETH
                  </p>

                </StaggerItem>
              ))}

            </StaggerGrid>

          </div>
        </StaggerItem>

      </StaggerGrid>

    </div>
  )
}