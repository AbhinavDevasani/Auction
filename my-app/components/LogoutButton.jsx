"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/signin" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  return (
    <button
      className="w-full text-left px-3 py-2 text-[15px] text-gray-700 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
      onClick={handleLogout}
    >
      Log out
    </button>
  );
}
