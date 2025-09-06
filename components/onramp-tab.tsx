"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-provider"
import { useWallet } from "./wallet-provider"
import { PreviewModal } from "./preview-modal"
import { Info, CreditCard, Smartphone, QrCode } from "lucide-react"

export function OnRampTab() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("USDC")
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()
  const { language } = useAuth()
  const { formatCurrency, addTransaction, updateTokenBalance } = useWallet()

  const minAmount = 20
  const maxAmount = 500
  const rate = fromCurrency === "VND" ? 27000 : 1
  const estimatedReceive = amount ? (Number.parseFloat(amount) / rate).toFixed(2) : "0.00"
  const processingFee = amount ? (Number.parseFloat(amount) * 0.029 + 0.3).toFixed(2) : "0.00"
  const totalCost = amount ? (Number.parseFloat(amount) + Number.parseFloat(processingFee)).toFixed(2) : "0.00"

  const isValidAmount = amount && Number.parseFloat(amount) >= minAmount && Number.parseFloat(amount) <= maxAmount

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  const handlePreview = () => {
    if (!isValidAmount || isProcessing) return
    setShowPreview(true)
  }

  const handleConfirmPayment = async () => {
    setShowPreview(false)
    setIsProcessing(true)

    toast({
      title: t("Payment initiated...", "Đang xử lý thanh toán..."),
      description: t("Processing your purchase", "Đang xử lý giao dịch mua của bạn"),
    })

    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      addTransaction({
        type: "onramp",
        amount: Number.parseFloat(estimatedReceive),
        token: toCurrency,
        status: "completed",
      })

      updateTokenBalance(toCurrency, Number.parseFloat(estimatedReceive))

      toast({
        title: t("Purchase successful", "Mua thành công"),
        description: t(
          `Added ${estimatedReceive} ${toCurrency} to your wallet`,
          `Đã thêm ${estimatedReceive} ${toCurrency} vào ví`,
        ),
      })

      setAmount("")
    } catch (error) {
      toast({
        title: t("Purchase failed", "Mua thất bại"),
        description: t("Please try again", "Vui lòng thử lại"),
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case "card":
        return t("Credit Card", "Thẻ tín dụng")
      case "apple":
        return "Apple Pay"
      case "vnpay":
        return "VNPay QR"
      default:
        return t("Card", "Thẻ")
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Alert className="glass border-border/30">
        <Info className="h-4 w-4" />
        <AlertDescription>
          {t(
            "Buy crypto directly into your wallet with fiat currency",
            "Mua crypto trực tiếp vào ví bằng tiền pháp định",
          )}
        </AlertDescription>
      </Alert>

      {/* From Currency */}
      <div className="space-y-2">
        <Label>{t("From", "Từ")}</Label>
        <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={isProcessing}>
          <SelectTrigger className="glass">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD - US Dollar</SelectItem>
            <SelectItem value="VND">VND - Vietnamese Dong</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* To Currency */}
      <div className="space-y-2">
        <Label>{t("To", "Đến")}</Label>
        <Select value={toCurrency} onValueChange={setToCurrency} disabled={isProcessing}>
          <SelectTrigger className="glass">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USDC">USDC - USD Coin</SelectItem>
            <SelectItem value="USDT">USDT - Tether</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label>
          {t("Amount", "Số tiền")} ({fromCurrency})
        </Label>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="glass text-lg"
          disabled={isProcessing}
        />
        <p className="text-xs text-muted-foreground">
          {t(`Min $${minAmount} • Max $${maxAmount}`, `Tối thiểu $${minAmount} • Tối đa $${maxAmount}`)}
        </p>
      </div>

      {/* Rate & Estimate */}
      {amount && (
        <div className="p-3 rounded-lg bg-muted/20 space-y-1">
          <div className="flex justify-between text-sm">
            <span>{t("Rate:", "Tỷ giá:")}</span>
            <span>1 USD = 27,000 VND</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t("Processing fee:", "Phí xử lý:")}</span>
            <span>{formatCurrency(Number.parseFloat(processingFee))}</span>
          </div>
          <div className="flex justify-between text-sm font-medium border-t border-border/50 pt-1">
            <span>{t("You'll receive:", "Bạn sẽ nhận:")}</span>
            <span className="text-primary">
              {estimatedReceive} {toCurrency}
            </span>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="space-y-2">
        <Label>{t("Payment Method", "Phương thức thanh toán")}</Label>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant={paymentMethod === "card" ? "default" : "outline"}
            onClick={() => setPaymentMethod("card")}
            className="h-12 justify-start"
            disabled={isProcessing}
          >
            <CreditCard className="mr-3 h-4 w-4" />
            {t("Credit/Debit Card", "Thẻ tín dụng/ghi nợ")}
          </Button>
          <Button
            variant={paymentMethod === "apple" ? "default" : "outline"}
            onClick={() => setPaymentMethod("apple")}
            className="h-12 justify-start"
            disabled={isProcessing}
          >
            <Smartphone className="mr-3 h-4 w-4" />
            Apple Pay
          </Button>
          <Button
            variant={paymentMethod === "vnpay" ? "default" : "outline"}
            onClick={() => setPaymentMethod("vnpay")}
            className="h-12 justify-start"
            disabled={isProcessing}
          >
            <QrCode className="mr-3 h-4 w-4" />
            VNPay QR
          </Button>
        </div>
      </div>

      {/* CTA */}
      <Button
        onClick={handlePreview}
        disabled={!isValidAmount || isProcessing}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        {isProcessing ? t("Processing...", "Đang xử lý...") : t("Preview Purchase", "Xem trước giao dịch")}
      </Button>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmPayment}
        orderData={{
          amount: Number.parseFloat(amount),
          fromCurrency,
          toCurrency,
          estimatedReceive: Number.parseFloat(estimatedReceive),
          paymentMethod: getPaymentMethodName(),
          processingFee: Number.parseFloat(processingFee),
          totalCost: Number.parseFloat(totalCost),
        }}
      />
    </div>
  )
}
