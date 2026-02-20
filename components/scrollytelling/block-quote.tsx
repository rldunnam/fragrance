import { cn } from "@/lib/utils"

interface BlockQuoteProps {
  quote: string
  className?: string
}

export function BlockQuote({ quote, className }: BlockQuoteProps) {
  return (
    <blockquote
      className={cn(
        "relative my-8 pl-6 border-l-2 border-gold/40",
        className
      )}
    >
      <p className="font-serif italic text-cream-muted text-lg leading-relaxed">
        {`"${quote}"`}
      </p>
    </blockquote>
  )
}
