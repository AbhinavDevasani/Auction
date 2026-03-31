"use client"

import { useState, useEffect } from "react"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (res.ok && data.user) {
        setBalance(data.user.balance || 0);
      }
    };

    const fetchTransactions = async () => {
      const res = await fetch("/api/user/transactions");
      const data = await res.json();
      if (res.ok && data.transactions) {
        setTransactions(data.transactions);
      }
    }

    fetchUser();
    fetchTransactions();
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddMoney = async () => {
    const value = Number(amount)
    if (!value || value <= 0) return

    setLoading(true);

    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Razorpay SDK fail to load!");
        setLoading(false);
        return;
      }

      // Step 1: Create Order securely
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: value }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error);

      // Step 2: Open Razorpay checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "BidHub Auctions",
        description: "Add Funds to Wallet",
        order_id: orderData.order.id,
        handler: async function (response) {
          // Step 3: Verify the cryptographic transaction backend natively!
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: value
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            setBalance(verifyData.balance);
            setTransactions((prev) => [
              { type: "Deposit via Razorpay", amount: value, createdAt: new Date().toISOString() },
              ...prev
            ]);
            setAmount("");
            alert("Payment Successful!");
          } else {
            alert(verifyData.error || "Payment verification failed");
          }
        },
        theme: {
          color: "#ea580c" // Tailwind orange-600
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
         alert("Payment failed: " + response.error.description);
      });
      rzp1.open();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8 text-black">
      <StaggerGrid className="max-w-5xl mx-auto space-y-8">

        {/* 💰 WALLET CARD */}
        <StaggerItem>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Available Balance</p>
            <h1 className="text-3xl font-bold">₹{balance}</h1>

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
                disabled={loading}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Add Money"}
              </button>
            </div>
          </div>
        </StaggerItem>

        {/* 📊 QUICK STATS */}
        <StaggerItem>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-gray-500 text-sm">Total Deposits</p>
              <p className="font-bold text-lg">₹1,620</p>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-gray-500 text-sm">Total Spent</p>
              <p className="font-bold text-lg">₹380</p>
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
                    <p className="text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute:'2-digit'
                      })}
                    </p>
                  </div>

                  <span
                    className={`font-semibold ${
                      tx.amount > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : "-"}₹{Math.abs(tx.amount)}
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