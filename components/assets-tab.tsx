"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "./auth-provider"
import { useWallet } from "./wallet-provider"
import { DepositModal } from "./deposit-modal"
import { SendModal } from "./send-modal"
import { TokenDetailModal } from "./token-detail-modal"
import { Eye, EyeOff, Send, Plus, TrendingUp, TrendingDown, Clock } from "lucide-react"

export function AssetsTab() {
  const [showBalance, setShowBalance] = useState(true)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const { language, userState } = useAuth()
  const { tokens, totalBalance, formatCurrency, currency, setCurrency, transactions } = useWallet()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  const handleTokenClick = (tokenSymbol: string) => {
    setSelectedToken(tokenSymbol)
  }

  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Total Balance */}
      <Card className="glass border-border/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t("Total Balance", "Tổng số dư")}</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setCurrency(currency === "USD" ? "VND" : "USD")}>
                {currency}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-primary mb-2">
              {showBalance ? formatCurrency(totalBalance) : "••••••"}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">+2.3% (24h)</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => setShowSendModal(true)} className="h-12">
              <Send className="mr-2 h-4 w-4" />
              {t("Send", "Gửi")}
            </Button>
            <Button variant="outline" onClick={() => setShowDepositModal(true)} className="h-12">
              <Plus className="mr-2 h-4 w-4" />
              {t("Deposit", "Nạp tiền")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Token List */}
      <Card className="glass border-border/30">
        <CardHeader>
          <CardTitle className="text-lg">{t("Your Tokens", "Token của bạn")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {tokens.map((token, index) => (
              <div key={token.symbol}>
                <div
                  className="flex items-center justify-between p-4 hover:bg-muted/20 cursor-pointer transition-colors"
                  onClick={() => handleTokenClick(token.symbol)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                      {token.icon}
                    </div>
                    <div>
                      <p className="font-medium">{token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{token.name}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">
                      {showBalance ? token.amount.toFixed(4) : "••••"} {token.symbol}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {showBalance ? formatCurrency(token.amount * token.price) : "••••"}
                      </p>
                      <Badge variant={token.change24h >= 0 ? "default" : "destructive"} className="text-xs">
                        {token.change24h >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(token.change24h).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
                {index < tokens.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass border-border/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t("Recent Activity", "Hoạt động gần đây")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentTransactions.length > 0 ? (
            <div className="space-y-0">
              {recentTransactions.map((tx, index) => (
                <div key={tx.id}>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        {tx.type === "onramp" && "💳"}
                        {tx.type === "swap" && "🔄"}
                        {tx.type === "send" && "📤"}
                        {tx.type === "receive" && "📥"}
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {t(tx.type, tx.type === "onramp" ? "Nạp tiền" : tx.type === "swap" ? "Hoán đổi" : tx.type)}
                        </p>
                        <p className="text-sm text-muted-foreground">{tx.timestamp.toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        +{tx.amount.toFixed(4)} {tx.token}
                      </p>
                      <Badge variant={tx.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {t(tx.status, tx.status === "completed" ? "Hoàn thành" : tx.status)}
                      </Badge>
                    </div>
                  </div>
                  {index < recentTransactions.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("No recent activity", "Không có hoạt động gần đây")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />

      <SendModal isOpen={showSendModal} onClose={() => setShowSendModal(false)} />

      {selectedToken && (
        <TokenDetailModal isOpen={!!selectedToken} onClose={() => setSelectedToken(null)} tokenSymbol={selectedToken} />
      )}
    </div>
  )
}
