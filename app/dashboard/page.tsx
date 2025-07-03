import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SecurityOverview } from "@/components/dashboard/security-overview"
import { VulnerabilityList } from "@/components/dashboard/vulnerability-list"
import { AIAssistant } from "@/components/dashboard/ai-assistant"
import { ScanningProgress } from "@/components/dashboard/scanning-progress"
import { ThreatIntelligence } from "@/components/dashboard/threat-intelligence"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <SecurityOverview />
            <ScanningProgress />
            <VulnerabilityList />
            <ThreatIntelligence />
          </div>
          <div className="lg:col-span-1">
            <AIAssistant />
          </div>
        </div>
      </div>
    </div>
  )
}
