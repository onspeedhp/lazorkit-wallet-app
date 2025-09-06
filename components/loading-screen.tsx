"use client"

import { Card, CardContent } from "@/components/ui/card"

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="glass-card border-border/50 w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <h2 className="text-xl font-bold text-primary mb-2">Lazorkit Wallet</h2>
            <p className="text-sm text-muted-foreground">Loading your wallet...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
