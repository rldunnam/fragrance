"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { X, ChevronLeft, ChevronRight, Star, Droplets, Wind, Clock } from "lucide-react"

/* ─── Data ─── */

interface NoteLayer {
  label: string
  notes: string[]
  color: string
  duration: string
}

interface ReviewSnippet {
  text: string
  source: string
  rating: number
}

interface NicheFragrance {
  name: string
  house: string
  perfumer: string
  year: number
  price: string
  family: string
  description: string
  noteLayers: NoteLayer[]
  accords: { name: string; strength: number }[]
  sillage: number
  longevity: number
  projection: number
  reviews: ReviewSnippet[]
  bottleGradient: [string, string]
  accentColor: string
}

const FRAGRANCES: NicheFragrance[] = [
  {
    name: "Aventus",
    house: "Creed",
    perfumer: "Olivier Creed & Erwin Creed",
    year: 2010,
    price: "$300–$470",
    family: "Fruity Chypre",
    description:
      "The modern icon that launched a thousand clones. A bold celebration of strength, power, and success inspired by the dramatic life of Napoleon. Its smoky pineapple opening gives way to a rich, woody dry-down that has defined a generation of fragrance enthusiasts.",
    noteLayers: [
      { label: "Top", notes: ["Pineapple", "Bergamot", "Blackcurrant", "Apple"], color: "#E8D5A3", duration: "15-30 min" },
      { label: "Heart", notes: ["Birch", "Rose", "Jasmine", "Patchouli"], color: "#D4AF37", duration: "2-4 hrs" },
      { label: "Base", notes: ["Oakmoss", "Ambergris", "Musk", "Vanilla"], color: "#B8860B", duration: "8-12 hrs" },
    ],
    accords: [
      { name: "Fruity", strength: 90 },
      { name: "Woody", strength: 85 },
      { name: "Smoky", strength: 70 },
      { name: "Fresh", strength: 65 },
      { name: "Mossy", strength: 55 },
      { name: "Sweet", strength: 45 },
    ],
    sillage: 85,
    longevity: 80,
    projection: 82,
    reviews: [
      { text: "The king of niche for a reason. Every batch is slightly different, which adds to the mystique.", source: "Basenotes", rating: 4.5 },
      { text: "Compliment beast. I get stopped on the street wearing this. The pineapple-birch combo is genius.", source: "Fragrantica", rating: 4.3 },
      { text: "Overhyped? Maybe. But there's a reason it's the most cloned fragrance in history.", source: "r/fragrance", rating: 4.1 },
    ],
    bottleGradient: ["#2A2520", "#1A1510"],
    accentColor: "#D4AF37",
  },
  {
    name: "Layton",
    house: "Parfums de Marly",
    perfumer: "Hamid Merati-Kashani",
    year: 2016,
    price: "$205–$335",
    family: "Woody Floral",
    description:
      "An intoxicating crowd-pleaser that bridges the gap between approachable and complex. The apple-lavender opening is instantly captivating, while the vanilla-guaiac wood base provides addictive warmth that keeps people leaning in closer.",
    noteLayers: [
      { label: "Top", notes: ["Apple", "Lavender", "Bergamot", "Mandarin"], color: "#E8D5A3", duration: "20-40 min" },
      { label: "Heart", notes: ["Jasmine", "Violet", "Iris", "Geranium"], color: "#D4AF37", duration: "3-5 hrs" },
      { label: "Base", notes: ["Vanilla", "Guaiac Wood", "Pepper", "Sandalwood"], color: "#B8860B", duration: "10-14 hrs" },
    ],
    accords: [
      { name: "Sweet", strength: 88 },
      { name: "Woody", strength: 82 },
      { name: "Floral", strength: 75 },
      { name: "Warm Spicy", strength: 68 },
      { name: "Powdery", strength: 55 },
      { name: "Fresh", strength: 42 },
    ],
    sillage: 88,
    longevity: 90,
    projection: 85,
    reviews: [
      { text: "If you want compliments, this is your fragrance. My wife can't get enough of it.", source: "Basenotes", rating: 4.6 },
      { text: "The longevity is insane. I can still smell it on my jacket two days later.", source: "Fragrantica", rating: 4.4 },
      { text: "PDM Layton is the niche gateway drug. Once you smell this, there's no going back to designers.", source: "r/fragrance", rating: 4.5 },
    ],
    bottleGradient: ["#1E2530", "#121820"],
    accentColor: "#7B9EC7",
  },
  {
    name: "Jazz Club",
    house: "Maison Margiela",
    perfumer: "Alienor Massenet",
    year: 2013,
    price: "$100–$160",
    family: "Tobacco Vanilla",
    description:
      "A sophisticated smoky-sweet composition that captures the ambiance of a late-night jazz lounge. Rum-soaked tobacco meets creamy vanilla in a warm, enveloping embrace. It's the olfactory equivalent of a velvet armchair by a fireplace.",
    noteLayers: [
      { label: "Top", notes: ["Pink Pepper", "Lemon", "Neroli", "Primofiore"], color: "#E8D5A3", duration: "10-20 min" },
      { label: "Heart", notes: ["Rum Absolute", "Clary Sage", "Java Vetiver", "Tobacco Leaf"], color: "#D4AF37", duration: "2-4 hrs" },
      { label: "Base", notes: ["Vanilla Bean", "Tonka Bean", "Styrax", "Musk"], color: "#B8860B", duration: "6-10 hrs" },
    ],
    accords: [
      { name: "Tobacco", strength: 92 },
      { name: "Sweet", strength: 80 },
      { name: "Boozy", strength: 78 },
      { name: "Warm Spicy", strength: 65 },
      { name: "Smoky", strength: 60 },
      { name: "Vanilla", strength: 72 },
    ],
    sillage: 70,
    longevity: 75,
    projection: 65,
    reviews: [
      { text: "The most atmospheric fragrance I own. Close your eyes and you're in a Harlem jazz bar.", source: "Basenotes", rating: 4.2 },
      { text: "Perfect fall and winter scent. The rum-tobacco combo is cozy without being cloying.", source: "Fragrantica", rating: 4.0 },
      { text: "Best value in niche. Under $100 for this quality? Absolute steal.", source: "r/fragrance", rating: 4.3 },
    ],
    bottleGradient: ["#2A1E1E", "#1A1212"],
    accentColor: "#C47A5A",
  },
  {
    name: "Jubilation XXV",
    house: "Amouage",
    perfumer: "Bertrand Duchaufour",
    year: 2008,
    price: "$270–$430",
    family: "Oriental Woody",
    description:
      "An opulent oriental masterpiece of staggering complexity. Layer upon layer of spices, florals, and precious resins unfold over hours. This is a fragrance for connoisseurs who appreciate depth, artistry, and the finest raw materials money can buy.",
    noteLayers: [
      { label: "Top", notes: ["Tarragon", "Coriander", "Orange", "Blackberry"], color: "#E8D5A3", duration: "15-30 min" },
      { label: "Heart", notes: ["Rose", "Guaiac Wood", "Orchid", "Cinnamon"], color: "#D4AF37", duration: "3-6 hrs" },
      { label: "Base", notes: ["Oud", "Amber", "Frankincense", "Musks"], color: "#B8860B", duration: "12-18 hrs" },
    ],
    accords: [
      { name: "Woody", strength: 95 },
      { name: "Resinous", strength: 88 },
      { name: "Warm Spicy", strength: 85 },
      { name: "Floral", strength: 70 },
      { name: "Balsamic", strength: 65 },
      { name: "Oud", strength: 60 },
    ],
    sillage: 82,
    longevity: 95,
    projection: 78,
    reviews: [
      { text: "This is what luxury smells like. Every time I wear it, I discover a new facet. True art.", source: "Basenotes", rating: 4.7 },
      { text: "The finest oriental I've ever experienced. It evolves for hours on skin. Masterpiece.", source: "Fragrantica", rating: 4.5 },
      { text: "If money is no object, this is THE fragrance. Nothing else in my 200+ collection comes close.", source: "r/fragrance", rating: 4.6 },
    ],
    bottleGradient: ["#2A2028", "#1A1018"],
    accentColor: "#9B6B8C",
  },
]

