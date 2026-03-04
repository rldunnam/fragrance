"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

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
      <rect x="22" y="0" width="16" height="12" rx="2" fill="currentColor" opacity="0.6" />
      <rect x="24" y="12" width="12" height="18" rx="1" fill="currentColor" opacity="0.4" />
      <path d="M24 30 L12 48 L12 50 L48 50 L48 48 L36 30Z" fill="currentColor" opacity="0.3" />
      <rect x="12" y="50" width="36" height="80" rx="4" fill="currentColor" opacity="0.2" />
      <rect x="18" y="56" width="4" height="60" rx="2" fill="currentColor" opacity="0.15" />
    </svg>
  )
}

export function SelectorHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const content = contentRef.current
    if (!content) return
    const timer = setTimeout(() => {
      content.style.opacity = "1"
      content.style.transform = "translateY(0)"
    }, 100)

    const handleScroll = () => {
      const hero = heroRef.current
      if (!hero) return
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
    <div
      ref={heroRef}
      className="relative flex min-h-[45vh] items-center justify-center overflow-hidden bg-background pt-14"
    >
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0.01) 40%, transparent 70%)",
          }}
        />
      </div>

      {/* Floating bottles */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <BottleSilhouette className="hero-bottle absolute left-[8%] top-[25%] w-8 text-gold/25 hidden md:block" delay={0} />
        <BottleSilhouette className="hero-bottle absolute right-[12%] top-[20%] w-7 text-gold/15 hidden md:block" delay={1} />
        <BottleSilhouette className="hero-bottle absolute left-[18%] bottom-[20%] w-6 text-gold/10 hidden lg:block" delay={2} />
        <BottleSilhouette className="hero-bottle absolute right-[8%] bottom-[25%] w-8 text-gold/20 hidden md:block" delay={3} />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center transition-all duration-1000 ease-out"
        style={{ opacity: 0, transform: "translateY(20px)" }}
      >
        <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-gold/80">
          Discover Your Signature
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-cream leading-[1.1] text-balance">
          Find the Fragrance{" "}
          <span className="text-gold">That Defines You</span>
        </h1>
        <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <p className="mx-auto mt-6 max-w-xl text-base text-cream-muted leading-relaxed">
          Filter 200+ men&apos;s fragrances by occasion, season, family, and budget.
          Rate what you own and let your taste profile sharpen every recommendation.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#selector"
            className="rounded-full bg-gold/15 border border-gold/30 px-6 py-2.5 text-sm font-medium text-gold hover:bg-gold/25 transition-all duration-200"
          >
            Start Exploring
          </a>
          <Link
            href="/guide"
            className="rounded-full border border-gold/10 px-6 py-2.5 text-sm font-medium text-cream-muted/60 hover:border-gold/30 hover:text-gold/80 transition-all duration-200"
          >
            Read the Guide →
          </Link>
        </div>
        <p className="mt-5 text-xs text-cream-muted/40">
          Not sure where to start?{' '}
          <Link href="/quiz" className="text-gold/60 hover:text-gold underline underline-offset-2 transition-colors">
            Take the quiz →
          </Link>
        </p>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="h-6 w-px bg-gradient-to-b from-gold/40 to-transparent animate-pulse" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
