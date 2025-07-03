"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Send, Lightbulb, Shield, Zap } from "lucide-react"

export function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      type: "assistant",
      content:
        "Hi! I'm your AI Security Assistant. I can help you understand vulnerabilities, suggest remediation steps, and answer security questions. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")

  const quickActions = [
    {
      icon: Shield,
      title: "Explain CVE-2024-0001",
      description: "Get detailed analysis of the SQL injection vulnerability",
    },
    {
      icon: Lightbulb,
      title: "Remediation Steps",
      description: "Show me how to fix critical vulnerabilities",
    },
    {
      icon: Zap,
      title: "Security Best Practices",
      description: "Recommend security improvements for SMEs",
    },
  ]

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = {
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: "assistant",
        content: `I understand you're asking about "${input}". Based on my analysis of your current security posture, here are my recommendations:\n\n1. **Immediate Action**: Address the critical SQL injection vulnerability in your authentication system\n2. **Medium Term**: Implement proper input validation and parameterized queries\n3. **Long Term**: Consider implementing a Web Application Firewall (WAF)\n\nWould you like me to provide specific code examples or help you prioritize these actions?`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <Card className="h-fit sticky top-24">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Security Assistant</CardTitle>
            <CardDescription>Get instant security guidance</CardDescription>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-700 border-green-200 w-fit">Online</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <ScrollArea className="h-64 w-full border rounded-lg p-3">
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex space-x-2">
          <Input
            placeholder="Ask about vulnerabilities, remediation..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Quick Actions</p>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="w-full justify-start h-auto p-3 bg-transparent"
              onClick={() => setInput(action.title)}
            >
              <action.icon className="w-4 h-4 mr-2 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
