import { cn } from "@/lib/utils"

interface MetricCardProps {
  metric: string
  description: string
  className?: string
}

export function MetricCard({ metric, description, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface-elevated p-5",
        "transition-all duration-300 hover:border-gold/30 hover:gold-glow",
        className
      )}
    >
      <div className="font-serif text-2xl text-gold font-semibold tracking-tight">
        {metric}
      </div>
      <div className="mt-1.5 text-sm text-cream-muted leading-relaxed">
        {description}
      </div>
    </div>
  )
}
