"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "./wallet-provider"
import { useAuth } from "./auth-provider"
import { PreviewModal } from "./preview-modal"
import { SuccessCallbackScreen } from "./success-callback-screen"
import { Info, AlertTriangle, CreditCard, Smartphone, QrCode } from "lucide-react"

export function OnRampScreen() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("USDC")
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const { toast } = useToast()
  const { formatCurrency, addTransaction, updateTokenBalance } = useWallet()
  const { language, setLanguage, createWallet, userState, createPasskey } = useAuth()

  const minAmount = 20
  const maxAmount = 500
  const rate = fromCurrency === "VND" ? 27000 : 1
  const estimatedReceive = amount ? (Number.parseFloat(amount) / rate).toFixed(2) : "0.00"
  const processingFee = amount ? (Number.parseFloat(amount) * 0.029 + 0.3).toFixed(2) : "0.00"
  const totalCost = amount ? (Number.parseFloat(amount) + Number.parseFloat(processingFee)).toFixed(2) : "0.00"

  const validateForm = () => {
    const errors: string[] = []

    if (!amount) {
      errors.push(t("Amount is required", "Số tiền là bắt buộc"))
    } else {
      const numAmount = Number.parseFloat(amount)
      if (numAmount < minAmount) {
        errors.push(t(`Minimum amount is $${minAmount}`, `Số tiền tối thiểu là $${minAmount}`))
      }
      if (numAmount > maxAmount) {
        errors.push(t(`Maximum amount is $${maxAmount}`, `Số tiền tối đa là $${maxAmount}`))
      }
    }

    // Payment method specific validation
    if (paymentMethod === "apple" && !navigator.userAgent.includes("iPhone")) {
      errors.push(t("Apple Pay is only available on iOS devices", "Apple Pay chỉ khả dụng trên thiết bị iOS"))
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const isValidAmount = amount && Number.parseFloat(amount) >= minAmount && Number.parseFloat(amount) <= maxAmount

  const handlePreview = () => {
    if (!validateForm() || isProcessing) return
    setShowPreview(true)
  }

  const handleConfirmPayment = async () => {
    setShowPreview(false)
    setIsProcessing(true)

    // Simulate checkout flow
    toast({
      title: language === "EN" ? "Payment initiated..." : "Đang xử lý thanh toán...",
      description:
        language === "EN"
          ? `Processing ${formatCurrency(Number.parseFloat(amount))} payment via ${getPaymentMethodName()}`
          : `Đang xử lý thanh toán ${formatCurrency(Number.parseFloat(amount))} qua ${getPaymentMethodName()}`,
    })

    // Simulate payment processing delay (different for each method)
    const delay = paymentMethod === "apple" ? 1000 : paymentMethod === "vnpay" ? 3000 : 2000
    await new Promise((resolve) => setTimeout(resolve, delay))

    // Simulate random payment failure (10% chance)
    if (Math.random() < 0.1) {
      setIsProcessing(false)
      toast({
        title: language === "EN" ? "Payment failed" : "Thanh toán thất bại",
        description:
          language === "EN"
            ? "Payment was declined. Please try a different method."
            : "Thanh toán bị từ chối. Vui lòng thử phương thức khác.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create wallet if user doesn't have one
      if (!userState.hasWallet) {
        await createWallet(true)
      }

      // Add transaction to history
      addTransaction({
        type: "onramp",
        amount: Number.parseFloat(estimatedReceive),
        token: toCurrency,
        status: "completed",
      })

      // Update token balance
      updateTokenBalance(toCurrency, Number.parseFloat(estimatedReceive))

      const orderId = `LZ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      // Set order details for success screen
      setOrderDetails({
        orderId,
        amount: Number.parseFloat(amount),
        currency: fromCurrency,
        tokenReceived: Number.parseFloat(estimatedReceive),
        token: toCurrency,
        paymentMethod: getPaymentMethodName(),
        processingFee: Number.parseFloat(processingFee),
        totalCost: Number.parseFloat(totalCost),
      })

      setShowSuccess(true)
    } catch (error) {
      toast({
        title: language === "EN" ? "Payment failed" : "Thanh toán thất bại",
        description:
          language === "EN"
            ? "An unexpected error occurred. Please try again."
            : "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.",
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

  const handleCreatePasskey = async () => {
    await createPasskey()
  }

  const handleReturnToApp = () => {
    setShowSuccess(false)
    setAmount("")
    setOrderDetails(null)
  }

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  // Show success callback screen
  if (showSuccess && orderDetails) {
    return <SuccessCallbackScreen orderDetails={orderDetails} onReturn={handleReturnToApp} />
  }

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Lazorkit Wallet</h1>
          <p className="text-sm text-muted-foreground">{t("Buy crypto with ease", "Mua crypto dễ dàng")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant={language === "EN" ? "default" : "ghost"} size="sm" onClick={() => setLanguage("EN")}>
            EN
          </Button>
          <Button variant={language === "VI" ? "default" : "ghost"} size="sm" onClick={() => setLanguage("VI")}>
            VI
          </Button>
        </div>
      </div>

      {/* KYC/Limits Info Banner */}
      <Alert className="mb-4 glass-card border-border/50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          {t(
            "Demo limits: $20-$500 per transaction. Real KYC verification would be required for higher amounts.",
            "Giới hạn demo: $20-$500 mỗi giao dịch. Xác minh KYC thực tế sẽ được yêu cầu cho số tiền cao hơn.",
          )}
        </AlertDescription>
      </Alert>

      {/* Passkey Status */}
      {!userState.hasPasskey && (
        <Card className="glass-card border-border/50 mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t("Secure your wallet", "Bảo mật ví của bạn")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("Create a passkey for enhanced security", "Tạo passkey để tăng cường bảo mật")}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleCreatePasskey}>
                {t("Create Passkey", "Tạo Passkey")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* On-Ramp Form */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">
            {t("Buy with Card / Apple Pay / VNPay", "Mua bằng Thẻ / Apple Pay / VNPay")}
          </CardTitle>
          <Badge variant="secondary" className="w-fit">
            {t("Rate is static in this demo", "Tỷ giá cố định trong demo")}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
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
                <SelectItem value="USDC">USDC - USD Coin (Solana)</SelectItem>
                <SelectItem value="USDT">USDT - Tether (Solana)</SelectItem>
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
              onChange={(e) => {
                setAmount(e.target.value)
                setValidationErrors([]) // Clear errors on change
              }}
              className="glass text-lg"
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground">
              {t(`Min $${minAmount} • Max $${maxAmount}`, `Tối thiểu $${minAmount} • Tối đa $${maxAmount}`)}
            </p>
          </div>

          {/* Rate & Estimate */}
          <div className="p-3 rounded-lg bg-muted/20 space-y-1">
            <div className="flex justify-between text-sm">
              <span>{t("Rate:", "Tỷ giá:")}</span>
              <span>1 USD = 27,000 VND</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t("Processing fee:", "Phí xử lý:")}</span>
              <span>{formatCurrency(Number.parseFloat(processingFee))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t("Total cost:", "Tổng chi phí:")}</span>
              <span className="font-medium">{formatCurrency(Number.parseFloat(totalCost))}</span>
            </div>
            <div className="flex justify-between text-sm font-medium border-t border-border/50 pt-1">
              <span>{t("You'll receive:", "Bạn sẽ nhận:")}</span>
              <span className="text-primary">
                {estimatedReceive} {toCurrency}
              </span>
            </div>
          </div>

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
                disabled={isProcessing || !navigator.userAgent.includes("iPhone")}
              >
                <Smartphone className="mr-3 h-4 w-4" />
                Apple Pay
                {!navigator.userAgent.includes("iPhone") && (
                  <Badge variant="secondary" className="ml-auto">
                    {t("iOS only", "Chỉ iOS")}
                  </Badge>
                )}
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
            {isProcessing ? t("Processing...", "Đang xử lý...") : t("Preview Order", "Xem trước đơn hàng")}
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-auto pt-6 text-center">
        <p className="text-xs text-muted-foreground">
          {t("Prototype • No real funds • Rates simulated", "Prototype • Không có tiền thật • Tỷ giá mô phỏng")}
        </p>
      </div>

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
