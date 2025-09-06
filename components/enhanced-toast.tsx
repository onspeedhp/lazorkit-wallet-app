"use client"

import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, AlertCircle, Info, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EnhancedToastProps {
  type: "success" | "error" | "warning" | "info"
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  copyText?: string
  link?: {
    label: string
    url: string
  }
}

export function useEnhancedToast() {
  const { toast } = useToast()

  const showToast = ({ type, title, description, action, copyText, link }: EnhancedToastProps) => {
    const icons = {
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      error: <XCircle className="h-5 w-5 text-red-500" />,
      warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      info: <Info className="h-5 w-5 text-blue-500" />,
    }

    toast({
      title: (
        <div className="flex items-center gap-2">
          {icons[type]}
          <span>{title}</span>
        </div>
      ),
      description: description && (
        <div className="space-y-3">
          <p>{description}</p>
          {(action || copyText || link) && (
            <div className="flex gap-2">
              {action && (
                <Button size="sm" variant="outline" onClick={action.onClick}>
                  {action.label}
                </Button>
              )}
              {copyText && (
                <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(copyText)}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              )}
              {link && (
                <Button size="sm" variant="outline" onClick={() => window.open(link.url, "_blank")}>
                  <ExternalLink className="h-3 w-3 mr-1" />
                  {link.label}
                </Button>
              )}
            </div>
          )}
        </div>
      ),
      duration: type === "error" ? 8000 : 5000,
    })
  }

  return { showToast }
}
