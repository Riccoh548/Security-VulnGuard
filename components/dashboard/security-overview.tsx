import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Activity } from "lucide-react"

export function SecurityOverview() {
  const metrics = [
    {
      title: "Security Score",
      value: "78",
      unit: "/100",
      change: "+5",
      trend: "up",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Critical Vulnerabilities",
      value: "3",
      change: "-2",
      trend: "down",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "High Priority",
      value: "12",
      change: "+1",
      trend: "up",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Resolved This Week",
      value: "24",
      change: "+8",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Security Overview</h2>
        <Badge className="bg-purple-100 text-purple-700 border-purple-200">
          <Activity className="w-3 h-3 mr-1" />
          Real-time
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  {metric.unit && <span className="text-sm text-gray-500">{metric.unit}</span>}
                </div>
                <p className="text-sm text-gray-600">{metric.title}</p>
                {metric.title === "Security Score" && <Progress value={78} className="h-2" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
