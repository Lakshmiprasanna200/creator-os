"use client"

import { useState } from "react"

interface CompetitorData {
  channelTitle: string
  subscribers: number
  totalViews: number
  totalVideos: number
  description: string
  topVideos: {
    title: string
    views: number
    likes: number
  }[]
  analysis: {
    strengths: string[]
    contentStrategy: string
    whatToSteal: string[]
    gaps: string[]
    actionPlan: string[]
  }
}

export default function CompetitorPage() {
  const [channel, setChannel] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CompetitorData | null>(null)
  const [error, setError] = useState("")

  async function handleAnalyze() {
    if (!channel.trim()) return
    setLoading(true)
    setError("")
    setData(null)

    const res = await fetch(`/api/competitor?channel=${encodeURIComponent(channel)}`)
    const result = await res.json()

    if (result.error) {
      setError(result.error)
    } else {
      setData(result)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">🔍 Competitor Analysis</h1>
      <p className="text-gray-400 mb-8">
        Enter any YouTube channel name — get real stats and AI strategy!
      </p>

      {/* Input */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <label className="text-white font-medium mb-3 block">YouTube Channel Name</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder="e.g. MrBeast, Technical Guruji, Dhruv Rathee..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-all"
          >
            {loading ? "Analyzing..." : "🔍 Analyze"}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {/* Results */}
      {data && (
        <div className="space-y-6">
          {/* Channel Overview */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-white font-bold text-xl mb-4">
              📺 {data.channelTitle}
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-400">
                  {data.subscribers.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm mt-1">Subscribers</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {data.totalViews.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm mt-1">Total Views</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-400">
                  {data.totalVideos.toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm mt-1">Videos</p>
              </div>
            </div>
          </div>

          {/* Top Videos */}
          {data.topVideos.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">🏆 Their Top Videos</h3>
              <div className="space-y-3">
                {data.topVideos.map((video, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{video.title}</p>
                    </div>
                    <div className="flex gap-4 ml-4 shrink-0 text-xs">
                      <span className="text-blue-400">👁 {video.views.toLocaleString()}</span>
                      <span className="text-red-400">❤️ {video.likes.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Analysis */}
          <div className="grid grid-cols-2 gap-6">
            {/* What to Steal */}
            <div className="bg-gray-900 border border-green-800 rounded-xl p-6">
              <h3 className="text-green-400 font-semibold mb-3">
                💡 What to Copy From Them
              </h3>
              <ul className="space-y-2">
                {data.analysis.whatToSteal?.map((item, i) => (
                  <li key={i} className="text-gray-300 text-sm flex gap-2">
                    <span className="text-green-400 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div className="bg-gray-900 border border-yellow-800 rounded-xl p-6">
              <h3 className="text-yellow-400 font-semibold mb-3">
                🎯 Gaps You Can Fill
              </h3>
              <ul className="space-y-2">
                {data.analysis.gaps?.map((item, i) => (
                  <li key={i} className="text-gray-300 text-sm flex gap-2">
                    <span className="text-yellow-400 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Strategy */}
            <div className="bg-gray-900 border border-blue-800 rounded-xl p-6">
              <h3 className="text-blue-400 font-semibold mb-3">
                📋 Their Content Strategy
              </h3>
              <p className="text-gray-300 text-sm">{data.analysis.contentStrategy}</p>
            </div>

            {/* Action Plan */}
            <div className="bg-gray-900 border border-purple-800 rounded-xl p-6">
              <h3 className="text-purple-400 font-semibold mb-3">
                🚀 Your Action Plan
              </h3>
              <ul className="space-y-2">
                {data.analysis.actionPlan?.map((item, i) => (
                  <li key={i} className="text-gray-300 text-sm flex gap-2">
                    <span className="text-purple-400 shrink-0">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {!data && !loading && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-gray-400">Enter a competitor channel name to get AI-powered analysis!</p>
        </div>
      )}
    </div>
  )
}