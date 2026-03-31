"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

export default function SavedItemsPage() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const res = await fetch("/api/user/saved");
        const data = await res.json();
        console.log(data)
        if (res.ok) {
          setSavedItems(data.savedItems || []);
        }
      } catch (error) {
        console.error("Failed to fetch saved items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItems();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen px-8 py-12 flex justify-center items-center">
        <p>Loading saved items...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Saved Items</h1>

        {savedItems.length === 0 ? (
          <p className="text-gray-500">You have not saved any items yet.</p>
        ) : (
          <StaggerGrid className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedItems.map((item, index) => (
              <StaggerItem key={item._id || index}>
                <div
                  className="bg-white rounded-xl shadow p-4 
                transition-all duration-300 
                hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]"
                >
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      width={400}
                      height={250}
                      alt={item.title}
                      className="object-cover h-40 w-full transition duration-300 hover:scale-105"
                    />
                  </div>

                  <h3 className="mt-3 font-semibold">{item.title}</h3>

                  <p className="text-gray-500 text-sm">Current Bid</p>

                  <p className="font-bold">₹{item.currentBid || item.startingPrice}</p>

                  <Link href={`/auction/${item._id}`}>
                    <button
                      className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg
                  transition duration-200 hover:bg-orange-600 hover:shadow-md"
                    >
                      View Auction
                    </button>
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </div>
  );
}