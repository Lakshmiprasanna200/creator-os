"use client"

import { useState } from "react"

interface Repurposed {
  youtube: string
  instagram: string
  linkedin: string
  twitter: string
  blog: string
}

export default function RepurposePage() {
  const [content, setContent] = useState("")
  const [result, setResult] = useState<Repurposed | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("youtube")

  async function handleRepurpose() {
    if (!content.trim()) return
    setLoading(true)
    const res = await fetch("/api/repurpose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  const tabs = [
    { key: "youtube", label: "📹 YouTube" },
    { key: "instagram", label: "📸 Instagram" },
    { key: "linkedin", label: "💼 LinkedIn" },
    { key: "twitter", label: "🐦 Twitter" },
    { key: "blog", label: "📝 Blog" },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">🔄 Repurpose Studio</h1>
      <p className="text-gray-400 mb-8">Turn one piece of content into five formats instantly</p>

      {/* Input */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <label className="text-white font-medium mb-3 block">
          Paste your content here
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your blog post, video transcript, podcast notes, or any content..."
          rows={6}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
        />
        <button
          onClick={handleRepurpose}
          disabled={loading || !content.trim()}
          className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
        >
          {loading ? "Repurposing..." : "🔄 Repurpose Content"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">✅ Repurposed Content</h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-300 whitespace-pre-wrap">
              {result[activeTab as keyof Repurposed]}
            </p>
          </div>

          <button
            onClick={() => navigator.clipboard.writeText(result[activeTab as keyof Repurposed])}
            className="mt-4 bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-all"
          >
            📋 Copy to Clipboard
          </button>
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔄</p>
          <p className="text-gray-400">Paste any content above and get 5 formats instantly!</p>
        </div>
      )}
    </div>
  )
}