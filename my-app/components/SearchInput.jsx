"use client"

import { useRouter } from "next/navigation"

export default function SearchInput() {
  const router = useRouter()

  const handleFocus = () => {
    router.push("/search")
  }

  return (
    <input
      onFocus={handleFocus}
      placeholder="Search auctions, items..."
      className="outline-none w-full text-black"
      readOnly
    />
  )
}