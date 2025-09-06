"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { OnRampTab } from "./onramp-tab"
import { SwapTab } from "./swap-tab"
import { useAuth } from "./auth-provider"
import { useWallet } from "./wallet-provider"
import { Eye, EyeOff, Plus } from "lucide-react"

export function BuyCoins() {
  const [showBalance, setShowBalance] = useState(true)
  const { language, userState } = useAuth()
  const { totalBalance, formatCurrency, truncateAddress } = useWallet()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  return (
    <div className="space-y-6 p-4">
      {/* Wallet Banner */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{t("Your Wallet", "Ví của bạn")}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Balance Display */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">{t("Total Balance", "Tổng số dư")}</p>
            <p className="text-3xl font-bold text-primary">{showBalance ? formatCurrency(totalBalance) : "••••••"}</p>
          </div>

          {/* Wallet Address */}
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">{t("Wallet Address", "Địa chỉ ví")}</p>
              <p className="font-mono text-sm">{truncateAddress(userState.pubkey)}</p>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t("Deposit", "Nạp tiền")}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/10 rounded-lg">
              <p className="text-sm text-muted-foreground">{t("Active Tokens", "Token hoạt động")}</p>
              <p className="text-lg font-semibold">5</p>
            </div>
            <div className="text-center p-3 bg-muted/10 rounded-lg">
              <p className="text-sm text-muted-foreground">{t("24h Change", "Thay đổi 24h")}</p>
              <p className="text-lg font-semibold text-green-500">+2.3%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buy/Swap Tabs */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t("Buy & Trade", "Mua & Giao dịch")}
            <Badge variant="secondary" className="text-xs">
              {t("Demo", "Demo")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="onramp" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="onramp" className="text-sm">
                {t("On-Ramp", "Nạp tiền")}
              </TabsTrigger>
              <TabsTrigger value="swap" className="text-sm">
                {t("Swap", "Hoán đổi")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="onramp" className="space-y-4">
              <OnRampTab />
            </TabsContent>

            <TabsContent value="swap" className="space-y-4">
              <SwapTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
