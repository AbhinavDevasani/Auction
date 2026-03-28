"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import Link from "next/link";


export default function AuctionsPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAuctions = async () => {
      const res = await fetch("/api/auctions");
      const data = await res.json()
      setAuctions(data.auctions)
      setLoading(false);
    };

    fetchAuctions();
  }, []);
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* HERO */}
      <section className="py-20 px-8">
        <StaggerGrid className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <StaggerItem>
            <div>
              <h1 className="text-5xl font-bold leading-tight text-[#1F2937]">
                Transparent Auctions
                <span className="text-orange-500 block">Player vs Players</span>
              </h1>

              <p className="text-gray-600 mt-4">
                Join exciting auctions and compete with other players to win
                amazing items.
              </p>

              <div className="flex gap-4 mt-6">
                <Link
                  href="/signup"
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg"
                >
                  Sign Up
                </Link>

                <Link
                  href="/signin"
                  className="border px-6 py-3 rounded-lg text-[#1F2937]"
                >
                  Log In
                </Link>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <Image
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format"
                width={500}
                height={350}
                alt="Auction"
                className="rounded-xl"
              />
            </div>
          </StaggerItem>
        </StaggerGrid>
      </section>

      {/* FEATURED AUCTIONS */}
      <section className="max-w-7xl mx-auto px-8 pb-20 text-[#1F2937]">
        <StaggerItem>
          <h2 className="text-2xl font-semibold mb-6">Featured Lots</h2>
        </StaggerItem>

        <StaggerGrid className="grid md:grid-cols-4 gap-6">
          {auctions.slice(0, 4).map((item, index) => (
            <StaggerItem key={index}>
              {/* CARD */}
              <div
                className="bg-white rounded-xl shadow p-4
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl"
              >
                <Image
                  src={item.image}
                  width={300}
                  height={200}
                  alt={item.title}
                  className="rounded-lg object-cover h-40"
                />

                <h3 className="mt-3 font-medium">{item.title}</h3>

                <p className="text-sm text-gray-500">Current Bid</p>

                <p className="font-bold">${item.currentBid}</p>

                <Link href={`/auction/${item._id}`}>
                  <button className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
                    Place Bid
                  </button>
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </div>
  );
}
