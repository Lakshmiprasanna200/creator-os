"use client"

import { useState, useEffect } from "react"

interface Idea {
  id: string
  title: string
  status: string
}

interface Script {
  hook: string
  body: string
  cta: string
}

export default function ScriptsPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
  const [tone, setTone] = useState("casual")
  const [script, setScript] = useState<Script | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("script")

  useEffect(() => {
    fetch("/api/ideas")
      .then(r => r.json())
      .then(data => setIdeas(data.filter((i: Idea) => i.status === "saved")))
  }, [])

  async function handleGenerate() {
    if (!selectedIdea) return
    setLoading(true)
    const res = await fetch("/api/scripts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ideaId: selectedIdea.id,
        ideaTitle: selectedIdea.title,
        tone,
      }),
    })
    const data = await res.json()
    setScript(data.script)
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">✍️ Script Writer</h1>
      <p className="text-gray-400 mb-8">Turn your ideas into full scripts</p>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-white font-medium mb-2 block">Select an Idea</label>
            <select
              onChange={(e) => {
                const idea = ideas.find(i => i.id === e.target.value)
                setSelectedIdea(idea || null)
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">Choose a saved idea...</option>
              {ideas.map(idea => (
                <option key={idea.id} value={idea.id}>{idea.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-white font-medium mb-2 block">Select Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="casual">😊 Casual</option>
              <option value="professional">💼 Professional</option>
              <option value="funny">😂 Funny</option>
              <option value="inspirational">🔥 Inspirational</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !selectedIdea}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
        >
          {loading ? "Writing Script..." : "✨ Generate Script"}
        </button>
      </div>

      {script && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex gap-3 mb-6">
            {["script", "instagram", "linkedin", "twitter"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {tab === "script" ? "📹 YouTube" :
                 tab === "instagram" ? "📸 Instagram" :
                 tab === "linkedin" ? "💼 LinkedIn" : "🐦 Twitter"}
              </button>
            ))}
          </div>

          {activeTab === "script" && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2">🎣 Hook</h3>
                <p className="text-gray-300">{script.hook}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2">📖 Main Content</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{script.body}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2">📢 Call to Action</h3>
                <p className="text-gray-300">{script.cta}</p>
              </div>
            </div>
          )}

          {activeTab !== "script" && (
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-300 whitespace-pre-wrap">
                {activeTab === "instagram"
                  ? `📸 ${script.hook}\n\n${script.body.slice(0, 200)}...\n\n#content #creator`
                  : activeTab === "linkedin"
                  ? `💡 ${script.hook}\n\n${script.body.slice(0, 300)}...\n\nWhat do you think?`
                  : `🧵 1/ ${script.hook}\n\n2/ ${script.body.slice(0, 150)}...\n\n3/ ${script.cta}`
                }
              </p>
            </div>
          )}

          <button
            onClick={() => navigator.clipboard.writeText(`${script.hook}\n\n${script.body}\n\n${script.cta}`)}
            className="mt-4 bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-all"
          >
            📋 Copy to Clipboard
          </button>
        </div>
      )}

      {!script && !loading && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">✍️</p>
          <p className="text-gray-400">Select a saved idea and generate your script!</p>
        </div>
      )}
    </div>
  )
}