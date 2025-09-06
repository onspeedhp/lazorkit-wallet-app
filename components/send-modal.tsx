"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "./auth-provider"
import { useWallet } from "./wallet-provider"
import { useToast } from "@/hooks/use-toast"
import { Scan, Clipboard } from "lucide-react"

interface SendModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SendModal({ isOpen, onClose }: SendModalProps) {
  const [selectedToken, setSelectedToken] = useState("")
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { language } = useAuth()
  const { tokens, formatCurrency, addTransaction, updateTokenBalance, getTokenBySymbol } = useWallet()
  const { toast } = useToast()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  const availableTokens = tokens.filter((token) => token.amount > 0)
  const selectedTokenData = getTokenBySymbol(selectedToken)
  const maxBalance = selectedTokenData?.amount || 0
  const estimatedFee = 0.000005 // SOL

  const isValidAmount = amount && Number.parseFloat(amount) > 0 && Number.parseFloat(amount) <= maxBalance
  const isValidRecipient = recipient && recipient.length > 10

  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setRecipient(text)
      toast({
        title: t("Pasted", "Đã dán"),
        description: t("Address pasted from clipboard", "Địa chỉ đã được dán từ clipboard"),
      })
    } catch (error) {
      toast({
        title: t("Error", "Lỗi"),
        description: t("Could not paste from clipboard", "Không thể dán từ clipboard"),
        variant: "destructive",
      })
    }
  }

  const handleScanQR = () => {
    // Simulate QR scan
    const mockAddress = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
    setRecipient(mockAddress)
    toast({
      title: t("QR Scanned", "Đã quét QR"),
      description: t("Address scanned successfully", "Địa chỉ đã được quét thành công"),
    })
  }

  const handleSend = async () => {
    if (!isValidAmount || !isValidRecipient || isProcessing) return

    setIsProcessing(true)

    toast({
      title: t("Sending...", "Đang gửi..."),
      description: t(`Sending ${amount} ${selectedToken}`, `Đang gửi ${amount} ${selectedToken}`),
    })

    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      // Update balance
      const currentBalance = selectedTokenData?.amount || 0
      updateTokenBalance(selectedToken, currentBalance - Number.parseFloat(amount))

      // Add transaction
      addTransaction({
        type: "send",
        amount: Number.parseFloat(amount),
        token: selectedToken,
        status: "completed",
      })

      toast({
        title: t("Sent successfully", "Gửi thành công"),
        description: t(`Sent ${amount} ${selectedToken}`, `Đã gửi ${amount} ${selectedToken}`),
      })

      // Reset form and close
      setSelectedToken("")
      setRecipient("")
      setAmount("")
      onClose()
    } catch (error) {
      toast({
        title: t("Send failed", "Gửi thất bại"),
        description: t("Please try again", "Vui lòng thử lại"),
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      setSelectedToken("")
      setRecipient("")
      setAmount("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t("Send Crypto", "Gửi Crypto")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Token Selection */}
          <div className="space-y-2">
            <Label>{t("Choose Token", "Chọn Token")}</Label>
            <Select value={selectedToken} onValueChange={setSelectedToken} disabled={isProcessing}>
              <SelectTrigger className="glass">
                <SelectValue placeholder={t("Select a token", "Chọn một token")} />
              </SelectTrigger>
              <SelectContent>
                {availableTokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center gap-2">
                      <span>{token.icon}</span>
                      <span>{token.symbol}</span>
                      <span className="text-muted-foreground">({token.amount.toFixed(4)})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recipient Address */}
          <div className="space-y-2">
            <Label>{t("Recipient Address", "Địa chỉ người nhận")}</Label>
            <div className="flex gap-2">
              <Input
                placeholder={t("Enter wallet address", "Nhập địa chỉ ví")}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="glass"
                disabled={isProcessing}
              />
              <Button variant="outline" size="icon" onClick={handlePasteAddress} disabled={isProcessing}>
                <Clipboard className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleScanQR} disabled={isProcessing}>
                <Scan className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("Amount", "Số lượng")}</Label>
              {selectedTokenData && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAmount(maxBalance.toString())}
                  disabled={isProcessing}
                >
                  {t("Max", "Tối đa")}: {maxBalance.toFixed(4)}
                </Button>
              )}
            </div>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="glass text-lg"
              disabled={isProcessing || !selectedToken}
            />
          </div>

          {/* Transaction Summary */}
          {selectedToken && amount && isValidAmount && (
            <Card className="glass border-border/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("Amount", "Số lượng")}</span>
                  <span>
                    {amount} {selectedToken}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("Network fee", "Phí mạng")}</span>
                  <span>{estimatedFee} SOL</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("Total value", "Tổng giá trị")}</span>
                  <span>{formatCurrency(Number.parseFloat(amount) * (selectedTokenData?.price || 0))}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Validation Errors */}
          {amount && !isValidAmount && (
            <p className="text-xs text-destructive">{t("Insufficient balance", "Số dư không đủ")}</p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isProcessing} className="flex-1 bg-transparent">
            {t("Cancel", "Hủy")}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!isValidAmount || !isValidRecipient || isProcessing}
            className="flex-1"
          >
            {isProcessing ? t("Sending...", "Đang gửi...") : t("Send", "Gửi")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
