// This file provides placeholder images for Duel Masters cards
// In a real application, you would use actual card images with proper licensing

// Helper function to generate placeholder URLs with civilization-specific colors and imagery
export function getCardImageUrl(card: {
  id: string
  name: string
  civilization: string
  type: string
  race?: string
  power?: number
  cost?: number
  set: string
}): string {
  // Define civilization-specific colors and imagery for placeholders
  const civilizationStyles: Record<
    string,
    {
      bg: string
      text: string
      gradient: string
      symbol: string
    }
  > = {
    Light: {
      bg: "FFEB3B,FFF9C4",
      text: "000000",
      gradient: "linear-gradient(135deg, #FFEB3B 0%, #FFF9C4 100%)",
      symbol: "⦿", // Sun symbol
    },
    Fire: {
      bg: "F44336,FFCDD2",
      text: "FFFFFF",
      gradient: "linear-gradient(135deg, #F44336 0%, #FFCDD2 100%)",
      symbol: "🔥", // Fire symbol
    },
    Water: {
      bg: "2196F3,BBDEFB",
      text: "FFFFFF",
      gradient: "linear-gradient(135deg, #2196F3 0%, #BBDEFB 100%)",
      symbol: "〜", // Wave symbol
    },
    Darkness: {
      bg: "673AB7,D1C4E9",
      text: "FFFFFF",
      gradient: "linear-gradient(135deg, #673AB7 0%, #D1C4E9 100%)",
      symbol: "☠", // Skull symbol
    },
    Nature: {
      bg: "4CAF50,C8E6C9",
      text: "000000",
      gradient: "linear-gradient(135deg, #4CAF50 0%, #C8E6C9 100%)",
      symbol: "⚘", // Flower symbol
    },
  }

  // Get styles for the specified civilization or use default
  const styles = civilizationStyles[card.civilization] || {
    bg: "9E9E9E,EEEEEE",
    text: "000000",
    gradient: "linear-gradient(135deg, #9E9E9E 0%, #EEEEEE 100%)",
    symbol: "?",
  }

  // Create a unique seed for each card to generate consistent but different patterns
  const seed = card.id.charCodeAt(0) + card.id.charCodeAt(card.id.length - 1)

  // Generate a pattern based on the card type and race
  let pattern = ""
  if (card.type === "Creature") {
    // Different patterns for different races
    const raceHash = card.race ? card.race.charCodeAt(0) % 5 : 0
    switch (raceHash) {
      case 0:
        pattern = "circles"
        break
      case 1:
        pattern = "triangles"
        break
      case 2:
        pattern = "squares"
        break
      case 3:
        pattern = "lines"
        break
      case 4:
        pattern = "waves"
        break
    }
  } else if (card.type === "Spell") {
    pattern = "sparkles"
  }

  // Create a placeholder URL with civilization colors, card name, and additional styling
  const imageUrl =
    `/placeholder.svg?height=350&width=250&text=${encodeURIComponent(card.name)}` +
    `&colors=${styles.bg}&textColor=${styles.text}` +
    `&pattern=${pattern}&seed=${seed}&symbol=${encodeURIComponent(styles.symbol)}`

  return imageUrl
}

// Generate custom card art URLs for each card
export function generateCardArt(card: {
  id: string
  name: string
  civilization: string
  type: string
  race?: string
}): string {
  const civilizationColors: Record<string, string> = {
    Light: "FFEB3B",
    Fire: "F44336",
    Water: "2196F3",
    Darkness: "673AB7",
    Nature: "4CAF50",
  }

  const color = civilizationColors[card.civilization] || "9E9E9E"
  const type = card.type.toLowerCase()
  const race = card.race ? card.race.toLowerCase().replace(/\s+/g, "-") : "unknown"

  // Create a unique but deterministic seed for this card
  const seed = card.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Generate a unique pattern based on the card's properties
  const patternType = seed % 6
  let pattern = ""

  switch (patternType) {
    case 0:
      pattern = "diagonal-lines"
      break
    case 1:
      pattern = "circles"
      break
    case 2:
      pattern = "hexagons"
      break
    case 3:
      pattern = "triangles"
      break
    case 4:
      pattern = "squares"
      break
    case 5:
      pattern = "waves"
      break
  }

  // Create a custom SVG placeholder with the card's properties
  return (
    `/placeholder.svg?height=350&width=250&text=${encodeURIComponent(card.name)}` +
    `&backgroundColor=${color}&textColor=FFFFFF` +
    `&pattern=${pattern}&seed=${seed}` +
    `&subtitle=${encodeURIComponent(card.civilization + " • " + card.type)}`
  )
}

// Map of card IDs to image URLs
export const cardImages: Record<string, string> = {}

// Import card data to generate placeholder images
import { cardsData } from "./cards-data"

// Generate unique placeholder images for all cards
cardsData.forEach((card) => {
  // Create a more detailed and unique image for each card
  cardImages[card.id] = getCardImageUrl(card)
})

export default cardImages

