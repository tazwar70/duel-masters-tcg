"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import cardImages from "@/lib/card-images"

interface CardProps {
  card: {
    id: string
    name: string
    civilization: string
    type: string
    race?: string
    cost?: number
    power?: number
    text?: string
    imageUrl?: string
    set: string
    rarity: string
  }
  showDetails?: boolean
  onClick?: () => void
  className?: string
}

export default function DuelMastersCard({ card, showDetails = false, onClick, className }: CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const civilizationColors: Record<string, { bg: string; text: string; accent: string; border: string }> = {
    fire: {
      bg: "bg-red-500",
      text: "text-white",
      accent: "bg-red-600",
      border: "border-red-400",
    },
    water: {
      bg: "bg-blue-500",
      text: "text-white",
      accent: "bg-blue-600",
      border: "border-blue-400",
    },
    light: {
      bg: "bg-yellow-500",
      text: "text-black",
      accent: "bg-yellow-600",
      border: "border-yellow-400",
    },
    darkness: {
      bg: "bg-purple-900",
      text: "text-white",
      accent: "bg-purple-950",
      border: "border-purple-700",
    },
    nature: {
      bg: "bg-green-600",
      text: "text-white",
      accent: "bg-green-700",
      border: "border-green-500",
    },
  }

  const civColors = civilizationColors[card.civilization.toLowerCase()] || {
    bg: "bg-gray-500",
    text: "text-white",
    accent: "bg-gray-600",
    border: "border-gray-400",
  }

  // Get card image from our image service
  const cardImageUrl = card.imageUrl || cardImages[card.id] || `/placeholder.svg?height=350&width=250&text=${card.name}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className={cn("group relative overflow-hidden transition-all duration-200 hover:shadow-md", className)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onClick}
        >
          <div className={cn("absolute inset-0 opacity-20", civColors.bg)} />
          <CardContent className="p-3">
            <div className="relative aspect-[2.5/3.5] overflow-hidden rounded-sm bg-muted">
              <img
                // src={cardImageUrl || "/placeholder.svg"}
                src={card.imageUrl || "/placeholder.svg"}
                alt={card.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Card name and civilization at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                <h3 className="font-bold leading-tight">{card.name}</h3>
                <p className="text-xs opacity-90">{card.civilization}</p>
              </div>

              {/* Mana cost in top left corner as a circle with civilization color */}
              {card.cost !== undefined && (
                <div className="absolute left-2 top-2 flex items-center justify-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm font-bold shadow-md",
                      civColors.bg,
                      civColors.text,
                    )}
                  >
                    {card.cost}
                  </div>
                </div>
              )}

              {/* Power in bottom right as a circle */}
              {card.type === "Creature" && (
                <div className="absolute bottom-12 right-2">
                  <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                    {card.power || "?"}
                  </div>
                </div>
              )}
            </div>
            {showDetails && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{card.type}</span>
                  <span className="text-xs text-muted-foreground">{card.set}</span>
                </div>
                {card.race && <p className="text-xs text-muted-foreground">{card.race}</p>}
                {card.text && <p className="text-xs line-clamp-2">{card.text}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{card.name}</DialogTitle>
          <DialogDescription>
            {card.civilization} • {card.type} • {card.set}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative aspect-[2.5/3.5] w-full max-w-[180px] overflow-hidden rounded-md bg-muted sm:w-[180px]">
            <img src={cardImageUrl || "/placeholder.svg"} alt={card.name} className="h-full w-full object-cover" />

            {/* Mana cost in top left corner as a circle with civilization color */}
            {card.cost !== undefined && (
              <div className="absolute left-2 top-2 flex items-center justify-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm font-bold shadow-md",
                    civColors.bg,
                    civColors.text,
                  )}
                >
                  {card.cost}
                </div>
              </div>
            )}

            {/* Power in bottom right as a circle */}
            {card.type === "Creature" && (
              <div className="absolute bottom-12 right-2">
                <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                  {card.power || "?"}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium">Civilization</p>
                <p className="text-sm">{card.civilization}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm">{card.type}</p>
              </div>
              {card.race && (
                <div>
                  <p className="text-sm font-medium">Race</p>
                  <p className="text-sm">{card.race}</p>
                </div>
              )}
              {card.cost !== undefined && (
                <div>
                  <p className="text-sm font-medium">Cost</p>
                  <p className="text-sm">{card.cost}</p>
                </div>
              )}
              {card.type === "Creature" && (
                <div>
                  <p className="text-sm font-medium">Power</p>
                  <p className="text-sm">{card.power}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Rarity</p>
                <p className="text-sm">{card.rarity}</p>
              </div>
            </div>
            {card.text && (
              <div>
                <p className="text-sm font-medium">Card Text</p>
                <p className="text-sm whitespace-pre-line">{card.text}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

