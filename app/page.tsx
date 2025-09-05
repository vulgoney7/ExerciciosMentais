"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { ColorGame } from "@/components/color-game"
import { MemoryGameIntro } from "@/components/memory-game-intro"
import { MemoryGame } from "@/components/memory-game"
import { LogicGame } from "@/components/logic-game"
import { ReactionGame } from "@/components/reaction-game"
import { DiagnosisPage } from "@/components/diagnosis-page"
import { SalesPage } from "@/components/sales-page"

export type GameResults = {
  colorGameScore: number
  colorGameTime: number
  memoryGameScore: number
  memoryGameTime: number
  logicGameScore: number
  logicGameTime: number
  reactionGameScore: number
  reactionGameTime: number
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [gameResults, setGameResults] = useState<GameResults>({
    colorGameScore: 0,
    colorGameTime: 0,
    memoryGameScore: 0,
    memoryGameTime: 0,
    logicGameScore: 0,
    logicGameTime: 0,
    reactionGameScore: 0,
    reactionGameTime: 0,
  })

  const steps = [
    <LandingPage key="landing" onNext={() => setCurrentStep(1)} />,
    <ColorGame
      key="color"
      onComplete={(score, time) => {
        setGameResults((prev) => ({ ...prev, colorGameScore: score, colorGameTime: time }))
        setCurrentStep(2)
      }}
    />,
    <MemoryGameIntro key="memory-intro" onNext={() => setCurrentStep(3)} />,
    <MemoryGame
      key="memory"
      onComplete={(score, time) => {
        setGameResults((prev) => ({ ...prev, memoryGameScore: score, memoryGameTime: time }))
        setCurrentStep(4)
      }}
    />,
    <LogicGame
      key="logic"
      onComplete={(score, time) => {
        setGameResults((prev) => ({ ...prev, logicGameScore: score, logicGameTime: time }))
        setCurrentStep(5)
      }}
    />,
    <ReactionGame
      key="reaction"
      onComplete={(score, time) => {
        setGameResults((prev) => ({ ...prev, reactionGameScore: score, reactionGameTime: time }))
        setCurrentStep(6)
      }}
    />,
    <DiagnosisPage key="diagnosis" results={gameResults} onNext={() => setCurrentStep(7)} />,
    <SalesPage key="sales" results={gameResults} />,
  ]

  return <div className="min-h-screen bg-background">{steps[currentStep]}</div>
}
