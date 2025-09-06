"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-provider"
import { useWallet } from "./wallet-provider"
import { FlipHorizontal as SwapHorizontal, ArrowUpDown, AlertTriangle } from "lucide-react"

export function SwapTab() {
  const [fromToken, setFromToken] = useState("SOL")
  const [toToken, setToToken] = useState("USDC")
  const [amount, setAmount] = useState("")
  const [slippage, setSlippage] = useState("1")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const { language } = useAuth()
  const { tokens, formatCurrency, addTransaction, updateTokenBalance, getTokenBySymbol } = useWallet()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  const fromTokenData = getTokenBySymbol(fromToken)
  const toTokenData = getTokenBySymbol(toToken)
  const maxBalance = fromTokenData?.amount || 0

  // Simulate exchange rate (in real app, this would come from DEX)
  const exchangeRate = fromTokenData && toTokenData ? fromTokenData.price / toTokenData.price : 1
  const estimatedReceive = amount ? (Number.parseFloat(amount) * exchangeRate * (1 - 0.003)).toFixed(6) : "0.00"
  const tradingFee = amount ? (Number.parseFloat(amount) * 0.003).toFixed(6) : "0.00"

  const isValidAmount = amount && Number.parseFloat(amount) > 0 && Number.parseFloat(amount) <= maxBalance
  const hasInsufficientBalance = amount && Number.parseFloat(amount) > maxBalance

  const availableTokens = tokens.filter((token) => token.amount > 0)

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setAmount("")
  }

  const handleMaxClick = () => {
    setAmount(maxBalance.toString())
  }

  const handleSwap = async () => {
    if (!isValidAmount || isProcessing) return

    setIsProcessing(true)

    toast({
      title: t("Swap initiated...", "Đang hoán đổi..."),
      description: t(
        `Swapping ${amount} ${fromToken} for ${toToken}`,
        `Đang hoán đổi ${amount} ${fromToken} lấy ${toToken}`,
      ),
    })

    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      // Update balances
      const currentFromBalance = fromTokenData?.amount || 0
      const currentToBalance = toTokenData?.amount || 0

      updateTokenBalance(fromToken, currentFromBalance - Number.parseFloat(amount))
      updateTokenBalance(toToken, currentToBalance + Number.parseFloat(estimatedReceive))

      // Add transaction
      addTransaction({
        type: "swap",
        amount: Number.parseFloat(estimatedReceive),
        token: toToken,
        status: "completed",
      })

      toast({
        title: t("Swap successful", "Hoán đổi thành công"),
        description: t(`Received ${estimatedReceive} ${toToken}`, `Đã nhận ${estimatedReceive} ${toToken}`),
      })

      setAmount("")
    } catch (error) {
      toast({
        title: t("Swap failed", "Hoán đổi thất bại"),
        description: t("Please try again", "Vui lòng thử lại"),
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Check if user has any tokens to swap
  if (availableTokens.length === 0) {
    return (
      <Alert className="glass border-border/30">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="space-y-3">
          <p>{t("You don't have enough balance to swap.", "Bạn không có đủ số dư để hoán đổi.")}</p>
          <Button variant="outline" size="sm">
            {t("On-ramp now", "Nạp tiền ngay")}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Alert className="glass border-border/30">
        <SwapHorizontal className="h-4 w-4" />
        <AlertDescription>
          {t("Swap between tokens in your wallet instantly", "Hoán đổi giữa các token trong ví ngay lập tức")}
        </AlertDescription>
      </Alert>

      {/* From Token */}
      <div className="space-y-2">
        <Label>{t("From", "Từ")}</Label>
        <Select value={fromToken} onValueChange={setFromToken} disabled={isProcessing}>
          <SelectTrigger className="glass">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableTokens.map((token) => (
              <SelectItem key={token.symbol} value={token.symbol} disabled={token.symbol === toToken}>
                <div className="flex items-center gap-2">
                  <span>{token.icon}</span>
                  <span>{token.symbol}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {token.amount.toFixed(4)}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fromTokenData && (
          <p className="text-xs text-muted-foreground">
            {t("Balance:", "Số dư:")} {fromTokenData.amount.toFixed(4)} {fromToken}
          </p>
        )}
      </div>

      {/* Swap Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={handleSwapTokens}
          disabled={isProcessing}
          className="rounded-full bg-transparent"
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      {/* To Token */}
      <div className="space-y-2">
        <Label>{t("To", "Đến")}</Label>
        <Select value={toToken} onValueChange={setToToken} disabled={isProcessing}>
          <SelectTrigger className="glass">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tokens.map((token) => (
              <SelectItem key={token.symbol} value={token.symbol} disabled={token.symbol === fromToken}>
                <div className="flex items-center gap-2">
                  <span>{token.icon}</span>
                  <span>{token.symbol}</span>
                  <span className="text-muted-foreground">- {token.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{t("Amount", "Số lượng")}</Label>
          <Button variant="ghost" size="sm" onClick={handleMaxClick} disabled={isProcessing}>
            {t("Max", "Tối đa")}
          </Button>
        </div>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="glass text-lg"
          disabled={isProcessing}
        />
        {hasInsufficientBalance && (
          <p className="text-xs text-destructive">{t("Insufficient balance", "Số dư không đủ")}</p>
        )}
      </div>

      {/* Slippage */}
      <div className="space-y-2">
        <Label>{t("Slippage Tolerance", "Độ trượt giá")}</Label>
        <div className="flex gap-2">
          {["0.5", "1", "2"].map((value) => (
            <Button
              key={value}
              variant={slippage === value ? "default" : "outline"}
              size="sm"
              onClick={() => setSlippage(value)}
              disabled={isProcessing}
            >
              {value}%
            </Button>
          ))}
        </div>
      </div>

      {/* Rate & Estimate */}
      {amount && isValidAmount && (
        <div className="p-3 rounded-lg bg-muted/20 space-y-1">
          <div className="flex justify-between text-sm">
            <span>{t("Rate:", "Tỷ giá:")}</span>
            <span>
              1 {fromToken} = {exchangeRate.toFixed(6)} {toToken}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t("Trading fee (0.3%):", "Phí giao dịch (0.3%):")}</span>
            <span>
              {tradingFee} {fromToken}
            </span>
          </div>
          <div className="flex justify-between text-sm font-medium border-t border-border/50 pt-1">
            <span>{t("You'll receive:", "Bạn sẽ nhận:")}</span>
            <span className="text-primary">
              {estimatedReceive} {toToken}
            </span>
          </div>
        </div>
      )}

      {/* CTA */}
      <Button
        onClick={handleSwap}
        disabled={!isValidAmount || isProcessing}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        {isProcessing ? t("Swapping...", "Đang hoán đổi...") : t("Review Swap", "Xem lại hoán đổi")}
      </Button>
    </div>
  )
}
