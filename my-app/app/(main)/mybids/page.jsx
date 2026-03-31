import Image from "next/image"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"

const myBids = [
  {
    item: "Vintage Rolex Watch",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    currentBid: "₹1,250",
    myBid: "₹1,100",
    status: "Outbid",
    time: "2h 15m"
  },
  {
    item: "Nike Air Jordan 1",
    img: "https://res.cloudinary.com/dudjdf428/image/upload/v1773499373/piyush-haswani-gAVIw1zs1fU-unsplash_thqw5v.jpg",
    currentBid: "₹320",
    myBid: "₹320",
    status: "Winning",
    time: "5h 12m"
  },
  {
    item: "Apple iPad Pro",
    img: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28",
    currentBid: "₹720",
    myBid: "₹680",
    status: "Outbid",
    time: "1d 3h"
  },
]

export default function MyBidsPage() {
  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">

      <div className="max-w-7xl mx-auto">

        <StaggerGrid className="space-y-8">

          {/* PAGE TITLE */}
          <StaggerItem>
            <h1 className="text-3xl font-bold">
              My Bids
            </h1>
          </StaggerItem>

          {/* BID GRID */}
          <StaggerItem>

            <StaggerGrid className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {myBids.map((bid, index) => (

                <StaggerItem key={index}>

                  <div className="bg-white rounded-xl shadow p-4 
                  transition-all duration-300 
                  hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]">

                    {/* ITEM IMAGE */}
                    <div className="overflow-hidden rounded-lg">
                      <Image
                        src={bid.img}
                        width={400}
                        height={250}
                        alt={bid.item}
                        className="object-cover h-40 w-full transition duration-300 hover:scale-105"
                      />
                    </div>

                    {/* ITEM INFO */}
                    <h3 className="mt-3 font-semibold">
                      {bid.item}
                    </h3>

                    <div className="mt-2 text-sm text-gray-500">
                      Current Bid
                    </div>

                    <p className="font-bold">
                      {bid.currentBid}
                    </p>

                    <div className="mt-2 text-sm text-gray-500">
                      Your Bid
                    </div>

                    <p className="font-semibold text-orange-600">
                      {bid.myBid}
                    </p>

                    {/* STATUS */}
                    <div className="flex justify-between items-center mt-3">

                      <span
                        className={`text-xs px-2 py-1 rounded-lg ${
                          bid.status === "Winning"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {bid.status}
                      </span>

                      <span className="text-xs text-gray-500">
                        {bid.time}
                      </span>

                    </div>

                    {/* BUTTON */}
                    <button className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg
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