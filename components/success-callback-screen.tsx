"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "./auth-provider"
import { useWallet } from "./wallet-provider"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Copy, ArrowLeft } from "lucide-react"

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

interface SuccessCallbackScreenProps {
  orderDetails: OrderDetails
  onReturn: () => void
}

export function SuccessCallbackScreen({ orderDetails, onReturn }: SuccessCallbackScreenProps) {
  const { language, userState } = useAuth()
  const { formatCurrency, truncateAddress } = useWallet()
  const { toast } = useToast()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderDetails.orderId)
    toast({
      title: t("Copied", "Đã sao chép"),
      description: t("Order ID copied to clipboard", "ID đơn hàng đã được sao chép"),
    })
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(userState.pubkey)
    toast({
      title: t("Copied", "Đã sao chép"),
      description: t("Wallet address copied to clipboard", "Địa chỉ ví đã được sao chép"),
    })
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Success Icon */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">{t("Payment Successful", "Thanh toán thành công")}</h1>
          <p className="text-muted-foreground">
            {t("Your crypto purchase has been completed", "Giao dịch mua crypto của bạn đã hoàn tất")}
          </p>
        </div>

        {/* Order Details */}
        <Card className="glass-card border-border/50">
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
                <Button variant="ghost" size="sm" onClick={handleCopyOrderId}>
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
                <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Status */}
        <Card className="glass-card border-border/50">
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
        <Button onClick={onReturn} className="w-full h-12 text-base font-medium" size="lg">
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
