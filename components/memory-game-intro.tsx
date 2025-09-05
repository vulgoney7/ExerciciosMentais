"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Zap } from "lucide-react"

interface MemoryGameIntroProps {
  onNext: () => void
}

export function MemoryGameIntro({ onNext }: MemoryGameIntroProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-balance">Teste de Foco: A Sequência Oculta</h2>
          <p className="text-sm text-muted-foreground">Sua memória de curto prazo está sendo testada agora.</p>
        </div>

        <Progress value={37.5} className="w-full" />

        <Card className="p-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Brain className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Prepare-se.</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Uma sequência de números irá piscar na tela. Você terá que digitá-la na ordem correta, de memória.
              </p>
              <p className="text-sm text-destructive font-medium">
                Quanto mais você acertar, mais longa a sequência fica.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center space-x-2 text-accent">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Dica Importante</span>
              </div>
              <p className="text-xs text-muted-foreground">
                A maioria das pessoas falha na primeira tentativa. Isso é normal quando o cérebro está lento.
              </p>
            </div>
          </div>

          <Button onClick={onNext} className="w-full py-4 text-lg font-semibold pulse-glow" size="lg">
            Iniciar Desafio
          </Button>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>Etapa 2 de 6 • Foco e Memória</p>
        </div>
      </div>
    </div>
  )
}
