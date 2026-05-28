import connectDB from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { verifyToken } from "@/lib/auth";
import WalletClient from "@/components/WalletClient";
import Link from "next/link";
import "@/models/User"; // Ensure User model is loaded
import "@/models/Transaction"; // Ensure Transaction model is loaded

export default async function WalletPage() {
  await connectDB();
  const decoded = await verifyToken();

  if (!decoded) {
    return (
      <div className="bg-gray-100 min-h-screen px-8 py-12 flex items-center justify-center text-[#1F2937]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
          <p className="text-gray-500">Please sign in to view your wallet.</p>
          <Link href="/signin">
            <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 cursor-pointer">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const user = await User.findById(decoded.userId || decoded.id || decoded._id).lean();
  const transactions = await Transaction.find({ user: user?._id })
    .sort({ createdAt: -1 })
    .lean();

  const serializedTransactions = JSON.parse(JSON.stringify(transactions));
  const balance = user?.balance || 0;

  return (
    <WalletClient
      initialBalance={balance}
      initialTransactions={serializedTransactions}
    />
  );
}