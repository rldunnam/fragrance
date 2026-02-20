import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ProseProps {
  children: ReactNode
  className?: string
}

/**
 * Prose wrapper that styles nested HTML content with the midnight luxury theme.
 * Use for body text, paragraphs, lists etc.
 */
export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        "scroll-reveal",
        /* Base typography */
        "text-[15px] md:text-base leading-relaxed text-cream-muted",
        /* Strong/bold text */
        "[&_strong]:text-cream [&_strong]:font-semibold",
        /* Paragraphs spacing */
        "[&_p+p]:mt-5",
        /* Headings */
        "[&_h3]:font-serif [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:text-cream [&_h3]:font-semibold [&_h3]:mt-10 [&_h3]:mb-4",
        "[&_h4]:font-serif [&_h4]:text-lg [&_h4]:text-cream [&_h4]:font-medium [&_h4]:mt-8 [&_h4]:mb-3",
        className
      )}
    >
      {children}
    </div>
  )
}
