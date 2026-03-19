"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function SeachInput1({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const updateSearch = useCallback(
    (value) => {
      const params = new URLSearchParams()
      if (value.trim()) {
        params.set("q", value.trim())
      }
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname)
    },
    [router, pathname]
  )

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateSearch(value)
    }, 300)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      updateSearch(query)
    }
  }

  return (
    <input
      ref={inputRef}
      value={query}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Search auctions..."
      className="outline-none w-full text-sm text-black"
    />
  )
}