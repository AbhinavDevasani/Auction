"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import SeachInput1 from "@/components/SeachInput1";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/auctions?q=${query}`);
        console.log(res);
        const data = await res.json();
        console.log(data);
        setResults(data.auctions);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">
      <div className="max-w-7xl mx-auto">
        <StaggerGrid className="space-y-10">
          {/* TITLE */}
          <StaggerItem>
            <div>
              <h1 className="text-3xl font-bold mb-2">Search Auctions</h1>
              <p className="text-gray-500">Find items you want to bid on.</p>
            </div>
          </StaggerItem>

          {/* SEARCH BAR */}
          <StaggerItem>
            <div className="bg-white rounded-xl shadow px-4 py-3 flex items-center gap-3">
              <Search size={20} className="text-gray-400" />
              <SeachInput1 initialQuery={query} />
            </div>
          </StaggerItem>

          {/* RESULTS */}
          <StaggerItem>
            {loading ? (
              <p>Loading...</p>
            ) : results.length === 0 ? (
              <p className="text-gray-500">No results found</p>
            ) : (
              <StaggerGrid className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map((item) => (
                  <StaggerItem key={item._id}>
                    <div
                      className="bg-white rounded-xl shadow p-4
                      transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]"
                    >
                      <div className="overflow-hidden rounded-lg">
                        <Image
                          src={item.image || "/placeholder.jpg"}
                          width={400}
                          height={250}
                          alt={item.title}
                          className="object-cover h-40 w-full"
                        />
                      </div>

                      <h3 className="mt-3 font-semibold">{item.title}</h3>

                      <p className="text-gray-500 text-sm">Current Bid</p>

                      <p className="font-bold">
                        ₹{item.currentBid || item.startingPrice}
                      </p>

                      <Link href={`/auction/${item._id}`}>
                        <button className="mt-3 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
                          View Auction
                        </button>
                      </Link>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            )}
          </StaggerItem>
        </StaggerGrid>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-10 font-bold">Loading search...</p>}>
      <SearchContent />
    </Suspense>
  );
}