/* ─── Bottle SVG ─── */

function BottleIllustration({
  gradient,
  accent,
  className,
}: {
  gradient: [string, string]
  accent: string
  className?: string
}) {
  const id = `bottle-${gradient[0].replace("#", "")}`
  return (
    <svg viewBox="0 0 100 220" fill="none" className={className}>
      <defs>
        <linearGradient id={`${id}-body`} x1="50" y1="60" x2="50" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={gradient[0]} />
          <stop offset="100%" stopColor={gradient[1]} />
        </linearGradient>
        <linearGradient id={`${id}-liquid`} x1="50" y1="100" x2="50" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* Cap */}
      <rect x="38" y="2" width="24" height="18" rx="4" fill={accent} opacity="0.7" />
      {/* Neck */}
      <rect x="42" y="20" width="16" height="28" rx="2" fill={gradient[0]} stroke={accent} strokeWidth="0.5" strokeOpacity="0.3" />
      {/* Shoulders */}
      <path d="M42 48 L22 72 L22 76 L78 76 L78 72 L58 48Z" fill={`url(#${id}-body)`} stroke={accent} strokeWidth="0.5" strokeOpacity="0.2" />
      {/* Body */}
      <rect x="22" y="76" width="56" height="130" rx="6" fill={`url(#${id}-body)`} stroke={accent} strokeWidth="0.8" strokeOpacity="0.3" />
      {/* Liquid fill */}
      <rect x="26" y="100" width="48" height="100" rx="4" fill={`url(#${id}-liquid)`} />
      {/* Highlight reflection */}
      <rect x="30" y="82" width="6" height="90" rx="3" fill={accent} opacity="0.08" />
      {/* Label area */}
      <rect x="32" y="120" width="36" height="40" rx="2" fill={accent} opacity="0.06" stroke={accent} strokeWidth="0.4" strokeOpacity="0.15" />
    </svg>
  )
}

