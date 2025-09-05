"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Eye } from "lucide-react"

interface MemoryGameProps {
  onComplete: (score: number, totalTime: number) => void
}

export function MemoryGame({ onComplete }: MemoryGameProps) {
  const [currentRound, setCurrentRound] = useState(0)
  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState("")
  const [showSequence, setShowSequence] = useState(true)
  const [score, setScore] = useState(0)
  const [gameStartTime] = useState(Date.now())
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)

  const generateSequence = (length: number) => {
    // Generate more complex sequences with repeated numbers to confuse memory
    const complexSequence = Array.from({ length }, () => Math.floor(Math.random() * 10))
    // Add some repeated digits to make it harder
    if (length > 4) {
      const repeatIndex = Math.floor(Math.random() * (length - 1))
      complexSequence[repeatIndex + 1] = complexSequence[repeatIndex]
    }
    return complexSequence
  }

  useEffect(() => {
    const newSequence = generateSequence(6 + currentRound * 2)
    setSequence(newSequence)
    setShowSequence(true)
    setUserInput("")
    setFeedback(null)

    const timer = setTimeout(
      () => {
        setShowSequence(false)
      },
      1500 + currentRound * 300,
    )

    return () => clearTimeout(timer)
  }, [currentRound])

  const handleSubmit = () => {
    const userSequence = userInput.split("").map(Number)
    const isCorrect = JSON.stringify(userSequence) === JSON.stringify(sequence)

    if (isCorrect) {
      setScore(score + 1)
      setFeedback("correct")
    } else {
      setFeedback("incorrect")
    }

    setTimeout(() => {
      if (currentRound < 2) {
        setCurrentRound(currentRound + 1)
      } else {
        setIsGameOver(true)
        const totalTime = (Date.now() - gameStartTime) / 1000
        setTimeout(() => onComplete(score + (isCorrect ? 1 : 0), totalTime), 2000)
      }
    }, 1500)
  }

  const progress = ((currentRound + 1) / 3) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Teste de Foco: A Sequência Oculta</h2>
          <p className="text-sm text-muted-foreground">Sua capacidade de focar está em risco. Preste atenção.</p>
        </div>

        <Progress value={progress} className="w-full" />

        <Card className="p-6 space-y-6">
          <div className="text-center">
            <span className="text-sm font-medium">Rodada {currentRound + 1}/3</span>
          </div>

          {showSequence ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-accent">
                <Eye className="w-5 h-5" />
                <span className="text-sm">Memorize a sequência</span>
              </div>
              <div className="text-4xl font-mono font-bold tracking-wider">{sequence.join(" ")}</div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm">Digite a sequência que você viu:</p>
              <Input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ""))}
                placeholder="Ex: 123456"
                className="text-center text-lg font-mono"
                maxLength={sequence.length}
              />
              <Button onClick={handleSubmit} className="w-full" disabled={userInput.length !== sequence.length}>
                Confirmar
              </Button>
            </div>
          )}

          {feedback && (
            <div className={`text-center bounce-in ${feedback === "correct" ? "text-green-500" : "text-destructive"}`}>
              {feedback === "correct" ? (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-6 h-6" />
                  <span>Excelente memória!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <XCircle className="w-6 h-6" />
                  <span>Dificuldade em focar? Isso é mais comum do que você imagina...</span>
                </div>
              )}
            </div>
          )}
        </Card>

        {isGameOver && (
          <div className="text-center text-accent bounce-in">
            <p className="font-semibold">Progresso: 50% concluído</p>
            <p className="text-sm">Continuando avaliação...</p>
          </div>
        )}
      </div>
    </div>
  )
}
