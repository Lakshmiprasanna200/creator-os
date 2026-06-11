"use client"

import { useState, useEffect } from "react"

interface Goal {
  id: string
  title: string
  target: string
  deadline: string
  progress: number
  milestones?: any
}

interface Video {
  id: string
  title: string
  views: number
  likes: number
  comments: number
  isShort: boolean
  estimatedRevenue: number
  publishedAt: string
}

interface YouTubeStats {
  subscribers: number
  totalViews: number
  totalVideos: number
  channelTitle: string
  videos: Video[]
  monthlyRevenue: number
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [target, setTarget] = useState("")
  const [targetNumber, setTargetNumber] = useState("")
  const [deadline, setDeadline] = useState("")
  const [saving, setSaving] = useState(false)
  const [youtubeStats, setYoutubeStats] = useState<YouTubeStats | null>(null)
  const [currentCounts, setCurrentCounts] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchGoals()
    fetchYouTubeStats()
  }, [])

  async function fetchGoals() {
    const res = await fetch("/api/goals")
    const data = await res.json()
    setGoals(Array.isArray(data) ? data : [])
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

  async function handleCreate() {
    if (!title || !target || !deadline) return
    setSaving(true)
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        title,
        target: `${targetNumber} ${target}`,
        deadline,
      }),
    })
    setTitle("")
    setTarget("")
    setTargetNumber("")
    setDeadline("")
    setShowForm(false)
    await fetchGoals()
    setSaving(false)
  }

  async function handleUpdateProgress(goalId: string, current: number, targetNum: number) {
    const progress = Math.min(Math.round((current / targetNum) * 100), 100)
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", goalId, progress }),
    })
    setGoals(goals.map(g => g.id === goalId ? { ...g, progress } : g))
  }

  function daysLeft(deadline: string) {
    const diff = new Date(deadline).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  function extractTargetNumber(target: string) {
    const match = target.match(/\d+/)
    return match ? parseInt(match[0]) : 100
  }

  const shorts = youtubeStats?.videos?.filter(v => v.isShort) || []
  const longVideos = youtubeStats?.videos?.filter(v => !v.isShort) || []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">🎯 Goal Tracker</h1>
          <p className="text-gray-400">Set goals and track your growth</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all"
        >
          + New Goal
        </button>
      </div>

      {/* YouTube Stats Card */}
      {youtubeStats && (
        <div className="bg-gray-900 border border-purple-500 rounded-xl p-6 mb-8">
          {/* Channel Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-red-500 text-xl">▶</span>
            <h2 className="text-white font-semibold">
              {youtubeStats.channelTitle} — Live YouTube Stats
            </h2>
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">LIVE</span>
          </div>

          {/* Channel Overview */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-red-400">
                {youtubeStats.subscribers?.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mt-1">Subscribers</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">
                {youtubeStats.totalViews?.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mt-1">Total Views</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-400">
                ₹{youtubeStats.monthlyRevenue?.toLocaleString() || 0}
              </p>
              <p className="text-gray-400 text-sm mt-1">Est. Monthly Revenue</p>
            </div>
          </div>

          {/* Shorts Section */}
          {shorts.length > 0 && (
            <div className="mb-4">
              <h3 className="text-purple-400 font-semibold mb-3">⚡ Shorts</h3>
              <div className="space-y-2">
                {shorts.map(video => (
                  <div key={video.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{video.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {video.views.toLocaleString()} views · {video.likes.toLocaleString()} likes
                      </p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <p className="text-green-400 text-sm font-medium">₹{video.estimatedRevenue}</p>
                      <p className="text-gray-500 text-xs">est. revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Long Videos Section */}
          {longVideos.length > 0 && (
            <div>
              <h3 className="text-blue-400 font-semibold mb-3">🎬 Long Videos</h3>
              <div className="space-y-2">
                {longVideos.map(video => (
                  <div key={video.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{video.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {video.views.toLocaleString()} views · {video.likes.toLocaleString()} likes · {video.comments.toLocaleString()} comments
                      </p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <p className="text-green-400 text-sm font-medium">₹{video.estimatedRevenue}</p>
                      <p className="text-gray-500 text-xs">est. revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Goal Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-white font-semibold mb-4">Create New Goal</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Goal Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Grow YouTube Channel"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Target Number</label>
                <input
                  type="number"
                  value={targetNumber}
                  onChange={e => setTargetNumber(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">What are you tracking?</label>
                <input
                  type="text"
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  placeholder="e.g. subscribers, views, posts"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition-all"
              >
                {saving ? "Generating milestones..." : "Create Goal"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals List */}
      {loading ? (
        <p className="text-gray-400">Loading goals...</p>
      ) : goals.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🎯</p>
          <p className="text-gray-400">No goals yet! Click "+ New Goal" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => {
            const targetNum = extractTargetNumber(goal.target)
            const current = parseInt(currentCounts[goal.id] || "0")
            const isSubGoal = goal.target.toLowerCase().includes("subscriber")

            return (
              <div key={goal.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{goal.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">Target: {goal.target}</p>
                    {isSubGoal && youtubeStats && (
                      <span className="text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded-full mt-1 inline-block">
                        ✅ Auto tracking from YouTube
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      daysLeft(goal.deadline) < 7 ? "text-red-400" : "text-gray-400"
                    }`}>
                      {daysLeft(goal.deadline) > 0
                        ? `${daysLeft(goal.deadline)} days left`
                        : "Deadline passed!"}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-purple-400 font-medium">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Auto or Manual Update */}
                {isSubGoal && youtubeStats ? (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm">
                      {youtubeStats.subscribers.toLocaleString()} / {targetNum.toLocaleString()} subscribers
                    </p>
                    <button
                      onClick={() => handleUpdateProgress(goal.id, youtubeStats.subscribers, targetNum)}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-all"
                    >
                      🔄 Sync Progress
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 items-center">
                    <input
                      type="number"
                      value={currentCounts[goal.id] || ""}
                      onChange={e => setCurrentCounts({ ...currentCounts, [goal.id]: e.target.value })}
                      placeholder={`Current count (out of ${targetNum})`}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                    />
                    <button
                      onClick={() => handleUpdateProgress(goal.id, current, targetNum)}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-all"
                    >
                      Update
                    </button>
                  </div>
                )}

                {/* AI Milestones */}
                {goal.milestones && (
                  <div className="mt-4 border-t border-gray-800 pt-4">
                    <h4 className="text-purple-400 text-sm font-semibold mb-2">
                      🤖 AI Weekly Milestones
                    </h4>
                    <p className="text-gray-400 text-xs mb-3">
                      Weekly target: {(goal.milestones as any).weeklyTarget}
                    </p>
                    <div className="space-y-2">
                      {((goal.milestones as any).milestones || []).slice(0, 4).map((m: any) => (
                        <div key={m.week} className="flex items-start gap-2 text-xs">
                          <span className="text-purple-500 font-medium shrink-0">Week {m.week}</span>
                          <span className="text-gray-400">{m.target} — {m.action}</span>
                        </div>
                      ))}
                    </div>
                    {(goal.milestones as any).tip && (
                      <p className="text-yellow-400 text-xs mt-3">
                        💡 {(goal.milestones as any).tip}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}