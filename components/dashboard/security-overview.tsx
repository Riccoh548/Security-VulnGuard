"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, TrendingUp, Activity } from "lucide-react"

interface SecurityMetrics {
  securityScore: number
  totalVulnerabilities: number
  criticalVulnerabilities: number
  highVulnerabilities: number
  mediumVulnerabilities: number
  lowVulnerabilities: number
  resolvedVulnerabilities: number
  activeScans: number
}

export function SecurityOverview() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    securityScore: 0,
    totalVulnerabilities: 0,
    criticalVulnerabilities: 0,
    highVulnerabilities: 0,
    mediumVulnerabilities: 0,
    lowVulnerabilities: 0,
    resolvedVulnerabilities: 0,
    activeScans: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchSecurityMetrics()
  }, [])

  const fetchSecurityMetrics = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get user's organization
      const { data: orgMember } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .single()

      if (!orgMember) return

      // Fetch vulnerability counts
      const { data: vulnerabilities } = await supabase
        .from("vulnerabilities")
        .select("severity, status")
        .eq("organization_id", orgMember.organization_id)

      // Fetch active scans
      const { data: scans } = await supabase
        .from("scans")
        .select("status")
        .eq("organization_id", orgMember.organization_id)
        .in("status", ["pending", "running"])

      // Calculate metrics
      const vulnCounts = vulnerabilities?.reduce(
        (acc, vuln) => {
          acc.total++
          if (vuln.status === "resolved") acc.resolved++

          switch (vuln.severity) {
            case "Critical":
              acc.critical++
              break
            case "High":
              acc.high++
              break
            case "Medium":
              acc.medium++
              break
            case "Low":
              acc.low++
              break
          }
          return acc
        },
        { total: 0, critical: 0, high: 0, medium: 0, low: 0, resolved: 0 },
      ) || { total: 0, critical: 0, high: 0, medium: 0, low: 0, resolved: 0 }

      // Calculate security score using the database function
      const { data: scoreData } = await supabase.rpc("calculate_security_score", { org_id: orgMember.organization_id })

      setMetrics({
        securityScore: scoreData || 100,
        totalVulnerabilities: vulnCounts.total,
        criticalVulnerabilities: vulnCounts.critical,
        highVulnerabilities: vulnCounts.high,
        mediumVulnerabilities: vulnCounts.medium,
        lowVulnerabilities: vulnCounts.low,
        resolvedVulnerabilities: vulnCounts.resolved,
        activeScans: scans?.length || 0,
      })
    } catch (error) {
      console.error("Error fetching security metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreDescription = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Attention"
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Security Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className={`text-3xl font-bold ${getScoreColor(metrics.securityScore)}`}>
                {metrics.securityScore}/100
              </div>
              <p className="text-sm text-gray-600">{getScoreDescription(metrics.securityScore)}</p>
            </div>
            <div className="text-right">
              <Badge variant={metrics.securityScore >= 80 ? "default" : "destructive"}>
                {metrics.activeScans > 0 ? "Scanning..." : "Up to date"}
              </Badge>
            </div>
          </div>
          <Progress value={metrics.securityScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vulnerabilities</p>
                <p className="text-2xl font-bold">{metrics.totalVulnerabilities}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">{metrics.criticalVulnerabilities}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{metrics.resolvedVulnerabilities}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Scans</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.activeScans}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vulnerability Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Vulnerability Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Critical</span>
              </div>
              <span className="font-medium">{metrics.criticalVulnerabilities}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm">High</span>
              </div>
              <span className="font-medium">{metrics.highVulnerabilities}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Medium</span>
              </div>
              <span className="font-medium">{metrics.mediumVulnerabilities}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Low</span>
              </div>
              <span className="font-medium">{metrics.lowVulnerabilities}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
