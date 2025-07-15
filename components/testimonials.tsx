import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO",
      company: "TechStart Solutions",
      content:
        "VulnGuard's AI-powered analysis helped us identify critical vulnerabilities we missed with traditional tools. The automated remediation guidance saved us weeks of research.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael Rodriguez",
      role: "IT Director",
      company: "GrowthCorp",
      content:
        "The multi-layer scanning capability is impressive. We now have complete visibility across our cloud infrastructure, web apps, and network - all from one platform.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emily Watson",
      role: "Security Manager",
      company: "InnovateLab",
      content:
        "As an SME, we couldn't afford enterprise security tools. VulnGuard gives us enterprise-grade protection at a fraction of the cost with much better usability.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200">Customer Success</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Trusted by SMEs Worldwide</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how organizations like yours are strengthening their security posture with our AI-powered platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-gray-300 mb-4" />

                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>

                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
