"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useCardsData } from "@/lib/use-cards-data"
import cardImages from "@/lib/card-images"
import DuelMastersCard from "./duel-masters-card"
import { cn } from "@/lib/utils"

export default function CardGrid() {
  const { cards, loading, error } = useCardsData()
  const [civilization, setCivilization] = useState<string>("all")
  const [set, setSet] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const cardsPerPage = 12

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [civilization, set, searchTerm])

  // Get unique civilizations and sets for filters
  const uniqueCivilizations = Array.from(
    new Set(cards.flatMap((card) => (Array.isArray(card.civilization) ? card.civilization : [card.civilization]))),
  ).sort()

  const uniqueSets = Array.from(new Set(cards.map((card) => card.set))).sort()

  // Filter cards based on selected filters
  const filteredCards = cards.filter((card) => {
    // Filter by civilization
    if (civilization !== "all") {
      if (Array.isArray(card.civilization)) {
        if (!card.civilization.includes(civilization)) return false
      } else if (card.civilization !== civilization) {
        return false
      }
    }

    // Filter by set
    if (set !== "all" && card.set !== set) return false

    // Filter by search term
    if (searchTerm && !card.name.toLowerCase().includes(searchTerm.toLowerCase())) return false

    return true
  })

  // Pagination
  const indexOfLastCard = currentPage * cardsPerPage
  const indexOfFirstCard = indexOfLastCard - cardsPerPage
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard)
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage)

  // Define civilization colors for badges
  const civilizationStyles: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    Light: {
      bg: "bg-yellow-400",
      text: "text-black",
      border: "border-yellow-300",
      gradient: "from-yellow-400",
    },
    Fire: {
      bg: "bg-red-600",
      text: "text-white",
      border: "border-red-500",
      gradient: "from-red-600",
    },
    Water: {
      bg: "bg-blue-600",
      text: "text-white",
      border: "border-blue-500",
      gradient: "from-blue-600",
    },
    Darkness: {
      bg: "bg-purple-900",
      text: "text-white",
      border: "border-purple-800",
      gradient: "from-purple-900",
    },
    Nature: {
      bg: "bg-green-600",
      text: "text-white",
      border: "border-green-500",
      gradient: "from-green-600",
    },
  }

  // Get gradient style for multi-civilization cards
  const getMultiCivGradient = (civs: string[]) => {
    if (civs.length <= 1) return ""

    const primary = civilizationStyles[civs[0]]?.gradient || "from-gray-500"
    const secondary = civilizationStyles[civs[1]]?.gradient.replace("from-", "to-") || "to-gray-500"

    return `bg-gradient-to-tr ${primary} ${secondary}`
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading card data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Card Browser</h2>
        <div className="flex flex-wrap gap-2">
          <Select value={set} onValueChange={setSet}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Set" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sets</SelectItem>
              {uniqueSets.map((setId) => (
                <SelectItem key={setId} value={setId}>
                  {setId.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={civilization} onValueChange={setCivilization}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Civilization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {uniqueCivilizations.map((civ) => (
                <SelectItem key={civ} value={civ}>
                  {civ}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="search"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground">Showing {filteredCards.length} cards</div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-40 grid-cols-2">
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentCards.map((card) => (
              <DuelMastersCard key={card.id} card={card} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          <div className="space-y-2">
            {currentCards.map((card) => (
              <Card key={card.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={
                          card.imageUrl ||
                          cardImages[card.id] ||
                          `/placeholder.svg?height=48&width=48&text=${card.name || "/placeholder.svg"}`
                        }
                        alt={card.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{card.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            Array.isArray(card.civilization)
                              ? `${getMultiCivGradient(card.civilization)} text-white`
                              : `${civilizationStyles[card.civilization]?.bg || "bg-gray-500"} ${
                                  civilizationStyles[card.civilization]?.text || "text-white"
                                }`,
                          )}
                        >
                          {Array.isArray(card.civilization) ? card.civilization.join(" / ") : card.civilization}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {card.type}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {card.set}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      {card.type === "Creature" && (
                        <>
                          {card.cost !== undefined && (
                            <div
                              className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-sm",
                                Array.isArray(card.civilization)
                                  ? `bg-gradient-to-tr ${
                                      civilizationStyles[card.civilization[0]]?.gradient || "from-gray-500"
                                    } ${
                                      civilizationStyles[card.civilization[1]]?.gradient.replace("from-", "to-") ||
                                      "to-gray-500"
                                    } text-white`
                                  : `${civilizationStyles[card.civilization]?.bg || "bg-gray-500"} ${
                                      civilizationStyles[card.civilization]?.text || "text-white"
                                    }`,
                              )}
                            >
                              {card.cost}
                            </div>
                          )}
                          {card.power !== undefined && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-600 text-white">
                              {card.power}
                            </span>
                          )}
                        </>
                      )}
                      <p className="text-xs text-muted-foreground">{card.rarity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="mx-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
