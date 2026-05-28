"use client";

import {
  LayoutDashboard,
  Home,
  RotateCcw,
  Bookmark,
  Search,
  Headphones,
  Info,
  List,
  Settings,
  PlusCircle,
  Sun,
  Moon,
  Monitor,
  ChevronRight,
  ChevronLeft,
  Menu,
  X
} from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import { motion, AnimatePresence } from "framer-motion";
const inter = Inter({ subsets: ["latin"] });

export default function Sidebar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownView, setDropdownView] = useState("main");
  const [theme, setTheme] = useState("system");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    setDropdownView("main");
  }, [pathname]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    }
    fetchUser();

    const handleBalanceEvent = (e) => {
      if (e.detail && e.detail.newBalance !== undefined) {
        setUser((prev) => prev ? { ...prev, balance: e.detail.newBalance } : prev);
      } else {
        fetchUser();
      }
    };

    window.addEventListener("balanceUpdated", handleBalanceEvent);
    return () => window.removeEventListener("balanceUpdated", handleBalanceEvent);
  }, []);

  useEffect(() => {
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme !== "light" && savedTheme !== "dark") {
      savedTheme = "light";
      localStorage.setItem("theme", "light");
    }
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
    setDropdownView("main");
  };

  const menu = [
    { icon: Home, label: "Home", href: "/auction" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },

    { section: "Auction" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: RotateCcw, label: "Active Bids", href: "/activebids" },
    { icon: Bookmark, label: "Saved", href: "/saved" },
    { icon: PlusCircle, label: "Sell Item", href: "/sell" },
    { label: "My Listings", href: "/mylistings", icon: List },

    { section: "Auction finder" },
    { icon: Info, label: "About Us", href: "/aboutus" },
    { icon: Headphones, label: "Help Center", href: "/helpcenter" },
  ];

  return (
    <>
      {/* Mobile Header Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-40 w-full h-16 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
          <Link href="/auction" className="flex items-center gap-2">
            <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-gavel"
              >
                <path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381" />
                <path d="m16 16 6-6" />
                <path d="m21.5 10.5-8-8" />
                <path d="m8 8 6-6" />
                <path d="m8.5 7.5 8 8" />
              </svg>
            </div>
            <span className="text-xl font-bold text-black">BidHub</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/wallet" className="text-xs font-semibold bg-gray-100 px-2.5 py-1.5 rounded-lg text-gray-700 hover:bg-gray-200 transition">
            ₹{user?.balance !== undefined ? user.balance : "0.00"}
          </Link>
          <Link href="/profile" className="w-8 h-8 rounded-full overflow-hidden border">
            <img
              src={user?.avatar || user?.image || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || "User Profile")}`}
              alt="Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer (Left Sidebar on Mobile) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-[80vw] max-w-[300px] bg-white border-r z-50 md:hidden flex flex-col justify-between p-4 shadow-xl overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-gavel"
                      >
                        <path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381" />
                        <path d="m16 16 6-6" />
                        <path d="m21.5 10.5-8-8" />
                        <path d="m8 8 6-6" />
                        <path d="m8.5 7.5 8 8" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-black">BidHub</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
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
                  <div className="absolute bottom-[110%] left-0 right-0 bg-white border border-gray-100 rounded-[10px] shadow-lg py-1 z-50 overflow-hidden">
                    {dropdownView === "main" ? (
                      <>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                          My Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                          Profile Settings
                        </Link>
                        <Link
                          href="/activebids"
                          className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                          My Bids
                        </Link>
                        <Link
                          href="/wallet"
                          className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                          Wallet
                        </Link>

                        <div className="border-t border-gray-100 my-1"></div>

                        <div
                          onClick={() => setDropdownView("appearance")}
                          className="flex items-center justify-between px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer select-none font-medium"
                        >
                          <div className="flex items-center gap-2">
                            {theme === "dark" ? <Moon size={16} className="text-gray-500" /> : <Sun size={16} className="text-gray-500" />}
                            <span>Appearance</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <span>{theme === "dark" ? "Dark" : "Light"}</span>
                            <ChevronRight size={14} />
                          </div>
                        </div>

                        <div className="border-t border-gray-100 my-1"></div>

                        <div className="px-1.5 mb-1 mt-1">
                          <LogoutButton/>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          onClick={() => setDropdownView("main")}
                          className="flex items-center gap-2 px-4 py-2.5 text-[15px] font-bold text-gray-900 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <ChevronLeft size={16} />
                          <span>Appearance</span>
                        </div>

                        <div
                          onClick={() => changeTheme("light")}
                          className="flex items-center justify-between px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors font-medium"
                        >
                          <div className="flex items-center gap-3">
                            <Sun size={16} className="text-gray-500" />
                            <span>Light</span>
                          </div>
                          <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                            {theme === "light" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                            )}
                          </div>
                        </div>

                        <div
                          onClick={() => changeTheme("dark")}
                          className="flex items-center justify-between px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors font-medium"
                        >
                          <div className="flex items-center gap-3">
                            <Moon size={16} className="text-gray-500" />
                            <span>Dark</span>
                          </div>
                          <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                            {theme === "dark" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                            )}
                          </div>
                        </div>

                      </>
                    )}
                  </div>
                )}

                <div
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={user?.avatar || user?.image || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || "User Profile")}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                        {user?.name || "Loading..."}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        ₹{user?.balance !== undefined ? user.balance : "0.00"} Balance
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (hidden on mobile, flex on md and up) */}
      <div className="hidden md:flex md:w-[20vw] md:min-w-[240px] md:max-w-[300px] shrink-0 sticky top-0 h-screen overflow-y-auto bg-white flex flex-col justify-between p-4">
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
            <div className="absolute bottom-[110%] left-4 w-64 bg-white border border-gray-100 rounded-[10px] shadow-lg py-1 z-50 overflow-hidden">
              {dropdownView === "main" ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    My Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/activebids"
                    className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    My Bids
                  </Link>
                  <Link
                    href="/wallet"
                    className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Wallet
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <div
                    onClick={() => setDropdownView("appearance")}
                    className="flex items-center justify-between px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer select-none font-medium"
                  >
                    <div className="flex items-center gap-2">
                      {theme === "dark" ? <Moon size={16} className="text-gray-500" /> : <Sun size={16} className="text-gray-500" />}
                      <span>Appearance</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>{theme === "dark" ? "Dark" : "Light"}</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-1"></div>

                  <div className="px-1.5 mb-1 mt-1">
                    <LogoutButton/>
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => setDropdownView("main")}
                    className="flex items-center gap-2 px-4 py-2.5 text-[15px] font-bold text-gray-900 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <ChevronLeft size={16} />
                    <span>Appearance</span>
                  </div>

                  <div
                    onClick={() => changeTheme("light")}
                    className="flex items-center justify-between px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <Sun size={16} className="text-gray-500" />
                      <span>Light</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                      {theme === "light" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => changeTheme("dark")}
                    className="flex items-center justify-between px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <Moon size={16} className="text-gray-500" />
                      <span>Dark</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                      {theme === "dark" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                      )}
                    </div>
                  </div>

                </>
              )}
            </div>
          )}

          <div
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src={user?.avatar || user?.image || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || "User Profile")}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                  {user?.name || "Loading..."}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  ₹{user?.balance !== undefined ? user.balance : "0.00"} Balance
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
