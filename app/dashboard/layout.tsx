"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  Lightbulb,
  FileText,
  RefreshCw,
  Calendar,
  BarChart2,
  Target,
  LogOut,
  Search,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: Lightbulb, label: "Dashboard" },
  { href: "/dashboard/ideas", icon: Lightbulb, label: "Idea Engine" },
  { href: "/dashboard/scripts", icon: FileText, label: "Script Writer" },
  { href: "/dashboard/repurpose", icon: RefreshCw, label: "Repurpose" },
  { href: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
  { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/dashboard/goals", icon: Target, label: "Goals" },
  { href: "/dashboard/competitor", icon: Search, label: "Competitor" },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession()

  return (
    <div className="flex h-screen bg-gray-950 text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">

        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">
            Creator <span className="text-purple-500">OS</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Your AI content workspace</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom User Section */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
                {session?.user?.name?.[0] ?? "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name ?? "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {session?.user?.email ?? "Creator"}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>

    </div>
  )
}