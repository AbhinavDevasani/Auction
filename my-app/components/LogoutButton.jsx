"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const removeToken = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      router.push("/signin");
      router.refresh(); 
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <button
      className="w-full text-left px-3 py-2 text-[15px] text-gray-700 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
      onClick={removeToken}
    >
      Log out
    </button>
  );
}
