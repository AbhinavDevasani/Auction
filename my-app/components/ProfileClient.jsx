"use client";

import { useState } from "react";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { User as UserIcon, Mail, Camera, X } from "lucide-react";
import { toast } from "sonner";

export default function ProfileClient({ initialUser, initialStats }) {
  const [user, setUser] = useState(initialUser);
  const [uploading, setUploading] = useState(false);
  const [stats] = useState(initialStats);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

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

      toast.success("Avatar uploaded successfully");

      // Let other components know the balance/user info might have updated (e.g. avatar)
      window.dispatchEvent(new CustomEvent("balanceUpdated"));
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

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
                  alt="avatar"
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

              <form className="grid md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-sm text-gray-500">
                    Full Name
                  </label>
                  <div className="relative mt-1">
                    <UserIcon className="absolute left-3 top-3 text-gray-400" size={18}/>
                    <input
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-black"
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
                      className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-black"
                    />
                  </div>
                </div>
              </form>

              <div className="mt-6">
                <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition cursor-pointer">
                  Save Changes
                </button>
              </div>
            </div>
          </StaggerItem>
        </StaggerGrid>
      </div>


    </div>
  );
}
