"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import SearchInput from "./SearchInput";
import NotificationsPanel from "./NotificationsPanel";

export default function DashboardHeaderClient({ initialUser }) {
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    const handleBalanceEvent = async (e) => {
      if (e.detail && e.detail.newBalance !== undefined) {
        setUser((prev) => prev ? { ...prev, balance: e.detail.newBalance } : prev);
      } else {
        try {
          const res = await fetch("/api/user");
          const data = await res.json();
          if (res.ok && data.user) {
            setUser(data.user);
          }
        } catch (err) {
          console.error("Failed to fetch user balance", err);
        }
      }
    };

    window.addEventListener("balanceUpdated", handleBalanceEvent);
    return () => window.removeEventListener("balanceUpdated", handleBalanceEvent);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center bg-white rounded-xl shadow px-4 py-2 w-full sm:max-w-[420px]">
        <Search className="text-gray-400 mr-2 shrink-0" size={18} />
        <SearchInput />
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
        <div className="flex items-center gap-3">
          <NotificationsPanel />

          <Link href={"/wallet"}>
            <div className="bg-white px-4 py-2 rounded-xl shadow text-sm font-medium text-[#1F2937] cursor-pointer hover:bg-gray-50 transition whitespace-nowrap">
              Wallet: ₹{user?.balance !== undefined ? user.balance : "0"}
            </div>
          </Link>
        </div>

        <Link href={"/profile"} className="shrink-0">
          <img
            src={user?.avatar || user?.image || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || "User Profile")}`}
            width={36}
            height={36}
            alt="User"
            className="rounded-full cursor-pointer object-cover w-9 h-9"
            referrerPolicy="no-referrer"
          />
        </Link>
      </div>
    </div>
  );
}
