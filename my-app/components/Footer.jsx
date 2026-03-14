import Link from "next/link"
import { Gavel, Twitter, Github, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t">

      <div className="max-w-7xl mx-auto px-8 py-12">

        <div className="grid md:grid-cols-4 gap-8">

          {/* Logo Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-500 w-9 h-9 rounded-full flex items-center justify-center text-white">
                <Gavel size={16}/>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                BidHub
              </span>
            </div>

            <p className="text-sm text-gray-500">
              BidHub is a modern auction marketplace where users can
              discover unique items and participate in live bidding.
            </p>
          </div>

          {/* Marketplace Links */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">
              Marketplace
            </h3>

            <div className="space-y-2 text-sm text-gray-500">

              <Link href="/auction" className="block hover:text-black">
                Browse Auctions
              </Link>

              <Link href="/activebids" className="block hover:text-black">
                Active Bids
              </Link>

              <Link href="/saved" className="block hover:text-black">
                Saved Items
              </Link>

              <Link href="/search" className="block hover:text-black">
                Search Auctions
              </Link>

            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">
              Company
            </h3>

            <div className="space-y-2 text-sm text-gray-500">

              <Link href="/aboutus" className="block hover:text-black">
                About Us
              </Link>

              <Link href="/helpcenter" className="block hover:text-black">
                Help Center
              </Link>

              <Link href="#" className="block hover:text-black">
                Privacy Policy
              </Link>

              <Link href="#" className="block hover:text-black">
                Terms of Service
              </Link>

            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">
              Contact
            </h3>

            <p className="text-sm text-gray-500 mb-3">
              Need help? Reach out to our support team.
            </p>

            <div className="flex gap-4 text-gray-500">

              <Mail className="cursor-pointer hover:text-black"/>
              <Twitter className="cursor-pointer hover:text-black"/>
              <Github className="cursor-pointer hover:text-black"/>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t mt-10 pt-6 text-sm text-gray-500 flex justify-between flex-wrap gap-4">

          <p>© {new Date().getFullYear()} BidHub. All rights reserved.</p>

          <div className="flex gap-6">

            <Link href="#" className="hover:text-black">
              Privacy
            </Link>

            <Link href="#" className="hover:text-black">
              Terms
            </Link>

          </div>

        </div>

      </div>

    </footer>
  )
}