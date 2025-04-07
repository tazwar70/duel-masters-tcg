"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Sword, Zap, RotateCcw, Hand, AlertTriangle, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import DuelMastersCard from "./duel-masters-card"
import cards from "@/lib/cards-data"
import { cn } from "@/lib/utils"

// Simplified game state for demo purposes
interface GameState {
  playerDeck: typeof cards
  opponentDeck: typeof cards
  playerHand: typeof cards
  opponentHand: number // Just the count for opponent
  playerShieldZone: typeof cards
  opponentShieldZone: number
  playerManaZone: typeof cards
  opponentManaZone: number
  playerBattleZone: typeof cards
  opponentBattleZone: typeof cards
  playerGraveyard: typeof cards
  opponentGraveyard: typeof cards
  currentPhase: "draw" | "charge" | "main" | "attack" | "end"
  currentTurn: "player" | "opponent"
  turnNumber: number
  attackingCreature: number | null
  tappedCreatures: number[]
  summonedThisTurn: number[] // Track creatures summoned this turn (for summoning sickness)
}

// Helper function to check if a creature has "speed attacker" ability
function hasSpeedAttacker(card: (typeof cards)[0]): boolean {
  // In a real implementation, you would check the card text or abilities
  // For this demo, we'll assume no cards have speed attacker
  return card.text?.toLowerCase().includes("speed attacker") || false
}

