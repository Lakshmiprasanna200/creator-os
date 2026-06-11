import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { totalContent, platforms, goalProgress, youtubeStats } = await req.json()

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Generate a weekly performance report for a content creator.
        
Data:
- Total content pieces created: ${totalContent}
- Platforms used: ${platforms.join(", ")}
- Goal progress: ${goalProgress}%
- YouTube stats: ${youtubeStats ? JSON.stringify(youtubeStats) : "Not connected"}

Return ONLY JSON:
{
  "summary": "2-3 sentence plain English summary of the week",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "tips": ["tip for next week 1", "tip 2", "tip 3"]
}`,
      },
    ],
  })

  const text = completion.choices[0].message.content || "{}"
  const clean = text.replace(/```json|```/g, "").trim()
  const report = JSON.parse(clean)

  return NextResponse.json(report)
}