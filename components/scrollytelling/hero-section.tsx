"use client"

import { useEffect, useRef } from "react"

const SECTIONS = [
  { id: "vocabulary", label: "Vocabulary" },
  { id: "scent-profiling", label: "Scent Profiling" },
  { id: "popular-fragrances", label: "Popular Fragrances" },
  { id: "community", label: "Community" },
  { id: "designer-vs-niche", label: "Designer vs Niche" },
  { id: "practical-guide", label: "Practical Guide" },
]

function BottleSilhouette({ className, delay }: { className?: string; delay: number }) {
  return (
    <svg
      viewBox="0 0 60 140"
      fill="none"
      className={className}
      style={{
        animation: `float ${3 + delay * 0.5}s ease-in-out infinite`,
        animationDelay: `${delay * 0.4}s`,
      }}
    >
      {/* Cap */}
      <rect x="22" y="0" width="16" height="12" rx="2" fill="currentColor" opacity="0.6" />
      {/* Neck */}
      <rect x="24" y="12" width="12" height="18" rx="1" fill="currentColor" opacity="0.4" />
      {/* Shoulders */}
      <path d="M24 30 L12 48 L12 50 L48 50 L48 48 L36 30Z" fill="currentColor" opacity="0.3" />
      {/* Body */}
      <rect x="12" y="50" width="36" height="80" rx="4" fill="currentColor" opacity="0.2" />
      {/* Highlight */}
      <rect x="18" y="56" width="4" height="60" rx="2" fill="currentColor" opacity="0.15" />
    </svg>
  )
}

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const content = contentRef.current
    if (!hero || !content) return

    // Fade in on load
    const timer = setTimeout(() => {
      content.style.opacity = "1"
      content.style.transform = "translateY(0)"
    }, 100)

    // Parallax on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY
      const bottles = hero.querySelectorAll<HTMLElement>(".hero-bottle")
      bottles.forEach((bottle, i) => {
        const speed = 0.03 + i * 0.015
        bottle.style.transform = `translateY(${scrollY * speed}px)`
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background"
    >
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.04) 0%, rgba(212,175,55,0.01) 40%, transparent 70%)",
          }}
        />
      </div>

      {/* Floating bottle silhouettes */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <BottleSilhouette
          className="hero-bottle absolute left-[10%] top-[20%] w-10 text-gold/30 hidden md:block"
          delay={0}
        />
        <BottleSilhouette
          className="hero-bottle absolute right-[15%] top-[15%] w-8 text-gold/20 hidden md:block"
          delay={1}
        />
        <BottleSilhouette
          className="hero-bottle absolute left-[20%] bottom-[25%] w-7 text-gold/15 hidden lg:block"
          delay={2}
        />
        <BottleSilhouette
          className="hero-bottle absolute right-[10%] bottom-[20%] w-9 text-gold/25 hidden md:block"
          delay={3}
        />
        <BottleSilhouette
          className="hero-bottle absolute left-[45%] top-[10%] w-6 text-gold/10 hidden lg:block"
          delay={4}
        />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center transition-all duration-1000 ease-out"
        style={{ opacity: 0, transform: "translateY(24px)" }}
      >
        <span className="mb-6 inline-block text-xs font-medium uppercase tracking-[0.3em] text-gold/80">
          An Interactive Guide
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-cream leading-[1.1] text-balance">
          The Art & Science of{" "}
          <span className="text-gold">Men&apos;s Fragrance</span>
        </h1>
        <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <p className="mx-auto mt-8 max-w-2xl text-base md:text-lg text-cream-muted leading-relaxed">
          Welcome to the sophisticated world of men&apos;s fragrance&mdash;a subculture where
          chemistry meets artistry, and scent becomes personal signature.
        </p>

        {/* Table of Contents */}
        <nav
          aria-label="Table of contents"
          className="mx-auto mt-14 flex flex-wrap items-center justify-center gap-2 md:gap-3"
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-border bg-surface/60 px-4 py-2 text-xs md:text-sm text-cream-muted transition-all duration-200 hover:border-gold/40 hover:text-gold hover:bg-surface-elevated cursor-pointer"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-cream-muted/40">
          Scroll
        </span>
        <div className="h-8 w-px bg-gradient-to-b from-gold/40 to-transparent animate-pulse" />
      </div>

      {/* Float animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </header>
  )
}
