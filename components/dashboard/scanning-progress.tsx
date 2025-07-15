import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Network, Globe, Cloud, Database, CheckCircle, Clock, Play } from "lucide-react"

export function ScanningProgress() {
  const scanLayers = [
    {
      name: "Network Discovery",
      icon: Network,
      status: "completed",
      progress: 100,
      duration: "2m 34s",
      findings: 15,
    },
    {
      name: "Web Application",
      icon: Globe,
      status: "running",
      progress: 65,
      duration: "5m 12s",
      findings: 8,
    },
    {
      name: "Cloud Infrastructure",
      icon: Cloud,
      status: "queued",
      progress: 0,
      duration: "Est. 3m",
      findings: 0,
    },
    {
      name: "Database Security",
      icon: Database,
      status: "queued",
      progress: 0,
      duration: "Est. 4m",
      findings: 0,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "running":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <Activity className="w-3 h-3 mr-1" />
            Running
          </Badge>
        )
      case "queued":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
            <Clock className="w-3 h-3 mr-1" />
            Queued
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Multi-Layer Scanning Progress</CardTitle>
            <CardDescription>Comprehensive security assessment across all infrastructure layers</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Start New Scan
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {scanLayers.map((layer, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <layer.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{layer.name}</p>
                    <p className="text-sm text-gray-500">
                      {layer.duration} • {layer.findings} findings
                    </p>
                  </div>
                </div>
                {getStatusBadge(layer.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{layer.progress}%</span>
                </div>
                <Progress
                  value={layer.progress}
                  className={`h-2 ${
                    layer.status === "completed"
                      ? "[&>div]:bg-green-500"
                      : layer.status === "running"
                        ? "[&>div]:bg-blue-500"
                        : "[&>div]:bg-gray-300"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">AI Analysis in Progress</p>
              <p className="text-sm text-blue-700 mt-1">
                Our AI is analyzing scan results in real-time, classifying vulnerabilities and preparing remediation
                recommendations.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
