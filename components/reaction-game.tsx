"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Zap, RotateCcw } from "lucide-react"

interface ReactionGameProps {
  onComplete: (score: number, totalTime: number) => void
}

export function ReactionGame({ onComplete }: ReactionGameProps) {
  const [score, setScore] = useState(0)
  const [gameStartTime] = useState(Date.now())
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [circles, setCircles] = useState<
    Array<{ id: number; x: number; y: number; color: "green" | "red"; visible: boolean }>
  >([])
  const [gameStarted, setGameStarted] = useState(false)

  const generateCircle = useCallback(() => {
    if (!gameStarted || timeLeft <= 0) return

    const newCircle = {
      id: Date.now(),
      x: Math.random() * 80 + 10, // 10% to 90% of container width
      y: Math.random() * 60 + 20, // 20% to 80% of container height
      color: Math.random() > 0.3 ? "green" : ("red" as "green" | "red"), // 70% green, 30% red
      visible: true,
    }

    setCircles((prev) => [...prev, newCircle])

    // Remove circle after 1.5 seconds
    setTimeout(() => {
      setCircles((prev) => prev.filter((c) => c.id !== newCircle.id))
    }, 1500)
  }, [gameStarted, timeLeft])

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameStarted) {
      setIsGameOver(true)
      const totalTime = (Date.now() - gameStartTime) / 1000
      setTimeout(() => onComplete(score, totalTime), 2000)
    }
  }, [timeLeft, gameStarted, score, gameStartTime, onComplete])

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const interval = setInterval(generateCircle, 800 + Math.random() * 400) // Random interval between 800-1200ms
      return () => clearInterval(interval)
    }
  }, [generateCircle, gameStarted, timeLeft])

  const handleCircleClick = (circleId: number, color: "green" | "red") => {
    if (color === "green") {
      setScore((prev) => prev + 1)
      setFeedback("correct")
    } else {
      setScore(0) // Reset score on red click
      setFeedback("incorrect")
      // Shake effect
      document.body.style.animation = "shake 0.5s"
      setTimeout(() => {
        document.body.style.animation = ""
      }, 500)
    }

    // Remove clicked circle
    setCircles((prev) => prev.filter((c) => c.id !== circleId))

    // Clear feedback after short time
    setTimeout(() => setFeedback(null), 800)
  }

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setTimeLeft(20)
    setCircles([])
    setFeedback(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-balance">O Teste da Velocidade Mental</h2>
          <p className="text-sm text-muted-foreground">Seu cérebro reage rápido? Vamos descobrir.</p>
        </div>

        <Progress value={87.5} className="w-full" />

        <Card className="p-6 space-y-6">
          {!gameStarted ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-accent/10 rounded-full">
                  <Zap className="w-8 h-8 text-accent" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Instruções:</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Toque apenas nos círculos <span className="text-green-500 font-medium">VERDES</span>. Se tocar em um
                  círculo vermelho, sua pontuação zera.
                </p>
                <p className="text-xs text-destructive">Você tem 20 segundos. Seja rápido, mas cuidadoso.</p>
              </div>
              <Button onClick={startGame} className="w-full py-4 text-lg font-semibold pulse-glow" size="lg">
                Começar Teste
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Pontos: {score}</span>
                </div>
                <div className="flex items-center space-x-2 text-destructive">
                  <RotateCcw className="w-4 h-4" />
                  <span className="font-bold">{timeLeft}s</span>
                </div>
              </div>

              {/* Game Area */}
              <div className="relative bg-muted/20 rounded-lg h-64 overflow-hidden border-2 border-dashed border-muted">
                {circles.map((circle) => (
                  <button
                    key={circle.id}
                    onClick={() => handleCircleClick(circle.id, circle.color)}
                    className={`absolute w-12 h-12 rounded-full transition-all duration-200 hover:scale-110 ${
                      circle.color === "green" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                    } bounce-in`}
                    style={{
                      left: `${circle.x}%`,
                      top: `${circle.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}

                {circles.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                    Aguarde os círculos aparecerem...
                  </div>
                )}
              </div>

              {feedback && (
                <div
                  className={`text-center bounce-in ${feedback === "correct" ? "text-green-500" : "text-destructive"}`}
                >
                  {feedback === "correct" ? (
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>+1 ponto!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <XCircle className="w-5 h-5" />
                      <span>Pontuação zerada! Foque apenas no verde.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Card>

        {isGameOver && (
          <div className="text-center text-accent bounce-in">
            <p className="font-semibold">Avaliação Completa!</p>
            <p className="text-sm">Preparando seu diagnóstico personalizado...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}
