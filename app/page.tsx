"use client"

import { OnRampScreen } from "@/components/onramp-screen"
import { MainApp } from "@/components/main-app"
import { WalletProvider } from "@/components/wallet-provider"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { LoadingScreen } from "@/components/loading-screen"

export default function HomePage() {
  return (
    <AuthProvider>
      <WalletProvider>
        <div className="min-h-screen bg-background">
          <WalletRouter />
        </div>
      </WalletProvider>
    </AuthProvider>
  )
}

function WalletRouter() {
  const { userState, isLoading } = useAuth()

  // Show loading screen while initializing
  if (isLoading) {
    return <LoadingScreen />
  }

  // State 1 & 2: No wallet -> show OnRamp only
  // (Both no passkey + no wallet, and has passkey + no wallet show OnRamp)
  if (!userState.hasWallet) {
    return <OnRampScreen />
  }

  // State 3: Has wallet -> show main app
  return <MainApp />
}
