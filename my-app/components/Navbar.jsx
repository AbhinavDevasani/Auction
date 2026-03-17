"use client";

import {
  LayoutDashboard,
  Home,
  RotateCcw,
  Bookmark,
  Search,
  Headphones,
  Info,
  Settings,PlusCircle
} from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Sidebar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menu = [
    { icon: Home, label: "Home", href: "/auction" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },

    { section: "Auction" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: RotateCcw, label: "Active Bids", href: "/activebids" },
    { icon: Bookmark, label: "Saved", href: "/saved" },
    { icon: PlusCircle, label: "Sell Item", href: "/sell" },
    { section: "Auction finder" },
    { icon: Info, label: "About Us", href: "/aboutus" },
    { icon: Headphones, label: "Help Center", href: "/helpcenter" },
  ];

  return (
    <div className="w-[20vw]  bg-white border-r flex flex-col justify-between p-4 min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-gavel-icon lucide-gavel"
            >
              <path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381" />
              <path d="m16 16 6-6" />
              <path d="m21.5 10.5-8-8" />
              <path d="m8 8 6-6" />
              <path d="m8.5 7.5 8 8" />
            </svg>
          </div>
          <p className="text-[25px] font-semibold text-black">BidHub</p>
        </div>
        <div className="space-y-2">
          {menu.map((item, index) => {
            if (item.section) {
              return (
                <p key={index} className="text-xs text-gray-400 mt-4 mb-2">
                  {item.section}
                </p>
              );
            }

            const Icon = item.icon;

            const isActive = pathname === item.href;

            return (
              <Link href={item.href || "#"} key={index}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all hover:scale-105 font-bold
                ${
                  isActive
                    ? "bg-gray-100 text-black font-medium"
                    : "text-gray-500"
                }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Profile Section */}
      <div className="pt-4 mt-4 border-t border-gray-100 relative">
        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute bottom-[110%] left-4 w-50 bg-white border border-gray-100 rounded-[10px] shadow-lg py-1 z-50">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors"
            >
              My Dashboard
            </Link>
            <Link
              href="/profile"
              className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Profile Settings
            </Link>
            <Link
              href="/activebids"
              className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors"
            >
              My Bids
            </Link>
            <Link
              href="/wallet"
              className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Wallet
            </Link>
            <div className="border-t border-gray-100 my-1"></div>

            <div className="px-1.5 mb-1 mt-1">
              <button className="w-full text-left px-3 py-2 text-[15px] text-gray-700 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors">
                Log out
              </button>
            </div>
          </div>
        )}

        <div
          className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img
                src="https://ui-avatars.com/api/?name=User+Profile&background=random"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                Jane Doe
              </p>
              <p className="text-xs text-gray-500 font-medium">
                $542.00 Balance
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
