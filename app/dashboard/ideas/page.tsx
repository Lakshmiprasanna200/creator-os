"use client"

import { useState, useEffect } from "react"

interface Idea {
  id: string
  title: string
  angle: string
  status: string
}

interface IdeaDetails {
  angle: string
  viralScore: number
  competition: string
  bestPlatform: string
  category: string
}

function parseAngle(angle: string): IdeaDetails {
  try {
    return JSON.parse(angle)
  } catch {
    return { angle, viralScore: 0, competition: "Unknown", bestPlatform: "YouTube", category: "General" }
  }
}

const COMPETITION_COLORS: Record<string, string> = {
  Low: "text-green-400",
  Medium: "text-yellow-400",
  High: "text-red-400",
}

const CATEGORY_COLORS: Record<string, string> = {
  Trending: "bg-red-900 text-red-400",
  Educational: "bg-blue-900 text-blue-400",
  "Story/Personal": "bg-purple-900 text-purple-400",
  Challenge: "bg-orange-900 text-orange-400",
  General: "bg-gray-800 text-gray-400",
}

export default function IdeasPage() {
  const [niche, setNiche] = useState("")
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [lastCategory, setLastCategory] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchIdeas()
  }, [])

  async function fetchIdeas() {
    const res = await fetch("/api/ideas")
    const data = await res.json()
    setIdeas(Array.isArray(data) ? data : [])
    setFetching(false)
  }

  async function handleGenerate() {
    if (!niche.trim()) return
    setLoading(true)
    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate", niche }),
    })
    const data = await res.json()
    setLastCategory(data.category || "")
    await fetchIdeas()
    setLoading(false)
  }

  async function handleUpdate(ideaId: string, status: string) {
    await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", ideaId, status }),
    })
    setIdeas(ideas.map(i => i.id === ideaId ? { ...i, status } : i))
  }

  const filteredIdeas = ideas.filter(idea => {
    if (filter === "all") return true
    if (filter === "saved") return idea.status === "saved"
    if (filter === "pending") return idea.status === "pending"
    return true
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">💡 Idea Engine</h1>
      <p className="text-gray-400 mb-8">Generate unique viral content ideas — never repeating!</p>

      {/* Input Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <label className="text-white font-medium mb-3 block">What's your content niche?</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="e.g. fitness, tech, cooking, finance..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-all"
          >
            {loading ? "Generating..." : "✨ Generate Ideas"}
          </button>
        </div>
        {lastCategory && (
          <p className="text-gray-400 text-sm mt-3">
            ✅ Generated <span className="text-purple-400 font-medium">{lastCategory}</span> ideas
            — next generation will give a different category!
          </p>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6">
        {["all", "saved", "pending"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              filter === f
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {f === "all" ? `All (${ideas.length})` :
             f === "saved" ? `Saved (${ideas.filter(i => i.status === "saved").length})` :
             `Pending (${ideas.filter(i => i.status === "pending").length})`}
          </button>
        ))}
      </div>

      {/* Ideas Grid */}
      {fetching ? (
        <p className="text-gray-400">Loading ideas...</p>
      ) : filteredIdeas.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">💡</p>
          <p className="text-gray-400">No ideas yet! Enter your niche and click Generate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredIdeas.map((idea) => {
            const details = parseAngle(idea.angle)
            return (
              <div
                key={idea.id}
                className={`bg-gray-900 border rounded-xl p-5 transition-all ${
                  idea.status === "saved"
                    ? "border-purple-500"
                    : idea.status === "rejected"
                    ? "border-gray-700 opacity-40"
                    : "border-gray-800"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {details.category && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium mb-2 inline-block ${
                        CATEGORY_COLORS[details.category] || "bg-gray-800 text-gray-400"
                      }`}>
                        {details.category}
                      </span>
                    )}
                    <h3 className="text-white font-semibold mb-1">{idea.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{details.angle}</p>
                    {details.viralScore > 0 && (
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">🔥 Viral:</span>
                          <span className="text-orange-400 font-medium">{details.viralScore}/10</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Competition:</span>
                          <span className={`font-medium ${COMPETITION_COLORS[details.competition] || "text-gray-400"}`}>
                            {details.competition}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Best for:</span>
                          <span className="text-blue-400 font-medium">{details.bestPlatform}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {idea.status !== "saved" && idea.status !== "rejected" && (
                      <>
                        <button
                          onClick={() => handleUpdate(idea.id, "saved")}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1.5 rounded-lg transition-all"
                        >
                          ✅ Save
                        </button>
                        <button
                          onClick={() => handleUpdate(idea.id, "rejected")}
                          className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1.5 rounded-lg transition-all"
                        >
                          ❌ Skip
                        </button>
                      </>
                    )}
                    {idea.status === "saved" && (
                      <span className="text-purple-400 text-sm font-medium">✨ Saved</span>
                    )}
                    {idea.status === "rejected" && (
                      <button
                        onClick={() => handleUpdate(idea.id, "pending")}
                        className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1.5 rounded-lg transition-all"
                      >
                        ↩ Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}