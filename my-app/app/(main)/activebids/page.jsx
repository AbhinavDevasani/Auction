import Image from "next/image";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import Link from "next/link";
const bids = [
  {
    name: "Nike Air Jordan 1 Retro",
    slug: "nike-air-jordan-1",
    currentBid: "$120",
    yourBid: "$115",
    time: "2h 15m",
    img: "https://res.cloudinary.com/dudjdf428/image/upload/v1773499373/piyush-haswani-gAVIw1zs1fU-unsplash_thqw5v.jpg",
  },
  {
    name: "Apple iPad 10.2",
    slug: "ipad-10-2",
    currentBid: "$95",
    yourBid: "$90",
    time: "4h 10m",
    img: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28",
  },
  {
    name: "Samsung Galaxy A51",
    slug: "samsung-a51",
    currentBid: "$85",
    yourBid: "$80",
    time: "1h 40m",
    img: "https://images.unsplash.com/photo-1580910051074-3eb694886505",
  },
];

export default function ActiveBidsPage() {
  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">Active Bids</h1>

        <p className="text-gray-500 mb-8">
          Auctions where you have placed a bid
        </p>

        {/* Stagger Grid */}
        <StaggerGrid className="grid md:grid-cols-3 gap-6">
          {bids.map((bid, index) => (
            <StaggerItem key={index}>
              {/* CARD */}
              <div
                className="bg-white rounded-xl shadow p-4 
              transition-all duration-300 
              hover:-translate-y-1 hover:shadow-xl"
              >
                <Image
                  src={bid.img}
                  width={400}
                  height={250}
                  alt={bid.name}
                  className="rounded-lg object-cover h-44"
                />

                <h3 className="mt-3 font-semibold">{bid.name}</h3>

                <div className="mt-3 text-sm text-gray-600">
                  <p>
                    Current Bid:
                    <span className="font-bold ml-2">{bid.currentBid}</span>
                  </p>

                  <p>
                    Your Bid:
                    <span className="font-bold ml-2 text-orange-500">
                      {bid.yourBid}
                    </span>
                  </p>

                  <p>
                    Time Remaining:
                    <span className="ml-2">{bid.time}</span>
                  </p>
                </div>

                <Link href={`/auction/${bid.slug}`}>
                  <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
                    View Auction
                  </button>
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </div>
  );
}
