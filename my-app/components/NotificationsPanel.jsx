"use client"

import { useState } from "react"
import { Bell, X } from "lucide-react"

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false)

  const notifications = [
    {
      id: 1,
      title: "You’ve been outbid",
      desc: "iPhone 13 Pro",
      time: "2m ago",
    },
    {
      id: 2,
      title: "Auction ending soon",
      desc: "Nike Air Jordan",
      time: "10m ago",
    },
  ]

  return (
    <>
      {/* Bell */}
      <button onClick={() => setOpen(true)} className="relative text-black cursor-pointer">
        <Bell className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-lg transform transition-transform duration-300 text-[#1F2937] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Notifications</h2>
          <button onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-3 bg-[#F9FAFB] h-full overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-gray-500">{n.desc}</p>
              <p className="text-xs text-gray-400 mt-1">{n.time}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}