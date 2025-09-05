"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Timer, Lightbulb } from "lucide-react"

interface LogicGameProps {
  onComplete: (score: number, totalTime: number) => void
}

const logicQuestions = [
  {
    question: "Onde o rio encontra o mar?",
    options: ["Montanha", "Oceano", "Deserto"],
    correct: 1,
  },
  {
    question: "Se todos os gatos são animais e alguns animais voam, então:",
    options: ["Todos os gatos voam", "Alguns gatos podem voar", "Nenhum gato voa"],
    correct: 2,
  },
  {
    question: "O que vem depois na sequência: 2, 4, 8, 16, ?",
    options: ["24", "32", "20"],
    correct: 1,
  },
  {
    question: "Se é verdade que 'Todos os médicos são inteligentes' e 'João é médico', então:",
    options: ["João pode ser inteligente", "João é inteligente", "João não é inteligente"],
    correct: 1,
  },
]

export function LogicGame({ onComplete }: LogicGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameStartTime] = useState(Date.now())
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)

  const currentQ = logicQuestions[currentQuestion]

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver && !feedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleAnswer(-1) // Time's up
    }
  }, [timeLeft, isGameOver, feedback])

  const handleAnswer = (answerIndex: number) => {
    const isCorrect = answerIndex === currentQ.correct

    if (isCorrect) {
      setScore(score + 1)
      setFeedback("correct")
    } else {
      setFeedback("incorrect")
    }

    setTimeout(() => {
      if (currentQuestion < logicQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setTimeLeft(15)
        setFeedback(null)
      } else {
        setIsGameOver(true)
        const totalTime = (Date.now() - gameStartTime) / 1000
        setTimeout(() => onComplete(score + (isCorrect ? 1 : 0), totalTime), 2000)
      }
    }, 1500)
  }

  const progress = ((currentQuestion + 1) / logicQuestions.length) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-balance">Desafio de Lógica: Conecte os Pontos</h2>
          <p className="text-sm text-muted-foreground">
            A lentidão mental afeta seu raciocínio. Mostre que seu cérebro ainda funciona rápido.
          </p>
        </div>

        <Progress value={62.5} className="w-full" />

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Questão {currentQuestion + 1}/{logicQuestions.length}
            </span>
            <div className="flex items-center space-x-2 text-destructive">
              <Timer className="w-4 h-4" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-2 bg-accent/10 rounded-full">
                <Lightbulb className="w-6 h-6 text-accent" />
              </div>
            </div>
            <p className="text-sm font-medium leading-relaxed">{currentQ.question}</p>
          </div>

          {feedback && (
            <div className={`text-center bounce-in ${feedback === "correct" ? "text-green-500" : "text-destructive"}`}>
              {feedback === "correct" ? (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-6 h-6" />
                  <span>Certo!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <XCircle className="w-6 h-6" />
                  <span>Seu cérebro foi 3 segundos mais lento que o esperado</span>
                </div>
              )}
            </div>
          )}

          {!feedback && (
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleAnswer(index)}
                  className="w-full py-3 text-left justify-start"
                >
                  {String.fromCharCode(65 + index)}) {option}
                </Button>
              ))}
            </div>
          )}
        </Card>

        {isGameOver && (
          <div className="text-center text-accent bounce-in">
            <p className="font-semibold">Progresso: 75% concluído</p>
            <p className="text-sm">Quase terminando a avaliação...</p>
          </div>
        )}
      </div>
    </div>
  )
}
