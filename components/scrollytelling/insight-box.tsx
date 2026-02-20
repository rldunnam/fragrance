import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface InsightBoxProps {
  children: ReactNode
  className?: string
}

export function InsightBox({ children, className }: InsightBoxProps) {
  return (
    <div
      className={cn(
        "relative my-8 rounded-lg border border-gold/20 bg-surface-elevated px-6 py-5",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:rounded-l-lg before:bg-gold/60",
        className
      )}
    >
      <div className="text-cream-muted leading-relaxed text-[15px]">
        {children}
      </div>
    </div>
  )
}
