"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface LoadingSkeletonProps {
  type?: "card" | "list" | "button" | "text"
  count?: number
  className?: string
}

export function LoadingSkeleton({ type = "card", count = 1, className = "" }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <Card className={`glass-card border-border/50 ${className}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg skeleton" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 skeleton rounded" />
                  <div className="h-3 w-16 skeleton rounded" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="h-3 w-full skeleton rounded" />
                <div className="h-3 w-3/4 skeleton rounded" />
                <div className="flex gap-2 mt-3">
                  <div className="h-5 w-12 skeleton rounded-full" />
                  <div className="h-5 w-16 skeleton rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case "list":
        return (
          <div className={`flex items-center gap-3 p-4 ${className}`}>
            <div className="w-10 h-10 rounded-full skeleton" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 skeleton rounded" />
              <div className="h-3 w-24 skeleton rounded" />
            </div>
            <div className="h-6 w-16 skeleton rounded" />
          </div>
        )
      case "button":
        return <div className={`h-10 w-24 skeleton rounded-lg ${className}`} />
      case "text":
        return <div className={`h-4 w-48 skeleton rounded ${className}`} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-fade-in">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}
