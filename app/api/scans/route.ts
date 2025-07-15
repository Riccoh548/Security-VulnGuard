import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { NetworkScanner } from "@/lib/scanning/network-scanner"
import { WebScanner } from "@/lib/scanning/web-scanner"
import { CloudScanner } from "@/lib/scanning/cloud-scanner"
import { DatabaseScanner } from "@/lib/scanning/database-scanner"
import { InfrastructureScanner } from "@/lib/scanning/infrastructure-scanner"

export async function POST(request: NextRequest) {
  try {
    const { scanId, action } = await request.json()

    if (action === "start") {
      return await startScan(scanId)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Scan API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function startScan(scanId: string) {
  const supabase = createClient()

  try {
    // Get scan details
    const { data: scan, error: scanError } = await supabase.from("scans").select("*").eq("id", scanId).single()

    if (scanError || !scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    // Update scan status to running
    await supabase
      .from("scans")
      .update({
        status: "running",
        started_at: new Date().toISOString(),
        progress: 0,
      })
      .eq("id", scanId)

    // Start the appropriate scanner based on scan type
    const scannerPromise = startScanner(scan)

    // Don't await the scanner - let it run in background
    scannerPromise.catch((error) => {
      console.error(`Scanner error for scan ${scanId}:`, error)
      // Update scan status to failed
      supabase
        .from("scans")
        .update({
          status: "failed",
          error_message: error.message,
          completed_at: new Date().toISOString(),
        })
        .eq("id", scanId)
    })

    return NextResponse.json({ message: "Scan started successfully" })
  } catch (error) {
    console.error("Start scan error:", error)
    return NextResponse.json({ error: "Failed to start scan" }, { status: 500 })
  }
}

async function startScanner(scan: any) {
  const supabase = createClient()

  try {
    let scanner
    const config = scan.config || {}

    switch (scan.scan_type) {
      case "network":
        scanner = new NetworkScanner(supabase, scan.id)
        break
      case "web_application":
        scanner = new WebScanner(supabase, scan.id)
        break
      case "cloud":
        scanner = new CloudScanner(supabase, scan.id)
        break
      case "database":
        scanner = new DatabaseScanner(supabase, scan.id)
        break
      case "infrastructure":
        scanner = new InfrastructureScanner(supabase, scan.id)
        break
      default:
        throw new Error(`Unknown scan type: ${scan.scan_type}`)
    }

    // Run the scanner
    await scanner.scan(config.target, config)

    // Mark scan as completed
    await supabase
      .from("scans")
      .update({
        status: "completed",
        progress: 100,
        completed_at: new Date().toISOString(),
      })
      .eq("id", scan.id)
  } catch (error) {
    console.error("Scanner execution error:", error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const organizationId = searchParams.get("organizationId")

  if (!organizationId) {
    return NextResponse.json({ error: "Organization ID required" }, { status: 400 })
  }

  try {
    const { data: scans, error } = await supabase
      .from("scans")
      .select("*, assets(name, type, value)")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ scans })
  } catch (error) {
    console.error("Get scans error:", error)
    return NextResponse.json({ error: "Failed to fetch scans" }, { status: 500 })
  }
}
