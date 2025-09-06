"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "./auth-provider"
import { Search, Star, ExternalLink, Zap, Gamepad2, Palette, Shield, TrendingUp, Users, Gift } from "lucide-react"

interface App {
  id: string
  name: string
  description: string
  category: string
  rating: number
  users: string
  icon: React.ReactNode
  featured: boolean
  tags: string[]
  url?: string
}

const mockApps: App[] = [
  {
    id: "uniswap",
    name: "Uniswap",
    description: "Decentralized exchange for trading tokens",
    category: "defi",
    rating: 4.8,
    users: "2.1M",
    icon: <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold">U</div>,
    featured: true,
    tags: ["DEX", "Trading", "AMM"],
    url: "https://uniswap.org",
  },
  {
    id: "opensea",
    name: "OpenSea",
    description: "The largest NFT marketplace",
    category: "nft",
    rating: 4.5,
    users: "1.8M",
    icon: <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">O</div>,
    featured: true,
    tags: ["NFT", "Marketplace", "Art"],
    url: "https://opensea.io",
  },
  {
    id: "axie",
    name: "Axie Infinity",
    description: "Play-to-earn blockchain game",
    category: "gaming",
    rating: 4.3,
    users: "950K",
    icon: (
      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">A</div>
    ),
    featured: false,
    tags: ["P2E", "Gaming", "NFT"],
    url: "https://axieinfinity.com",
  },
  {
    id: "compound",
    name: "Compound",
    description: "Earn interest on your crypto",
    category: "defi",
    rating: 4.6,
    users: "680K",
    icon: (
      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">C</div>
    ),
    featured: false,
    tags: ["Lending", "Interest", "DeFi"],
  },
  {
    id: "superrare",
    name: "SuperRare",
    description: "Digital art marketplace",
    category: "nft",
    rating: 4.4,
    users: "320K",
    icon: <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">S</div>,
    featured: false,
    tags: ["Art", "NFT", "Collectibles"],
  },
  {
    id: "decentraland",
    name: "Decentraland",
    description: "Virtual world platform",
    category: "gaming",
    rating: 4.1,
    users: "450K",
    icon: (
      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">D</div>
    ),
    featured: false,
    tags: ["Metaverse", "Virtual", "Land"],
  },
]

export function ListApps() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { language } = useAuth()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  const categories = [
    { id: "all", label: t("All", "Tất cả"), icon: <Zap className="h-4 w-4" /> },
    { id: "defi", label: t("DeFi", "DeFi"), icon: <TrendingUp className="h-4 w-4" /> },
    { id: "nft", label: t("NFT", "NFT"), icon: <Palette className="h-4 w-4" /> },
    { id: "gaming", label: t("Gaming", "Game"), icon: <Gamepad2 className="h-4 w-4" /> },
    { id: "social", label: t("Social", "Xã hội"), icon: <Users className="h-4 w-4" /> },
    { id: "security", label: t("Security", "Bảo mật"), icon: <Shield className="h-4 w-4" /> },
  ]

  const filteredApps = mockApps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || app.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredApps = filteredApps.filter((app) => app.featured)
  const regularApps = filteredApps.filter((app) => !app.featured)

  const handleAppClick = (app: App) => {
    if (app.url) {
      window.open(app.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">{t("App Directory", "Thư mục Apps")}</h2>
          <p className="text-muted-foreground">
            {t(
              "Discover and connect to decentralized applications",
              "Khám phá và kết nối với các ứng dụng phi tập trung",
            )}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("Search apps...", "Tìm kiếm apps...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card border-border/50"
          />
        </div>
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 glass-card border-border/50">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2 text-xs">
              {category.icon}
              <span className="hidden sm:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6 space-y-6">
          {/* Featured Apps */}
          {featuredApps.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{t("Featured", "Nổi bật")}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredApps.map((app) => (
                  <Card
                    key={app.id}
                    className="glass-card border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
                    onClick={() => handleAppClick(app)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {app.icon}
                          <div>
                            <CardTitle className="text-base">{app.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-muted-foreground">{app.rating}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {app.users} {t("users", "người dùng")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="mb-3">{app.description}</CardDescription>
                      <div className="flex flex-wrap gap-1">
                        {app.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Apps */}
          {regularApps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("All Apps", "Tất cả Apps")} ({regularApps.length})
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {regularApps.map((app) => (
                  <Card
                    key={app.id}
                    className="glass-card border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
                    onClick={() => handleAppClick(app)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {app.icon}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium truncate">{app.name}</h4>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-muted-foreground">{app.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{app.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-muted-foreground">
                                {app.users} {t("users", "người dùng")}
                              </span>
                              <div className="flex gap-1">
                                {app.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredApps.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">{t("No apps found", "Không tìm thấy apps")}</h3>
              <p className="text-muted-foreground">
                {t("Try adjusting your search or category filter", "Thử điều chỉnh tìm kiếm hoặc bộ lọc danh mục")}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Info Banner */}
      <Card className="glass-card border-border/50 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Gift className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">{t("Connect Seamlessly", "Kết nối liền mạch")}</h4>
              <p className="text-xs text-muted-foreground">
                {t(
                  "Your wallet automatically connects to supported dApps. Always verify URLs before connecting.",
                  "Ví của bạn tự động kết nối với các dApps được hỗ trợ. Luôn xác minh URL trước khi kết nối.",
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
