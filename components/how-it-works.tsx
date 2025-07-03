import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Upload, Scan, Brain, FileText, Zap } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Asset Discovery",
      description: "Upload network ranges, domains, or connect cloud accounts for automatic asset discovery.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Scan,
      title: "Multi-Layer Scanning",
      description: "Our platform performs comprehensive scans across network, web, cloud, and application layers.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Advanced AI algorithms analyze findings, classify vulnerabilities, and assess business impact.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FileText,
      title: "Intelligent Reporting",
      description: "Auto-generated reports with executive summaries, technical details, and remediation guidance.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Zap,
      title: "Automated Remediation",
      description: "AI-powered workflows guide you through remediation with automated scripts and best practices.",
      color: "from-indigo-500 to-blue-500",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">How It Works</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">From Scan to Secure in 5 Steps</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process makes enterprise-grade security accessible to SMEs with minimal technical expertise
            required.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className={`p-4 bg-gradient-to-br ${step.color} rounded-full text-white w-fit mx-auto mb-4`}>
                      <step.icon className="w-8 h-8" />
                    </div>
                    <div className="text-sm font-semibold text-gray-500 mb-2">STEP {index + 1}</div>
                    <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
