"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Download,
  RefreshCw,
  Shield,
  Network,
  Globe,
  Cloud,
  DatabaseIcon,
  Server,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Share2,
  Eye,
  Filter,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { ScanDatabase } from "@/lib/supabase/types"
import { toast } from "sonner"

type Scan = ScanDatabase["public"]["Tables"]["scans"]["Row"]
type Vulnerability = ScanDatabase["public"]["Tables"]["vulnerabilities"]["Row"]

interface ScanResultsProps {
  scanId: string
}

const layerIcons = {
  network: Network,
  web_application: Globe,
  cloud: Cloud,
  database: DatabaseIcon,
  infrastructure: Server,
}

const severityColors = {
  Critical: "bg-red-500 text-white",
  High: "bg-orange-500 text-white",
  Medium: "bg-yellow-500 text-white",
  Low: "bg-blue-500 text-white",
  Info: "bg-gray-500 text-white",
}

const priorityColors = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
}

export function ScanResults({ scanId }: ScanResultsProps) {
  const [scan, setScan] = useState<Scan | null>(null)
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const supabase = createClient()

  useEffect(() => {
    fetchScanData()

    // Set up real-time subscription for scan updates
    const subscription = supabase
      .channel(`scan-${scanId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scans", filter: `id=eq.${scanId}` },
        (payload) => {
          setScan(payload.new as Scan)
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vulnerabilities", filter: `scan_id=eq.${scanId}` },
        () => {
          fetchVulnerabilities()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [scanId])

  const fetchScanData = async () => {
    try {
      const { data: scanData, error: scanError } = await supabase.from("scans").select("*").eq("id", scanId).single()

      if (scanError) {
        console.error("Error fetching scan:", scanError)
        toast.error("Failed to load scan data")
        return
      }

      setScan(scanData)
      await fetchVulnerabilities()
    } catch (error) {
      console.error("Error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchVulnerabilities = async () => {
    const { data, error } = await supabase
      .from("vulnerabilities")
      .select("*")
      .eq("scan_id", scanId)
      .order("ai_priority_score", { ascending: false })

    if (!error && data) {
      setVulnerabilities(data)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "running":
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "failed":
        return "bg-red-100 text-red-700 border-red-200"
      case "running":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getSeverityStats = () => {
    const stats = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
      Info: 0,
    }

    vulnerabilities.forEach((vuln) => {
      stats[vuln.severity]++
    })

    return stats
  }

  const getRiskTrend = (severity: string, count: number) => {
    // Mock trend calculation - in real app, compare with previous scans
    const mockTrend = Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "same"

    if (mockTrend === "up") return <TrendingUp className="w-4 h-4 text-red-500" />
    if (mockTrend === "down") return <TrendingDown className="w-4 h-4 text-green-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getRiskScore = () => {
    const stats = getSeverityStats()
    return stats.Critical * 10 + stats.High * 7 + stats.Medium * 4 + stats.Low * 1
  }

  const getFilteredVulnerabilities = () => {
    return vulnerabilities.filter((vuln) => {
      const severityMatch = selectedSeverity === "all" || vuln.severity === selectedSeverity
      const categoryMatch = selectedCategory === "all" || vuln.category === selectedCategory
      return severityMatch && categoryMatch
    })
  }

  const exportReport = async (format: "pdf" | "csv" | "json") => {
    try {
      const response = await fetch(`/api/scans/${scanId}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      })

      if (!response.ok) {
        throw new Error("Export failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `scan-report-${scanId}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`Report exported as ${format.toUpperCase()}`)
    } catch (error) {
      console.error("Export error:", error)
      toast.error("Failed to export report")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!scan) {
    return (
      <div className="text-center py-8">
        <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Scan not found</p>
      </div>
    )
  }

  const LayerIcon = layerIcons[scan.scan_type] || Shield
  const severityStats = getSeverityStats()
  const riskScore = getRiskScore()
  const filteredVulnerabilities = getFilteredVulnerabilities()

  return (
    <div className="space-y-6">
      {/* Scan Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <LayerIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{scan.name}</CardTitle>
                <CardDescription className="flex items-center space-x-4 mt-1">
                  <span>Started {new Date(scan.created_at).toLocaleString()}</span>
                  {scan.config?.priority && (
                    <Badge className={priorityColors[scan.config.priority as keyof typeof priorityColors]}>
                      {scan.config.priority} priority
                    </Badge>
                  )}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(scan.status)}>
                {getStatusIcon(scan.status)}
                <span className="ml-2 capitalize">{scan.status}</span>
              </Badge>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => exportReport("pdf")}>
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportReport("csv")}>
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Scan Progress</span>
                <span>{scan.progress}%</span>
              </div>
              <Progress value={scan.progress} className="h-2" />
            </div>

            {scan.status === "running" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  Scan is currently running. Results will appear here as they become available.
                </p>
              </div>
            )}

            {scan.status === "completed" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{riskScore}</p>
                  <p className="text-sm text-gray-600">Risk Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{vulnerabilities.length}</p>
                  <p className="text-sm text-gray-600">Total Issues</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{severityStats.Critical + severityStats.High}</p>
                  <p className="text-sm text-gray-600">Critical & High</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {scan.completed_at && scan.started_at
                      ? Math.round(
                          (new Date(scan.completed_at).getTime() - new Date(scan.started_at).getTime()) / 60000,
                        )
                      : 0}
                    m
                  </p>
                  <p className="text-sm text-gray-600">Duration</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities ({vulnerabilities.length})</TabsTrigger>
          <TabsTrigger value="remediation">Remediation</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Severity Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(severityStats).map(([severity, count]) => (
              <Card key={severity}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{severity}</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getRiskTrend(severity, count)}
                      <Badge className={severityColors[severity as keyof typeof severityColors]}>{severity}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Overall security posture analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Overall Risk Level</span>
                  <Badge
                    className={
                      riskScore >= 50
                        ? "bg-red-500 text-white"
                        : riskScore >= 25
                          ? "bg-orange-500 text-white"
                          : riskScore >= 10
                            ? "bg-yellow-500 text-white"
                            : "bg-green-500 text-white"
                    }
                  >
                    {riskScore >= 50 ? "Critical" : riskScore >= 25 ? "High" : riskScore >= 10 ? "Medium" : "Low"}
                  </Badge>
                </div>
                <Progress
                  value={Math.min((riskScore / 100) * 100, 100)}
                  className={`h-3 ${
                    riskScore >= 50
                      ? "[&>div]:bg-red-500"
                      : riskScore >= 25
                        ? "[&>div]:bg-orange-500"
                        : riskScore >= 10
                          ? "[&>div]:bg-yellow-500"
                          : "[&>div]:bg-green-500"
                  }`}
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Immediate Action Required</p>
                    <p className="text-gray-600">{severityStats.Critical} critical vulnerabilities</p>
                  </div>
                  <div>
                    <p className="font-medium">Priority Fixes</p>
                    <p className="text-gray-600">{severityStats.High} high severity issues</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Vulnerabilities */}
          <Card>
            <CardHeader>
              <CardTitle>Critical & High Severity Issues</CardTitle>
              <CardDescription>Issues requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {vulnerabilities
                    .filter((v) => v.severity === "Critical" || v.severity === "High")
                    .slice(0, 10)
                    .map((vuln) => (
                      <div key={vuln.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium">{vuln.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{vuln.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={severityColors[vuln.severity]}>{vuln.severity}</Badge>
                            {vuln.cvss_score && <span className="text-xs text-gray-500">CVSS: {vuln.cvss_score}</span>}
                            {vuln.category && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {vuln.category}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Priority Score</p>
                          <p className="font-bold text-red-600">{vuln.ai_priority_score || 0}</p>
                        </div>
                      </div>
                    ))}

                  {vulnerabilities.filter((v) => v.severity === "Critical" || v.severity === "High").length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <p>No critical or high severity issues found!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="all">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Info">Info</option>
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="Network Security">Network Security</option>
                  <option value="Web Application">Web Application</option>
                  <option value="Cloud Security">Cloud Security</option>
                  <option value="Database Security">Database Security</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
                <span className="text-sm text-gray-500">
                  Showing {filteredVulnerabilities.length} of {vulnerabilities.length} vulnerabilities
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Vulnerabilities</CardTitle>
              <CardDescription>Complete list of identified security issues</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {filteredVulnerabilities.map((vuln) => (
                    <div key={vuln.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{vuln.title}</h4>
                            {vuln.ai_priority_score && vuln.ai_priority_score > 80 && (
                              <Badge variant="destructive" className="text-xs">
                                AI Priority
                              </Badge>
                            )}
                          </div>
                          {vuln.description && <p className="text-sm text-gray-600 mt-1">{vuln.description}</p>}
                          {vuln.ai_summary && (
                            <div className="mt-2 p-2 bg-purple-50 rounded text-sm">
                              <div className="flex items-center space-x-1 mb-1">
                                <Eye className="w-3 h-3 text-purple-600" />
                                <strong className="text-purple-800">AI Analysis:</strong>
                              </div>
                              <p className="text-purple-700">{vuln.ai_summary}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={severityColors[vuln.severity]}>{vuln.severity}</Badge>
                          {vuln.ai_priority_score && (
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Priority</p>
                              <p className="font-bold text-sm">{vuln.ai_priority_score}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          {vuln.cve_id && <span>CVE: {vuln.cve_id}</span>}
                          {vuln.cvss_score && <span>CVSS: {vuln.cvss_score}</span>}
                          {vuln.category && <span>Category: {vuln.category}</span>}
                          {vuln.affected_component && <span>Component: {vuln.affected_component}</span>}
                        </div>
                        <span>{new Date(vuln.created_at).toLocaleDateString()}</span>
                      </div>

                      {vuln.remediation_steps && (
                        <div className="mt-3 p-3 bg-green-50 rounded text-sm">
                          <strong className="text-green-800">Remediation Steps:</strong>
                          <p className="mt-1 text-green-700">{vuln.remediation_steps}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredVulnerabilities.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No vulnerabilities match the selected filters</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remediation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Remediation Roadmap</CardTitle>
              <CardDescription>Prioritized action plan for addressing security issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {["Critical", "High", "Medium", "Low"].map((severity) => {
                  const severityVulns = vulnerabilities.filter((v) => v.severity === severity)
                  if (severityVulns.length === 0) return null

                  return (
                    <div key={severity}>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className={severityColors[severity as keyof typeof severityColors]}>{severity}</Badge>
                        <span className="text-sm text-gray-600">({severityVulns.length} issues)</span>
                      </div>
                      <div className="space-y-3 ml-4">
                        {severityVulns.slice(0, 5).map((vuln) => (
                          <div key={vuln.id} className="border-l-2 border-gray-200 pl-4">
                            <h4 className="font-medium">{vuln.title}</h4>
                            {vuln.remediation_steps && (
                              <p className="text-sm text-gray-600 mt-1">{vuln.remediation_steps}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-gray-500">Estimated effort:</span>
                              <Badge variant="outline" className="text-xs">
                                {severity === "Critical" ? "High" : severity === "High" ? "Medium" : "Low"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {severityVulns.length > 5 && (
                          <p className="text-sm text-gray-500 ml-4">
                            +{severityVulns.length - 5} more {severity.toLowerCase()} severity issues
                          </p>
                        )}
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scan Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scan Type</p>
                  <p className="capitalize">{scan.scan_type.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="capitalize">{scan.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Started</p>
                  <p>{scan.started_at ? new Date(scan.started_at).toLocaleString() : "Not started"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p>{scan.completed_at ? new Date(scan.completed_at).toLocaleString() : "In progress"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Created By</p>
                  <p>{scan.created_by || "System"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p>{scan.progress}%</p>
                </div>
              </div>

              {scan.config && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Configuration Details</p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-64">
                    {JSON.stringify(scan.config, null, 2)}
                  </pre>
                </div>
              )}

              {scan.results && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Scan Results Summary</p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(scan.results, null, 2)}
                  </pre>
                </div>
              )}

              {scan.error_message && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-800">Error Details</p>
                  <p className="text-sm text-red-700 mt-1">{scan.error_message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
