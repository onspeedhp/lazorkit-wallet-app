"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "./auth-provider"
import { useToast } from "@/hooks/use-toast"
import { AddDeviceModal } from "./add-device-modal"
import { RemoveDeviceDialog } from "./remove-device-dialog"
import { Smartphone, Laptop, Trash2, Plus, MapPin, Clock } from "lucide-react"

interface Device {
  id: string
  name: string
  platform: "iOS" | "Android" | "Windows" | "macOS"
  lastActive: string
  location: string
  isCurrent: boolean
}

const MOCK_DEVICES: Device[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    platform: "iOS",
    lastActive: "2 hours ago",
    location: "Ho Chi Minh City, VN",
    isCurrent: true,
  },
  {
    id: "2",
    name: "Pixel 8",
    platform: "Android",
    lastActive: "Yesterday",
    location: "Hanoi, VN",
    isCurrent: false,
  },
  {
    id: "3",
    name: "MacBook Pro",
    platform: "macOS",
    lastActive: "3 days ago",
    location: "Da Nang, VN",
    isCurrent: false,
  },
]

export function DevicesTab() {
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES)
  const [showAddDevice, setShowAddDevice] = useState(false)
  const [deviceToRemove, setDeviceToRemove] = useState<string | null>(null)
  const { language } = useAuth()
  const { toast } = useToast()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  const getPlatformIcon = (platform: Device["platform"]) => {
    switch (platform) {
      case "iOS":
      case "Android":
        return <Smartphone className="h-5 w-5" />
      case "Windows":
      case "macOS":
        return <Laptop className="h-5 w-5" />
      default:
        return <Smartphone className="h-5 w-5" />
    }
  }

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(devices.filter((device) => device.id !== deviceId))
    setDeviceToRemove(null)
    toast({
      title: t("Device removed", "Thiết bị đã xóa"),
      description: t("Device has been removed from your account", "Thiết bị đã được xóa khỏi tài khoản"),
    })
  }

  const handleAddDevice = (deviceName: string) => {
    const newDevice: Device = {
      id: Date.now().toString(),
      name: deviceName,
      platform: "iOS",
      lastActive: "Just now",
      location: "Unknown",
      isCurrent: false,
    }
    setDevices([...devices, newDevice])
    toast({
      title: t("Device added", "Thiết bị đã thêm"),
      description: t("New device has been paired successfully", "Thiết bị mới đã được ghép nối thành công"),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("Connected Devices", "Thiết bị đã kết nối")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("Manage devices that can access your wallet", "Quản lý thiết bị có thể truy cập ví của bạn")}
          </p>
        </div>
        <Button onClick={() => setShowAddDevice(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("Add Device", "Thêm thiết bị")}
        </Button>
      </div>

      {/* Security Notice */}
      <Alert className="glass border-border/30">
        <AlertDescription>
          {t(
            "Only add devices you trust. Remove any devices you no longer use or recognize.",
            "Chỉ thêm các thiết bị bạn tin tưởng. Xóa bất kỳ thiết bị nào bạn không còn sử dụng hoặc không nhận ra.",
          )}
        </AlertDescription>
      </Alert>

      {/* Device List */}
      <div className="space-y-3">
        {devices.length > 0 ? (
          devices.map((device) => (
            <Card key={device.id} className="glass border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      {getPlatformIcon(device.platform)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{device.name}</p>
                        {device.isCurrent && (
                          <Badge variant="default" className="text-xs">
                            {t("Current", "Hiện tại")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{device.platform}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {device.lastActive}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {device.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!device.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeviceToRemove(device.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="glass border-border/30">
            <CardContent className="p-8 text-center">
              <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                {t(
                  "No devices yet. Add one to manage this wallet.",
                  "Chưa có thiết bị nào. Thêm một thiết bị để quản lý ví này.",
                )}
              </p>
              <Button onClick={() => setShowAddDevice(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("Add Device", "Thêm thiết bị")}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <AddDeviceModal isOpen={showAddDevice} onClose={() => setShowAddDevice(false)} onAdd={handleAddDevice} />

      <RemoveDeviceDialog
        isOpen={!!deviceToRemove}
        onClose={() => setDeviceToRemove(null)}
        onConfirm={() => deviceToRemove && handleRemoveDevice(deviceToRemove)}
        deviceName={devices.find((d) => d.id === deviceToRemove)?.name || ""}
      />
    </div>
  )
}
