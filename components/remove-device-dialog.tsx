"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from "./auth-provider"

interface RemoveDeviceDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  deviceName: string
}

export function RemoveDeviceDialog({ isOpen, onClose, onConfirm, deviceName }: RemoveDeviceDialogProps) {
  const { language } = useAuth()

  const t = (en: string, vi: string) => (language === "EN" ? en : vi)

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="glass-card border-border/50">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Remove Device", "Xóa thiết bị")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              `Are you sure you want to remove "${deviceName}"? This device will no longer be able to access your wallet.`,
              `Bạn có chắc chắn muốn xóa "${deviceName}"? Thiết bị này sẽ không thể truy cập ví của bạn nữa.`,
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent">{t("Cancel", "Hủy")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("Remove", "Xóa")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
