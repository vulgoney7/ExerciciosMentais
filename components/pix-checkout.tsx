"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, QrCode, Loader2 } from "lucide-react"
import QRCode from "qrcode"
import Image from "next/image"

interface PixCheckoutProps {
  onClose: () => void
}

interface PixResponse {
  id: string
  status: string
  pix: {
    payload: string
    qr_code: string
  }
  total_amount: number
}

export function PixCheckout({ onClose }: PixCheckoutProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [pixData, setPixData] = useState<PixResponse | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const handlePaymentConfirmation = (event: MessageEvent) => {
      if (event.data.type === "PAYMENT_AUTHORIZED" && event.data.transactionId === pixData?.id) {
        console.log("[v0] Payment confirmed, redirecting to upsell")
        window.location.href = "https://www.zendesk.com.br/blog/o-que-e-upsell/"
      }
    }

    window.addEventListener("message", handlePaymentConfirmation)
    return () => window.removeEventListener("message", handlePaymentConfirmation)
  }, [pixData?.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const generateValidCPF = () => {
    const cpf = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))

    // Calculate first digit
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += cpf[i] * (10 - i)
    }
    const firstDigit = ((sum * 10) % 11) % 10
    cpf.push(firstDigit)

    // Calculate second digit
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += cpf[i] * (11 - i)
    }
    const secondDigit = ((sum * 10) % 11) % 10
    cpf.push(secondDigit)

    return cpf.join("")
  }

  const generateValidPhone = () => {
    const ddd = ["11", "21", "31", "41", "51", "61", "71", "81", "85", "91"][Math.floor(Math.random() * 10)]
    const number = "9" + Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join("")
    return ddd + number
  }

  const generateRandomId = () => {
    return `pedido_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c == "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  const getClientIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.log("[v0] Failed to get client IP, using fallback:", error)
      return "127.0.0.1" // Fallback IP
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const clientIP = await getClientIP()

      const payload = {
        external_id: generateUUID(),
        payment_method: "PIX",
        total_amount: 28.9,
        webhook_url: "https://faq.whatsapp.com/pt_br/android/26000003/",
        ip: clientIP,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: generateValidPhone(),
          document_type: "CPF",
          document: generateValidCPF(),
        },
        items: [
          {
            id: "1b86fd16-e78b-42bf-b253-3c01d6ae947d",
            title: "Exercícios Mentais",
            description: "Programa de exercícios mentais para melhorar sua capacidade cognitiva",
            quantity: 1,
            price: 28.9,
            is_physical: false,
          },
        ],
      }

      console.log("[v0] Creating PIX transaction with payload:", JSON.stringify(payload, null, 2))

      const response = await fetch("https://api.lirapaybr.com/v1/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-secret":
            "sk_b0c1b5bcef8731b6cae0f1183e57211edcb46530de18a7e7061baba9ae03a732d06390e45fbe2cabdd436450e19ab830a65385f9987ffd885dd909154a075f34",
        },
        body: JSON.stringify(payload),
      })

      console.log("[v0] API Response status:", response.status)
      console.log("[v0] API Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] API Error Response:", errorText)
        try {
          const errorJson = JSON.parse(errorText)
          console.error("[v0] Parsed API Error:", errorJson)
          throw new Error(`Erro na API (${response.status}): ${errorJson.message || errorText}`)
        } catch (parseError) {
          throw new Error(`Erro na API (${response.status}): ${errorText}`)
        }
      }

      const responseText = await response.text()
      console.log("[v0] Raw API Response:", responseText)

      const data: PixResponse = JSON.parse(responseText)
      console.log("[v0] PIX transaction created successfully:", data)

      // Generate QR Code from PIX payload
      const qrUrl = await QRCode.toDataURL(data.pix.payload)
      setQrCodeUrl(qrUrl)
      setPixData(data)
    } catch (err) {
      console.error("[v0] PIX checkout error details:", err)
      if (err instanceof Error) {
        setError(`Erro ao gerar PIX: ${err.message}`)
      } else {
        setError("Erro desconhecido ao gerar PIX. Verifique o console para mais detalhes.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const copyPixCode = async () => {
    if (pixData?.pix.payload) {
      try {
        await navigator.clipboard.writeText(pixData.pix.payload)
        console.log("[v0] PIX code copied to clipboard")
        // You could add a toast notification here
      } catch (err) {
        console.error("[v0] Failed to copy PIX code:", err)
      }
    }
  }

  if (pixData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-sm sm:max-w-md p-4 sm:p-6 space-y-4 sm:space-y-6 mx-4">
          <div className="text-center space-y-2">
            <QrCode className="w-8 h-8 mx-auto text-green-600" />
            <h2 className="text-lg sm:text-xl font-bold">Seu PIX foi gerado!</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Escaneie o código abaixo ou use a opção 'copia e cola' para concluir sua compra e ter acesso imediato ao
              seu programa de exercícios mentais.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center w-full">
              <div className="w-full max-w-[200px] sm:max-w-[240px] aspect-square">
                <img
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt="QR Code PIX"
                  className="w-full h-full object-contain border rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-medium">Código PIX (Copia e Cola)</Label>
              <div className="flex gap-2 w-full">
                <Input value={pixData.pix.payload} readOnly className="text-xs flex-1 min-w-0" />
                <Button size="sm" variant="outline" onClick={copyPixCode} className="shrink-0 bg-transparent px-3">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <p className="text-xs sm:text-sm text-center text-blue-800">
                <strong>Abra seu app de banco e pague o PIX para liberar seu acesso imediato</strong>
              </p>
            </div>

            <div className="text-center space-y-1">
              <p className="text-lg font-bold text-green-600">R$ 28,90</p>
              <p className="text-xs text-muted-foreground">Pagamento 100% Seguro</p>
            </div>
          </div>

          <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
            Fechar
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm sm:max-w-md p-4 sm:p-6 space-y-4 sm:space-y-6 mx-4">
        <div className="flex justify-center mb-4">
          <div className="w-full max-w-[240px] sm:max-w-[280px] aspect-[3/4] relative">
            <Image
              src="/images/exercicios-mentais-cover.png"
              alt="Exercícios Mentais - Ebook"
              fill
              className="object-contain rounded-lg"
              priority
              sizes="(max-width: 640px) 240px, 280px"
            />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-lg sm:text-xl font-bold">Finalizar Compra</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Preencha seus dados para gerar o PIX</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">
              Nome Completo
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Seu nome completo"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="seu@email.com"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Atenção: O acesso aos exercícios será enviado imediatamente para este e-mail após a confirmação do
              pagamento. Por favor, insira um e-mail válido.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full bg-transparent order-2 sm:order-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 order-1 sm:order-2"
              disabled={isLoading || !formData.name || !formData.email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                "Gerar PIX"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
