import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  label?: string
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeading({
  label,
  title,
  subtitle,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("scroll-reveal mb-12 md:mb-16", className)}>
      {label && (
        <span className="mb-3 block text-xs font-medium uppercase tracking-[0.2em] text-gold">
          {label}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-[44px] text-cream font-semibold leading-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-base md:text-lg text-cream-muted leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="mt-6 h-px w-16 bg-gold/50" />
    </div>
  )
}