/* ─── Radial Accord Chart ─── */

function RadialAccordChart({
  accords,
  accent,
}: {
  accords: { name: string; strength: number }[]
  accent: string
}) {
  const size = 280
  const cx = size / 2
  const cy = size / 2
  const maxR = 110
  const rings = [25, 50, 75, 100]
  const count = accords.length
  const angleStep = (2 * Math.PI) / count

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const points = accords.map((a, i) => {
    const angle = i * angleStep - Math.PI / 2
    const r = (a.strength / 100) * maxR
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      labelX: cx + (maxR + 24) * Math.cos(angle),
      labelY: cy + (maxR + 24) * Math.sin(angle),
      ...a,
    }
  })

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ")

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
      {/* Rings */}
      {rings.map((pct) => (
        <circle
          key={pct}
          cx={cx}
          cy={cy}
          r={(pct / 100) * maxR}
          fill="none"
          stroke="#D4AF37"
          strokeOpacity="0.08"
          strokeWidth="0.5"
        />
      ))}

      {/* Axis lines */}
      {accords.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + maxR * Math.cos(angle)}
            y2={cy + maxR * Math.sin(angle)}
            stroke="#D4AF37"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
        )
      })}

      {/* Filled polygon */}
      <polygon
        points={polygonPoints}
        fill={accent}
        fillOpacity="0.12"
        stroke={accent}
        strokeWidth="1.5"
        strokeOpacity="0.6"
        strokeLinejoin="round"
      />

      {/* Data points and labels */}
      {points.map((p, i) => (
        <g
          key={i}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Invisible larger hit area */}
          <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
          {/* Visible dot */}
          <circle
            cx={p.x}
            cy={p.y}
            r={hoveredIndex === i ? 5 : 3.5}
            fill={accent}
            stroke="#0A0A0F"
            strokeWidth="1.5"
            style={{ transition: "r 0.2s ease" }}
          />
          {/* Label */}
          <text
            x={p.labelX}
            y={p.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={hoveredIndex === i ? "#F5F5F0" : "#8A8A8A"}
            fontSize="10"
            fontFamily="Inter, sans-serif"
            style={{ transition: "fill 0.2s ease" }}
          >
            {p.name}
          </text>
          {/* Strength on hover */}
          {hoveredIndex === i && (
            <text
              x={p.labelX}
              y={p.labelY + 13}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={accent}
              fontSize="9"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
            >
              {p.strength}%
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

/* ─── Performance Bar ─── */

function PerformanceBar({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: number
  icon: React.ElementType
  accent: string
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={14} style={{ color: accent }} className="shrink-0" />
      <span className="text-xs text-cream-muted w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-border/60 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${accent}88, ${accent})`,
          }}
        />
      </div>
      <span className="text-xs text-cream-muted/80 w-8 text-right tabular-nums">{value}%</span>
    </div>
  )
}

/* ─── Star Rating ─── */

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.3
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={cn(
            i < full
              ? "fill-gold text-gold"
              : i === full && hasHalf
                ? "fill-gold/50 text-gold"
                : "text-border fill-transparent"
          )}
        />
      ))}
      <span className="ml-1 text-[10px] text-cream-muted tabular-nums">{rating.toFixed(1)}</span>
    </span>
  )
}

