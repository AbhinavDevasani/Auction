"use client"

import { useState, useEffect } from "react"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"
import { User, Mail, Phone, MapPin, Camera, X } from "lucide-react"
import EmailOTP from "@/components/EmailOTP"

export default function ProfilePage() {

  const [user, setUser] = useState({
    name: "Loading...",
    email: "Loading...",
    phone: "",
    location: "",
    avatar: ""
  })
  const [uploading, setUploading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [stats, setStats] = useState({
    wonAuctions: 0,
    activeBids: 0,
    createdAuctions: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [resWon, resBids, resListings] = await Promise.all([
          fetch("/api/user/wonauctions"),
          fetch("/api/auctions/activebids"),
          fetch("/api/user/listings")
        ]);

        const wonData = resWon.ok ? await resWon.json() : { auctions: [] };
        const bidsData = resBids.ok ? await resBids.json() : { auctions: [] };
        const listingsData = resListings.ok ? await resListings.json() : { listings: [] };

        setStats({
          wonAuctions: wonData.auctions?.length || 0,
          activeBids: bidsData.auctions?.length || 0,
          createdAuctions: listingsData.listings?.length || 0
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.user) {
          setUser(prev => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
            avatar: data.user.avatar || data.user.image || "",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload avatar");
      }

      setUser(prev => ({
        ...prev,
        avatar: data.user.avatar,
      }));
      
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
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
                  src={user.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name || "User Profile")}`}
                  className="w-24 h-24 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />

                <label className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 flex items-center justify-center rounded-full hover:bg-orange-700 transition cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarUpload} 
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/50 border-t-white animate-spin" />
                  ) : (
                    <Camera size={16}/>
                  )}
                </label>

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
                    {stats.wonAuctions}
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
                  <h3 className="text-gray-500 text-sm">
                    Active Bids
                  </h3>
                  <p className="text-2xl font-bold mt-2">
                    {stats.activeBids}
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
                  <h3 className="text-gray-500 text-sm">
                    Auctions Created
                  </h3>
                  <p className="text-2xl font-bold mt-2">
                    {stats.createdAuctions}
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

                  <div className="relative mt-1 flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={18}/>
                      <input
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowVerifyModal(true)}
                      className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-200 transition whitespace-nowrap"
                    >
                      Verify
                    </button>
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
        </StaggerGrid>

      </div>

      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full">
            <button 
              onClick={() => setShowVerifyModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-10 transition p-2 bg-gray-100/50 hover:bg-gray-200 rounded-full"
            >
              <X size={20} />
            </button>
            <EmailOTP 
              initialEmail={user.email} 
              onVerified={() => {
                setTimeout(() => setShowVerifyModal(false), 2000);
              }} 
            />
          </div>
        </div>
      )}

    </div>
  )
}