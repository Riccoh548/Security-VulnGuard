import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Zap, Brain } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-500/20 text-blue-100 border-blue-400/30">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Security Platform
          </Badge>

          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Next-Gen Vulnerability Management with{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>

          <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Comprehensive multi-layer security scanning with AI-powered analysis, automated remediation guidance, and
            intelligent threat classification designed specifically for SMEs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link href="/dashboard">
                Start Free Scan <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-blue-100">
              <Shield className="w-5 h-5" />
              <span>Multi-Layer Scanning</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-100">
              <Brain className="w-5 h-5" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-100">
              <Zap className="w-5 h-5" />
              <span>Automated Workflows</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
