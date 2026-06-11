import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <h1 className="text-xl font-bold">
          Creator <span className="text-purple-500">OS</span>
        </h1>
        <Link
          href="/login"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-lg transition-all"
        >
          Get Started Free
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-8 max-w-4xl mx-auto">
        <div className="inline-block bg-purple-900 text-purple-300 text-sm px-4 py-1.5 rounded-full mb-6">
          🚀 AI-Powered Content Workspace
        </div>
        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Create. Plan. Grow.<br />
          <span className="text-purple-500">10x Faster.</span>
        </h1>
        <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
          Creator OS is the all-in-one AI workspace for content creators.
          Generate viral ideas, write scripts, analyze competitors, and track
          your YouTube growth — all in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
          >
            Start for Free →
          </Link>
          <Link
            href="/dashboard"
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-gray-800 py-8 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-purple-500">10x</p>
            <p className="text-gray-400 text-sm mt-1">Faster Content Creation</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-500">6+</p>
            <p className="text-gray-400 text-sm mt-1">AI-Powered Features</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-500">5</p>
            <p className="text-gray-400 text-sm mt-1">Platforms Supported</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything a Creator Needs</h2>
          <p className="text-gray-400 text-lg">From idea to published — all powered by AI</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: "💡",
              title: "AI Idea Engine",
              desc: "Generate viral content ideas for your niche. Never repeat an idea. Get viral scores, competition levels, and best platform recommendations.",
              color: "border-yellow-500",
            },
            {
              icon: "✍️",
              title: "AI Script Writer",
              desc: "Turn any idea into a full YouTube script with hook, body, and CTA. One click converts it to Instagram, LinkedIn, Twitter, and blog formats.",
              color: "border-blue-500",
            },
            {
              icon: "🔄",
              title: "Repurpose Studio",
              desc: "Paste any content and instantly get 5 platform-ready versions. One piece of content becomes YouTube, Instagram, LinkedIn, Twitter, and Blog.",
              color: "border-green-500",
            },
            {
              icon: "📅",
              title: "Content Calendar",
              desc: "Plan and schedule your content visually. See your entire month at a glance with color-coded platforms and status badges.",
              color: "border-pink-500",
            },
            {
              icon: "🔍",
              title: "Competitor Analysis",
              desc: "Enter any YouTube channel name and get real stats, top videos, and AI-powered strategy on what to copy and what gaps to fill.",
              color: "border-red-500",
            },
            {
              icon: "📊",
              title: "Live Analytics",
              desc: "Real-time YouTube stats, AI content recommendations based on trending data, weekly AI reports, and posting consistency tracking.",
              color: "border-purple-500",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={`bg-gray-900 border ${feature.color} rounded-xl p-6 hover:scale-105 transition-all`}
            >
              <p className="text-3xl mb-3">{feature.icon}</p>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* YouTube Integration Section */}
      <section className="py-16 px-8 bg-gray-900 border-y border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            🔴 Live YouTube Integration
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Connect your YouTube channel and get real-time data — subscribers,
            views, per-video stats, Shorts vs Long video breakdown, and
            estimated monthly revenue. All updated automatically.
          </p>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Live Subscribers", icon: "👥" },
              { label: "Per Video Stats", icon: "📹" },
              { label: "Shorts vs Long", icon: "⚡" },
              { label: "Est. Revenue", icon: "💰" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="text-gray-300 text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 text-lg">From zero to published in minutes</p>
        </div>
        <div className="space-y-6">
          {[
            { step: "01", title: "Generate Ideas", desc: "Enter your niche → AI generates 8 unique viral ideas with scores and platform recommendations" },
            { step: "02", title: "Write Your Script", desc: "Pick a saved idea → AI writes a full script → convert to any platform with one click" },
            { step: "03", title: "Schedule & Track", desc: "Add to your content calendar, track YouTube growth, and get weekly AI performance reports" },
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start bg-gray-900 border border-gray-800 rounded-xl p-6">
              <span className="text-purple-500 font-bold text-2xl shrink-0">{item.step}</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 text-center bg-gray-900 border-t border-gray-800">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Grow Your Channel?
        </h2>
        <p className="text-gray-400 text-lg mb-8">
          Join creators who use AI to plan smarter and grow faster.
        </p>
        <Link
          href="/login"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all inline-block"
        >
          Get Started Free →
        </Link>
        <p className="text-gray-500 text-sm mt-4">No credit card required</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-8 text-center">
        <p className="text-gray-500 text-sm">
          Built with Next.js, PostgreSQL, YouTube API & Groq AI
        </p>
        <p className="text-gray-600 text-xs mt-2">
          © 2026 Creator OS. All rights reserved.
        </p>
      </footer>

    </div>
  )
}