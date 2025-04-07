// This file provides placeholder images for Duel Masters cards
// In a real application, you would use actual card images with proper licensing

import cards from './cards-data'

// Helper function to generate placeholder URLs with civilization-specific colors and imagery
export function getCardImageUrl(card: {
  id: string
  name: string
  civilizations: string[]
  type: string
  subtypes?: string[]
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

  // Get styles for the first civilization or use default
  const styles = civilizationStyles[card.civilizations[0]] || {
    bg: "9E9E9E,EEEEEE",
    text: "000000",
    gradient: "linear-gradient(135deg, #9E9E9E 0%, #EEEEEE 100%)",
    symbol: "?",
  }

  // Create a unique seed for each card to generate consistent but different patterns
  const seed = card.id.charCodeAt(0) + card.id.charCodeAt(card.id.length - 1)

  // Generate a pattern based on the card type and subtypes
  let pattern = ""
  if (card.type === "Creature") {
    // Different patterns for different subtypes
    const subtypeHash = card.subtypes && card.subtypes.length > 0 ? card.subtypes[0].charCodeAt(0) % 5 : 0
    switch (subtypeHash) {
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
    `&pattern=${pattern}&seed=${seed}&symbol=${encodeURIComponent(styles.symbol)}` +
    `&subtitle=${encodeURIComponent(card.civilizations.join(' / ') + ' • ' + card.type)}`

  return imageUrl
}

// Generate placeholder images for all cards
const cardImages: Record<string, string> = {}
cards.forEach(card => {
  cardImages[card.id] = getCardImageUrl(card)
})

export default cardImages

