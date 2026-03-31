"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

export default function SellPage() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    setError("");
  };

  const removeImage = (index) => {
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(images[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (!title || !startingPrice || !duration) {
        setError("Please fill all required fields");
        setLoading(false);
        return;
      }

      if (images.length === 0) {
        setError("Please upload at least one image");
        setLoading(false);
        return;
      }

      const endTime = new Date();
      endTime.setDate(endTime.getDate() + Number(duration));

      // Create FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("startingPrice", Number(startingPrice));
      formData.append("endTime", endTime.toISOString());

      // Append all image files
      images.forEach((img) => {
        formData.append("images", img.file);
      });

      const res = await fetch("/api/auctions/create", {
        method: "POST",
        body: formData,
        // Do NOT set Content-Type manually - browser will set it with boundary
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create auction");
      }

      setError("");
      alert("Auction created successfully!");
      setTitle("");
      setDescription("");
      setStartingPrice("");
      setDuration("");
      setImages([]);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-[#F9FAFB] min-h-screen text-[#1F2937]">
      <StaggerGrid className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <StaggerItem>
          <h1 className="text-3xl font-bold text-[#111827]">
            Sell an Item
          </h1>
          <p className="text-gray-500 mt-1">
            Add up to 5 images for better visibility
          </p>
        </StaggerItem>

        {/* Form */}
        <StaggerItem>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Item Images (max 5)
              </label>

              {images.length < 5 && (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 cursor-pointer hover:border-orange-400 transition mb-4">
                  <UploadCloud className="mb-2 text-gray-500" size={28} />
                  <p className="text-gray-500 text-sm">
                    Click to upload images
                  </p>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden border"
                  >
                    <Image
                      src={img.preview}
                      alt="preview"
                      width={200}
                      height={150}
                      className="object-cover w-full h-32"
                    />

                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Item Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. iPhone 13 Pro"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item..."
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="Starting Price ₹"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Auction Duration (days)"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || images.length === 0}
              className={`w-full font-semibold py-3 rounded-xl transition ${
                loading || images.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {loading ? "Uploading..." : "List Item"}
            </button>

          </div>
        </StaggerItem>
      </StaggerGrid>
    </div>
  );
}