"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BuyCoins } from "./buy-coins"
import { ListApps } from "./list-apps"
import { AccountManagement } from "./account-management"
import { useAuth } from "./auth-provider"
import { useWallet } from "./wallet-provider"
import { Menu, Wallet, ShoppingBag, Settings } from "lucide-react"
import { PageTransition } from "./page-transition"

export function MainApp() {
  const [currentPage, setCurrentPage] = useState("buy-coins")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { userState, language } = useAuth()
  const { truncateAddress } = useWallet()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  const menuItems = [
    {
      id: "buy-coins",
      label: t("Buy Coin", "Mua Coin"),
      icon: <Wallet className="h-5 w-5" />,
      description: t("Purchase crypto with fiat", "Mua crypto bằng tiền pháp định"),
    },
    {
      id: "list-apps",
      label: t("List Apps", "Danh sách Apps"),
      icon: <ShoppingBag className="h-5 w-5" />,
      description: t("Browse integrated applications", "Duyệt các ứng dụng tích hợp"),
    },
    {
      id: "account",
      label: t("Account Management", "Quản lý tài khoản"),
      icon: <Settings className="h-5 w-5" />,
      description: t("Manage assets and settings", "Quản lý tài sản và cài đặt"),
    },
  ]

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "buy-coins":
        return (
          <PageTransition>
            <BuyCoins />
          </PageTransition>
        )
      case "list-apps":
        return (
          <PageTransition>
            <ListApps />
          </PageTransition>
        )
      case "account":
        return (
          <PageTransition>
            <AccountManagement />
          </PageTransition>
        )
      default:
        return (
          <PageTransition>
            <BuyCoins />
          </PageTransition>
        )
    }
  }

  const getCurrentPageTitle = () => {
    const item = menuItems.find((item) => item.id === currentPage)
    return item?.label || t("Buy Coin", "Mua Coin")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40 animate-fade-in">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-primary">Lazorkit Wallet</h1>
          <p className="text-sm text-muted-foreground">{truncateAddress(userState.pubkey)}</p>
        </div>

        {/* Current Page Indicator */}
        <div className="flex-1 text-center">
          <p className="text-sm font-medium">{getCurrentPageTitle()}</p>
        </div>

        {/* Hamburger Menu */}
        <div className="flex-1 flex justify-end">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative focus-ring hover-lift">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 glass-card border-border/50 p-0 animate-slide-up">
              <div className="p-6">
                {/* Menu Header */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">{t("Menu", "Menu")}</h2>
                  <p className="text-sm text-muted-foreground">{t("Navigate your wallet", "Điều hướng ví của bạn")}</p>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <Button
                      key={item.id}
                      variant={currentPage === item.id ? "default" : "ghost"}
                      className="w-full justify-start h-auto p-4 flex-col items-start hover-lift focus-ring animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => {
                        setCurrentPage(item.id)
                        setIsMenuOpen(false)
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {item.icon}
                        <div className="text-left flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>

                {/* Menu Footer */}
                <div className="mt-8 pt-6 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">{t("Lazorkit Wallet v1.0", "Lazorkit Wallet v1.0")}</p>
                    <p className="text-xs text-muted-foreground">{t("Prototype Mode", "Chế độ Prototype")}</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderCurrentPage()}</div>

      {/* Footer */}
      <div className="p-4 text-center border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <p className="text-xs text-muted-foreground">
          {t("Prototype • No real funds • Rates simulated", "Prototype • Không có tiền thật • Tỷ giá mô phỏng")}
        </p>
      </div>
    </div>
  )
}
