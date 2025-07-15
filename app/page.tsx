import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { AIShowcase } from "@/components/ai-showcase"
import { Testimonials } from "@/components/testimonials"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Hero />
      <AIShowcase />
      <Features />
      <HowItWorks />
      <Testimonials />
    </div>
  )
}
