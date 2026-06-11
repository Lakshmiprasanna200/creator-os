import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateScript } from "@/lib/claude"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const scripts = await prisma.contentPiece.findMany({
    where: { 
      userId: (session.user as any).id,
      type: "script"
    },
    include: { idea: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(scripts)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { ideaId, ideaTitle, tone } = await req.json()

  const script = await generateScript(ideaTitle, tone)

  const saved = await prisma.contentPiece.create({
    data: {
      platform: "youtube",
      type: "script",
      body: JSON.stringify(script),
      tone,
      userId: (session.user as any).id,
      ideaId,
    },
  })

  return NextResponse.json({ script, id: saved.id })
}