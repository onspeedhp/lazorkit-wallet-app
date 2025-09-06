"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "./auth-provider"
import { useWallet } from "./wallet-provider"
import { useToast } from "@/hooks/use-toast"
import { Copy, Send, Plus, TrendingUp, TrendingDown, ExternalLink } from "lucide-react"

interface TokenDetailModalProps {
  isOpen: boolean
  onClose: () => void
  tokenSymbol: string
}

export function TokenDetailModal({ isOpen, onClose, tokenSymbol }: TokenDetailModalProps) {
  const { language } = useAuth()
  const { getTokenBySymbol, formatCurrency } = useWallet()
  const { toast } = useToast()

  const token = getTokenBySymbol(tokenSymbol)
  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  if (!token) return null

  const handleCopyContract = () => {
    if (token.contractAddress) {
      navigator.clipboard.writeText(token.contractAddress)
      toast({
        title: t("Copied", "Đã sao chép"),
        description: t("Contract address copied", "Địa chỉ hợp đồng đã được sao chép"),
      })
    }
  }

  const marketCap = 1234567890 // Mock data
  const totalSupply = 1000000000 // Mock data

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{token.icon}</span>
            <div>
              <div className="text-xl font-bold">{token.name}</div>
              <div className="text-sm text-muted-foreground">{token.symbol}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Price & Change */}
          <Card className="glass border-border/30">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold">{formatCurrency(token.price)}</p>
                <Badge variant={token.change24h >= 0 ? "default" : "destructive"} className="text-sm">
                  {token.change24h >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(token.change24h).toFixed(2)}% (24h)
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Holdings */}
          <Card className="glass border-border/30">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-medium">{t("Your Holdings", "Nắm giữ của bạn")}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("Balance", "Số dư")}</span>
                  <span className="font-medium">
                    {token.amount.toFixed(4)} {token.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("Value", "Giá trị")}</span>
                  <span className="font-medium">{formatCurrency(token.amount * token.price)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token Info */}
          <Card className="glass border-border/30">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-medium">{t("Token Information", "Thông tin Token")}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("Market Cap", "Vốn hóa thị trường")}</span>
                  <span>{formatCurrency(marketCap)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("Total Supply", "Tổng cung")}</span>
                  <span>{totalSupply.toLocaleString()}</span>
                </div>
                {token.contractAddress && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t("Contract", "Hợp đồng")}</span>
                        <Button variant="ghost" size="sm" onClick={handleCopyContract}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="font-mono text-xs break-all bg-muted/20 p-2 rounded">{token.contractAddress}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-12">
              <Send className="mr-2 h-4 w-4" />
              {t("Send", "Gửi")}
            </Button>
            <Button variant="outline" className="h-12 bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              {t("Deposit", "Nạp tiền")}
            </Button>
          </div>

          {/* External Links */}
          <Card className="glass border-border/30">
            <CardContent className="p-4">
              <Button variant="ghost" className="w-full justify-between">
                <span>{t("View on Explorer", "Xem trên Explorer")}</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
