import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are VulnGuard AI, an expert cybersecurity assistant specializing in vulnerability management for SMEs. 

Your capabilities include:
- Explaining vulnerabilities verin simple, business-friendly terms
- Providing step-by-step remediation guidance
- Recommending security best practices for small businesses
- Analyzing risk levels and business impact
- Suggesting cost-effective security solutions

Always be:
- Clear and concise
- Practical and actionable
- Focused on SME constraints (budget, resources, expertise)
- Security-focused but business-aware

Current context: The user is viewing their security dashboard with recent vulnerability scans showing SQL injection, unencrypted data transmission, and outdated dependencies.`,
      prompt: message,
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
