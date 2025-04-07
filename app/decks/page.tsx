import { Card, CardContent } from "@/components/ui/card"
import DeckBuilder from "@/components/deck-builder"

export default function DecksPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-3xl font-bold">Deck Builder</h1>
      <Card>
        <CardContent className="p-6">
          <DeckBuilder />
        </CardContent>
      </Card>
    </div>
  )
}
