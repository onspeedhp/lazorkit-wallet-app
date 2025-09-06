"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "./auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Copy, QrCode, Smartphone } from "lucide-react"

interface AddDeviceModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (deviceName: string) => void
}

export function AddDeviceModal({ isOpen, onClose, onAdd }: AddDeviceModalProps) {
  const [deviceName, setDeviceName] = useState("")
  const { language } = useAuth()
  const { toast } = useToast()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  const pairingLink = `https://lazorkit.app/pair?code=${Math.random().toString(36).substr(2, 9)}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pairingLink)
    toast({
      title: t("Copied", "Đã sao chép"),
      description: t("Pairing link copied to clipboard", "Liên kết ghép nối đã được sao chép"),
    })
  }

  const handleAdd = () => {
    if (deviceName.trim()) {
      onAdd(deviceName.trim())
      setDeviceName("")
      onClose()
    }
  }

  const handleClose = () => {
    setDeviceName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {t("Add New Device", "Thêm thiết bị mới")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Device Name */}
          <div className="space-y-2">
            <Label>{t("Device Name", "Tên thiết bị")}</Label>
            <Input
              placeholder={t("e.g., My iPhone", "ví dụ: iPhone của tôi")}
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="glass"
            />
          </div>

          {/* QR Code */}
          <Card className="glass border-border/30">
            <CardContent className="p-6 text-center">
              <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <QrCode className="h-24 w-24 mx-auto mb-2 text-gray-800" />
                  <p className="text-xs text-gray-600">{t("Pairing QR", "QR ghép nối")}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("Scan this QR code with your new device", "Quét mã QR này bằng thiết bị mới của bạn")}
              </p>
            </CardContent>
          </Card>

          {/* Pairing Link */}
          <Card className="glass border-border/30">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>{t("Pairing Link", "Liên kết ghép nối")}</Label>
                  <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg">
                  <p className="font-mono text-xs break-all">{pairingLink}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="glass border-border/30">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">{t("How to pair", "Cách ghép nối")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. {t("Open Lazorkit Wallet on your new device", "Mở Lazorkit Wallet trên thiết bị mới")}</li>
                <li>2. {t("Scan the QR code or use the pairing link", "Quét mã QR hoặc sử dụng liên kết ghép nối")}</li>
                <li>3. {t("Follow the setup instructions", "Làm theo hướng dẫn thiết lập")}</li>
              </ul>
            </CardContent>
          </Card>

          {/* Demo Notice */}
          <div className="text-xs text-muted-foreground text-center p-3 bg-muted/10 rounded-lg">
            {t("This is a demo. The pairing process is simulated.", "Đây là demo. Quá trình ghép nối được mô phỏng.")}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              {t("Cancel", "Hủy")}
            </Button>
            <Button onClick={handleAdd} disabled={!deviceName.trim()} className="flex-1">
              {t("Add Device", "Thêm thiết bị")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
