"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, TrendingDown } from "lucide-react"
import Image from "next/image"

interface LandingPageProps {
  onNext: () => void
}

export function LandingPage({ onNext }: LandingPageProps) {
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-card">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-4">
          <div className="w-full h-48 sm:h-56 mx-auto relative">
            <Image src="/images/brain-3d.jpeg" alt="Cérebro 3D" fill className="object-contain rounded-lg font-bold" priority />
          </div>
          <h1 className="font-bold text-balance leading-tight text-3xl">
            O seu cérebro pode estar mais lento do que você pensa
          </h1>
          <p className="text-lg text-pretty text-red-600">Faça o teste e descubra a verdade agora</p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-destructive">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Desafio expira em {timeLeft}s</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <span>78% das pessoas falham no primeiro teste</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Image src="/images/img1" alt="Cérebro 3D" width={16} height={16} className="rounded-lg" />
              <span>Apenas 3 minutos para descobrir a verdade</span>
            </div>
          </div>
        </Card>

        <Button onClick={onNext} size="lg" className="w-full pulse-glow text-lg py-6">
          Iniciar Desafio Mental
        </Button>

        <p className="text-xs text-muted-foreground">* Teste baseado em neurociência cognitiva</p>
      </div>
    </div>
  )
}
