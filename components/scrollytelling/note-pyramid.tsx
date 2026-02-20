"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

/* ───────────────────────────────────────────
   Data
   ─────────────────────────────────────────── */
interface NoteInfo {
  name: string
  duration: string
  description: string
  examples: { note: string; detail: string }[]
  color: string
  colorMuted: string
  glowColor: string
}

const TIERS: NoteInfo[] = [
  {
    name: "Top Notes",
    duration: "5 - 30 min",
    description:
      "The first impression. Light, volatile molecules that greet the nose instantly and evaporate quickly, setting the stage for what follows.",
    examples: [
      { note: "Bergamot", detail: "Bright citrus, slightly floral" },
      { note: "Lemon", detail: "Sharp, clean, sparkling freshness" },
      { note: "Lavender", detail: "Aromatic, calming herbal note" },
      { note: "Pink Pepper", detail: "Spicy-sweet effervescence" },
    ],
    color: "#E8D5A3",
    colorMuted: "rgba(232, 213, 163, 0.15)",
    glowColor: "rgba(232, 213, 163, 0.35)",
  },
  {
    name: "Heart Notes",
    duration: "2 - 4 hours",
    description:
      "The fragrance's true character. These notes emerge as the top notes fade, forming the core identity of the composition and bridging the opening with the base.",
    examples: [
      { note: "Rose", detail: "Rich, romantic, multifaceted floral" },
      { note: "Jasmine", detail: "Sweet, sensual white floral" },
      { note: "Cardamom", detail: "Warm, aromatic spice" },
      { note: "Geranium", detail: "Green, slightly rosy freshness" },
    ],
    color: "#D4AF37",
    colorMuted: "rgba(212, 175, 55, 0.15)",
    glowColor: "rgba(212, 175, 55, 0.35)",
  },
  {
    name: "Base Notes",
    duration: "6 - 24 hours",
    description:
      "The foundation. Deep, heavy molecules that anchor the fragrance and linger longest on skin and clothing, defining the scent's lasting impression.",
    examples: [
      { note: "Sandalwood", detail: "Creamy, warm, milky wood" },
      { note: "Amber", detail: "Warm, resinous, sweet depth" },
      { note: "Musk", detail: "Skin-like, animalic softness" },
      { note: "Vetiver", detail: "Earthy, smoky, grounding root" },
    ],
    color: "#B8860B",
    colorMuted: "rgba(184, 134, 11, 0.15)",
    glowColor: "rgba(184, 134, 11, 0.35)",
  },
]

/* ───────────────────────────────────────────
   Particle system (Canvas)
   ─────────────────────────────────────────── */
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
  hue: number
}

function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const particles = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener("resize", resize)

    const spawn = () => {
      const rect = canvas.getBoundingClientRect()
      const centerX = rect.width / 2
      const bottomY = rect.height
      // Spawn from the bottom-center area with some spread
      const spread = rect.width * 0.25
      particles.current.push({
        x: centerX + (Math.random() - 0.5) * spread,
        y: bottomY + 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.3 + Math.random() * 0.6),
        size: 1 + Math.random() * 2,
        opacity: 0,
        life: 0,
        maxLife: 160 + Math.random() * 120,
        hue: 38 + Math.random() * 15, // gold range
      })
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Spawn new particles
      if (particles.current.length < 50 && Math.random() < 0.3) {
        spawn()
      }

      particles.current = particles.current.filter((p) => p.life < p.maxLife)

      particles.current.forEach((p) => {
        p.life++
        p.x += p.vx + Math.sin(p.life * 0.02) * 0.3
        p.y += p.vy

        // Fade in then fade out
        const progress = p.life / p.maxLife
        if (progress < 0.15) {
          p.opacity = progress / 0.15
        } else if (progress > 0.7) {
          p.opacity = (1 - progress) / 0.3
        } else {
          p.opacity = 1
        }

        const alpha = Math.max(0, p.opacity * 0.6)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${alpha})`
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${alpha * 0.2})`
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [canvasRef])
}

/* ───────────────────────────────────────────
   Tooltip Component
   ─────────────────────────────────────────── */
