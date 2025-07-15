import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { format } = await request.json()
    const scanId = params.id

    const supabase = createClient()

    // Get scan data
    const { data: scan, error: scanError } = await supabase.from("scans").select("*").eq("id", scanId).single()

    if (scanError || !scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    // Get vulnerabilities
    const { data: vulnerabilities, error: vulnError } = await supabase
      .from("vulnerabilities")
      .select("*")
      .eq("scan_id", scanId)
      .order("ai_priority_score", { ascending: false })

    if (vulnError) {
      return NextResponse.json({ error: "Failed to fetch vulnerabilities" }, { status: 500 })
    }

    // Get asset info
    const { data: asset } = await supabase.from("assets").select("*").eq("id", scan.asset_id).single()

    const reportData = {
      scan,
      asset,
      vulnerabilities: vulnerabilities || [],
      generatedAt: new Date().toISOString(),
      summary: {
        totalVulnerabilities: vulnerabilities?.length || 0,
        criticalCount: vulnerabilities?.filter((v) => v.severity === "Critical").length || 0,
        highCount: vulnerabilities?.filter((v) => v.severity === "High").length || 0,
        mediumCount: vulnerabilities?.filter((v) => v.severity === "Medium").length || 0,
        lowCount: vulnerabilities?.filter((v) => v.severity === "Low").length || 0,
        infoCount: vulnerabilities?.filter((v) => v.severity === "Info").length || 0,
      },
    }

    let content: string
    let contentType: string
    let filename: string

    switch (format) {
      case "json":
        content = JSON.stringify(reportData, null, 2)
        contentType = "application/json"
        filename = `scan-report-${scanId}.json`
        break

      case "csv":
        content = generateCSV(reportData)
        contentType = "text/csv"
        filename = `scan-report-${scanId}.csv`
        break

      case "pdf":
        // For demo purposes, we'll return a simple text report
        // In a real app, you'd use a PDF generation library
        content = generateTextReport(reportData)
        contentType = "text/plain"
        filename = `scan-report-${scanId}.txt`
        break

      default:
        return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
    }

    return new NextResponse(content, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}

function generateCSV(reportData: any): string {
  const headers = [
    "Title",
    "Severity",
    "Category",
    "CVE ID",
    "CVSS Score",
    "Affected Component",
    "Description",
    "Remediation Steps",
    "AI Priority Score",
    "Created At",
  ]

  const rows = reportData.vulnerabilities.map((vuln: any) => [
    vuln.title || "",
    vuln.severity || "",
    vuln.category || "",
    vuln.cve_id || "",
    vuln.cvss_score || "",
    vuln.affected_component || "",
    (vuln.description || "").replace(/"/g, '""'),
    (vuln.remediation_steps || "").replace(/"/g, '""'),
    vuln.ai_priority_score || "",
    vuln.created_at || "",
  ])

  const csvContent = [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

  return csvContent
}

function generateTextReport(reportData: any): string {
  const { scan, asset, vulnerabilities, summary } = reportData

  let report = `VulnGuard Security Scan Report
=====================================

Scan Information:
- Name: ${scan.name}
- Type: ${scan.scan_type.replace("_", " ").toUpperCase()}
- Status: ${scan.status.toUpperCase()}
- Started: ${new Date(scan.created_at).toLocaleString()}
- Completed: ${scan.completed_at ? new Date(scan.completed_at).toLocaleString() : "In Progress"}

Target Information:
- Asset: ${asset?.name || "Unknown"}
- Type: ${asset?.type || "Unknown"}
- Value: ${asset?.value || "Unknown"}

Vulnerability Summary:
- Total Vulnerabilities: ${summary.totalVulnerabilities}
- Critical: ${summary.criticalCount}
- High: ${summary.highCount}
- Medium: ${summary.mediumCount}
- Low: ${summary.lowCount}
- Info: ${summary.infoCount}

Detailed Findings:
==================

`

  vulnerabilities.forEach((vuln: any, index: number) => {
    report += `${index + 1}. ${vuln.title}
   Severity: ${vuln.severity}
   Category: ${vuln.category || "N/A"}
   ${vuln.cve_id ? `CVE ID: ${vuln.cve_id}` : ""}
   ${vuln.cvss_score ? `CVSS Score: ${vuln.cvss_score}` : ""}
   ${vuln.affected_component ? `Affected Component: ${vuln.affected_component}` : ""}
   
   Description:
   ${vuln.description || "No description available"}
   
   ${
     vuln.remediation_steps
       ? `Remediation Steps:
   ${vuln.remediation_steps}`
       : ""
   }
   
   ${
     vuln.ai_summary
       ? `AI Analysis:
   ${vuln.ai_summary}`
       : ""
   }
   
   AI Priority Score: ${vuln.ai_priority_score || "N/A"}
   Found: ${new Date(vuln.created_at).toLocaleString()}
   
---

`
  })

  report += `
Report generated on: ${new Date().toLocaleString()}
Generated by: VulnGuard AI Security Platform
`

  return report
}
