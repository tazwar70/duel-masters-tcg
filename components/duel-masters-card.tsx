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
    type: string
    civilizations: string[]
    cost: number
    power?: number
    text?: string
    imageUrl: string
    set: string
    subtypes?: string[]
    supertypes?: string[]
    rarity: string
    illustrator: string
    flavor?: string
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

  // Use the first civilization for the card background
  const civColors = civilizationColors[card.civilizations[0].toLowerCase()] || {
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
                src={cardImageUrl}
                alt={card.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Card name and civilization at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white">
                <h3 className="text-sm font-medium">{card.name}</h3>
                <p className="text-xs text-gray-300">
                  {card.civilizations.join(' / ')} • {card.type}
                </p>
              </div>

              {/* Cost and power overlay */}
              <div className="absolute right-2 top-2 flex flex-col gap-1">
                {card.cost !== undefined && (
                  <div className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", civColors.text, civColors.accent)}>
                    {card.cost}
                  </div>
                )}
                {card.power !== undefined && (
                  <div className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", civColors.text, civColors.accent)}>
                    {card.power}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{card.name}</DialogTitle>
          <DialogDescription>
            {card.civilizations.join(' / ')} • {card.type} • {card.set}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative aspect-[2.5/3.5] overflow-hidden rounded-sm bg-muted">
            <img
              src={cardImageUrl}
              alt={card.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {card.cost !== undefined && (
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold", civColors.text, civColors.accent)}>
                  {card.cost}
                </div>
              )}
              {card.power !== undefined && (
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold", civColors.text, civColors.accent)}>
                  {card.power}
                </div>
              )}
            </div>

            {card.text && (
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm">{card.text}</p>
              </div>
            )}

            {card.flavor && (
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm italic">{card.flavor}</p>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <p>Illustrator: {card.illustrator}</p>
              <p>Rarity: {card.rarity}</p>
              {card.subtypes && card.subtypes.length > 0 && (
                <p>Subtypes: {card.subtypes.join(', ')}</p>
              )}
              {card.supertypes && card.supertypes.length > 0 && (
                <p>Supertypes: {card.supertypes.join(', ')}</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

