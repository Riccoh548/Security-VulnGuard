"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Loader2, Shield, AlertTriangle, TrendingUp, FileText, Zap, MessageSquare } from "lucide-react"
import { useChat } from "ai/react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface QuickAction {
  id: string
  label: string
  prompt: string
  icon: React.ComponentType<{ className?: string }>
  category: string
}

const quickActions: QuickAction[] = [
  {
    id: "security-overview",
    label: "Security Overview",
    prompt: "Provide a comprehensive security overview of my current vulnerabilities and their risk levels.",
    icon: Shield,
    category: "Analysis",
  },
  {
    id: "critical-issues",
    label: "Critical Issues",
    prompt: "What are the most critical security issues I need to address immediately?",
    icon: AlertTriangle,
    category: "Priority",
  },
  {
    id: "risk-trends",
    label: "Risk Trends",
    prompt: "Analyze my security risk trends over the past month and provide insights.",
    icon: TrendingUp,
    category: "Analysis",
  },
  {
    id: "compliance-report",
    label: "Compliance Status",
    prompt: "Generate a compliance report showing my adherence to security standards like SOC2, GDPR, and PCI-DSS.",
    icon: FileText,
    category: "Compliance",
  },
  {
    id: "quick-fixes",
    label: "Quick Fixes",
    prompt: "What are some quick security improvements I can implement today?",
    icon: Zap,
    category: "Action",
  },
]

export function AIAssistant() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [userContext, setUserContext] = useState<any>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your AI Security Assistant. I can help you understand your security posture, prioritize vulnerabilities, and provide actionable recommendations. How can I assist you today?",
      },
    ],
    onError: (error) => {
      console.error("Chat error:", error)
      toast.error("Failed to send message. Please try again.")
    },
  })

  useEffect(() => {
    fetchUserContext()
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const fetchUserContext = async () => {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return

      // Fetch user's recent scans and vulnerabilities for context
      const { data: scans } = await supabase
        .from("scans")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      const { data: vulnerabilities } = await supabase
        .from("vulnerabilities")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      setUserContext({ scans, vulnerabilities })
    } catch (error) {
      console.error("Error fetching user context:", error)
    }
  }

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.prompt)
    // Auto-submit the quick action
    const syntheticEvent = {
      preventDefault: () => {},
      target: { message: { value: action.prompt } },
    } as any
    handleSubmit(syntheticEvent)
  }

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
      .replace(/\n/g, "<br>")
  }

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          AI Assistant
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] flex flex-col">
      <Card className="flex-1 shadow-2xl border-0 bg-white">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <div>
                <CardTitle className="text-lg">AI Security Assistant</CardTitle>
                <CardDescription className="text-blue-100 text-sm">Your intelligent security advisor</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Quick Actions */}
          <div className="p-4 border-b bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.slice(0, 3).map((action) => {
                const IconComponent = action.icon
                return (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                    className="text-xs"
                    disabled={isLoading}
                  >
                    <IconComponent className="w-3 h-3 mr-1" />
                    {action.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[280px] ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      <div
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(message.content),
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-lg bg-gray-100 rounded-bl-sm">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about your security..."
                disabled={isLoading}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e as any)
                  }
                }}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="sm" className="px-3">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
