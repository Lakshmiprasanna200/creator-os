import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getYouTubeStats } from "@/lib/youtube"

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
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const account = await prisma.account.findFirst({
    where: {
      userId: (session.user as any).id,
      provider: "google",
    },
  })

  if (!account) {
    return NextResponse.json({ error: "No account found" }, { status: 400 })
  }

  let accessToken = account.access_token

  // If token expired, refresh it
  if (account.refresh_token) {
    const newToken = await refreshAccessToken(account.refresh_token)
    if (newToken) {
      accessToken = newToken
      // Save new token to database
      await prisma.account.update({
        where: { id: account.id },
        data: { access_token: newToken },
      })
    }
  }

  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 400 })
  }

  const stats = await getYouTubeStats(accessToken)

  if (!stats) {
    return NextResponse.json({ error: "No YouTube channel found" }, { status: 404 })
  }

  return NextResponse.json(stats)
}