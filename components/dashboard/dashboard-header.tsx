import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, User, Shield, Scan, Brain } from "lucide-react"
import { LogoutButton } from "@/components/auth/logout-button"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold">VulnGuard AI</span>
            </Link>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Brain className="w-3 h-3 mr-1" />
              AI Active
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/scans/new">
              <Button variant="outline" size="sm">
                <Scan className="w-4 h-4 mr-2" />
                New Scan
              </Button>
            </Link>

            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>

            <LogoutButton variant="ghost" size="sm" showIcon={true} showText={false} />
          </div>
        </div>
      </div>
    </header>
  )
}
