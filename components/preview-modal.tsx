"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "./auth-provider"
import { useWallet } from "./wallet-provider"
import { CreditCard, Smartphone, QrCode, ArrowRight } from "lucide-react"

interface OrderData {
  amount: number
  fromCurrency: string
  toCurrency: string
  estimatedReceive: number
  paymentMethod: string
  processingFee: number
  totalCost: number
}

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  orderData: OrderData
}

export function PreviewModal({ isOpen, onClose, onConfirm, orderData }: PreviewModalProps) {
  const { language } = useAuth()
  const { formatCurrency } = useWallet()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  const getPaymentIcon = () => {
    if (orderData.paymentMethod.includes("Apple")) return <Smartphone className="h-5 w-5" />
    if (orderData.paymentMethod.includes("VNPay")) return <QrCode className="h-5 w-5" />
    return <CreditCard className="h-5 w-5" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t("Review Your Order", "Xem lại đơn hàng")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <Card className="glass border-border/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("You pay", "Bạn trả")}</span>
                <span className="font-medium">
                  {formatCurrency(orderData.amount)} {orderData.fromCurrency}
                </span>
              </div>

              <div className="flex items-center justify-center py-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("You receive", "Bạn nhận")}</span>
                <span className="font-medium text-primary">
                  {orderData.estimatedReceive.toFixed(2)} {orderData.toCurrency}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="glass border-border/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {getPaymentIcon()}
                <div>
                  <p className="font-medium">{orderData.paymentMethod}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("Payment will be processed securely", "Thanh toán sẽ được xử lý an toàn")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Breakdown */}
          <Card className="glass border-border/30">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("Amount", "Số tiền")}</span>
                <span>{formatCurrency(orderData.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t("Processing fee", "Phí xử lý")}</span>
                <span>{formatCurrency(orderData.processingFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>{t("Total", "Tổng cộng")}</span>
                <span>{formatCurrency(orderData.totalCost)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground text-center p-3 bg-muted/10 rounded-lg">
            {t(
              "This is a demo transaction. No real funds will be charged.",
              "Đây là giao dịch demo. Không có tiền thật nào bị tính phí.",
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            {t("Cancel", "Hủy")}
          </Button>
          <Button onClick={onConfirm} className="flex-1">
            {t("Confirm & Pay", "Xác nhận & Thanh toán")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
