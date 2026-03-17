import { Search, Gavel } from "lucide-react";
import Image from "next/image";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import LineGraph from "@/components/LineGraph";
import SearchInput from "@/components/SearchInput";
import Link from "next/link";
export default function DashboardContent() {
  const completedAuctions = [
    {
      name: "Apple iPad 10.2",
      finalBid: "$520",
      bids: 18,
      winner: "Alex",
      img: "https://res.cloudinary.com/dudjdf428/image/upload/v1773597018/kool-c-vYZrIWIJ9mg-unsplash_co038x.jpg",
    },
    {
      name: "Nike Air Jordan 1",
      finalBid: "$340",
      bids: 12,
      winner: "Jordan",
      img: "https://res.cloudinary.com/dudjdf428/image/upload/v1773499373/piyush-haswani-gAVIw1zs1fU-unsplash_thqw5v.jpg",
    },
    {
      name: "Samsung Galaxy A51",
      finalBid: "$290",
      bids: 9,
      winner: "Chris",
      img: "https://images.unsplash.com/photo-1580910051074-3eb694886505",
    },
    {
      name: "Apple TV 4K",
      finalBid: "$210",
      bids: 7,
      winner: "Maya",
      img: "https://images.unsplash.com/photo-1593784991095-a205069470b6",
    },
  ];

  return (
    <div className="flex-1 bg-gray-100 min-h-screen p-8">
      ```
      <StaggerGrid className="space-y-10">
        {/* TOP BAR */}
        <StaggerItem>
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-white rounded-xl shadow px-4 py-2 w-[420px]">
              <Search className="text-gray-400 mr-2" size={18} />
              <SearchInput />
            </div>

            <div className="flex items-center gap-4">
              <Link href={"/wallet"}>
                <div className="bg-white px-4 py-2 rounded-xl shadow text-sm text-black font-medium">
                  Wallet: $1,240
                </div>
              </Link>
              
              <Link href={'/profile'}>
              <Image
                src="https://i.pravatar.cc/40"
                width={36}
                height={36}
                alt="User Avatar"
                className="rounded-full cursor-pointer"
              />
              </Link>
            </div>
          </div>
        </StaggerItem>

        {/* MAIN GRID */}
        <StaggerItem>
          <div className="grid grid-cols-4 gap-6">
            {/* FEATURED AUCTION */}
            <div className="col-span-2 bg-white rounded-2xl shadow p-4 text-black hover:shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28"
                width={800}
                height={350}
                alt="Auction Item"
                className="rounded-xl h-56 w-full object-cover mb-4"
              />

              <h2 className="text-lg font-semibold">Apple iPad 10.2</h2>

              <p className="text-gray-500 text-sm mb-4">Seller: TechStore</p>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Current Bid</p>
                  <p className="font-bold text-lg">$320</p>
                </div>

                <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                  Ends in 12h : 22m
                </div>
              </div>

              <div className="flex gap-3">
                <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
                  View Auction
                </button>

                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2">
                  <Gavel size={16} />
                  Place Bid
                </button>
              </div>
            </div>

            {/* TOP BIDDERS */}
            <div className="bg-white rounded-2xl shadow p-4 text-black hover:shadow-xl">
              <h3 className="font-semibold mb-4">Top Bidders</h3>

              {["Alex", "Maya", "Jordan", "Chris", "Sam"].map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-between mb-3 p-1 hover:bg-gray-100 rounded-lg"
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

                  <span className="text-xs text-gray-500">$1.2k bids</span>
                </div>
              ))}
            </div>

            {/* AUCTION STATS */}
            <div className="bg-white rounded-2xl shadow p-4 text-black hover:shadow-xl">
              <h3 className="font-semibold mb-4">Auction Stats</h3>

              <div className="h-32 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-lg mb-4">
                <LineGraph />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Auctions Won</span>
                  <span>18</span>
                </div>

                <div className="flex justify-between">
                  <span>Active Bids</span>
                  <span>7</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Spent</span>
                  <span>$3,420</span>
                </div>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* USER COMPLETED AUCTIONS */}
        <StaggerItem>
          <div className="text-black">
            <h2 className="text-xl font-semibold mb-6">
              Your Top Completed Auctions
            </h2>

            <StaggerGrid className="grid grid-cols-4 gap-6">
              {completedAuctions.map((auction, index) => (
                <StaggerItem
                  key={index}
                  className="bg-white rounded-xl shadow p-3
              transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Image
                    src={auction.img}
                    width={400}
                    height={200}
                    alt={auction.name}
                    className="rounded-lg h-32 w-full object-cover mb-3"
                  />

                  <p className="text-sm text-gray-500">{auction.name}</p>

                  <p className="font-semibold text-sm">
                    Final Bid: {auction.finalBid}
                  </p>

                  <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                    <span>{auction.bids} bids</span>

                    <span>Winner: {auction.winner}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </StaggerItem>
      </StaggerGrid>
    </div>
  );
}
