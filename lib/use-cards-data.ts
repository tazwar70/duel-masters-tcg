"use client"

import { useState, useEffect } from "react"
import { type DuelMastersCard, cardsData as fallbackData, fetchCardsData, normalizeCardData } from "./cards-data"

export function useCardsData() {
  const [cards, setCards] = useState<DuelMastersCard[]>(fallbackData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCards() {
      try {
        setLoading(true)
        const data = await fetchCardsData()

        // Normalize the data to ensure consistent structure
        const normalizedCards = data.map(normalizeCardData)

        setCards(normalizedCards)
        setError(null)
      } catch (err) {
        console.error("Failed to load cards:", err)
        setError("Failed to load card data. Using fallback data instead.")
      } finally {
        setLoading(false)
      }
    }

    loadCards()
  }, [])

  return { cards, loading, error }
}