function TierTooltip({ tier, side }: { tier: NoteInfo; side: "left" | "right" }) {
  return (
    <div
      className={cn(
        "absolute z-30 w-64 rounded-lg border bg-[#141419] p-4 shadow-xl",
        "opacity-0 pointer-events-none group-hover/tier:opacity-100 group-hover/tier:pointer-events-auto",
        "transition-all duration-300 ease-out",
        "group-hover/tier:translate-y-0 translate-y-2",
        side === "left"
          ? "right-full mr-4 top-1/2 -translate-x-0 -translate-y-1/2 group-hover/tier:-translate-y-1/2"
          : "left-full ml-4 top-1/2 -translate-x-0 -translate-y-1/2 group-hover/tier:-translate-y-1/2"
      )}
      style={{ borderColor: `${tier.color}33` }}
    >
      {/* Arrow */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 h-3 w-3 rotate-45 border bg-[#141419]",
          side === "left"
            ? "-right-[7px] border-t-0 border-l-0"
            : "-left-[7px] border-b-0 border-r-0"
        )}
        style={{ borderColor: `${tier.color}33` }}
      />
      <div className="flex items-center gap-2 mb-3">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: tier.color }}
        />
        <span className="font-serif text-sm font-semibold" style={{ color: tier.color }}>
          {tier.name}
        </span>
        <span className="ml-auto text-[11px] text-[#8A8A8A] font-mono">{tier.duration}</span>
      </div>
      <p className="text-[12px] text-[#C8C8C0] leading-relaxed mb-3">{tier.description}</p>
      <div className="space-y-1.5">
        {tier.examples.map((ex) => (
          <div key={ex.note} className="flex items-start gap-2">
            <div
              className="mt-1.5 h-1 w-1 rounded-full shrink-0"
              style={{ backgroundColor: tier.color }}
            />
            <div>
              <span className="text-[12px] font-medium text-[#F5F5F0]">{ex.note}</span>
              <span className="text-[11px] text-[#8A8A8A]"> &mdash; {ex.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────
   Mobile Detail Panel
   ─────────────────────────────────────────── */
function MobileDetailPanel({ tier }: { tier: NoteInfo | null }) {
  if (!tier) return null
  return (
    <div
      className="mt-6 rounded-lg border p-5 transition-all duration-500 md:hidden"
      style={{
        borderColor: `${tier.color}33`,
        backgroundColor: tier.colorMuted,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
        <span className="font-serif text-base font-semibold" style={{ color: tier.color }}>
          {tier.name}
        </span>
        <span className="ml-auto text-xs text-[#8A8A8A] font-mono">{tier.duration}</span>
      </div>
      <p className="text-[13px] text-[#C8C8C0] leading-relaxed mb-3">{tier.description}</p>
      <div className="grid grid-cols-2 gap-2">
        {tier.examples.map((ex) => (
          <div key={ex.note} className="flex items-start gap-1.5">
            <div
              className="mt-1.5 h-1 w-1 rounded-full shrink-0"
              style={{ backgroundColor: tier.color }}
            />
            <div>
              <div className="text-[12px] font-medium text-[#F5F5F0]">{ex.note}</div>
              <div className="text-[11px] text-[#8A8A8A]">{ex.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────
   Evaporation Timeline
   ─────────────────────────────────────────── */
function EvaporationTimeline({ activeTier }: { activeTier: number }) {
  const markers = [
    { label: "0 min", pos: 0 },
    { label: "30 min", pos: 12 },
    { label: "2 hrs", pos: 35 },
    { label: "4 hrs", pos: 55 },
    { label: "8 hrs", pos: 75 },
    { label: "24 hrs", pos: 100 },
  ]

  const ranges = [
    { start: 0, end: 12, tier: 0, label: "Top" },
    { start: 8, end: 55, tier: 1, label: "Heart" },
    { start: 35, end: 100, tier: 2, label: "Base" },
  ]

  return (
    <div className="mt-8 px-2">
      <div className="flex items-center gap-2 mb-3">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-60"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="text-[11px] uppercase tracking-[0.15em] text-[#D4AF37] opacity-60 font-medium">
          Evaporation Timeline
        </span>
      </div>
      <div className="relative h-16 rounded-lg bg-[#141419] border border-[#2A2A35] overflow-hidden">
        {/* Time markers */}
        {markers.map((m) => (
          <div
            key={m.label}
            className="absolute top-0 h-full flex flex-col justify-between items-center"
            style={{ left: `${m.pos}%` }}
          >
            <div className="h-1.5 w-px bg-[#2A2A35]" />
            <span className="text-[9px] text-[#8A8A8A] font-mono pb-1">{m.label}</span>
          </div>
        ))}

        {/* Range bars */}
        {ranges.map((r, i) => {
          const isActive = activeTier === r.tier
          const tier = TIERS[r.tier]
          return (
            <div
              key={r.label}
              className="absolute rounded-sm transition-all duration-500"
              style={{
                left: `${r.start}%`,
                width: `${r.end - r.start}%`,
                top: `${8 + i * 16}px`,
                height: "12px",
                backgroundColor: isActive ? `${tier.color}55` : `${tier.color}22`,
                boxShadow: isActive ? `0 0 12px ${tier.color}33` : "none",
                border: `1px solid ${isActive ? `${tier.color}66` : `${tier.color}22`}`,
              }}
            >
              <span
                className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[8px] font-medium leading-none"
                style={{ color: isActive ? tier.color : `${tier.color}88` }}
              >
                {r.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────
   Main Pyramid Component
   ─────────────────────────────────────────── */
export function NotePyramid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pyramidRef = useRef<HTMLDivElement>(null)
  const [activeTier, setActiveTier] = useState<number>(-1)
  const [focusedTier, setFocusedTier] = useState<number>(-1)

  useParticles(canvasRef)

  /* Scroll-based focus */
  useEffect(() => {
    const el = pyramidRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When pyramid enters view, cycle through tiers for visual effect
            const sequence = [2, 1, 0, -1]
            sequence.forEach((tier, i) => {
              setTimeout(() => setFocusedTier(tier), i * 800)
            })
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleTierClick = useCallback((index: number) => {
    setActiveTier((prev) => (prev === index ? -1 : index))
  }, [])

  const currentDetailTier = activeTier >= 0 ? TIERS[activeTier] : null

  return (
    <div
      id="widget-note-pyramid"
      className={cn("scroll-reveal my-8 relative", className)}
    >
      {/* Container */}
      <div
        ref={pyramidRef}
        className="relative mx-auto"
        style={{ maxWidth: 520 }}
      >
        {/* Canvas for particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Pyramid SVG structure with tiers */}
        <div className="relative z-20">
          {/* Use CSS polygon-based pyramid tiers */}
          <svg
            viewBox="0 0 500 380"
            className="w-full h-auto"
            role="img"
            aria-label="Fragrance note pyramid with three tiers: top notes, heart notes, and base notes"
          >
            <defs>
              {/* Glow filters for each tier */}
              {TIERS.map((tier, i) => (
                <filter key={i} id={`glow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feFlood floodColor={tier.color} floodOpacity="0.3" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}

              {/* Subtle gradient backgrounds for each tier */}
              <linearGradient id="grad-top" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E8D5A3" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#E8D5A3" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="grad-heart" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="grad-base" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B8860B" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#B8860B" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            {/* Outer pyramid outline */}
            <polygon
              points="250,20 480,360 20,360"
              fill="none"
              stroke="#D4AF3720"
              strokeWidth="1"
            />

            {/* Tier divider lines */}
            <line x1="145" y1="140" x2="355" y2="140" stroke="#D4AF3725" strokeWidth="1" />
            <line x1="80" y1="250" x2="420" y2="250" stroke="#D4AF3725" strokeWidth="1" />
          </svg>

          {/* Interactive tier overlays using absolute positioning over the SVG */}
          {/* Top tier */}
          <button
            className={cn(
              "group/tier absolute cursor-pointer transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]",
              (activeTier === 0 || focusedTier === 0) && "z-30"
            )}
            style={{
              top: "5%",
              left: "28%",
              width: "44%",
              height: "32%",
              clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            }}
            onClick={() => handleTierClick(0)}
            onMouseEnter={() => setActiveTier(0)}
            onMouseLeave={() => setActiveTier(-1)}
            aria-label="Top Notes: Bergamot, Lemon, Lavender, Pink Pepper. Duration: 5 to 30 minutes."
          >
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                background:
                  activeTier === 0 || focusedTier === 0
                    ? "linear-gradient(180deg, rgba(232,213,163,0.30) 0%, rgba(232,213,163,0.10) 100%)"
                    : "linear-gradient(180deg, rgba(232,213,163,0.15) 0%, rgba(232,213,163,0.04) 100%)",
                boxShadow:
                  activeTier === 0 || focusedTier === 0
                    ? "inset 0 0 40px rgba(232,213,163,0.15)"
                    : "none",
              }}
            />
            {/* Hidden tooltip shown on desktop */}
            <div className="hidden md:block">
              <TierTooltip tier={TIERS[0]} side="right" />
            </div>
          </button>

          {/* Heart tier */}
          <button
            className={cn(
              "group/tier absolute cursor-pointer transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]",
              (activeTier === 1 || focusedTier === 1) && "z-30"
            )}
            style={{
              top: "36%",
              left: "15.5%",
              width: "69%",
              height: "30%",
              clipPath: "polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)",
            }}
            onClick={() => handleTierClick(1)}
            onMouseEnter={() => setActiveTier(1)}
            onMouseLeave={() => setActiveTier(-1)}
            aria-label="Heart Notes: Rose, Jasmine, Cardamom, Geranium. Duration: 2 to 4 hours."
          >
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                background:
                  activeTier === 1 || focusedTier === 1
                    ? "linear-gradient(180deg, rgba(212,175,55,0.30) 0%, rgba(212,175,55,0.10) 100%)"
                    : "linear-gradient(180deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.04) 100%)",
                boxShadow:
                  activeTier === 1 || focusedTier === 1
                    ? "inset 0 0 40px rgba(212,175,55,0.15)"
                    : "none",
              }}
            />
            <div className="hidden md:block">
              <TierTooltip tier={TIERS[1]} side="left" />
            </div>
          </button>

          {/* Base tier */}
          <button
            className={cn(
              "group/tier absolute cursor-pointer transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]",
              (activeTier === 2 || focusedTier === 2) && "z-30"
            )}
            style={{
              top: "65%",
              left: "3.5%",
              width: "93%",
              height: "31%",
              clipPath: "polygon(13% 0%, 87% 0%, 100% 100%, 0% 100%)",
            }}
            onClick={() => handleTierClick(2)}
            onMouseEnter={() => setActiveTier(2)}
            onMouseLeave={() => setActiveTier(-1)}
            aria-label="Base Notes: Sandalwood, Amber, Musk, Vetiver. Duration: 6 to 24 hours."
          >
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                background:
                  activeTier === 2 || focusedTier === 2
                    ? "linear-gradient(180deg, rgba(184,134,11,0.30) 0%, rgba(184,134,11,0.10) 100%)"
                    : "linear-gradient(180deg, rgba(184,134,11,0.15) 0%, rgba(184,134,11,0.04) 100%)",
                boxShadow:
                  activeTier === 2 || focusedTier === 2
                    ? "inset 0 0 40px rgba(184,134,11,0.15)"
                    : "none",
              }}
            />
            <div className="hidden md:block">
              <TierTooltip tier={TIERS[2]} side="right" />
            </div>
          </button>

          {/* Tier labels on the pyramid */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Top label */}
            <div
              className="absolute flex flex-col items-center transition-all duration-500"
              style={{
                top: "18%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <span
                className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-500"
                style={{
                  color: activeTier === 0 || focusedTier === 0 ? "#E8D5A3" : "#E8D5A380",
                  textShadow:
                    activeTier === 0 || focusedTier === 0 ? "0 0 12px rgba(232,213,163,0.4)" : "none",
                }}
              >
                Top Notes
              </span>
              <span
                className="text-[8px] md:text-[9px] font-mono mt-0.5 transition-all duration-500"
                style={{
                  color: activeTier === 0 || focusedTier === 0 ? "#E8D5A3AA" : "#E8D5A350",
                }}
              >
                5-30 min
              </span>
            </div>

            {/* Heart label */}
            <div
              className="absolute flex flex-col items-center transition-all duration-500"
              style={{
                top: "46%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <span
                className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-500"
                style={{
                  color: activeTier === 1 || focusedTier === 1 ? "#D4AF37" : "#D4AF3780",
                  textShadow:
                    activeTier === 1 || focusedTier === 1 ? "0 0 12px rgba(212,175,55,0.4)" : "none",
                }}
              >
                Heart Notes
              </span>
              <span
                className="text-[8px] md:text-[9px] font-mono mt-0.5 transition-all duration-500"
                style={{
                  color: activeTier === 1 || focusedTier === 1 ? "#D4AF37AA" : "#D4AF3750",
                }}
              >
                2-4 hrs
              </span>
            </div>

            {/* Base label */}
            <div
              className="absolute flex flex-col items-center transition-all duration-500"
              style={{
                top: "75%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <span
                className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-500"
                style={{
                  color: activeTier === 2 || focusedTier === 2 ? "#B8860B" : "#B8860B80",
                  textShadow:
                    activeTier === 2 || focusedTier === 2 ? "0 0 12px rgba(184,134,11,0.4)" : "none",
                }}
              >
                Base Notes
              </span>
              <span
                className="text-[8px] md:text-[9px] font-mono mt-0.5 transition-all duration-500"
                style={{
                  color: activeTier === 2 || focusedTier === 2 ? "#B8860BAA" : "#B8860B50",
                }}
              >
                6-24 hrs
              </span>
            </div>
          </div>
        </div>

        {/* Subtle base glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-xl"
          style={{ backgroundColor: "rgba(184, 134, 11, 0.12)" }}
          aria-hidden="true"
        />
      </div>

      {/* Evaporation timeline */}
      <EvaporationTimeline activeTier={activeTier} />

      {/* Mobile detail panel */}
      <MobileDetailPanel tier={currentDetailTier} />

      {/* Instruction hint */}
      <p className="mt-4 text-center text-[11px] text-[#8A8A8A] tracking-wide md:hidden">
        Tap a tier to explore its notes
      </p>
      <p className="mt-4 text-center text-[11px] text-[#8A8A8A] tracking-wide hidden md:block">
        Hover over each tier to explore its notes and duration
      </p>
    </div>
  )
}
