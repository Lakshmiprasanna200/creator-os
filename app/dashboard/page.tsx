"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalIdeas: 0,
    savedIdeas: 0,
    totalScripts: 0,
    totalGoals: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      const [ideasRes, scriptsRes, goalsRes] = await Promise.all([
        fetch("/api/ideas"),
        fetch("/api/scripts"),
        fetch("/api/goals"),
      ])
      const ideas = await ideasRes.json()
      const scripts = await scriptsRes.json()
      const goals = await goalsRes.json()

      setStats({
        totalIdeas: Array.isArray(ideas) ? ideas.length : 0,
        savedIdeas: Array.isArray(ideas) ? ideas.filter((i: any) => i.status === "saved").length : 0,
        totalScripts: Array.isArray(scripts) ? scripts.length : 0,
        totalGoals: Array.isArray(goals) ? goals.length : 0,
      })
    }
    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Welcome to Creator OS</h1>
      <p className="text-gray-400 mb-8">Your AI-powered content workspace</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-1">💡 Ideas Generated</h3>
          <p className="text-3xl font-bold text-purple-500">{stats.totalIdeas}</p>
          <p className="text-gray-500 text-sm mt-1">{stats.savedIdeas} saved</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-1">✍️ Scripts Written</h3>
          <p className="text-3xl font-bold text-purple-500">{stats.totalScripts}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-1">🎯 Goals Active</h3>
          <p className="text-3xl font-bold text-purple-500">{stats.totalGoals}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-white font-semibold text-lg mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/ideas" className="bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-xl p-5 transition-all group">
          <p className="text-2xl mb-2">💡</p>
          <h3 className="text-white font-semibold">Generate Ideas</h3>
          <p className="text-gray-400 text-sm mt-1">Get AI-powered content ideas for your niche</p>
        </Link>
        <Link href="/dashboard/scripts" className="bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-xl p-5 transition-all group">
          <p className="text-2xl mb-2">✍️</p>
          <h3 className="text-white font-semibold">Write a Script</h3>
          <p className="text-gray-400 text-sm mt-1">Turn your ideas into full video scripts</p>
        </Link>
        <Link href="/dashboard/competitor" className="bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-xl p-5 transition-all group">
          <p className="text-2xl mb-2">🔍</p>
          <h3 className="text-white font-semibold">Competitor Analysis</h3>
          <p className="text-gray-400 text-sm mt-1">Analyze any YouTube channel with AI</p>
        </Link>
        <Link href="/dashboard/analytics" className="bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-xl p-5 transition-all group">
          <p className="text-2xl mb-2">📊</p>
          <h3 className="text-white font-semibold">View Analytics</h3>
          <p className="text-gray-400 text-sm mt-1">Track your content performance</p>
        </Link>
      </div>
    </div>
  )
}