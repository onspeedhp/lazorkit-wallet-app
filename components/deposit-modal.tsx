"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "./auth-provider"
import { useWallet } from "./wallet-provider"
import { useToast } from "@/hooks/use-toast"
import { Copy, QrCode } from "lucide-react"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const { language, userState } = useAuth()
  const { truncateAddress } = useWallet()
  const { toast } = useToast()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(userState.pubkey)
    toast({
      title: t("Copied", "Đã sao chép"),
      description: t("Wallet address copied to clipboard", "Địa chỉ ví đã được sao chép"),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t("Deposit Crypto", "Nạp Crypto")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code */}
          <Card className="glass border-border/30">
            <CardContent className="p-6 text-center">
              <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <QrCode className="h-24 w-24 mx-auto mb-2 text-gray-800" />
                  <p className="text-xs text-gray-600">{t("QR Code", "Mã QR")}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("Scan this QR code to get your wallet address", "Quét mã QR này để lấy địa chỉ ví")}
              </p>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="glass border-border/30">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("Your Solana Address", "Địa chỉ Solana của bạn")}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg">
                  <p className="font-mono text-sm break-all">{userState.pubkey}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="glass border-border/30">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">{t("How to deposit", "Cách nạp tiền")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("Copy your wallet address above", "Sao chép địa chỉ ví ở trên")}</li>
                <li>• {t("Send Solana tokens to this address", "Gửi token Solana đến địa chỉ này")}</li>
                <li>• {t("Funds will appear in your wallet", "Tiền sẽ xuất hiện trong ví của bạn")}</li>
              </ul>
            </CardContent>
          </Card>

          {/* Warning */}
          <div className="text-xs text-muted-foreground text-center p-3 bg-destructive/10 rounded-lg">
            {t(
              "⚠️ This is a demo. Do not send real funds to this address.",
              "⚠️ Đây là demo. Không gửi tiền thật đến địa chỉ này.",
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
