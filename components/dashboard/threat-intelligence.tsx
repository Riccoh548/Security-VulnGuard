import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Globe, Target, AlertTriangle, Brain, Shield } from "lucide-react"

export function ThreatIntelligence() {
  const threatData = [
    {
      category: "SQL Injection Attacks",
      riskLevel: "High",
      trend: "increasing",
      percentage: 85,
      description: "34% increase in SQL injection attempts targeting SME web applications this month.",
      color: "text-red-600",
      bgColor: "bg-red-50",
      progressColor: "bg-red-500",
    },
    {
      category: "Ransomware Campaigns",
      riskLevel: "Critical",
      trend: "stable",
      percentage: 92,
      description: "New ransomware variants specifically targeting small business networks detected.",
      color: "text-red-700",
      bgColor: "bg-red-100",
      progressColor: "bg-red-600",
    },
    {
      category: "Cloud Misconfigurations",
      riskLevel: "Medium",
      trend: "decreasing",
      percentage: 67,
      description: "Improved awareness leading to better cloud security practices among SMEs.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      progressColor: "bg-orange-500",
    },
    {
      category: "Phishing Attempts",
      riskLevel: "High",
      trend: "increasing",
      percentage: 78,
      description: "AI-generated phishing emails becoming more sophisticated and harder to detect.",
      color: "text-red-600",
      bgColor: "bg-red-50",
      progressColor: "bg-red-500",
    },
  ]

  const getRiskBadge = (level: string) => {
    const colors = {
      Critical: "bg-red-100 text-red-700 border-red-200",
      High: "bg-orange-100 text-orange-700 border-orange-200",
      Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Low: "bg-green-100 text-green-700 border-green-200",
    }
    return colors[level as keyof typeof colors] || colors.Low
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case "decreasing":
        return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
      default:
        return <Target className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>AI Threat Intelligence</span>
            </CardTitle>
            <CardDescription>Real-time threat landscape analysis powered by machine learning</CardDescription>
          </div>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
            <Brain className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Your Risk Profile</span>
              </div>
              <p className="text-sm text-blue-700">
                Based on your infrastructure, you're at <strong>moderate risk</strong> for web application attacks. Our
                AI recommends immediate attention to SQL injection vulnerabilities.
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Proactive Defense</span>
              </div>
              <p className="text-sm text-green-700">
                Your current security measures are <strong>above average</strong> for SMEs. Continue monitoring and
                implementing our AI recommendations.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Current Threat Landscape</h3>
            {threatData.map((threat, index) => (
              <div key={index} className={`p-4 rounded-lg border ${threat.bgColor} border-opacity-50`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`w-5 h-5 ${threat.color}`} />
                    <span className="font-medium">{threat.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(threat.trend)}
                    <Badge className={getRiskBadge(threat.riskLevel)}>{threat.riskLevel}</Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{threat.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Threat Level</span>
                    <span className="font-medium">{threat.percentage}%</span>
                  </div>
                  <Progress value={threat.percentage} className={`h-2 [&>div]:${threat.progressColor}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