/* ─── Detail Modal ─── */

function DetailView({
  fragrance,
  onClose,
}: {
  fragrance: NicheFragrance
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${fragrance.name} by ${fragrance.house} details`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />

      {/* Content */}
      <div
        className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl border-2 bg-surface"
        style={{ borderColor: `${fragrance.accentColor}33` }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full border border-border bg-surface-elevated p-2 text-cream-muted transition-colors hover:border-gold/40 hover:text-cream cursor-pointer"
          aria-label="Close detail view"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div
          className="relative px-6 pt-8 pb-6 md:px-10 md:pt-10"
          style={{
            background: `linear-gradient(180deg, ${fragrance.accentColor}08 0%, transparent 100%)`,
          }}
        >
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
            {/* Bottle */}
            <div className="shrink-0 mx-auto md:mx-0">
              <BottleIllustration
                gradient={fragrance.bottleGradient}
                accent={fragrance.accentColor}
                className="w-24 h-auto md:w-28"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-center md:text-left">
              <span
                className="inline-block text-[10px] font-medium uppercase tracking-[0.2em] mb-2"
                style={{ color: fragrance.accentColor }}
              >
                {fragrance.family}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-cream font-semibold">{fragrance.name}</h3>
              <p className="mt-1 text-sm text-cream-muted">{fragrance.house} &middot; {fragrance.year}</p>
              <p className="mt-1 text-xs text-cream-muted/60">Perfumer: {fragrance.perfumer}</p>
              <p className="mt-4 text-sm text-cream-muted leading-relaxed">{fragrance.description}</p>
              <span
                className="mt-3 inline-block text-sm font-semibold"
                style={{ color: fragrance.accentColor }}
              >
                {fragrance.price}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-8 md:px-10 md:pb-10">
          <div className="h-px w-full bg-border/40 mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Radial Chart */}
            <div>
              <h4 className="font-serif text-base text-cream font-medium mb-4">Accord Profile</h4>
              <RadialAccordChart accords={fragrance.accords} accent={fragrance.accentColor} />
            </div>

            {/* Right: Notes + Performance */}
            <div>
              <h4 className="font-serif text-base text-cream font-medium mb-4">Note Pyramid</h4>
              <div className="flex flex-col gap-3 mb-6">
                {fragrance.noteLayers.map((layer) => (
                  <div key={layer.label} className="rounded-lg border border-border/50 bg-surface-elevated px-4 py-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium uppercase tracking-wider" style={{ color: layer.color }}>
                        {layer.label} Notes
                      </span>
                      <span className="text-[10px] text-cream-muted/50">{layer.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {layer.notes.map((note) => (
                        <span
                          key={note}
                          className="rounded-full px-2.5 py-0.5 text-[11px] text-cream-muted border"
                          style={{ borderColor: `${layer.color}30`, background: `${layer.color}08` }}
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="font-serif text-base text-cream font-medium mb-3">Performance</h4>
              <div className="flex flex-col gap-2.5">
                <PerformanceBar label="Sillage" value={fragrance.sillage} icon={Wind} accent={fragrance.accentColor} />
                <PerformanceBar label="Longevity" value={fragrance.longevity} icon={Clock} accent={fragrance.accentColor} />
                <PerformanceBar label="Projection" value={fragrance.projection} icon={Droplets} accent={fragrance.accentColor} />
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-8">
            <div className="h-px w-full bg-border/40 mb-6" />
            <h4 className="font-serif text-base text-cream font-medium mb-4">Community Reviews</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {fragrance.reviews.map((review, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/50 bg-surface-elevated p-4 transition-colors hover:border-gold/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-gold/70">
                      {review.source}
                    </span>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-xs text-cream-muted leading-relaxed italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Card ─── */

function NicheCard({
  fragrance,
  onClick,
  index,
}: {
  fragrance: NicheFragrance
  onClick: () => void
  index: number
}) {
  const cardRef = useRef<HTMLButtonElement>(null)
  const [parallaxY, setParallaxY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = cardRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const viewH = window.innerHeight
      const center = rect.top + rect.height / 2
      const offset = (center - viewH / 2) / viewH
      setParallaxY(offset * -18)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Top 3 accords for preview
  const topAccords = fragrance.accords.slice(0, 3)

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      className={cn(
        "group relative flex-shrink-0 w-[280px] md:w-[300px] rounded-xl",
        "border-2 bg-surface overflow-hidden text-left",
        "transition-all duration-500 ease-out",
        "hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(212,175,55,0.12)]",
        "focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2",
        "cursor-pointer"
      )}
      style={{
        borderColor: `${fragrance.accentColor}40`,
        animationDelay: `${index * 100}ms`,
      }}
      aria-label={`View details for ${fragrance.name} by ${fragrance.house}`}
    >
      {/* Top accent line */}
      <div
        className="h-[3px] w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${fragrance.accentColor}80, transparent)`,
        }}
      />

      {/* Bottle area */}
      <div
        className="relative flex items-center justify-center py-8 px-6"
        style={{
          background: `radial-gradient(ellipse at center, ${fragrance.accentColor}06 0%, transparent 70%)`,
        }}
      >
        <div
          style={{ transform: `translateY(${parallaxY}px)`, transition: "transform 0.1s linear" }}
        >
          <BottleIllustration
            gradient={fragrance.bottleGradient}
            accent={fragrance.accentColor}
            className="w-20 h-auto transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Family badge */}
        <span
          className="absolute top-4 right-4 rounded-full px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider border"
          style={{
            color: fragrance.accentColor,
            borderColor: `${fragrance.accentColor}30`,
            background: `${fragrance.accentColor}0A`,
          }}
        >
          {fragrance.family}
        </span>
      </div>

      {/* Info area */}
      <div className="px-5 pb-5">
        <h4 className="font-serif text-xl text-cream font-semibold">{fragrance.name}</h4>
        <p className="mt-0.5 text-xs text-cream-muted">
          {fragrance.house} &middot; {fragrance.year}
        </p>

        {/* Mini accord bars */}
        <div className="mt-4 flex flex-col gap-1.5">
          {topAccords.map((accord) => (
            <div key={accord.name} className="flex items-center gap-2">
              <span className="text-[10px] text-cream-muted/70 w-16 shrink-0 truncate">{accord.name}</span>
              <div className="flex-1 h-1 rounded-full bg-border/40 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${accord.strength}%`,
                    background: fragrance.accentColor,
                    opacity: 0.6,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Price + CTA hint */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: fragrance.accentColor }}>
            {fragrance.price}
          </span>
          <span className="text-[10px] text-cream-muted/40 uppercase tracking-wider transition-colors duration-300 group-hover:text-cream-muted">
            Explore
          </span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="h-[2px] w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${fragrance.accentColor}60, transparent)`,
        }}
      />
    </button>
  )
}