export default function GameBoard() {
  // For demo purposes, we'll use a simplified game state
  const [selectedDeck, setSelectedDeck] = useState<string>("")
  const [gameStarted, setGameStarted] = useState(false)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [battleResult, setBattleResult] = useState<{
    attacker: (typeof cards)[0]
    defender?: (typeof cards)[0]
    result: "win" | "lose" | "shield" | "direct"
  } | null>(null)

  // Function to start a new game
  const startGame = () => {
    if (!selectedDeck) {
      alert("Please select a deck first")
      return
    }

    // In a real app, you would load the selected deck
    // For demo, we'll create a random deck from cardsData
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5)
    const playerDeck = shuffledCards.slice(0, 40)
    const opponentDeck = shuffledCards.slice(40, 80)

    // Initialize game state
    setGameState({
      playerDeck,
      opponentDeck,
      playerHand: playerDeck.slice(0, 5),
      opponentHand: 5,
      playerShieldZone: playerDeck.slice(5, 10),
      opponentShieldZone: 5,
      playerManaZone: [],
      opponentManaZone: 0,
      playerBattleZone: [],
      opponentBattleZone: opponentDeck.slice(0, 3), // For demo, opponent starts with 3 creatures
      playerGraveyard: [],
      opponentGraveyard: [],
      currentPhase: "draw",
      currentTurn: "player",
      turnNumber: 1,
      attackingCreature: null,
      tappedCreatures: [],
      summonedThisTurn: [],
    })

    setGameStarted(true)
  }

  // Function to handle drawing a card
  const drawCard = () => {
    if (!gameState) return

    setGameState((prev) => {
      if (!prev) return prev

      const newPlayerDeck = [...prev.playerDeck]
      const drawnCard = newPlayerDeck.shift()

      if (!drawnCard) {
        alert("You have no more cards to draw! Game over.")
        return prev
      }

      return {
        ...prev,
        playerDeck: newPlayerDeck,
        playerHand: [...prev.playerHand, drawnCard],
        currentPhase: "charge" as const,
      }
    })
  }

  // Function to handle charging mana
  const chargeMana = (cardIndex: number) => {
    if (!gameState) return

    setGameState((prev) => {
      if (!prev) return prev

      const newPlayerHand = [...prev.playerHand]
      const cardToCharge = newPlayerHand.splice(cardIndex, 1)[0]

      return {
        ...prev,
        playerHand: newPlayerHand,
        playerManaZone: [...prev.playerManaZone, cardToCharge],
        currentPhase: "main" as const,
      }
    })
  }

  // Function to summon a creature
  const summonCreature = (cardIndex: number) => {
    if (!gameState) return

    const cardToSummon = gameState.playerHand[cardIndex]

    // Check if player has enough mana
    if (gameState.playerManaZone.length < (cardToSummon.cost || 0)) {
      alert("Not enough mana to summon this creature!")
      return
    }

    setGameState((prev) => {
      if (!prev) return prev

      const newPlayerHand = [...prev.playerHand]
      const summonedCard = newPlayerHand.splice(cardIndex, 1)[0]

      // Add to battle zone and track that it was summoned this turn
      const newPlayerBattleZone = [...prev.playerBattleZone, summonedCard]
      const newSummonedThisTurn = [...prev.summonedThisTurn, newPlayerBattleZone.length - 1]

      return {
        ...prev,
        playerHand: newPlayerHand,
        playerBattleZone: newPlayerBattleZone,
        summonedThisTurn: newSummonedThisTurn,
      }
    })
  }

  // Function to select a creature to attack with
  const selectAttacker = (creatureIndex: number) => {
    if (!gameState || gameState.currentPhase !== "attack") return

    const creature = gameState.playerBattleZone[creatureIndex]

    // Check if creature is already tapped
    if (gameState.tappedCreatures.includes(creatureIndex)) {
      alert("This creature has already attacked this turn!")
      return
    }

    // Check for summoning sickness
    if (gameState.summonedThisTurn.includes(creatureIndex) && !hasSpeedAttacker(creature)) {
      alert("This creature can't attack this turn due to summoning sickness!")
      return
    }

    setGameState((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        attackingCreature: creatureIndex,
      }
    })
  }

  // Function to attack an opponent's creature
  const attackCreature = (defenderIndex: number) => {
    if (!gameState || gameState.attackingCreature === null) return

    const attacker = gameState.playerBattleZone[gameState.attackingCreature]
    const defender = gameState.opponentBattleZone[defenderIndex]

    // Compare power to determine winner
    const attackerPower = attacker.power || 0
    const defenderPower = defender.power || 0

    const newOpponentBattleZone = [...gameState.opponentBattleZone]
    const newPlayerBattleZone = [...gameState.playerBattleZone]
    const newPlayerGraveyard = [...gameState.playerGraveyard]
    const newOpponentGraveyard = [...gameState.opponentGraveyard]
    let result: "win" | "lose" = "win"

    if (attackerPower > defenderPower) {
      // Attacker wins
      newOpponentGraveyard.push(defender)
      newOpponentBattleZone.splice(defenderIndex, 1)
      result = "win"
    } else if (attackerPower < defenderPower) {
      // Defender wins
      newPlayerGraveyard.push(attacker)
      newPlayerBattleZone.splice(gameState.attackingCreature, 1)
      result = "lose"
    } else {
      // Both creatures are destroyed
      newOpponentGraveyard.push(defender)
      newPlayerGraveyard.push(attacker)
      newOpponentBattleZone.splice(defenderIndex, 1)
      newPlayerBattleZone.splice(gameState.attackingCreature, 1)
      result = "lose" // Both destroyed, but we'll call it a loss for simplicity
    }

    // Set battle result for animation/display
    setBattleResult({
      attacker,
      defender,
      result,
    })

    // Update game state
    setGameState((prev) => {
      if (!prev) return prev

      // If attacker survived, mark it as tapped
      const newTappedCreatures = [...prev.tappedCreatures]
      if (result === "win") {
        newTappedCreatures.push(prev.attackingCreature)
      }

      // Update summoned this turn indices if creatures were removed
      let newSummonedThisTurn = [...prev.summonedThisTurn]
      if (result === "lose") {
        // If attacker was destroyed, we need to update indices
        newSummonedThisTurn = newSummonedThisTurn
          .filter((index) => index !== prev.attackingCreature)
          .map((index) => (index > prev.attackingCreature ? index - 1 : index))
      }

      return {
        ...prev,
        playerBattleZone: newPlayerBattleZone,
        opponentBattleZone: newOpponentBattleZone,
        playerGraveyard: newPlayerGraveyard,
        opponentGraveyard: newOpponentGraveyard,
        attackingCreature: null,
        tappedCreatures: newTappedCreatures,
        summonedThisTurn: newSummonedThisTurn,
      }
    })
  }

  // Function to attack opponent's shields
  const attackShield = () => {
    if (!gameState || gameState.attackingCreature === null || gameState.opponentShieldZone <= 0) return

    const attacker = gameState.playerBattleZone[gameState.attackingCreature]

    // Set battle result for animation/display
    setBattleResult({
      attacker,
      result: "shield",
    })

    // Update game state
    setGameState((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        opponentShieldZone: prev.opponentShieldZone - 1,
        attackingCreature: null,
        tappedCreatures: [...prev.tappedCreatures, prev.attackingCreature],
      }
    })
  }

  // Function to attack opponent directly
  const attackOpponent = () => {
    if (!gameState || gameState.attackingCreature === null || gameState.opponentShieldZone > 0) return

    const attacker = gameState.playerBattleZone[gameState.attackingCreature]

    // Set battle result for animation/display
    setBattleResult({
      attacker,
      result: "direct",
    })

    // In a real game, this would trigger a win condition
    alert("Direct attack! You win the game!")

    // Update game state
    setGameState((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        attackingCreature: null,
        tappedCreatures: [...prev.tappedCreatures, prev.attackingCreature],
      }
    })
  }

  // Function to cancel an attack
  const cancelAttack = () => {
    if (!gameState) return

    setGameState((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        attackingCreature: null,
      }
    })
  }

  // Function to end turn
  const endTurn = () => {
    if (!gameState) return

    // Simulate opponent's turn
    setTimeout(() => {
      setGameState((prev) => {
        if (!prev) return prev

        // Simplified opponent AI
        return {
          ...prev,
          opponentHand: prev.opponentHand + 1,
          opponentManaZone: prev.opponentManaZone + 1,
          currentTurn: "player" as const,
          currentPhase: "draw" as const,
          turnNumber: prev.turnNumber + 1,
          tappedCreatures: [], // Untap all creatures for new turn
          summonedThisTurn: [], // Reset summoning sickness for new turn
        }
      })
    }, 1500)

    setGameState((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        currentTurn: "opponent" as const,
        currentPhase: "end" as const,
      }
    })
  }

  // Function to reset the game
  const resetGame = () => {
    setGameState(null)
    setGameStarted(false)
    setBattleResult(null)
  }

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="text-2xl font-bold">Duel Masters Game</h2>
        <p className="text-center text-muted-foreground">Select a deck and start a new game to play Duel Masters.</p>

        <div className="w-full max-w-md space-y-4">
          <Select value={selectedDeck} onValueChange={setSelectedDeck}>
            <SelectTrigger>
              <SelectValue placeholder="Select a deck" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fire-deck">Fire Civilization Deck</SelectItem>
              <SelectItem value="water-deck">Water Civilization Deck</SelectItem>
              <SelectItem value="nature-deck">Nature Civilization Deck</SelectItem>
              <SelectItem value="light-deck">Light Civilization Deck</SelectItem>
              <SelectItem value="darkness-deck">Darkness Civilization Deck</SelectItem>
              <SelectItem value="multi-deck">Multi-Civilization Deck</SelectItem>
            </SelectContent>
          </Select>

          <Button className="w-full" onClick={startGame}>
            Start New Game
          </Button>
        </div>
      </div>
    )
  }

  if (!gameState) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">
            Turn {gameState.turnNumber} - {gameState.currentTurn === "player" ? "Your Turn" : "Opponent's Turn"}
          </h2>
          <Badge variant={gameState.currentTurn === "player" ? "default" : "outline"}>
            {gameState.currentPhase.toUpperCase()} PHASE
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={resetGame}>
          <RotateCcw className="mr-1 h-4 w-4" />
          Reset Game
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Opponent's side */}
        <div className="col-span-full grid grid-cols-4 gap-2 rounded-lg border bg-muted/30 p-2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium">Deck</span>
            <div className="flex h-16 w-12 items-center justify-center rounded bg-muted">
              <span className="text-sm">{gameState.opponentDeck.length}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium">Hand</span>
            <div className="flex h-16 w-12 items-center justify-center rounded bg-muted">
              <Hand className="h-5 w-5" />
              <span className="ml-1 text-sm">{gameState.opponentHand}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium">Shields</span>
            <div className="flex h-16 w-12 items-center justify-center rounded bg-muted">
              <Shield className="h-5 w-5" />
              <span className="ml-1 text-sm">{gameState.opponentShieldZone}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium">Mana</span>
            <div className="flex h-16 w-12 items-center justify-center rounded bg-muted">
              <Zap className="h-5 w-5" />
              <span className="ml-1 text-sm">{gameState.opponentManaZone}</span>
            </div>
          </div>
        </div>

        {/* Opponent's battle zone */}
        <div className="col-span-full">
          <h3 className="mb-2 text-sm font-medium">Opponent's Battle Zone</h3>
          <div className="flex flex-wrap gap-2">
            {gameState.opponentBattleZone.map((card, index) => (
              <div
                key={`opponent-battle-${index}`}
                className={cn(
                  "relative w-20 transition-all",
                  gameState.attackingCreature !== null && "hover:scale-105 cursor-pointer",
                )}
                onClick={() => {
                  if (gameState.attackingCreature !== null) {
                    attackCreature(index)
                  }
                }}
              >
                <DuelMastersCard card={card} className="transform scale-75" />
                {gameState.attackingCreature !== null && (
                  <div className="absolute inset-0 bg-red-500/20 rounded-md border-2 border-red-500 animate-pulse"></div>
                )}
              </div>
            ))}
            {gameState.opponentBattleZone.length === 0 && (
              <div className="flex h-24 w-full items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">No creatures in battle zone</p>
              </div>
            )}
          </div>
        </div>

        {/* Player's battle zone */}
        <div className="col-span-full">
          <h3 className="mb-2 text-sm font-medium">Your Battle Zone</h3>
          <div className="flex flex-wrap gap-2">
            {gameState.playerBattleZone.map((card, index) => (
              <div
                key={`player-battle-${index}`}
                className={cn(
                  "relative w-20 transition-all",
                  gameState.currentPhase === "attack" &&
                    gameState.currentTurn === "player" &&
                    !gameState.tappedCreatures.includes(index) &&
                    !(gameState.summonedThisTurn.includes(index) && !hasSpeedAttacker(card)) &&
                    gameState.attackingCreature === null &&
                    "hover:scale-105 cursor-pointer",
                  gameState.tappedCreatures.includes(index) && "opacity-60",
                  gameState.attackingCreature === index && "ring-2 ring-primary",
                )}
                onClick={() => {
                  if (
                    gameState.currentPhase === "attack" &&
                    gameState.currentTurn === "player" &&
                    !gameState.tappedCreatures.includes(index) &&
                    !(gameState.summonedThisTurn.includes(index) && !hasSpeedAttacker(card)) &&
                    gameState.attackingCreature === null
                  ) {
                    selectAttacker(index)
                  }
                }}
              >
                <DuelMastersCard card={card} className="transform scale-75" />

                {/* Summoning sickness indicator */}
                {gameState.summonedThisTurn.includes(index) && !hasSpeedAttacker(card) && (
                  <div className="absolute inset-0 bg-yellow-500/30 rounded-md flex items-center justify-center">
                    <div className="absolute top-1 right-1 bg-yellow-500 rounded-full p-1">
                      <Clock className="h-3 w-3 text-white" />
                    </div>
                    {!gameState.tappedCreatures.includes(index) && (
                      <span className="text-xs text-yellow-800 font-bold bg-yellow-200 px-1 rounded">
                        SUMMONING SICKNESS
                      </span>
                    )}
                  </div>
                )}

                {/* Tapped indicator */}
                {gameState.tappedCreatures.includes(index) && (
                  <div className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center">
                    <span className="text-xs text-white font-bold">TAPPED</span>
                  </div>
                )}
              </div>
            ))}
            {gameState.playerBattleZone.length === 0 && (
              <div className="flex h-24 w-full items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">No creatures in battle zone</p>
              </div>
            )}
          </div>
        </div>

        {/* Player's side */}
        <div className="col-span-2">
          <Tabs defaultValue="hand">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hand">Hand ({gameState.playerHand.length})</TabsTrigger>
              <TabsTrigger value="mana">Mana Zone ({gameState.playerManaZone.length})</TabsTrigger>
              <TabsTrigger value="shields">Shields ({gameState.playerShieldZone.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="hand" className="mt-2">
              <div className="flex flex-wrap gap-2">
                {gameState.playerHand.map((card, index) => (
                  <div key={`hand-${index}`} className="relative w-24 transition-all hover:scale-105">
                    <DuelMastersCard card={card} className="transform scale-90" />
                    {gameState.currentTurn === "player" && (
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 pb-1">
                        {gameState.currentPhase === "charge" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 text-xs"
                            onClick={() => chargeMana(index)}
                          >
                            Charge
                          </Button>
                        )}
                        {gameState.currentPhase === "main" && card.type === "Creature" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 text-xs"
                            onClick={() => summonCreature(index)}
                            disabled={gameState.playerManaZone.length < (card.cost || 0)}
                          >
                            Summon
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {gameState.playerHand.length === 0 && (
                  <div className="flex h-32 w-full items-center justify-center rounded-md border border-dashed">
                    <p className="text-sm text-muted-foreground">Your hand is empty</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="mana" className="mt-2">
              <div className="flex flex-wrap gap-2">
                {gameState.playerManaZone.map((card, index) => (
                  <div key={`mana-${index}`} className="w-16">
                    <DuelMastersCard card={card} className="transform scale-75" />
                  </div>
                ))}
                {gameState.playerManaZone.length === 0 && (
                  <div className="flex h-32 w-full items-center justify-center rounded-md border border-dashed">
                    <p className="text-sm text-muted-foreground">Your mana zone is empty</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="shields" className="mt-2">
              <div className="flex flex-wrap gap-2">
                {gameState.playerShieldZone.map((card, index) => (
                  <div key={`shield-${index}`} className="w-16">
                    <Card className="aspect-[2.5/3.5] bg-gradient-to-br from-blue-500 to-purple-600">
                      <CardContent className="flex h-full items-center justify-center p-2">
                        <Shield className="h-6 w-6 text-white" />
                      </CardContent>
                    </Card>
                  </div>
                ))}
                {gameState.playerShieldZone.length === 0 && (
                  <div className="flex h-32 w-full items-center justify-center rounded-md border border-dashed">
                    <p className="text-sm text-muted-foreground">You have no shields left!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary p-2 text-primary-foreground">
                <Sword className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Game Actions</h3>
                <p className="text-xs text-muted-foreground">Current phase: {gameState.currentPhase.toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-md border p-3">
            {gameState.currentTurn === "player" ? (
              <>
                {gameState.currentPhase === "draw" && (
                  <Button className="w-full" onClick={drawCard}>
                    Draw Card
                  </Button>
                )}
                {gameState.currentPhase === "charge" && (
                  <Button
                    className="w-full"
                    onClick={() => setGameState((prev) => (prev ? { ...prev, currentPhase: "main" } : prev))}
                  >
                    Skip Charge
                  </Button>
                )}
                {gameState.currentPhase === "main" && (
                  <Button
                    className="w-full"
                    onClick={() => setGameState((prev) => (prev ? { ...prev, currentPhase: "attack" } : prev))}
                  >
                    Go to Attack Phase
                  </Button>
                )}
                {gameState.currentPhase === "attack" && gameState.attackingCreature === null && (
                  <div className="space-y-2">
                    <div className="rounded-md bg-muted p-2 text-sm">
                      <p>Select one of your creatures to attack with</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Clock className="inline-block h-3 w-3 mr-1" />
                        Creatures with summoning sickness can't attack
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => setGameState((prev) => (prev ? { ...prev, currentPhase: "end" } : prev))}
                    >
                      Skip Attack Phase
                    </Button>
                  </div>
                )}
                {gameState.currentPhase === "attack" && gameState.attackingCreature !== null && (
                  <div className="space-y-2">
                    <div className="rounded-md bg-muted p-2 text-sm">
                      <p>Choose a target to attack:</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="destructive" onClick={attackShield} disabled={gameState.opponentShieldZone <= 0}>
                        <Shield className="mr-1 h-4 w-4" />
                        Attack Shield
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={attackOpponent}
                        disabled={gameState.opponentShieldZone > 0}
                      >
                        <AlertTriangle className="mr-1 h-4 w-4" />
                        Direct Attack
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full" onClick={cancelAttack}>
                      Cancel Attack
                    </Button>
                  </div>
                )}
                {(gameState.currentPhase === "end" || gameState.currentPhase === "attack") && (
                  <Button className="w-full" variant="outline" onClick={endTurn}>
                    End Turn
                  </Button>
                )}
              </>
            ) : (
              <div className="flex h-20 items-center justify-center">
                <p className="text-sm text-muted-foreground">Opponent is thinking...</p>
              </div>
            )}
          </div>

          <div className="rounded-md border p-3">
            <h3 className="mb-2 font-medium">Game Stats</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Your Deck:</div>
              <div className="text-right">{gameState.playerDeck.length} cards</div>
              <div>Opponent Deck:</div>
              <div className="text-right">{gameState.opponentDeck.length} cards</div>
              <div>Turn Number:</div>
              <div className="text-right">{gameState.turnNumber}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Result Dialog */}
      {battleResult && (
        <Dialog open={!!battleResult} onOpenChange={() => setBattleResult(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Battle Result</DialogTitle>
              <DialogDescription>
                {battleResult.result === "win" && "Your creature won the battle!"}
                {battleResult.result === "lose" && "Your creature was defeated!"}
                {battleResult.result === "shield" && "Shield attack successful!"}
                {battleResult.result === "direct" && "Direct attack successful!"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center gap-8 py-4">
              <div className="text-center">
                <p className="mb-2 text-sm font-medium">Your Creature</p>
                <div className="mx-auto w-24">
                  <DuelMastersCard card={battleResult.attacker} />
                </div>
              </div>

              {battleResult.defender && (
                <div className="text-center">
                  <p className="mb-2 text-sm font-medium">Opponent's Creature</p>
                  <div className="mx-auto w-24">
                    <DuelMastersCard card={battleResult.defender} />
                  </div>
                </div>
              )}

              {battleResult.result === "shield" && (
                <div className="text-center">
                  <p className="mb-2 text-sm font-medium">Shield Broken</p>
                  <div className="mx-auto flex h-32 w-24 items-center justify-center">
                    <Shield className="h-12 w-12 text-blue-500" />
                  </div>
                </div>
              )}

              {battleResult.result === "direct" && (
                <div className="text-center">
                  <p className="mb-2 text-sm font-medium">Direct Attack</p>
                  <div className="mx-auto flex h-32 w-24 items-center justify-center">
                    <AlertTriangle className="h-12 w-12 text-red-500" />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setBattleResult(null)}>Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Badge component for phases
function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "outline" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        variant === "default" ? "bg-primary text-primary-foreground" : "border border-input bg-background"
      }`}
    >
      {children}
    </span>
  )
}

