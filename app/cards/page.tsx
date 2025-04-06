import { Card, CardContent } from "@/components/ui/card"
import CardGrid from "@/components/card-grid"

export default function CardsPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-3xl font-bold">Card Browser</h1>
      <Card>
        <CardContent className="p-6">
          <CardGrid />
        </CardContent>
      </Card>
    </div>
  )
}

