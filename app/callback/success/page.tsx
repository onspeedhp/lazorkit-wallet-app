"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useWallet } from "@/components/wallet-provider"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Copy, ArrowLeft, Loader2 } from "lucide-react"

interface OrderDetails {
  orderId: string
  amount: number
  currency: string
  tokenReceived: number
  token: string
  paymentMethod: string
  processingFee: number
  totalCost: number
}

function SuccessCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { language, userState, setUserState } = useAuth()
  const { formatCurrency, truncateAddress, addToken } = useWallet()
  const { toast } = useToast()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  useEffect(() => {
    const orderId = searchParams.get("orderId")
    const amount = searchParams.get("amount")
    const currency = searchParams.get("currency")
    const token = searchParams.get("token")
    const method = searchParams.get("method")

    if (orderId && amount && currency && token && method) {
      // Simulate order details from query params
      const tokenReceived = Number.parseFloat(amount) / (currency === "USD" ? 1 : 27000) // Fake conversion
      const processingFee = Number.parseFloat(amount) * 0.029 // 2.9% fee
      const totalCost = Number.parseFloat(amount) + processingFee

      setOrderDetails({
        orderId,
        amount: Number.parseFloat(amount),
        currency,
        tokenReceived,
        token,
        paymentMethod: method,
        processingFee,
        totalCost,
      })

      if (!userState.hasWallet) {
        setUserState((prev) => ({ ...prev, hasWallet: true }))

        // Add the purchased tokens to wallet
        addToken(token, tokenReceived)

        toast({
          title: t("Wallet Ready", "Ví đã sẵn sàng"),
          description: t(
            "Your Lazorkit Wallet has been created and funded",
            "Ví Lazorkit của bạn đã được tạo và nạp tiền",
          ),
        })
      } else {
        // Just add tokens to existing wallet
        addToken(token, tokenReceived)
      }
    }

    setIsLoading(false)
  }, [searchParams, userState.hasWallet, setUserState, addToken, toast])

  const handleCopyOrderId = () => {
    if (orderDetails) {
      navigator.clipboard.writeText(orderDetails.orderId)
      toast({
        title: t("Copied", "Đã sao chép"),
        description: t("Order ID copied to clipboard", "ID đơn hàng đã được sao chép"),
      })
    }
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(userState.pubkey)
    toast({
      title: t("Copied", "Đã sao chép"),
      description: t("Wallet address copied to clipboard", "Địa chỉ ví đã được sao chép"),
    })
  }

  const handleReturn = () => {
    // Return to main app since user now has wallet
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">{t("Processing payment...", "Đang xử lý thanh toán...")}</span>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-background">
        <Card className="glass-card border-border/50 w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-bold mb-2">{t("Invalid Order", "Đơn hàng không hợp lệ")}</h1>
            <p className="text-muted-foreground mb-4">
              {t("Order details not found", "Không tìm thấy chi tiết đơn hàng")}
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              {t("Return to app", "Quay lại ứng dụng")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Success Icon */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 animate-scale-in">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">{t("Payment Successful", "Thanh toán thành công")}</h1>
          <p className="text-muted-foreground">
            {t("Your crypto purchase has been completed", "Giao dịch mua crypto của bạn đã hoàn tất")}
          </p>
        </div>

        {/* Order Details */}
        <Card className="glass-card border-border/50 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              {t("Order Details", "Chi tiết đơn hàng")}
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {t("Completed", "Hoàn thành")}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order ID */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("Order ID", "Mã đơn hàng")}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{orderDetails.orderId}</span>
                <Button variant="ghost" size="sm" onClick={handleCopyOrderId} className="focus-ring">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Amount Paid */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("Amount paid", "Số tiền đã trả")}</span>
              <span className="font-medium">
                {formatCurrency(orderDetails.totalCost)} {orderDetails.currency}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("Payment method", "Phương thức thanh toán")}</span>
              <span className="font-medium">{orderDetails.paymentMethod}</span>
            </div>

            {/* Token Received */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("Token received", "Token đã nhận")}</span>
              <span className="font-medium text-primary">
                {orderDetails.tokenReceived.toFixed(2)} {orderDetails.token}
              </span>
            </div>

            {/* Target Address */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("Sent to", "Gửi đến")}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{truncateAddress(userState.pubkey)}</span>
                <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="focus-ring">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Status */}
        <Card className="glass-card border-border/50 animate-slide-up">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{t("Wallet Ready", "Ví đã sẵn sàng")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("Your Lazorkit Wallet has been created and funded", "Ví Lazorkit của bạn đã được tạo và nạp tiền")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Button */}
        <Button onClick={handleReturn} className="w-full h-12 text-base font-medium focus-ring" size="lg">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("Return to app", "Quay lại ứng dụng")}
        </Button>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {t("Prototype • No real funds • Rates simulated", "Prototype • Không có tiền thật • Tỷ giá mô phỏng")}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-background">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        </div>
      }
    >
      <SuccessCallbackContent />
    </Suspense>
  )
}
