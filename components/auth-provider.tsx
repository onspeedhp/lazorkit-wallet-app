"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface UserState {
  hasPasskey: boolean
  hasWallet: boolean
  pubkey: string
  walletName: string
}

interface AuthContextType {
  userState: UserState
  language: "EN" | "VI"
  setLanguage: (lang: "EN" | "VI") => void
  createPasskey: () => Promise<void>
  createWallet: (fromOnRamp?: boolean) => Promise<void>
  resetDemoData: () => void
  regeneratePasskey: () => Promise<void>
  updateWalletName: (name: string) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const INITIAL_STATE: UserState = {
  hasPasskey: false,
  hasWallet: false,
  pubkey: "",
  walletName: "My Wallet",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE)
  const [language, setLanguage] = useState<"EN" | "VI">("EN")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem("lazorkit-user-state")
    const savedLanguage = localStorage.getItem("lazorkit-language")

    if (savedState) {
      try {
        setUserState(JSON.parse(savedState))
      } catch (error) {
        console.error("Failed to parse saved state:", error)
      }
    }

    if (savedLanguage) {
      setLanguage(savedLanguage as "EN" | "VI")
    }

    setIsLoading(false)
  }, [])

  // Save state changes
  const updateUserState = (newState: Partial<UserState>) => {
    const updatedState = { ...userState, ...newState }
    setUserState(updatedState)
    localStorage.setItem("lazorkit-user-state", JSON.stringify(updatedState))
  }

  const updateLanguage = (lang: "EN" | "VI") => {
    setLanguage(lang)
    localStorage.setItem("lazorkit-language", lang)
    toast({
      title: lang === "EN" ? "Language changed to English" : "Ngôn ngữ đã chuyển sang Tiếng Việt",
      description: lang === "EN" ? "Interface language updated" : "Giao diện đã được cập nhật",
    })
  }

  const generatePubkey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const prefix = Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("")
    const suffix = Array.from({ length: 3 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("")
    return `${prefix}...${suffix}`
  }

  const createPasskey = async (): Promise<void> => {
    setIsLoading(true)

    // Simulate passkey creation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    updateUserState({ hasPasskey: true })

    toast({
      title: language === "EN" ? "Passkey created" : "Passkey đã tạo",
      description:
        language === "EN" ? "Your passkey has been securely generated" : "Passkey của bạn đã được tạo an toàn",
    })

    setIsLoading(false)
  }

  const createWallet = async (fromOnRamp = false): Promise<void> => {
    setIsLoading(true)

    // Simulate wallet creation delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newPubkey = generatePubkey()
    updateUserState({
      hasWallet: true,
      pubkey: newPubkey,
      hasPasskey: true, // Ensure passkey is created with wallet
    })

    if (fromOnRamp) {
      toast({
        title: language === "EN" ? "Wallet ready" : "Ví đã sẵn sàng",
        description:
          language === "EN" ? "Your wallet has been created successfully" : "Ví của bạn đã được tạo thành công",
      })
    }

    setIsLoading(false)
  }

  const regeneratePasskey = async (): Promise<void> => {
    setIsLoading(true)

    // Simulate regeneration delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newPubkey = generatePubkey()
    updateUserState({ pubkey: newPubkey })

    toast({
      title: language === "EN" ? "Passkey regenerated (demo)" : "Passkey đã tái tạo (demo)",
      description: language === "EN" ? "New passkey generated successfully" : "Passkey mới đã được tạo thành công",
    })

    setIsLoading(false)
  }

  const updateWalletName = (name: string) => {
    updateUserState({ walletName: name })
    toast({
      title: language === "EN" ? "Wallet name updated" : "Tên ví đã cập nhật",
      description: language === "EN" ? `Wallet renamed to "${name}"` : `Ví đã đổi tên thành "${name}"`,
    })
  }

  const resetDemoData = () => {
    setUserState(INITIAL_STATE)
    localStorage.removeItem("lazorkit-user-state")
    localStorage.removeItem("lazorkit-language")
    setLanguage("EN")

    toast({
      title: language === "EN" ? "Demo data reset" : "Dữ liệu demo đã reset",
      description: language === "EN" ? "All local data has been cleared" : "Tất cả dữ liệu cục bộ đã được xóa",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        userState,
        language,
        setLanguage: updateLanguage,
        createPasskey,
        createWallet,
        resetDemoData,
        regeneratePasskey,
        updateWalletName,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
