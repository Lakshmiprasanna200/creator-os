import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function generateIdeas(niche: string) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Generate 8 viral content ideas for a ${niche} creator.
        Return ONLY a JSON array, no extra text, no markdown:
        [{"title": "...", "angle": "...", "estimatedEngagement": "..."}]`,
      },
    ],
  })
  const text = completion.choices[0].message.content || ""
  const clean = text.replace(/```json|```/g, "").trim()
  return JSON.parse(clean)
}

export async function generateScript(idea: string, tone: string) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Write a YouTube script for: "${idea}"
        Tone: ${tone}
        Return ONLY JSON, no extra text, no markdown:
        {"hook": "...", "body": "...", "cta": "..."}`,
      },
    ],
  })
  const text = completion.choices[0].message.content || ""
  const clean = text.replace(/```json|```/g, "").trim()
  return JSON.parse(clean)
}

export async function repurposeContent(content: string) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Repurpose this content into 5 formats:
        "${content}"
        Return ONLY JSON, no extra text, no markdown:
        {"youtube": "...", "instagram": "...", "linkedin": "...", "twitter": "...", "blog": "..."}`,
      },
    ],
  })
  const text = completion.choices[0].message.content || ""
  const clean = text.replace(/```json|```/g, "").trim()
  return JSON.parse(clean)
}

export async function generateWeeklyReport(data: {
  totalContent: number
  platforms: string[]
  goalProgress: number
}) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Generate a weekly performance report for a content creator.
        Data: ${JSON.stringify(data)}
        Return ONLY JSON, no extra text, no markdown:
        {"summary": "...", "highlights": ["..."], "tips": ["..."]}`,
      },
    ],
  })
  const text = completion.choices[0].message.content || ""
  const clean = text.replace(/```json|```/g, "").trim()
  return JSON.parse(clean)
}