"use client"

import { useRef, useEffect } from "react"

export default function SeachInput1() {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <input
      ref={inputRef}
      placeholder="Search auctions..."
      className="outline-none w-full text-sm text-black"
    />
  )
}