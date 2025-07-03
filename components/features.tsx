import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Network, Cloud, Globe, Database, Smartphone, Server, BarChart3, Bell, Users } from "lucide-react"

export function Features() {
  const scanningLayers = [
    {
      icon: Network,
      title: "Network Layer Scanning",
      description: "Comprehensive Nmap integration for port scanning, service detection, and network topology mapping.",
      technologies: ["Nmap", "Nessus", "OpenVAS"],
    },
    {
      icon: Globe,
      title: "Web Application Security",
      description: "OWASP Top 10 vulnerability detection, SQL injection, XSS, and authentication bypass testing.",
      technologies: ["OWASP ZAP", "Burp Suite", "Custom Crawlers"],
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "Multi-cloud security assessment for AWS, Azure, GCP with configuration compliance checking.",
      technologies: ["AWS Config", "Azure Security", "GCP Security"],
    },
    {
      icon: Database,
      title: "Database Security",
      description: "Database vulnerability scanning, privilege escalation detection, and data exposure analysis.",
      technologies: ["SQLMap", "Custom DB Scanners"],
    },
    {
      icon: Smartphone,
      title: "Mobile Application",
      description: "Static and dynamic analysis of mobile apps for iOS and Android security vulnerabilities.",
      technologies: ["MobSF", "QARK", "Custom Tools"],
    },
    {
      icon: Server,
      title: "Infrastructure Hardening",
      description: "Operating system and server configuration security assessment and compliance checking.",
      technologies: ["Lynis", "CIS Benchmarks", "Custom Scripts"],
    },
  ]

  const enhancedFeatures = [
    {
      icon: BarChart3,
      title: "Executive Dashboards",
      description: "C-level friendly dashboards with risk metrics, compliance status, and business impact analysis.",
    },
    {
      icon: Bell,
      title: "Smart Alerting",
      description: "AI-powered alert prioritization that reduces noise and focuses on critical threats.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Built-in workflow management for security teams with task assignment and progress tracking.",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Multi-Layer Scanning */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">Multi-Layer Security</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Comprehensive Security Coverage</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform scans across all layers of your infrastructure, from network to application level, providing
            complete visibility into your security posture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {scanningLayers.map((layer, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg text-white w-fit mb-4">
                  <layer.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{layer.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">{layer.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {layer.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Features */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200">Enhanced UX/UI</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Built for SME Success</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Designed specifically for small and medium enterprises with intuitive interfaces and business-focused
            insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {enhancedFeatures.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg text-white w-fit mb-4">
                  <feature.icon className="w-6 h-6" />
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
