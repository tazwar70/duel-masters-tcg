"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cardsData } from "@/lib/cards-data"
import cardImages from "@/lib/card-images"
import DuelMastersCard from "./duel-masters-card"

export default function CardGrid() {
  const [civilization, setCivilization] = useState<string>("all")
  const [set, setSet] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const cardsPerPage = 12

  // Filter cards based on selected filters
  const filteredCards = cardsData.filter((card) => {
    if (civilization !== "all" && card.civilization !== civilization) return false
    if (set !== "all" && card.set !== set) return false
    return true
  })

  // Pagination
  const indexOfLastCard = currentPage * cardsPerPage
  const indexOfFirstCard = indexOfLastCard - cardsPerPage
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard)
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage)

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
              <SelectItem value="dm-01">DM-01</SelectItem>
              <SelectItem value="dm-02">DM-02</SelectItem>
              <SelectItem value="dm-03">DM-03</SelectItem>
              <SelectItem value="dm-04">DM-04</SelectItem>
            </SelectContent>
          </Select>

          <Select value={civilization} onValueChange={setCivilization}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Civilization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Fire">Fire</SelectItem>
              <SelectItem value="Water">Water</SelectItem>
              <SelectItem value="Light">Light</SelectItem>
              <SelectItem value="Darkness">Darkness</SelectItem>
              <SelectItem value="Nature">Nature</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
                      <p className="text-sm text-muted-foreground">
                        {card.civilization} • {card.type} • {card.set}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      {card.type === "Creature" && (
                        <>
                          {card.cost !== undefined && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                              {card.cost}
                            </div>
                          )}
                          {card.power !== undefined && (
                            <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                              {card.power}
                            </div>
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

