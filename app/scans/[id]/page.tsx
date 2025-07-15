import { ScanResults } from "@/components/scanning/scan-results"

interface ScanPageProps {
  params: {
    id: string
  }
}

export default function ScanPage({ params }: ScanPageProps) {
  return (
    <div className="container mx-auto py-8">
      <ScanResults scanId={params.id} />
    </div>
  )
}
