import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const YT_KEY = process.env.YOUTUBE_API_KEY

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const channelName = searchParams.get("channel") || ""

  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Search for channel using API key
  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(channelName)}&type=channel&maxResults=1&key=${YT_KEY}`
  )
  const searchData = await searchRes.json()

  if (!searchData.items || searchData.items.length === 0) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 })
  }

  const channelId = searchData.items[0].id.channelId

  // Get channel details
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${YT_KEY}`
  )
  const channelData = await channelRes.json()
  const channel = channelData.items[0]

  // Get their top videos
  const videosRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=viewCount&maxResults=6&key=${YT_KEY}`
  )
  const videosData = await videosRes.json()

  const videoIds = videosData.items?.map((v: any) => v.id.videoId).join(",") || ""
  let topVideos: any[] = []

  if (videoIds) {
    const statsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoIds}&key=${YT_KEY}`
    )
    const statsData = await statsRes.json()
    topVideos = statsData.items?.map((v: any) => ({
      title: v.snippet?.title,
      views: parseInt(v.statistics?.viewCount || "0"),
      likes: parseInt(v.statistics?.likeCount || "0"),
      duration: v.contentDetails?.duration,
    })) || []
  }

  const competitorStats = {
    channelTitle: channel.snippet?.title,
    subscribers: parseInt(channel.statistics?.subscriberCount || "0"),
    totalViews: parseInt(channel.statistics?.viewCount || "0"),
    totalVideos: parseInt(channel.statistics?.videoCount || "0"),
    description: channel.snippet?.description?.slice(0, 200),
    topVideos,
  }

  // AI Analysis
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Analyze this YouTube competitor channel and give strategic advice:
        Channel: ${competitorStats.channelTitle}
        Subscribers: ${competitorStats.subscribers.toLocaleString()}
        Total Views: ${competitorStats.totalViews.toLocaleString()}
        Total Videos: ${competitorStats.totalVideos}
        Top Videos: ${JSON.stringify(topVideos.slice(0, 3))}

        Return ONLY JSON:
        {
          "strengths": ["..."],
          "contentStrategy": "...",
          "whatToSteal": ["..."],
          "gaps": ["..."],
          "actionPlan": ["..."]
        }`,
      },
    ],
  })

  const text = completion.choices[0].message.content || "{}"
  const clean = text.replace(/```json|```/g, "").trim()
  const analysis = JSON.parse(clean)

  return NextResponse.json({ ...competitorStats, analysis })
}