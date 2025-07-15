import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json()
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Get user's organization
    const { data: orgMember } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .single()

    if (!orgMember) {
      return new Response("No organization found", { status: 400 })
    }

    // Get recent vulnerabilities for context
    const { data: vulnerabilities } = await supabase
      .from("vulnerabilities")
      .select("title, severity, description, remediation_steps")
      .eq("organization_id", orgMember.organization_id)
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(10)

    // Create context from vulnerabilities
    const vulnContext =
      vulnerabilities?.map((v) => `- ${v.title} (${v.severity}): ${v.description}`).join("\n") ||
      "No active vulnerabilities found."

    const systemPrompt = `You are VulnGuard AI, a cybersecurity assistant specialized in vulnerability management and security guidance for small and medium enterprises (SMEs). 

Current organization vulnerabilities:
${vulnContext}

Your capabilities include:
- Analyzing and explaining security vulnerabilities
- Providing step-by-step remediation guidance
- Offering security best practices for SMEs
- Helping prioritize security issues based on business impact
- Explaining technical concepts in business-friendly terms

Always provide actionable, practical advice that considers the resource constraints typical of SMEs. Be concise but thorough in your responses.`

    const result = await streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
    })

    // Save the chat session
    if (sessionId) {
      await supabase.from("ai_chat_sessions").upsert({
        id: sessionId,
        user_id: user.id,
        organization_id: orgMember.organization_id,
        messages: messages,
        updated_at: new Date().toISOString(),
      })
    }

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
