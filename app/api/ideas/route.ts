import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const CATEGORIES = ["Trending", "Educational", "Story/Personal", "Challenge"]

async function generateSmartIdeas(niche: string, existingTitles: string[], categoryIndex: number) {
  const category = CATEGORIES[categoryIndex % 4]

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Generate 8 unique ${category} content ideas for a "${niche}" creator.

IMPORTANT: Do NOT generate ideas similar to these already existing ones:
${existingTitles.length > 0 ? existingTitles.slice(-20).join("\n") : "None yet"}

Category focus: ${category}
- Trending: ideas based on what's viral right now
- Educational: how-to, tips, tutorials, myths busted
- Story/Personal: my journey, transformation, behind the scenes
- Challenge: 30 day challenges, experiments, trying something new

For each idea also provide:
- viralScore: 1-10 (how likely to go viral)
- competition: "Low" | "Medium" | "High" (how many creators cover this)
- bestPlatform: "YouTube Shorts" | "YouTube Long" | "Instagram Reels" | "LinkedIn" | "Twitter"
- category: "${category}"

Return ONLY a JSON array, no extra text:
[{
  "title": "...",
  "angle": "...",
  "viralScore": 8,
  "competition": "Low",
  "bestPlatform": "YouTube Shorts",
  "category": "${category}"
}]`,
      },
    ],
  })

  const text = completion.choices[0].message.content || "[]"
  const clean = text.replace(/```json|```/g, "").trim()
  return JSON.parse(clean)
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const ideas = await prisma.idea.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(ideas)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { niche, action, ideaId, status } = await req.json()

  if (action === "generate") {
    // Get existing ideas to avoid repetition
    const existingIdeas = await prisma.idea.findMany({
      where: { userId: (session.user as any).id },
      select: { title: true },
      orderBy: { createdAt: "desc" },
    })
    const existingTitles = existingIdeas.map(i => i.title)

    // Rotate category based on how many times user generated
    const categoryIndex = Math.floor(existingIdeas.length / 8)

    const ideas = await generateSmartIdeas(niche, existingTitles, categoryIndex)

    await prisma.idea.createMany({
      data: ideas.map((idea: any) => ({
        title: idea.title,
        angle: JSON.stringify({
          angle: idea.angle,
          viralScore: idea.viralScore,
          competition: idea.competition,
          bestPlatform: idea.bestPlatform,
          category: idea.category,
        }),
        status: "pending",
        userId: (session.user as any).id,
      })),
    })

    return NextResponse.json({ success: true, category: CATEGORIES[categoryIndex % 4] })
  }

  if (action === "update") {
    const idea = await prisma.idea.update({
      where: { id: ideaId },
      data: { status },
    })
    return NextResponse.json(idea)
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}