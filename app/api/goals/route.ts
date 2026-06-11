import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const goals = await prisma.goal.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(goals)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { title, target, deadline, action, goalId, progress } = await req.json()

  if (action === "create") {
    const goal = await prisma.goal.create({
      data: {
        title,
        target,
        deadline: new Date(deadline),
        userId: (session.user as any).id,
      },
    })
    return NextResponse.json(goal)
  }

  if (action === "update") {
    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: { progress },
    })
    return NextResponse.json(goal)
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}