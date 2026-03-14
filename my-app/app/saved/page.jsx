"use client"

import Image from "next/image"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"

const savedItems = [
  {
    name: "Nike Air Jordan 1",
    price: "$120",
    img: "https://res.cloudinary.com/dudjdf428/image/upload/v1773499373/piyush-haswani-gAVIw1zs1fU-unsplash_thqw5v.jpg"
  },
  {
    name: "Apple iPad 10.2",
    price: "$95",
    img: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28"
  },
  {
    name: "Samsung Galaxy A51",
    price: "$85",
    img: "https://images.unsplash.com/photo-1580910051074-3eb694886505"
  },
  {
    name: "Apple TV 4K",
    price: "$70",
    img: "https://images.unsplash.com/photo-1593784991095-a205069470b6"
  }
]

export default function SavedItemsPage() {
  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Saved Items
        </h1>

        <StaggerGrid className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {savedItems.map((item, index) => (

            <StaggerItem key={index}>

              <div className="bg-white rounded-xl shadow p-4 
              transition-all duration-300 
              hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]">

                <div className="overflow-hidden rounded-lg">
                  <Image
                    src={item.img}
                    width={400}
                    height={250}
                    alt={item.name}
                    className="object-cover h-40 w-full transition duration-300 hover:scale-105"
                  />
                </div>

                <h3 className="mt-3 font-semibold">
                  {item.name}
                </h3>

                <p className="text-gray-500 text-sm">
                  Current Bid
                </p>

                <p className="font-bold">
                  {item.price}
                </p>

                <button className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg
                transition duration-200 hover:bg-orange-600 hover:shadow-md">
                  View Auction
                </button>

              </div>

            </StaggerItem>

          ))}

        </StaggerGrid>

      </div>

    </div>
  )
}