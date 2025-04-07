// This file imports the Duel Masters cards data from the JSON file

// Define the card type structure based on the JSON format
export interface DuelMastersCard {
  id: string
  name: string
  civilization: string | string[]
  type: string
  race?: string
  cost?: number
  power?: number
  text?: string
  flavor?: string
  set: string
  rarity: string
  illustrator?: string
  printings?: {
    set: string
    id: string
    rarity: string
    illustrator: string
  }[]
}

// Fetch the cards data from the JSON file
export async function fetchCardsData(): Promise<DuelMastersCard[]> {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/tazwar70/duel-masters-tcg/main/public/DuelMastersCards.json",
    )
    if (!response.ok) {
      throw new Error("Failed to fetch cards data")
    }
    const data = await response.json()
    return data.cards || []
  } catch (error) {
    console.error("Error fetching cards data:", error)
    return []
  }
}

// For client components that can't use async/await directly
// We'll provide a fallback dataset until the data is loaded
export const cardsData: DuelMastersCard[] = [
  // A few sample cards as fallback until the full data loads
  {
    id: "dm01-1",
    name: "Hanusa, Radiance Elemental",
    civilization: "Light",
    type: "Creature",
    race: "Angel Command",
    cost: 6,
    power: 9000,
    text: "Double breaker (This creature breaks 2 shields.)",
    set: "dm-01",
    rarity: "Very Rare",
  },
  {
    id: "dm01-6",
    name: "Bolshack Dragon",
    civilization: "Fire",
    type: "Creature",
    race: "Armored Dragon",
    cost: 6,
    power: 6000,
    text: "Double breaker (This creature breaks 2 shields.)",
    set: "dm-01",
    rarity: "Very Rare",
  },
  // More fallback cards can be added here
]

// Helper function to normalize card data
export function normalizeCardData(card: any): DuelMastersCard {
  // Handle civilization which can be a string or array
  let civilization = card.civilization || card.civilizations
  if (Array.isArray(civilization) && civilization.length === 1) {
    civilization = civilization[0]
  }

  // Extract the first printing if available
  const printing = Array.isArray(card.printings) && card.printings.length > 0 ? card.printings[0] : null

  return {
    id: card.id || printing?.id || "unknown",
    name: card.name || "Unknown Card",
    civilization: civilization || "Unknown",
    type: card.type || "Unknown",
    race: card.race || undefined,
    cost: typeof card.cost === "number" ? card.cost : undefined,
    power:
      typeof card.power === "number"
        ? card.power
        : typeof card.power === "string"
          ? Number.parseInt(card.power, 10)
          : undefined,
    text: card.text || undefined,
    flavor: card.flavor || undefined,
    set: card.set || printing?.set || "unknown",
    rarity: card.rarity || printing?.rarity || "Unknown",
    illustrator: card.illustrator || printing?.illustrator || undefined,
    printings: card.printings,
  }
}
