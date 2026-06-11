"use client"

import { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"

interface Stats {
  totalIdeas: number
  savedIdeas: number
  totalScripts: number
  totalGoals: number
}

interface YouTubeStats {
  subscribers: number
  totalViews: number
  totalVideos: number
  channelTitle: string
  videos: any[]
  monthlyRevenue: number
}

interface Recommendation {
  title: string
  reason: string
  idealLength: string
  format: string
  estimatedViews: string
  urgency: string
}

interface Insights {
  bestTitlePattern: string
  bestVideoLength: string
  hotTopics: string[]
  avoid: string[]
}

const COLORS = ["#9333ea", "#ec4899", "#3b82f6", "#06b6d4", "#f59e0b"]

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    totalIdeas: 0,
    savedIdeas: 0,
    totalScripts: 0,
    totalGoals: 0,
  })
  const [loading, setLoading] = useState(true)
  const [youtubeStats, setYoutubeStats] = useState<YouTubeStats | null>(null)
  const [niche, setNiche] = useState("")
  const [recLoading, setRecLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [insights, setInsights] = useState<Insights | null>(null)
  const [weeklyReport, setWeeklyReport] = useState<any>(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [activeDays, setActiveDays] = useState<number[]>([])
  const [platformCounts, setPlatformCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchStats()
    fetchYouTubeStats()
  }, [])

  async function fetchStats() {
    const [ideasRes, scriptsRes, goalsRes] = await Promise.all([
      fetch("/api/ideas"),
      fetch("/api/scripts"),
      fetch("/api/goals"),
    ])
    const ideas = await ideasRes.json()
    const scripts = await scriptsRes.json()
    const goals = await goalsRes.json()

    // Real platform breakdown
    const counts: Record<string, number> = {}
    if (Array.isArray(scripts)) {
      scripts.forEach((s: any) => {
        const platform = s.platform || "youtube"
        counts[platform] = (counts[platform] || 0) + 1
      })
    }

    // Real posting consistency - last 28 days
    const days: number[] = []
    if (Array.isArray(scripts)) {
      scripts.forEach((s: any) => {
        const date = new Date(s.createdAt)
        const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
        if (daysAgo < 28) days.push(27 - daysAgo)
      })
    }

    setActiveDays(days)
    setPlatformCounts(counts)
    setStats({
      totalIdeas: Array.isArray(ideas) ? ideas.length : 0,
      savedIdeas: Array.isArray(ideas) ? ideas.filter((i: any) => i.status === "saved").length : 0,
      totalScripts: Array.isArray(scripts) ? scripts.length : 0,
      totalGoals: Array.isArray(goals) ? goals.length : 0,
    })
    setLoading(false)
  }

  async function fetchYouTubeStats() {
    try {
      const res = await fetch("/api/youtube")
      if (res.ok) {
        const data = await res.json()
        setYoutubeStats(data)
      }
    } catch (e) {
      console.log("YouTube not connected")
    }
  }

  async function handleGetRecommendations() {
    if (!niche.trim()) return
    setRecLoading(true)
    const res = await fetch(`/api/recommend?niche=${encodeURIComponent(niche)}`)
    const data = await res.json()
    setRecommendations(data.recommendations?.recommendations || [])
    setInsights(data.recommendations?.insights || null)
    setRecLoading(false)
  }

  async function handleWeeklyReport() {
    setReportLoading(true)
    const res = await fetch("/api/weekly-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalContent: stats.totalScripts,
        platforms: Object.keys(platformCounts),
        goalProgress: 50,
        youtubeStats: youtubeStats ? {
          subscribers: youtubeStats.subscribers,
          totalViews: youtubeStats.totalViews,
          videos: youtubeStats.totalVideos,
        } : null,
      }),
    })
    const data = await res.json()
    setWeeklyReport(data)
    setReportLoading(false)
  }

  const barData = [
    { name: "Ideas", value: stats.totalIdeas },
    { name: "Saved", value: stats.savedIdeas },
    { name: "Scripts", value: stats.totalScripts },
    { name: "Goals", value: stats.totalGoals },
  ]

  const platformData = Object.entries(platformCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  const URGENCY_COLORS: Record<string, string> = {
    "Post this week": "border-red-500 bg-red-900/10",
    "Post this month": "border-yellow-500 bg-yellow-900/10",
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">📊 Analytics</h1>
      <p className="text-gray-400 mb-8">Track performance and get AI content recommendations</p>

      {/* YouTube Live Stats */}
      {youtubeStats && (
        <div className="bg-gray-900 border border-purple-500 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-red-500 text-xl">▶</span>
            <h2 className="text-white font-semibold">{youtubeStats.channelTitle} — Live Stats</h2>
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">LIVE</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{youtubeStats.subscribers.toLocaleString()}</p>
              <p className="text-gray-400 text-sm mt-1">Subscribers</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{youtubeStats.totalViews.toLocaleString()}</p>
              <p className="text-gray-400 text-sm mt-1">Total Views</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">{youtubeStats.totalVideos.toLocaleString()}</p>
              <p className="text-gray-400 text-sm mt-1">Videos</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-400">₹{youtubeStats.monthlyRevenue.toLocaleString()}</p>
              <p className="text-gray-400 text-sm mt-1">Est. Monthly</p>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      {!loading && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Total Ideas</p>
            <p className="text-3xl font-bold text-purple-500 mt-1">{stats.totalIdeas}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Saved Ideas</p>
            <p className="text-3xl font-bold text-pink-500 mt-1">{stats.savedIdeas}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Scripts Written</p>
            <p className="text-3xl font-bold text-blue-500 mt-1">{stats.totalScripts}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Active Goals</p>
            <p className="text-3xl font-bold text-cyan-500 mt-1">{stats.totalGoals}</p>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Content Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" fill="#9333ea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Platform Breakdown</h3>
          {platformData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {platformData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-500 text-sm">No scripts yet — create some to see breakdown!</p>
            </div>
          )}
        </div>
      </div>

      {/* Posting Consistency */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">📅 Posting Consistency</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }).map((_, i) => {
            const isActive = activeDays.includes(i)
            return (
              <div
                key={i}
                className={`h-8 rounded-md ${isActive ? "bg-purple-600" : "bg-gray-800"}`}
                title={`Day ${i + 1}`}
              />
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <p className="text-gray-400 text-sm">Last 28 days activity</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-600" />
            <span className="text-gray-400 text-xs">Active day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-800" />
            <span className="text-gray-400 text-xs">No activity</span>
          </div>
        </div>
      </div>

      {/* AI Weekly Report */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold">🤖 AI Weekly Report</h3>
            <p className="text-gray-400 text-sm">Get a plain English summary of your week</p>
          </div>
          <button
            onClick={handleWeeklyReport}
            disabled={reportLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg transition-all"
          >
            {reportLoading ? "Generating..." : "Generate Report"}
          </button>
        </div>
        {weeklyReport && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-300">{weeklyReport.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-green-400 font-medium mb-2">✅ Highlights</h4>
                <ul className="space-y-1">
                  {weeklyReport.highlights?.map((h: string, i: number) => (
                    <li key={i} className="text-gray-300 text-sm flex gap-2">
                      <span className="text-green-400">→</span>{h}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-yellow-400 font-medium mb-2">💡 Tips for Next Week</h4>
                <ul className="space-y-1">
                  {weeklyReport.tips?.map((t: string, i: number) => (
                    <li key={i} className="text-gray-300 text-sm flex gap-2">
                      <span className="text-yellow-400">→</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h3 className="text-white font-semibold mb-2">🎯 AI Content Recommendations</h3>
        <p className="text-gray-400 text-sm mb-4">
          Enter your niche → AI analyzes top viral videos → recommends your next content
        </p>
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGetRecommendations()}
            placeholder="e.g. fitness, tech, cooking..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleGetRecommendations}
            disabled={recLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-all"
          >
            {recLoading ? "Analyzing..." : "🤖 Get Recommendations"}
          </button>
        </div>

        {insights && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-purple-400 text-sm font-semibold mb-2">📝 Best Title Pattern</p>
              <p className="text-gray-300 text-sm">{insights.bestTitlePattern}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-blue-400 text-sm font-semibold mb-2">⏱️ Best Video Length</p>
              <p className="text-gray-300 text-sm">{insights.bestVideoLength}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-green-400 text-sm font-semibold mb-2">🔥 Hot Topics Now</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {insights.hotTopics?.map((topic, i) => (
                  <span key={i} className="bg-green-900 text-green-400 text-xs px-2 py-0.5 rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-red-400 text-sm font-semibold mb-2">❌ Avoid These</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {insights.avoid?.map((item, i) => (
                  <span key={i} className="bg-red-900 text-red-400 text-xs px-2 py-0.5 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-white font-semibold">📹 Your Next 5 Videos</h4>
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className={`border rounded-xl p-5 ${URGENCY_COLORS[rec.urgency] || "border-gray-700"}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h5 className="text-white font-semibold">{rec.title}</h5>
                  <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                    rec.urgency === "Post this week"
                      ? "bg-red-900 text-red-400"
                      : "bg-yellow-900 text-yellow-400"
                  }`}>
                    {rec.urgency}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{rec.reason}</p>
                <div className="flex gap-4 text-xs">
                  <span className="text-blue-400">📐 {rec.format}</span>
                  <span className="text-green-400">⏱️ {rec.idealLength}</span>
                  <span className="text-purple-400">👁️ Est. {rec.estimatedViews}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!recLoading && recommendations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              Enter your niche above to get AI-powered video recommendations!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}