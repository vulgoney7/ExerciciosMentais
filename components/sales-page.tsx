"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Play, Target, TrendingUp, Zap, Shield } from "lucide-react"
import Image from "next/image"
import type { GameResults } from "@/app/page"
import { PixCheckout } from "./pix-checkout"

interface SalesPageProps {
  results: GameResults
}

export function SalesPage({ results }: SalesPageProps) {
  const [hasStartedVideo, setHasStartedVideo] = useState(false)
  const [hasWatched110Seconds, setHasWatched110Seconds] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [showPixCheckout, setShowPixCheckout] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const watchTimeRef = useRef(0)
  const listenersAttachedRef = useRef(false)

  // Controle do tempo assistido
  useEffect(() => {
    let interval: NodeJS.Timer
    if (videoRef.current && !listenersAttachedRef.current) {
      interval = setInterval(() => {
        if (videoRef.current) {
          watchTimeRef.current = videoRef.current.currentTime
          if (watchTimeRef.current >= 110 && !hasWatched110Seconds) {
            setHasWatched110Seconds(true)
            console.log("[v0] VSL watched for 1:50 (110 seconds)", { results })
          }
        }
      }, 500)
      listenersAttachedRef.current = true
    }
    return () => {
      clearInterval(interval)
    }
  }, [hasWatched110Seconds, results])

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.volume = 1 // volume máximo
      videoRef.current.play()
      setHasStartedVideo(true)
      setShowPlayButton(false)
    }
  }

  const benefits = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Exercícios diários personalizados",
      description: "Para melhorar memória e concentração baseado no seu perfil",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Acompanhamento de progresso",
      description: "Veja sua evolução cognitiva em tempo real com métricas detalhadas",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Estratégias especializadas",
      description: "Técnicas comprovadas para aumentar energia mental e recordação",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Prevenção do declínio",
      description: "Proteja seu cérebro contra o envelhecimento cognitivo",
    },
  ]

  const handleCTAClick = (buttonType: string) => {
    console.log(`[v0] ${buttonType} CTA clicked`, { results, hasWatched110Seconds })
    setShowPixCheckout(true)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-4">
          <Badge variant="destructive" className="text-sm">
            ATENÇÃO RISCO IDENTIFICADO
          </Badge>
          <h1 className="text-2xl font-bold text-balance">
            {"O Problema é Sério Mas a Solução está em Suas Mãos\n"}
          </h1>
          <p className="text-sm text-orange-600 font-medium bg-orange-50 p-3 rounded-lg border border-orange-200 animate-pulse">
            Clique para assistir: O resultado do seu teste será revelado no vídeo
          </p>
        </div>

        <div className="relative">
          {/* ✅ vídeo direto sem controles */}
          <div className="rounded-lg overflow-hidden relative" style={{ height: "280px" }}>
            <video
              ref={videoRef}
              src="/videos/Cakto Quiz.mp4" // coloque aqui o caminho do seu arquivo de vídeo
              controls={false} // remove todos os controles nativos
              style={{ width: "100%", height: "100%", pointerEvents: "none" }} // impede fullscreen e clique direto
            />

            {showPlayButton && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 cursor-pointer"
                onClick={handlePlayVideo}
              >
                <Button
                  size="lg"
                  className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 pulse-glow"
                >
                  <Play className="w-8 h-8 ml-1" fill="white" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div
          className={`transition-all duration-1000 ${
            hasWatched110Seconds
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <Button
            size="lg"
            className="w-full pulse-glow text-lg py-6 bg-red-600 hover:bg-red-700"
            onClick={() => handleCTAClick("Immediate VSL")}
          >
            Adquirir Exercícios Mentais
          </Button>

          <div className="space-y-4 mt-6">
            <h3 className="font-semibold text-lg">O que você vai receber:</h3>
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-4">
                <div className="flex space-x-3">
                  <div className="text-accent mt-1">{benefit.icon}</div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">{benefit.title}</h4>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 bg-accent/5 border-accent/20">
            <div className="text-center space-y-4">
              <div className="w-48 h-32 mx-auto relative">
                <Image
                  src="/images/exercicios-mentais-cover.png"
                  alt="Exercícios Mentais - Ebook"
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground line-through">De R$ 110 </p>
                <p className="text-3xl font-bold text-accent">R$ 28,90</p>
                <p className="text-xs text-muted-foreground">Pagamento único • Acesso vitalício</p>
              </div>
            </div>
          </Card>

          <Button
            size="lg"
            className="w-full pulse-glow text-lg py-6"
            onClick={() => handleCTAClick("Final")}
          >
            Reative Seu Cérebro Agora
          </Button>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-green-500">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Garantia de 30 dias</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-500">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Acesso imediato</span>
            </div>
          </div>
        </div>
      </div>
      {showPixCheckout && <PixCheckout onClose={() => setShowPixCheckout(false)} />}
    </div>
  )
}
