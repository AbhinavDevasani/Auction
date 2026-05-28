import Sidebar from "@/components/Navbar"
export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 w-full">{children}</main>
    </div>
  )
}