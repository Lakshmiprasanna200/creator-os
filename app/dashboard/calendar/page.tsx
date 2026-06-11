"use client"

import { useState, useEffect } from "react"

interface CalendarEntry {
  id: string
  scheduledAt: string
  status: string
  platform: string
  contentPiece: {
    body: string
    type: string
  }
}

const PLATFORMS = ["youtube", "instagram", "linkedin", "twitter"]
const PLATFORM_COLORS: Record<string, string> = {
  youtube: "bg-red-500",
  instagram: "bg-pink-500",
  linkedin: "bg-blue-500",
  twitter: "bg-sky-500",
}

export default function CalendarPage() {
  const [entries, setEntries] = useState<CalendarEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    const res = await fetch("/api/calendar")
    const data = await res.json()
    setEntries(data)
    setLoading(false)
  }

  // Get days in current month
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  function getEntriesForDay(day: number) {
    return entries.filter(entry => {
      const date = new Date(entry.scheduledAt)
      return date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">📅 Content Calendar</h1>
      <p className="text-gray-400 mb-8">Plan and schedule your content</p>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
        >
          ← Prev
        </button>
        <h2 className="text-white font-semibold text-xl">{monthName}</h2>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
        >
          Next →
        </button>
      </div>

      {/* Platform Legend */}
      <div className="flex gap-4 mb-6">
        {PLATFORMS.map(platform => (
          <div key={platform} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${PLATFORM_COLORS[platform]}`} />
            <span className="text-gray-400 text-sm capitalize">{platform}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-800">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-3 text-center text-gray-400 text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for first week */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 border-b border-r border-gray-800" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayEntries = getEntriesForDay(day)
            const isToday = new Date().getDate() === day &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year

            return (
              <div
                key={day}
                className={`h-24 border-b border-r border-gray-800 p-2 ${
                  isToday ? "bg-purple-900/20" : ""
                }`}
              >
                <span className={`text-sm font-medium ${
                  isToday ? "text-purple-400" : "text-gray-400"
                }`}>
                  {day}
                </span>
                <div className="mt-1 space-y-1">
                  {dayEntries.map(entry => (
                    <div
                      key={entry.id}
                      className={`text-xs px-1.5 py-0.5 rounded text-white truncate ${
                        PLATFORM_COLORS[entry.platform]
                      }`}
                    >
                      {entry.platform}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {loading && <p className="text-gray-400 mt-4">Loading calendar...</p>}

      {!loading && entries.length === 0 && (
        <div className="text-center py-8 mt-4">
          <p className="text-gray-400">No scheduled content yet. Schedule from your scripts!</p>
        </div>
      )}
    </div>
  )
}