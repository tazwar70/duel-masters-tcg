"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, MinusCircle, Save, Download, Trash2 } from "lucide-react"
import cards from "@/lib/cards-data"
import DuelMastersCard from "./duel-masters-card"

interface DeckCard {
  card: (typeof cards)[0]
  quantity: number
}

export default function DeckBuilder() {
  const [deckName, setDeckName] = useState("New Deck")
  const [deckCards, setDeckCards] = useState<DeckCard[]>([])
  const [civilization, setCivilization] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Filter cards based on selected filters and search term
  const filteredCards = cards.filter((card) => {
    if (civilization !== "all" && !card.civilizations.includes(civilization)) return false
    if (searchTerm && !card.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const addCardToDeck = (card: (typeof cards)[0]) => {
    setDeckCards((prev) => {
      const existingCard = prev.find((item) => item.card.id === card.id)
      if (existingCard) {
        return prev.map((item) =>
          item.card.id === card.id ? { ...item, quantity: Math.min(item.quantity + 1, 4) } : item,
        )
      } else {
        return [...prev, { card, quantity: 1 }]
      }
    })
  }

  const removeCardFromDeck = (cardId: string) => {
    setDeckCards((prev) => {
      const existingCard = prev.find((item) => item.card.id === cardId)
      if (existingCard && existingCard.quantity > 1) {
        return prev.map((item) => (item.card.id === cardId ? { ...item, quantity: item.quantity - 1 } : item))
      } else {
        return prev.filter((item) => item.card.id !== cardId)
      }
    })
  }

  const clearDeck = () => {
    if (confirm("Are you sure you want to clear this deck?")) {
      setDeckCards([])
    }
  }

  const saveDeck = () => {
    const deckData = {
      name: deckName,
      cards: deckCards.map((item) => ({ id: item.card.id, quantity: item.quantity })),
      createdAt: new Date().toISOString(),
    }

    // In a real app, you would save this to a database or localStorage
    localStorage.setItem(`deck_${Date.now()}`, JSON.stringify(deckData))
    alert("Deck saved successfully!")
  }

  const exportDeck = () => {
    const deckData = {
      name: deckName,
      cards: deckCards.map((item) => ({
        id: item.card.id,
        name: item.card.name,
        quantity: item.quantity,
      })),
      createdAt: new Date().toISOString(),
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deckData, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `${deckName.replace(/\s+/g, "_")}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  // Calculate deck stats
  const totalCards = deckCards.reduce((sum, item) => sum + item.quantity, 0)
  const civilizationCounts = deckCards.reduce((acc, { card, quantity }) => {
    card.civilizations.forEach(civ => {
      acc[civ] = (acc[civ] || 0) + quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  const civilizationDistribution = Object.entries(civilizationCounts).map(([civ, count]) => ({
    civilization: civ,
    count,
    percentage: Math.round((count / totalCards) * 100),
  }));

  const costDistribution: Record<number, number> = {}

  deckCards.forEach((item) => {
    // Count by mana cost
    if (item.card.cost !== undefined) {
      costDistribution[item.card.cost] = (costDistribution[item.card.cost] || 0) + item.quantity
    }
  })

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Card Browser</h2>
          <div className="flex gap-2">
            <Select value={civilization} onValueChange={setCivilization}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Civilization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="fire">Fire</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="darkness">Darkness</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="search"
              placeholder="Search cards..."
              className="w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filteredCards.map((card) => (
            <div key={card.id} className="relative group">
              <DuelMastersCard card={card} />
              <Button
                size="sm"
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => addCardToDeck(card)}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Deck Builder</CardTitle>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={saveDeck}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={exportDeck}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button size="sm" variant="outline" onClick={clearDeck}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2">
              <Label htmlFor="deck-name">Deck Name</Label>
              <Input id="deck-name" value={deckName} onChange={(e) => setDeckName(e.target.value)} className="mt-1" />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="cards">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cards">Cards ({totalCards})</TabsTrigger>
                <TabsTrigger value="stats">Deck Stats</TabsTrigger>
              </TabsList>
              <TabsContent value="cards" className="mt-4 max-h-[500px] overflow-y-auto pr-2">
                {deckCards.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                    <p className="text-sm text-muted-foreground">Add cards to your deck from the browser</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {deckCards.map((item) => (
                      <div key={item.card.id} className="flex items-center justify-between rounded-md border p-2">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                            <img
                              src={item.card.imageUrl || `/placeholder.svg?height=40&width=40&text=${item.card.name}`}
                              alt={item.card.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium leading-tight">{item.card.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.card.civilization} • {item.card.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => removeCardFromDeck(item.card.id)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="w-4 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => addCardToDeck(item.card)}
                            disabled={item.quantity >= 4}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="stats" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium">Civilization Distribution</h3>
                    <div className="space-y-2">
                      {civilizationDistribution.map(({ civilization, count, percentage }) => (
                        <div key={civilization} className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              civilization.toLowerCase() === "fire"
                                ? "bg-red-500"
                                : civilization.toLowerCase() === "water"
                                  ? "bg-blue-500"
                                  : civilization.toLowerCase() === "light"
                                    ? "bg-yellow-500"
                                    : civilization.toLowerCase() === "darkness"
                                      ? "bg-purple-900"
                                      : civilization.toLowerCase() === "nature"
                                        ? "bg-green-600"
                                        : "bg-gray-500"
                            }`}
                          />
                          <span className="text-sm">{civilization}</span>
                          <div className="flex-1 rounded-full bg-muted">
                            <div
                              className={`h-2 rounded-full ${
                                civilization.toLowerCase() === "fire"
                                  ? "bg-red-500"
                                  : civilization.toLowerCase() === "water"
                                    ? "bg-blue-500"
                                    : civilization.toLowerCase() === "light"
                                      ? "bg-yellow-500"
                                      : civilization.toLowerCase() === "darkness"
                                        ? "bg-purple-900"
                                        : civilization.toLowerCase() === "nature"
                                          ? "bg-green-600"
                                          : "bg-gray-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Mana Curve</h3>
                    <div className="flex h-32 items-end justify-between gap-1">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((cost) => {
                        const count = costDistribution[cost] || 0
                        const maxCount = Math.max(...Object.values(costDistribution), 1)
                        const height = count ? (count / maxCount) * 100 : 0

                        return (
                          <div key={cost} className="flex flex-col items-center">
                            <div className="w-6 text-center text-xs text-muted-foreground">{count || ""}</div>
                            <div
                              className="w-6 bg-primary transition-all duration-300"
                              style={{ height: `${height}%` }}
                            />
                            <div className="w-6 text-center text-xs">{cost}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

