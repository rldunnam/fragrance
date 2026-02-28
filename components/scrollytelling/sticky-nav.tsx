"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const SECTIONS = [
  { id: "vocabulary",        label: "Vocabulary",         short: "I"   },
  { id: "scent-profiling",   label: "Scent Profiling",    short: "II"  },
  { id: "popular-fragrances",label: "Popular Fragrances", short: "III" },
  { id: "community",         label: "Community",          short: "IV"  },
  { id: "designer-vs-niche", label: "Designer vs Niche",  short: "V"   },
  { id: "practical-guide",   label: "Practical Guide",    short: "VI"  },
]

export function StickyNav() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [visible, setVisible] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  // Show nav once user scrolls past the hero
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight

      setVisible(scrollY > heroHeight * 0.6)
      setProgress(docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track which section is currently in view
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id)
        },
        { threshold: 0.3, rootMargin: "-10% 0px -60% 0px" }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Close expanded menu when clicking outside
  useEffect(() => {
    if (!expanded) return
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setExpanded(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [expanded])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 80
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: "smooth" })
    setExpanded(false)
  }

  const activeIndex = SECTIONS.findIndex(s => s.id === activeId)

  return (
    <div
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        "translate-y-0 opacity-100"
      )}
    >
      {/* Progress bar — very top of screen */}
      <div className="h-[2px] w-full bg-surface-elevated/60">
        <div
          className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold/60 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Nav bar */}
      <div className="bg-[#0A0A0F]/90 backdrop-blur-md border-b border-gold/10">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">

            {/* Left: wordmark */}
            <Link
              href="/"
              className="font-serif text-sm text-gold/70 hover:text-gold transition-colors duration-200 tracking-wider"
            >
              The Art & Science of Fragrance
            </Link>

            {/* Centre: section dots (desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {SECTIONS.map(({ id, label }, i) => {
                const isActive = id === activeId
                const isPast = activeIndex > i
                return (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200"
                    title={label}
                  >
                    {/* Dot */}
                    <span
                      className={cn(
                        "block rounded-full transition-all duration-300",
                        isActive
                          ? "w-2 h-2 bg-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]"
                          : isPast
                            ? "w-1.5 h-1.5 bg-gold/40"
                            : "w-1.5 h-1.5 bg-cream-muted/20 group-hover:bg-cream-muted/50"
                      )}
                    />
                    {/* Label — only show for active */}
                    <span
                      className={cn(
                        "text-[11px] font-medium uppercase tracking-[0.12em] transition-all duration-300 overflow-hidden whitespace-nowrap",
                        isActive
                          ? "max-w-[120px] opacity-100 text-gold"
                          : "max-w-0 opacity-0"
                      )}
                    >
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Right: page nav + mobile menu toggle + progress % */}
            <div className="flex items-center gap-3">
              <Link
                href="/collection"
                className={cn(
                  "hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium uppercase tracking-[0.12em] transition-all duration-200",
                  pathname === "/collection"
                    ? "border-gold/60 bg-gold/10 text-gold"
                    : "border-gold/20 text-cream-muted/60 hover:border-gold/40 hover:text-gold/80"
                )}
              >
                My Collection
              </Link>
              <span className="hidden sm:block text-[10px] font-medium uppercase tracking-[0.15em] text-cream-muted/40 tabular-nums">
                {isHome ? `${Math.round(progress)}%` : ""}
              </span>

              {/* Mobile hamburger */}
              <button
                onClick={() => setExpanded(v => !v)}
                className="md:hidden flex flex-col gap-[5px] p-1.5 rounded border border-gold/20 hover:border-gold/40 transition-colors"
                aria-label="Toggle navigation"
              >
                <span className={cn(
                  "block h-px w-4 bg-gold/60 transition-all duration-200",
                  expanded && "rotate-45 translate-y-[6px]"
                )} />
                <span className={cn(
                  "block h-px w-4 bg-gold/60 transition-all duration-200",
                  expanded && "opacity-0"
                )} />
                <span className={cn(
                  "block h-px w-4 bg-gold/60 transition-all duration-200",
                  expanded && "-rotate-45 -translate-y-[6px]"
                )} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={cn(
          "md:hidden bg-[#0A0A0F]/95 backdrop-blur-md border-b border-gold/10 overflow-hidden transition-all duration-300 ease-out",
          expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mx-auto max-w-[1200px] px-6 py-3 flex flex-col gap-1">
          <Link
            href="/collection"
            onClick={() => setExpanded(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
              pathname === "/collection"
                ? "bg-gold/10 text-gold"
                : "text-cream-muted hover:bg-surface-elevated hover:text-cream"
            )}
          >
            <span className="text-[10px] font-medium uppercase tracking-widest w-6 text-cream-muted/30">★</span>
            <span className="text-sm font-medium">My Collection</span>
          </Link>
          <div className="my-1 border-t border-gold/10" />
          {SECTIONS.map(({ id, label, short }, i) => {
            const isActive = id === activeId
            const isPast = activeIndex > i
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                  isActive
                    ? "bg-gold/10 text-gold"
                    : "text-cream-muted hover:bg-surface-elevated hover:text-cream"
                )}
              >
                <span className={cn(
                  "text-[10px] font-medium uppercase tracking-widest w-6 tabular-nums",
                  isActive ? "text-gold" : isPast ? "text-gold/40" : "text-cream-muted/30"
                )}>
                  {short}
                </span>
                <span className="text-sm font-medium">{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
