import Image from "next/image"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"
import Link from "next/link"
export default function AboutPage() {
  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">

      <div className="max-w-7xl mx-auto">

        <StaggerGrid className="space-y-16">

          {/* HERO */}
          <StaggerItem>
            <div className="grid md:grid-cols-2 gap-12 items-center">

              <div>
                <h1 className="text-4xl font-bold mb-6">
                  About Our Auction Platform
                </h1>

                <p className="text-gray-600 mb-4">
                  We are building a modern digital auction marketplace where
                  users can discover rare items, place bids in real time, and
                  connect with collectors around the world.
                </p>

                <p className="text-gray-600">
                  Our mission is to make auctions simple, transparent, and
                  accessible through a powerful and beautifully designed
                  platform.
                </p>
              </div>

              <Image
                src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b"
                width={600}
                height={400}
                alt="Auction platform"
                className="rounded-2xl shadow-lg object-cover"
              />

            </div>
          </StaggerItem>

          {/* FEATURES */}
          <StaggerItem>

            <div>

              <h2 className="text-2xl font-semibold mb-8">
                Why Choose Us
              </h2>

              <StaggerGrid className="grid md:grid-cols-3 gap-6">

                <StaggerItem>
                  <div className="bg-white rounded-xl shadow p-6 
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                    <h3 className="font-semibold mb-2">
                      Live Bidding
                    </h3>

                    <p className="text-gray-600 text-sm">
                      Experience real-time auctions with instant updates
                      and seamless bidding.
                    </p>

                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="bg-white rounded-xl shadow p-6 
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                    <h3 className="font-semibold mb-2">
                      Secure Transactions
                    </h3>

                    <p className="text-gray-600 text-sm">
                      All transactions are encrypted and protected
                      for maximum security.
                    </p>

                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="bg-white rounded-xl shadow p-6 
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                    <h3 className="font-semibold mb-2">
                      Global Marketplace
                    </h3>

                    <p className="text-gray-600 text-sm">
                      Connect with buyers and sellers worldwide
                      through our auction platform.
                    </p>

                  </div>
                </StaggerItem>

              </StaggerGrid>

            </div>

          </StaggerItem>
          {/* CTA */}
          <StaggerItem>

            <div className="bg-white rounded-2xl shadow p-10 text-center
            transition-all duration-300 hover:shadow-xl">

              <h2 className="text-2xl font-semibold mb-4">
                Join Our Marketplace
              </h2>

              <p className="text-gray-600 mb-6">
                Start exploring auctions and discover unique items today.
              </p>

              <Link className="bg-orange-600 text-white px-6 py-3 rounded-lg
              transition hover:bg-orange-700 hover:shadow-lg" href={'/search'}>
                Start Bidding
              </Link>

            </div>

          </StaggerItem>

        </StaggerGrid>

      </div>

    </div>
  )
}