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
import type { DuelMastersCard } from "@/lib/cards-data"

interface CardProps {
  card: DuelMastersCard
  showDetails?: boolean
  onClick?: () => void
  className?: string
}

export default function DuelMastersCardComponent({ card, showDetails = false, onClick, className }: CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Define civilization colors for badges and styling
  const civilizationStyles: Record<
    string,
    {
      bg: string
      text: string
      border: string
      gradient: string
      icon: string
    }
  > = {
    Light: {
      bg: "bg-yellow-400",
      text: "text-black",
      border: "border-yellow-300",
      gradient: "from-yellow-400",
      icon: "☀️", // Sun icon
    },
    Fire: {
      bg: "bg-red-600",
      text: "text-white",
      border: "border-red-500",
      gradient: "from-red-600",
      icon: "⚙️", // Gear icon
    },
    Water: {
      bg: "bg-blue-600",
      text: "text-white",
      border: "border-blue-500",
      gradient: "from-blue-600",
      icon: "💧", // Water droplet icon
    },
    Darkness: {
      bg: "bg-purple-900",
      text: "text-white",
      border: "border-purple-800",
      gradient: "from-purple-900",
      icon: "🦇", // Bat icon
    },
    Nature: {
      bg: "bg-green-600",
      text: "text-white",
      border: "border-green-500",
      gradient: "from-green-600",
      icon: "🌿", // Leaf icon
    },
  }

  // Handle multi-civilization cards
  const primaryCivilization = Array.isArray(card.civilization) ? card.civilization[0] : card.civilization
  const secondaryCivilization =
    Array.isArray(card.civilization) && card.civilization.length > 1 ? card.civilization[1] : null

  // Get styles for primary civilization
  const primaryStyle = civilizationStyles[primaryCivilization] || {
    bg: "bg-gray-500",
    text: "text-white",
    border: "border-gray-400",
    gradient: "from-gray-500",
    icon: "❓",
  }

  // Get styles for secondary civilization if it exists
  const secondaryStyle = secondaryCivilization ? civilizationStyles[secondaryCivilization] || primaryStyle : null

  // Create gradient style for dual civilization cards
  const getGradientStyle = () => {
    if (!secondaryStyle) return primaryStyle.bg

    return `bg-gradient-to-tr ${primaryStyle.gradient} ${secondaryStyle.gradient.replace("from-", "to-")}`
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
          <div className={cn("absolute inset-0 opacity-20", getGradientStyle())} />
          <CardContent className="p-3">
            <div className="relative aspect-[2.5/3.5] overflow-hidden rounded-sm bg-muted">
              <img
                src={cardImageUrl || "/placeholder.svg"}
                alt={card.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Card name and civilization at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                <h3 className="font-bold leading-tight">{card.name}</h3>
                <div className="mt-1">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      Array.isArray(card.civilization)
                        ? `bg-gradient-to-tr ${primaryStyle.gradient} ${secondaryStyle?.gradient.replace(
                            "from-",
                            "to-",
                          )} text-white`
                        : `${primaryStyle.bg} ${primaryStyle.text}`,
                    )}
                  >
                    {Array.isArray(card.civilization) ? card.civilization.join(" / ") : card.civilization}
                  </span>
                </div>
              </div>

              {/* Mana cost in top left corner as a circle with civilization color */}
              {card.cost !== undefined && (
                <div className="absolute left-2 top-2 flex items-center justify-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm font-bold shadow-md",
                      Array.isArray(card.civilization)
                        ? `bg-gradient-to-tr ${primaryStyle.gradient} ${secondaryStyle?.gradient.replace(
                            "from-",
                            "to-",
                          )}`
                        : primaryStyle.bg,
                      primaryStyle.text,
                    )}
                  >
                    {card.cost}
                  </div>
                </div>
              )}

              {/* Power badge in bottom right */}
              {card.type === "Creature" && card.power !== undefined && (
                <div className="absolute bottom-12 right-2 z-10">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      "bg-red-600 text-white",
                    )}
                  >
                    {typeof card.power === "number" ? card.power : card.power}
                  </span>
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
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mr-2",
                Array.isArray(card.civilization)
                  ? `bg-gradient-to-tr ${primaryStyle.gradient} ${secondaryStyle?.gradient.replace(
                      "from-",
                      "to-",
                    )} text-white`
                  : `${primaryStyle.bg} ${primaryStyle.text}`,
              )}
            >
              {Array.isArray(card.civilization) ? card.civilization.join(" / ") : card.civilization}
            </span>
            • {card.type} • {card.set}
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
                    Array.isArray(card.civilization)
                      ? `bg-gradient-to-tr ${primaryStyle.gradient} ${secondaryStyle?.gradient.replace("from-", "to-")}`
                      : primaryStyle.bg,
                    primaryStyle.text,
                  )}
                >
                  {card.cost}
                </div>
              </div>
            )}

            {/* Power badge in bottom right */}
            {card.type === "Creature" && card.power !== undefined && (
              <div className="absolute bottom-12 right-2 z-10">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    "bg-red-600 text-white",
                  )}
                >
                  {typeof card.power === "number" ? card.power : card.power}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium">Civilization</p>
                <p className="text-sm">
                  {Array.isArray(card.civilization) ? card.civilization.join(" / ") : card.civilization}
                </p>
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
              {card.type === "Creature" && card.power !== undefined && (
                <div>
                  <p className="text-sm font-medium">Power</p>
                  <p className="text-sm">{card.power}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Rarity</p>
                <p className="text-sm">{card.rarity}</p>
              </div>
              {card.illustrator && (
                <div>
                  <p className="text-sm font-medium">Illustrator</p>
                  <p className="text-sm">{card.illustrator}</p>
                </div>
              )}
            </div>
            {card.text && (
              <div>
                <p className="text-sm font-medium">Card Text</p>
                <p className="text-sm whitespace-pre-line">{card.text}</p>
              </div>
            )}
            {card.flavor && (
              <div>
                <p className="text-sm font-medium">Flavor Text</p>
                <p className="text-sm italic text-muted-foreground">{card.flavor}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
