"use client"

import { useState } from "react"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"

export default function WalletPage() {
  const [balance, setBalance] = useState(1240)
  const [amount, setAmount] = useState("")

  const [transactions, setTransactions] = useState([
    { type: "Deposit", amount: 500, date: "Today" },
    { type: "Auction Win", amount: -320, date: "Yesterday" },
    { type: "Refund", amount: 120, date: "2 days ago" }
  ])

  const handleAddMoney = () => {
    const value = Number(amount)
    if (!value || value <= 0) return

    setBalance((prev) => prev + value)

    setTransactions((prev) => [
      { type: "Deposit", amount: value, date: "Just now" },
      ...prev
    ])

    setAmount("")
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8 text-black">
      <StaggerGrid className="max-w-5xl mx-auto space-y-8">

        {/* 💰 WALLET CARD */}
        <StaggerItem>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Available Balance</p>
            <h1 className="text-3xl font-bold">${balance}</h1>

            <div className="flex gap-3 mt-4">
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border rounded-lg px-3 py-2 w-40 outline-none focus:ring-2 focus:ring-orange-400"
              />

              <button
                onClick={handleAddMoney}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Add Money
              </button>
            </div>
          </div>
        </StaggerItem>

        {/* 📊 QUICK STATS */}
        <StaggerItem>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-gray-500 text-sm">Total Deposits</p>
              <p className="font-bold text-lg">$1,620</p>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-gray-500 text-sm">Total Spent</p>
              <p className="font-bold text-lg">$380</p>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-gray-500 text-sm">Active Bids</p>
              <p className="font-bold text-lg">3</p>
            </div>

          </div>
        </StaggerItem>

        {/* 📜 TRANSACTIONS */}
        <StaggerItem>
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-semibold mb-4 text-lg">
              Transaction History
            </h2>

            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-medium">{tx.type}</p>
                    <p className="text-sm text-gray-500">{tx.date}</p>
                  </div>

                  <span
                    className={`font-semibold ${
                      tx.amount > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : "-"}${Math.abs(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>

      </StaggerGrid>
    </div>
  )
}