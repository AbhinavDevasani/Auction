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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/auctions?q=${query}&page=${page}&limit=8&status=${statusFilter}`);
        const data = await res.json();
        setResults(data.auctions || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchResults();
  }, [query, page, statusFilter]);

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

          {/* SEARCH BAR & FILTERS */}
          <StaggerItem>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-white rounded-xl shadow px-4 py-3 flex items-center gap-3">
                <Search size={20} className="text-gray-400" />
                <SeachInput1 initialQuery={query} />
              </div>
              <div className="bg-white rounded-xl shadow px-4 py-3 flex items-center">
                <span className="text-gray-500 mr-3 text-sm font-medium">Status:</span>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-[#1F2937]"
                >
                  <option value="all">All</option>
                  <option value="active">Active Bids</option>
                  <option value="ended">Ended Bids</option>
                </select>
              </div>
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

                      <div className="flex justify-between items-start mt-3">
                        <h3 className="font-semibold line-clamp-1 flex-1 pr-2">{item.title}</h3>
                      </div>
                      <p className="text-gray-500 text-sm mt-2">Current Bid</p>

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

          {/* PAGINATION */}
          {totalPages > 1 && (
            <StaggerItem>
              <div className="flex justify-center items-center mt-2 gap-4 pb-12">
                <button 
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white shadow text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 font-medium">
                  Page {page} of {totalPages}
                </span>
                <button 
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-white shadow text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
            </StaggerItem>
          )}
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