/* ─── Main Showcase ─── */

export function NicheShowcase() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateScrollState, { passive: true })
    updateScrollState()
    return () => el.removeEventListener("scroll", updateScrollState)
  }, [updateScrollState])

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === "left" ? -330 : 330, behavior: "smooth" })
  }

  const handleClose = useCallback(() => setSelectedIndex(null), [])

  return (
    <div className="scroll-reveal my-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold/70">
            Premium Collection
          </span>
          <p className="mt-1 text-sm text-cream-muted/60">
            Click any card to explore its full profile
          </p>
        </div>

        {/* Scroll controls */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "rounded-full border border-border bg-surface-elevated p-2 transition-all duration-200 cursor-pointer",
              canScrollLeft
                ? "hover:border-gold/40 hover:text-gold text-cream-muted"
                : "opacity-30 cursor-not-allowed text-cream-muted/40"
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "rounded-full border border-border bg-surface-elevated p-2 transition-all duration-200 cursor-pointer",
              canScrollRight
                ? "hover:border-gold/40 hover:text-gold text-cream-muted"
                : "opacity-30 cursor-not-allowed text-cream-muted/40"
            )}
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable card track */}
      <div className="relative">
        {/* Fade edges */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-background to-transparent" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-background to-transparent" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {FRAGRANCES.map((frag, i) => (
            <NicheCard
              key={frag.name}
              fragrance={frag}
              index={i}
              onClick={() => setSelectedIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {selectedIndex !== null && (
        <DetailView
          fragrance={FRAGRANCES[selectedIndex]}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
