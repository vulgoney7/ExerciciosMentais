"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Timer } from "lucide-react"

interface ColorGameProps {
  onComplete: (score: number, totalTime: number) => void
}

const colorWords = [
  { word: "VERDE", color: "text-blue-500", correct: "AZUL" },
  { word: "AZUL", color: "text-red-500", correct: "VERMELHO" },
  { word: "VERMELHO", color: "text-green-500", correct: "VERDE" },
  { word: "AMARELO", color: "text-purple-500", correct: "ROXO" },
  { word: "ROXO", color: "text-yellow-500", correct: "AMARELO" },
]

const colorOptions = ["VERDE", "AZUL", "VERMELHO", "AMARELO", "ROXO"]

export function ColorGame({ onComplete }: ColorGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(8)
  const [gameStartTime] = useState(Date.now())
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [hasError, setHasError] = useState(false)

  const currentColorWord = colorWords[currentQuestion]

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleAnswer("") // Time's up
    }
  }, [timeLeft, isGameOver])

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === currentColorWord.correct

    if (isCorrect) {
      setScore(score + 1)
      setFeedback("correct")
    } else {
      setFeedback("incorrect")
      setHasError(true)
    }

    setTimeout(() => {
      if (currentQuestion < colorWords.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setTimeLeft(hasError ? 10 : 8)
        setFeedback(null)
      } else {
        setIsGameOver(true)
        const totalTime = (Date.now() - gameStartTime) / 1000
        setTimeout(() => onComplete(score + (isCorrect ? 1 : 0), totalTime), 2000)
      }
    }, 1500)
  }

  const progress = ((currentQuestion + 1) / colorWords.length) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Aquecimento: O Jogo das Cores</h2>
          <p className="text-sm text-muted-foreground">
            Não é sobre o que você vê, mas sobre o quão rápido seu cérebro processa.
          </p>
        </div>

        <Progress value={progress} className="w-full" />

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Questão {currentQuestion + 1}/5</span>
            <div className="flex items-center space-x-2 text-destructive">
              <Timer className="w-4 h-4" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm">Clique na cor que a palavra está escrita:</p>
            <div className={`text-4xl font-bold ${currentColorWord.color}`}>{currentColorWord.word}</div>
          </div>

          {feedback && (
            <div className={`text-center bounce-in ${feedback === "correct" ? "text-green-500" : "text-destructive"}`}>
              {feedback === "correct" ? (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-6 h-6" />
                  <span>Parabéns!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <XCircle className="w-6 h-6" />
                  <span>Seu cérebro foi 1,2s mais lento que a média</span>
                </div>
              )}
            </div>
          )}

          {!feedback && (
            <div className="grid grid-cols-2 gap-3">
              {colorOptions.map((color) => (
                <Button key={color} variant="outline" onClick={() => handleAnswer(color)} className="py-3">
                  {color}
                </Button>
              ))}
            </div>
          )}
        </Card>

        {isGameOver && (
          <div className="text-center text-accent bounce-in">
            <p className="font-semibold">Progresso: 50% concluído</p>
            <p className="text-sm">Você está indo bem... por enquanto.</p>
          </div>
        )}
      </div>
    </div>
  )
}
