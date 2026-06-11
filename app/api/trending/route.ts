import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function refreshAccessToken(refreshToken: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  })
  const data = await res.json()
  return data.access_token
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const niche = searchParams.get("niche") || "technology"

  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const account = await prisma.account.findFirst({
    where: {
      userId: (session.user as any).id,
      provider: "google",
    },
  })

  let accessToken = account?.access_token

  if (account?.refresh_token) {
    const newToken = await refreshAccessToken(account.refresh_token)
    if (newToken) {
      accessToken = newToken
      await prisma.account.update({
        where: { id: account.id },
        data: { access_token: newToken },
      })
    }
  }

  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 400 })
  }

  // Search trending videos for the niche
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(niche)}&type=video&order=viewCount&publishedAfter=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}&maxResults=6&relevanceLanguage=en`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  const data = await res.json()

  if (!data.items) {
    return NextResponse.json({ trending: [] })
  }

  // Get video stats
  const videoIds = data.items.map((v: any) => v.id.videoId).join(",")
  const statsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  const statsData = await statsRes.json()

  const trending = statsData.items?.map((video: any) => ({
    id: video.id,
    title: video.snippet?.title || "",
    channel: video.snippet?.channelTitle || "",
    views: parseInt(video.statistics?.viewCount || "0"),
    likes: parseInt(video.statistics?.likeCount || "0"),
    thumbnail: video.snippet?.thumbnails?.medium?.url || "",
    publishedAt: video.snippet?.publishedAt || "",
    url: `https://youtube.com/watch?v=${video.id}`,
  })) || []

  return NextResponse.json({ trending })
}