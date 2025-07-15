"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Network,
  Globe,
  Cloud,
  Database,
  Server,
  Shield,
  ArrowRight,
  ArrowLeft,
  Play,
  Settings,
  Target,
  Clock,
  AlertTriangle,
  Info,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ScanLayer {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  enabled: boolean
  estimatedTime: string
  complexity: "Low" | "Medium" | "High"
  config: Record<string, any>
}

const scanLayers: ScanLayer[] = [
  {
    id: "network",
    name: "Network Security",
    description: "Comprehensive port scanning, service detection, and network vulnerability assessment",
    icon: Network,
    enabled: false,
    estimatedTime: "5-15 minutes",
    complexity: "Medium",
    config: {
      portRange: "1-65535",
      aggressive: false,
      timeout: 5000,
      threads: 10,
    },
  },
  {
    id: "web_application",
    name: "Web Application Security",
    description: "OWASP Top 10 testing, SQL injection, XSS, authentication bypass, and more",
    icon: Globe,
    enabled: false,
    estimatedTime: "10-30 minutes",
    complexity: "High",
    config: {
      depth: 3,
      includeSubdomains: false,
      followRedirects: true,
      userAgent: "VulnGuard Scanner 1.0",
      authRequired: false,
    },
  },
  {
    id: "cloud",
    name: "Cloud Infrastructure",
    description: "Multi-cloud security assessment for AWS, Azure, GCP configurations and compliance",
    icon: Cloud,
    enabled: false,
    estimatedTime: "8-20 minutes",
    complexity: "High",
    config: {
      provider: "aws",
      regions: ["us-east-1"],
      services: ["s3", "ec2", "iam", "rds"],
      complianceChecks: ["SOC2", "GDPR", "HIPAA"],
    },
  },
  {
    id: "database",
    name: "Database Security",
    description: "Database access control, encryption, privilege escalation, and data leakage assessment",
    icon: Database,
    enabled: false,
    estimatedTime: "6-18 minutes",
    complexity: "Medium",
    config: {
      dbType: "mysql",
      port: 3306,
      checkEncryption: true,
      checkPrivileges: true,
      checkAuditing: true,
    },
  },
  {
    id: "infrastructure",
    name: "Infrastructure Security",
    description: "OS vulnerabilities, patch management, system hardening, and configuration assessment",
    icon: Server,
    enabled: false,
    estimatedTime: "7-25 minutes",
    complexity: "Medium",
    config: {
      osType: "linux",
      checkPatches: true,
      checkServices: true,
      checkConfigurations: true,
      scanDepth: "standard",
    },
  },
]

