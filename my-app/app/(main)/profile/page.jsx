"use client"

import { useState } from "react"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"
import { User, Mail, Phone, MapPin, Camera } from "lucide-react"

export default function ProfilePage() {

  const [user, setUser] = useState({
    name: "Abhinav",
    email: "abhinav@example.com",
    phone: "+91 98765 43210",
    location: "India"
  })

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">

      <div className="max-w-7xl mx-auto">

        <StaggerGrid className="space-y-10">

          {/* PAGE TITLE */}
          <StaggerItem>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-gray-500 mt-2">
              Manage your account information and profile settings.
            </p>
          </StaggerItem>

          {/* PROFILE HEADER */}
          <StaggerItem>

            <div className="bg-white rounded-xl shadow p-8 flex items-center gap-6">

              <div className="relative">

                <img
                  src="https://i.pravatar.cc/120"
                  className="w-24 h-24 rounded-full object-cover"
                />

                <button className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700">
                  <Camera size={16}/>
                </button>

              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  {user.name}
                </h2>

                <p className="text-gray-500">
                  {user.email}
                </p>
              </div>

            </div>

          </StaggerItem>

          {/* STATS */}
          <StaggerItem>

            <StaggerGrid className="grid md:grid-cols-3 gap-6">

              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
                  <h3 className="text-gray-500 text-sm">
                    Auctions Won
                  </h3>
                  <p className="text-2xl font-bold mt-2">
                    12
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
                  <h3 className="text-gray-500 text-sm">
                    Active Bids
                  </h3>
                  <p className="text-2xl font-bold mt-2">
                    5
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
                  <h3 className="text-gray-500 text-sm">
                    Auctions Created
                  </h3>
                  <p className="text-2xl font-bold mt-2">
                    3
                  </p>
                </div>
              </StaggerItem>

            </StaggerGrid>

          </StaggerItem>

          {/* EDIT PROFILE */}
          <StaggerItem>

            <div className="bg-white rounded-xl shadow p-8">

              <h2 className="text-xl font-semibold mb-6">
                Edit Profile
              </h2>

              <form className="grid md:grid-cols-2 gap-6">

                <div>
                  <label className="text-sm text-gray-500">
                    Full Name
                  </label>

                  <div className="relative mt-1">
                    <User className="absolute left-3 top-3 text-gray-400" size={18}/>
                    <input
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    Email
                  </label>

                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18}/>
                    <input
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    Phone
                  </label>

                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={18}/>
                    <input
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    Location
                  </label>

                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18}/>
                    <input
                      name="location"
                      value={user.location}
                      onChange={handleChange}
                      className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

              </form>

              <div className="mt-6">

                <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition">
                  Save Changes
                </button>

              </div>

            </div>

          </StaggerItem>

          {/* RECENT ACTIVITY */}
          <StaggerItem>

            <div className="bg-white rounded-xl shadow p-8">

              <h2 className="text-xl font-semibold mb-6">
                Recent Activity
              </h2>

              <div className="space-y-4 text-sm text-gray-600">

                <div className="border-b pb-2">
                  Placed a bid on <span className="font-medium">Vintage Camera</span>
                </div>

                <div className="border-b pb-2">
                  Won auction for <span className="font-medium">Gaming Keyboard</span>
                </div>

                <div className="border-b pb-2">
                  Created auction <span className="font-medium">Apple Watch</span>
                </div>

              </div>

            </div>

          </StaggerItem>

        </StaggerGrid>

      </div>

    </div>
  )
}