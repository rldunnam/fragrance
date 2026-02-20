import { cn } from "@/lib/utils"

interface WidgetPlaceholderProps {
  id: string
  title: string
  description: string
  height?: string
  className?: string
}

/**
 * Placeholder for heavy interactive widgets that will be implemented later.
 * Renders a styled container with a label so implementers know what goes here.
 */
export function WidgetPlaceholder({
  id,
  title,
  description,
  height = "h-80",
  className,
}: WidgetPlaceholderProps) {
  return (
    <div
      id={id}
      className={cn(
        "scroll-reveal my-8 rounded-lg border border-dashed border-gold/20 bg-surface/50",
        "flex flex-col items-center justify-center text-center px-6",
        height,
        className
      )}
    >
      <div className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-gold/60">
        Interactive Widget
      </div>
      <div className="font-serif text-lg text-cream/80">{title}</div>
      <div className="mt-2 max-w-sm text-sm text-cream-muted/60 leading-relaxed">
        {description}
      </div>
    </div>
  )
}
