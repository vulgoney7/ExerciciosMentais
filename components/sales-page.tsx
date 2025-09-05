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

declare global {
  interface Window {
    Vimeo: any
  }
}

// 🔑 Detecta se é iOS (Safari bloqueia autoplay com som)
const isIOS = () => {
  if (typeof window === "undefined") return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

export function SalesPage({ results }: SalesPageProps) {
  const [hasStartedVideo, setHasStartedVideo] = useState(false)
  const [hasWatched110Seconds, setHasWatched110Seconds] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [playerReady, setPlayerReady] = useState(false)
  const [showPixCheckout, setShowPixCheckout] = useState(false)
  const vimeoPlayerRef = useRef<any>(null)
  const watchTimeRef = useRef(0)
  const listenersAttachedRef = useRef(false)

  useEffect(() => {
    const loadVimeoPlayer = () => {
      if (window.Vimeo && !vimeoPlayerRef.current) {
        const iframe = document.querySelector("#vimeo-player") as HTMLIFrameElement
        if (iframe) {
          try {
            vimeoPlayerRef.current = new window.Vimeo.Player(iframe)

            vimeoPlayerRef.current
              .ready()
              .then(() => {
                setPlayerReady(true)
                console.log("[v0] Vimeo player ready")

                if (!isIOS()) {
                  // ✅ No desktop/Android: já inicia com volume máximo
                  vimeoPlayerRef.current.setVolume(1)
                }

                if (!listenersAttachedRef.current) {
                  vimeoPlayerRef.current.on("timeupdate", (data: any) => {
                    watchTimeRef.current = data.seconds

                    if (watchTimeRef.current >= 110 && !hasWatched110Seconds) {
                      setHasWatched110Seconds(true)
                      console.log("[v0] VSL watched for 1:50 (110 seconds)", { results })
                    }
                  })
                  listenersAttachedRef.current = true
                }
              })
              .catch((error: any) => {
                console.error("[v0] Vimeo player initialization error:", error)
              })
          } catch (error) {
            console.error("[v0] Error creating Vimeo player:", error)
          }
        }
      }
    }

    if (!window.Vimeo) {
      const script = document.createElement("script")
      script.src = "https://player.vimeo.com/api/player.js"
      script.onload = loadVimeoPlayer
      script.onerror = () => console.error("[v0] Failed to load Vimeo Player API")
      document.head.appendChild(script)

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    } else {
      loadVimeoPlayer()
    }

    return () => {
      if (vimeoPlayerRef.current && listenersAttachedRef.current) {
        try {
          vimeoPlayerRef.current.off("timeupdate")
          listenersAttachedRef.current = false
        } catch (error) {
          console.error("[v0] Error removing Vimeo event listeners:", error)
        }
      }
    }
  }, [])

  const handlePlayVideo = async () => {
    if (vimeoPlayerRef.current && playerReady) {
      try {
        await vimeoPlayerRef.current.setVolume(1)
        await vimeoPlayerRef.current.play()
        setHasStartedVideo(true)
        setShowPlayButton(false) // ✅ botão some de vez
        console.log("[v0] VSL Play button clicked", { results })
      } catch (error) {
        console.error("[v0] Error playing video:", error)
        setHasStartedVideo(true)
        setShowPlayButton(false)
      }
    } else {
      console.warn("[v0] Vimeo player not ready yet")
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
          <h1 className="text-2xl font-bold text-balance">{"O Problema é Sério Mas a Solução está em Suas Mãos\n"}</h1>
          <p className="text-sm text-orange-600 font-medium bg-orange-50 p-3 rounded-lg border border-orange-200 animate-pulse">
            {/* ✅ mensagem piscando */}
            Clique no vídeo para assistir: O resultado do seu teste será revelado
          </p>
        </div>

        <div className="relative">
          {/* ✅ vídeo maior */}
          <div className="rounded-lg overflow-hidden relative" style={{ height: "280px" }}>
            <iframe
              id="vimeo-player"
              src={`https://player.vimeo.com/video/1116027189?autoplay=1&controls=0${isIOS() ? "&muted=1" : ""}`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              title="Atenção!"
            />
            {showPlayButton && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 cursor-pointer"
                onClick={handlePlayVideo}
              >
                <Button
                  size="lg"
                  className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 pulse-glow"
                  disabled={!playerReady}
                >
                  <Play className="w-8 h-8 ml-1" fill="white" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div
          className={`transition-all duration-1000 ${
            hasWatched110Seconds ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
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

          <Button size="lg" className="w-full pulse-glow text-lg py-6" onClick={() => handleCTAClick("Final")}>
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
