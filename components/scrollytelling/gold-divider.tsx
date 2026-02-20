import { cn } from "@/lib/utils"

interface GoldDividerProps {
  className?: string
  variant?: "line" | "ornament"
}

export function GoldDivider({ className, variant = "line" }: GoldDividerProps) {
  if (variant === "ornament") {
    return (
      <div className={cn("flex items-center justify-center gap-4 py-6", className)}>
        <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-gold/40" />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gold/60">
          <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="currentColor" />
        </svg>
        <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-gold/40" />
      </div>
    )
  }

  return (
    <div className={cn("mx-auto max-w-[1200px] px-6 lg:px-8", className)}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </div>
  )
}
