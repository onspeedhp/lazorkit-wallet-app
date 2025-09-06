"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "./auth-provider"
import { useWallet } from "./wallet-provider"
import { useToast } from "@/hooks/use-toast"
import { User, Palette, Shield, Key, Zap, AlertTriangle, Copy } from "lucide-react"

export function SettingsTab() {
  const [walletName, setWalletName] = useState("")
  const [theme, setTheme] = useState("dark")
  const { language, setLanguage, userState, updateWalletName, regeneratePasskey, resetDemoData } = useAuth()
  const { currency, setCurrency, truncateAddress } = useWallet()
  const { toast } = useToast()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  const handleSaveWalletName = () => {
    if (walletName.trim()) {
      updateWalletName(walletName.trim())
      setWalletName("")
    }
  }

  const handleExportPublicKey = () => {
    navigator.clipboard.writeText(userState.pubkey)
    toast({
      title: t("Exported", "Đã xuất"),
      description: t("Public key copied to clipboard", "Khóa công khai đã được sao chép"),
    })
  }

  const handleTestnetAirdrop = () => {
    toast({
      title: t("Airdrop received (demo)", "Đã nhận airdrop (demo)"),
      description: t("0.1 SOL added to your wallet", "0.1 SOL đã được thêm vào ví"),
    })
  }

  return (
    <div className="space-y-6">
      {/* Wallet Settings */}
      <Card className="glass border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("Wallet Settings", "Cài đặt ví")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("Wallet Name", "Tên ví")}</Label>
            <div className="flex gap-2">
              <Input
                placeholder={userState.walletName || t("My Wallet", "Ví của tôi")}
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                className="glass"
              />
              <Button onClick={handleSaveWalletName} disabled={!walletName.trim()}>
                {t("Save", "Lưu")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="glass border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t("Appearance", "Giao diện")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("Language", "Ngôn ngữ")}</Label>
            <Select value={language} onValueChange={(value: "EN" | "VI") => setLanguage(value)}>
              <SelectTrigger className="glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN">English</SelectItem>
                <SelectItem value="VI">Tiếng Việt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("Theme", "Chủ đề")}</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">{t("Dark", "Tối")}</SelectItem>
                <SelectItem value="light">{t("Light", "Sáng")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("Default Currency", "Tiền tệ mặc định")}</Label>
            <Select value={currency} onValueChange={(value: "USD" | "VND") => setCurrency(value)}>
              <SelectTrigger className="glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="VND">VND - Vietnamese Dong</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Security */}
      <Card className="glass border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("Backup & Security", "Sao lưu & Bảo mật")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t("Passkey Status", "Trạng thái Passkey")}</p>
              <p className="text-sm text-muted-foreground">
                {userState.hasPasskey
                  ? t("Passkey created and active", "Passkey đã tạo và hoạt động")
                  : t("No passkey created", "Chưa tạo passkey")}
              </p>
            </div>
            <Button variant="outline" onClick={regeneratePasskey}>
              <Key className="mr-2 h-4 w-4" />
              {t("Regenerate", "Tái tạo")}
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t("Export Public Key", "Xuất khóa công khai")}</p>
              <p className="text-sm text-muted-foreground">{truncateAddress(userState.pubkey)}</p>
            </div>
            <Button variant="outline" onClick={handleExportPublicKey}>
              <Copy className="mr-2 h-4 w-4" />
              {t("Copy", "Sao chép")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced */}
      <Card className="glass border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {t("Advanced", "Nâng cao")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t("Request Testnet Airdrop", "Yêu cầu Airdrop Testnet")}</p>
              <p className="text-sm text-muted-foreground">
                {t("Get free testnet tokens for testing", "Nhận token testnet miễn phí để thử nghiệm")}
              </p>
            </div>
            <Button variant="outline" onClick={handleTestnetAirdrop}>
              <Zap className="mr-2 h-4 w-4" />
              {t("Request", "Yêu cầu")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="glass border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {t("Danger Zone", "Vùng nguy hiểm")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive" className="bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t(
                "This resets demo data on this device only. Your wallet and transactions will be cleared.",
                "Điều này sẽ reset dữ liệu demo chỉ trên thiết bị này. Ví và giao dịch của bạn sẽ bị xóa.",
              )}
            </AlertDescription>
          </Alert>

          <Button variant="destructive" onClick={resetDemoData} className="w-full">
            {t("Reset Local Demo Data", "Reset dữ liệu demo cục bộ")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
