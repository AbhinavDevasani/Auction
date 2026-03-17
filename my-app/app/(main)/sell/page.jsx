"use client"

import { useState } from "react"
import Image from "next/image"
import { UploadCloud, X } from "lucide-react"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"

export default function SellPage() {
  const [images, setImages] = useState([])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)

    if (images.length + files.length > 5) {
      alert("You can upload a maximum of 5 images.")
      return
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="p-6 md:p-10 bg-[#F9FAFB] min-h-screen text-[#1F2937]">
      <StaggerGrid className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <StaggerItem>
          <h1 className="text-3xl font-bold text-[#111827]">Sell an Item</h1>
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

              {/* Upload Box */}
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

              {/* Preview Grid */}
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

                    {/* Remove Button */}
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
                placeholder="Describe your item..."
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Starting Price ₹"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
              <input
                type="number"
                placeholder="Auction Duration (days)"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            {/* Submit */}
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition">
              List Item
            </button>

          </div>
        </StaggerItem>

      </StaggerGrid>
    </div>
  )
}