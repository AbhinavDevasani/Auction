import connectDB from "@/lib/db";
import User from "@/models/User";
import Auction from "@/models/Auction";
import { verifyToken } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import "@/models/User"; // Ensure User model is loaded
import "@/models/Auction"; // Ensure Auction model is loaded

export default async function SavedItemsPage() {
  await connectDB();
  const decoded = await verifyToken();

  if (!decoded) {
    return (
      <div className="bg-gray-100 min-h-screen px-8 py-12 flex items-center justify-center text-[#1F2937]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
          <p className="text-gray-500">Please sign in to view your saved items.</p>
          <Link href="/signin">
            <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 cursor-pointer">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const user = await User.findById(decoded.userId || decoded.id || decoded._id).populate("savedItems").lean();
  const savedItems = user?.savedItems || [];
  const serializedSavedItems = JSON.parse(JSON.stringify(savedItems));

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Saved Items</h1>

        {serializedSavedItems.length === 0 ? (
          <p className="text-gray-500">You have not saved any items yet.</p>
        ) : (
          <StaggerGrid className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {serializedSavedItems.map((item, index) => (
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
                  transition duration-200 hover:bg-orange-600 hover:shadow-md cursor-pointer"
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