export function ScanWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [scanName, setScanName] = useState("")
  const [scanDescription, setScanDescription] = useState("")
  const [targetUrl, setTargetUrl] = useState("")
  const [targetType, setTargetType] = useState("url")
  const [priority, setPriority] = useState("medium")
  const [scheduledScan, setScheduledScan] = useState(false)
  const [layers, setLayers] = useState<ScanLayer[]>(scanLayers)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleLayerToggle = (layerId: string) => {
    setLayers((prev) => prev.map((layer) => (layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer)))
  }

  const handleLayerConfigUpdate = (layerId: string, configKey: string, value: any) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, config: { ...layer.config, [configKey]: value } } : layer,
      ),
    )
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getTotalEstimatedTime = () => {
    const enabledLayers = layers.filter((layer) => layer.enabled)
    if (enabledLayers.length === 0) return "0 minutes"

    const totalMinutes = enabledLayers.reduce((total, layer) => {
      const timeRange = layer.estimatedTime.match(/(\d+)-(\d+)/)
      if (timeRange) {
        return total + (Number.parseInt(timeRange[1]) + Number.parseInt(timeRange[2])) / 2
      }
      return total + 10
    }, 0)

    return `${Math.round(totalMinutes)} minutes`
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low":
        return "bg-green-100 text-green-700 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "High":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const handleCreateScan = async () => {
    if (!scanName.trim()) {
      toast.error("Please enter a scan name")
      return
    }

    if (!targetUrl.trim()) {
      toast.error("Please enter a target URL or IP")
      return
    }

    const enabledLayers = layers.filter((layer) => layer.enabled)
    if (enabledLayers.length === 0) {
      toast.error("Please select at least one scan layer")
      return
    }

    setIsCreating(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Please log in to create a scan")
        return
      }

      // Get user's organization
      const { data: orgMember } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .single()

      if (!orgMember) {
        toast.error("No organization found")
        return
      }

      // Create asset first
      const { data: asset, error: assetError } = await supabase
        .from("assets")
        .insert({
          organization_id: orgMember.organization_id,
          name: scanName,
          type: targetType === "url" ? "domain" : targetType === "ip" ? "ip_address" : "domain",
          value: targetUrl,
          description: scanDescription,
        })
        .select()
        .single()

      if (assetError) {
        console.error("Asset creation error:", assetError)
        toast.error("Failed to create asset")
        return
      }

      // Create scans for each enabled layer
      const scanPromises = enabledLayers.map((layer) =>
        supabase
          .from("scans")
          .insert({
            organization_id: orgMember.organization_id,
            asset_id: asset.id,
            name: `${scanName} - ${layer.name}`,
            scan_type: layer.id as any,
            status: "pending",
            progress: 0,
            created_by: user.id,
            config: {
              target: targetUrl,
              target_type: targetType,
              priority: priority,
              scheduled: scheduledScan,
              layer_config: layer.config,
            },
          })
          .select()
          .single(),
      )

      const results = await Promise.all(scanPromises)
      const hasErrors = results.some((result) => result.error)

      if (hasErrors) {
        toast.error("Some scans failed to create")
        return
      }

      // Start the scans
      const scanIds = results.map((result) => result.data?.id).filter(Boolean)
      await Promise.all(
        scanIds.map((scanId) =>
          fetch("/api/scans", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ scanId, action: "start" }),
          }),
        ),
      )

      toast.success(`Created and started ${scanIds.length} scan(s) successfully!`)
      router.push("/dashboard")
    } catch (error) {
      console.error("Scan creation error:", error)
      toast.error("Failed to create scan")
    } finally {
      setIsCreating(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return scanName.trim().length > 0
      case 2:
        return targetUrl.trim().length > 0
      case 3:
        return layers.some((layer) => layer.enabled)
      case 4:
        return true
      default:
        return false
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Settings className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold">Scan Configuration</h2>
        <p className="text-gray-600">Set up basic information for your security assessment</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <Label htmlFor="scanName">Scan Name *</Label>
          <Input
            id="scanName"
            placeholder="e.g., Production Website Security Audit"
            value={scanName}
            onChange={(e) => setScanName(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="scanDescription">Description (Optional)</Label>
          <Textarea
            id="scanDescription"
            placeholder="Brief description of what you're scanning and why"
            value={scanDescription}
            onChange={(e) => setScanDescription(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label>Scan Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="critical">Critical Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="scheduled" checked={scheduledScan} onCheckedChange={setScheduledScan} />
          <Label htmlFor="scheduled">Schedule for later execution</Label>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Target className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold">Target Configuration</h2>
        <p className="text-gray-600">Specify what you want to scan</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <div>
          <Label>Target Type</Label>
          <RadioGroup value={targetType} onValueChange={setTargetType} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="url" id="url" />
              <Label htmlFor="url">Website/Web Application</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ip" id="ip" />
              <Label htmlFor="ip">IP Address/Network Range</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="domain" id="domain" />
              <Label htmlFor="domain">Domain/Subdomain</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="targetUrl">
            {targetType === "url" && "Target URL *"}
            {targetType === "ip" && "IP Address/Range *"}
            {targetType === "domain" && "Domain Name *"}
          </Label>
          <Input
            id="targetUrl"
            placeholder={
              targetType === "url"
                ? "https://example.com"
                : targetType === "ip"
                  ? "192.168.1.1 or 192.168.1.0/24"
                  : "example.com"
            }
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            {targetType === "url" && "Enter the full URL including protocol (http/https)"}
            {targetType === "ip" && "Enter single IP or CIDR notation for ranges"}
            {targetType === "domain" && "Enter domain name without protocol"}
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Important Notice</p>
              <p className="text-sm text-yellow-700 mt-1">
                Only scan systems you own or have explicit permission to test. Unauthorized scanning may violate terms
                of service or laws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Shield className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold">Security Layers</h2>
        <p className="text-gray-600">Choose which security aspects to assess</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {layers.map((layer) => {
          const IconComponent = layer.icon
          return (
            <Card
              key={layer.id}
              className={`cursor-pointer transition-all ${
                layer.enabled ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleLayerToggle(layer.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Checkbox checked={layer.enabled} onChange={() => handleLayerToggle(layer.id)} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        <h3 className="font-medium">{layer.name}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getComplexityColor(layer.complexity)}>{layer.complexity}</Badge>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{layer.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{layer.description}</p>

                    {layer.enabled && (
                      <div className="bg-white border rounded-lg p-3 space-y-3">
                        <h4 className="font-medium text-sm">Configuration Options</h4>
                        {layer.id === "network" && (
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs">Port Range</Label>
                              <Input
                                size="sm"
                                value={layer.config.portRange}
                                onChange={(e) => handleLayerConfigUpdate(layer.id, "portRange", e.target.value)}
                                placeholder="1-65535"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={layer.config.aggressive}
                                onCheckedChange={(checked) => handleLayerConfigUpdate(layer.id, "aggressive", checked)}
                              />
                              <Label className="text-xs">Aggressive scanning</Label>
                            </div>
                          </div>
                        )}
                        {layer.id === "web_application" && (
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs">Crawl Depth</Label>
                              <Slider
                                value={[layer.config.depth]}
                                onValueChange={(value) => handleLayerConfigUpdate(layer.id, "depth", value[0])}
                                max={5}
                                min={1}
                                step={1}
                                className="mt-1"
                              />
                              <span className="text-xs text-gray-500">{layer.config.depth} levels</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={layer.config.includeSubdomains}
                                onCheckedChange={(checked) =>
                                  handleLayerConfigUpdate(layer.id, "includeSubdomains", checked)
                                }
                              />
                              <Label className="text-xs">Include subdomains</Label>
                            </div>
                          </div>
                        )}
                        {layer.id === "cloud" && (
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs">Cloud Provider</Label>
                              <Select
                                value={layer.config.provider}
                                onValueChange={(value) => handleLayerConfigUpdate(layer.id, "provider", value)}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="aws">Amazon Web Services</SelectItem>
                                  <SelectItem value="azure">Microsoft Azure</SelectItem>
                                  <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {layers.some((layer) => layer.enabled) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Scan Summary</p>
              <p className="text-sm text-blue-700 mt-1">
                {layers.filter((layer) => layer.enabled).length} layer(s) selected • Estimated time:{" "}
                {getTotalEstimatedTime()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Shield className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold">Review & Launch</h2>
        <p className="text-gray-600">Review your scan configuration before launching</p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Name:</span>
                <p className="font-medium">{scanName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Target:</span>
                <p className="font-medium">{targetUrl}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Priority:</span>
                <p className="font-medium capitalize">{priority}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Estimated Time:</span>
                <p className="font-medium">{getTotalEstimatedTime()}</p>
              </div>
            </div>
            {scanDescription && (
              <div>
                <span className="text-sm text-gray-600">Description:</span>
                <p className="text-sm mt-1">{scanDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Selected Security Layers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {layers
                .filter((layer) => layer.enabled)
                .map((layer) => {
                  const IconComponent = layer.icon
                  return (
                    <div key={layer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{layer.name}</p>
                          <p className="text-sm text-gray-600">{layer.estimatedTime}</p>
                        </div>
                      </div>
                      <Badge className={getComplexityColor(layer.complexity)}>{layer.complexity}</Badge>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <span>New Security Scan</span>
              </CardTitle>
              <CardDescription>
                Step {currentStep} of {totalSteps}: Configure your comprehensive security assessment
              </CardDescription>
            </div>
            <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i + 1 <= currentStep ? "bg-blue-600" : "bg-gray-300"}`}
                />
              ))}
            </div>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleCreateScan} disabled={!canProceed() || isCreating}>
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating Scans...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Launch Security Scan
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
