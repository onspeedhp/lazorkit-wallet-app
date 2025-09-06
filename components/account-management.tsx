"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssetsTab } from "./assets-tab"
import { DevicesTab } from "./devices-tab"
import { SettingsTab } from "./settings-tab"
import { useAuth } from "./auth-provider"
import { Wallet, Smartphone, Settings } from "lucide-react"

export function AccountManagement() {
  const { language } = useAuth()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">{t("Account Management", "Quản lý tài khoản")}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("Manage your assets, devices, and settings", "Quản lý tài sản, thiết bị và cài đặt của bạn")}
          </p>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-0">
          <Tabs defaultValue="assets" className="w-full">
            <div className="p-6 pb-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="assets" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("Assets", "Tài sản")}</span>
                </TabsTrigger>
                <TabsTrigger value="devices" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("Devices", "Thiết bị")}</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("Settings", "Cài đặt")}</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="assets" className="mt-0">
                <AssetsTab />
              </TabsContent>

              <TabsContent value="devices" className="mt-0">
                <DevicesTab />
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <SettingsTab />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
