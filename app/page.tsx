import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import CardGrid from "@/components/card-grid"
import DeckBuilder from "@/components/deck-builder"
import GameBoard from "@/components/game-board"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <img src="/placeholder.svg?height=32&width=32" alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">Duel Masters TCG</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search cards..."
                className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <nav className="flex items-center gap-2">
              <Link href="/cards">
                <Button variant="ghost">Cards</Button>
              </Link>
              <Link href="/decks">
                <Button variant="ghost">Decks</Button>
              </Link>
              <Link href="/play">
                <Button variant="ghost">Play</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <Tabs defaultValue="cards" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cards">Card Browser</TabsTrigger>
              <TabsTrigger value="deck-builder">Deck Builder</TabsTrigger>
              <TabsTrigger value="game">Game Board</TabsTrigger>
            </TabsList>
            <TabsContent value="cards" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <CardGrid />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="deck-builder" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <DeckBuilder />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="game" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <GameBoard />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Duel Masters TCG App - Sets DM-01 to DM-04</p>
          <p className="text-sm text-muted-foreground">Created with Next.js</p>
        </div>
      </footer>
    </div>
  )
}
