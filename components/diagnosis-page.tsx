"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingDown, Clock } from "lucide-react"
import type { GameResults } from "@/app/page"

interface DiagnosisPageProps {
  results: GameResults
  onNext: () => void
}

export function DiagnosisPage({ results, onNext }: DiagnosisPageProps) {
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowResults(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const totalScore = results.colorGameScore + results.memoryGameScore
  const averageTime = (results.colorGameTime + results.memoryGameTime) / 2
  const riskLevel = totalScore < 4 ? "alto" : totalScore < 7 ? "moderado" : "baixo"
  const riskColor =
    riskLevel === "alto" ? "text-destructive" : riskLevel === "moderado" ? "text-accent" : "text-green-500"
  const progressValue = (totalScore / 10) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Resultados Finais...</h2>
          <p className="text-lg font-semibold">E a Verdade Sobre o Seu Cérebro</p>
        </div>

        {showResults && (
          <div className="space-y-6 bounce-in">
            <Card className="p-6 space-y-4 border-destructive/20">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Análise Cognitiva Completa</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Performance Geral</span>
                    <span className={riskColor}>{totalScore}/10</span>
                  </div>
                  <Progress value={progressValue} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Tempo de Reação</span>
                    </div>
                    <span className="text-destructive font-semibold">{averageTime.toFixed(1)}s</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <TrendingDown className="w-3 h-3" />
                      <span>Nível de Risco</span>
                    </div>
                    <span className={`font-semibold ${riskColor}`}>{riskLevel.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-destructive/5 border-destructive/20">
              <div className="space-y-3 text-sm">
                <p className="font-semibold text-destructive">
                  A maioria das pessoas falha aqui. A sua performance mostra um risco {riskLevel} de declínio cognitivo.
                </p>
                <p>
                  A lentidão nas respostas e a perda de foco não são normais. Os exercícios que você fez agora foram
                  apenas a ponta do iceberg.
                </p>
                <p className="text-destructive font-semibold">
                  Você está no grupo de risco. O tempo está passando, e o seu cérebro não perdoa. A prevenção é a única
                  saída.
                </p>
              </div>
            </Card>

            <Button onClick={onNext} size="lg" className="w-full pulse-glow">
              Ver a Solução Definitiva
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
