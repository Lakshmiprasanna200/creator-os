import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const entries = await prisma.calendarEntry.findMany({
    where: { userId: (session.user as any).id },
    include: { contentPiece: true },
    orderBy: { scheduledAt: "asc" },
  }) 

  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { contentId, platform, scheduledAt } = await req.json()

  const entry = await prisma.calendarEntry.create({
    data: {
      contentId,
      platform,
      scheduledAt: new Date(scheduledAt),
      userId: (session.user as any).id,
    },
  })

  return NextResponse.json(entry)
}