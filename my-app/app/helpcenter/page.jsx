"use client"

import { useState } from "react"
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid"
import { HelpCircle, Gavel, CreditCard, Shield, MessageCircle } from "lucide-react"

const faq = [
  {
    question: "How do I place a bid?",
    answer:
      "Go to the auction page, select an item, enter your bid amount, and confirm your bid. If your bid is the highest, you will be marked as the current winner."
  },
  {
    question: "What happens if someone outbids me?",
    answer:
      "If another user places a higher bid, your status will change to 'Outbid'. You can place another bid to regain the leading position."
  },
  {
    question: "How do I track my bids?",
    answer:
      "You can view all auctions you have bid on inside the 'My Bids' page from the sidebar."
  },
  {
    question: "Are payments secure?",
    answer:
      "Yes. All payments are processed through secure and encrypted transactions to ensure safety."
  }
]

export default function HelpCenterPage() {
  const [open, setOpen] = useState(null)

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-12 text-[#1F2937]">

      <div className="max-w-7xl mx-auto">

        <StaggerGrid className="space-y-12">

          {/* PAGE TITLE */}
          <StaggerItem>
            <h1 className="text-3xl font-bold">
              Help Center
            </h1>
            <p className="text-gray-500 mt-2">
              Find answers to common questions about using BidHub.
            </p>
          </StaggerItem>

          {/* HELP CATEGORIES */}
          <StaggerItem>
            <StaggerGrid className="grid md:grid-cols-4 gap-6">

              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <Gavel className="mb-3 text-orange-600" size={28}/>
                  <h3 className="font-semibold">Bidding</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Learn how auctions and bidding work.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <CreditCard className="mb-3 text-orange-600" size={28}/>
                  <h3 className="font-semibold">Payments</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Understand how payments and transactions work.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <Shield className="mb-3 text-orange-600" size={28}/>
                  <h3 className="font-semibold">Security</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Learn how we keep your account safe.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-6 rounded-xl shadow
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <HelpCircle className="mb-3 text-orange-600" size={28}/>
                  <h3 className="font-semibold">General</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Basic questions about using the platform.
                  </p>
                </div>
              </StaggerItem>

            </StaggerGrid>
          </StaggerItem>

          {/* FAQ SECTION */}
          <StaggerItem>

            <div className="bg-white rounded-xl shadow p-6">

              <h2 className="text-xl font-semibold mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">

                {faq.map((item, index) => (

                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >

                    <button
                      onClick={() => setOpen(open === index ? null : index)}
                      className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                    >
                      <span className="font-medium">
                        {item.question}
                      </span>

                      <span className="text-gray-400">
                        {open === index ? "-" : "+"}
                      </span>

                    </button>

                    {open === index && (
                      <div className="px-4 pb-4 text-gray-500 text-sm">
                        {item.answer}
                      </div>
                    )}

                  </div>

                ))}

              </div>

            </div>

          </StaggerItem>

          {/* CONTACT SUPPORT */}
          <StaggerItem>

            <div className="bg-white rounded-xl shadow p-8 text-center
            transition-all duration-300 hover:shadow-xl">

              <MessageCircle className="mx-auto mb-4 text-orange-600" size={36}/>

              <h2 className="text-xl font-semibold mb-2">
                Still need help?
              </h2>

              <p className="text-gray-500 mb-6">
                Our support team is here to help you with any issues.
              </p>

              <button className="bg-orange-600 text-white px-6 py-3 rounded-lg
              transition hover:bg-orange-700 hover:shadow-lg">
                Contact Support
              </button>

            </div>

          </StaggerItem>

        </StaggerGrid>

      </div>

    </div>
  )
}