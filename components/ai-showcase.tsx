import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, MessageSquare, FileText, Zap, Target, Shield } from "lucide-react"

export function AIShowcase() {
  const aiFeatures = [
    {
      icon: Brain,
      title: "Intelligent Vulnerability Classification",
      description:
        "AI automatically categorizes and prioritizes vulnerabilities based on your business context and threat landscape.",
      badge: "Smart Analysis",
    },
    {
      icon: FileText,
      title: "Auto-Generated Security Reports",
      description: "Get executive summaries and technical reports automatically generated with actionable insights.",
      badge: "NLP Powered",
    },
    {
      icon: MessageSquare,
      title: "AI Security Assistant",
      description: "Chat with our AI assistant for instant remediation guidance and security best practices.",
      badge: "24/7 Support",
    },
    {
      icon: Target,
      title: "Predictive Threat Modeling",
      description: "Machine learning algorithms predict potential attack vectors based on your infrastructure.",
      badge: "Predictive AI",
    },
    {
      icon: Zap,
      title: "Automated Remediation Workflows",
      description: "AI-driven automation creates and executes remediation plans with minimal human intervention.",
      badge: "Automation",
    },
    {
      icon: Shield,
      title: "Continuous Learning",
      description: "Our AI continuously learns from new threats and adapts to your organization's security posture.",
      badge: "Adaptive",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
            <Brain className="w-4 h-4 mr-2" />
            AI & Machine Learning
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Powered by Advanced AI Technology</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI engine transforms raw vulnerability data into actionable intelligence, making enterprise-grade
            security accessible to SMEs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiFeatures.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
