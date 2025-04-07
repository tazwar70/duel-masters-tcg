import { Card, CardContent } from "@/components/ui/card"
import GameBoard from "@/components/game-board"

export default function PlayPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-3xl font-bold">Game Board</h1>
      <Card>
        <CardContent className="p-6">
          <GameBoard />
        </CardContent>
      </Card>
    </div>
  )
}
