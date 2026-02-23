"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { X, Droplets, Wind, Clock, Flame, Sparkles, Star } from "lucide-react"

/* ── Fragrance Data ── */

interface FragranceNote {
  name: string
  intensity: number // 0-100
}

interface Fragrance {
  id: string
  name: string
  house: string
  tagline: string
  family: string
  concentration: string
  notes: {
    top: FragranceNote[]
    heart: FragranceNote[]
    base: FragranceNote[]
  }
  description: string
  sentiment: {
    score: number // 0-100
    label: string
    compliments: number // out of 5
    longevity: number // hours
    sillage: "Intimate" | "Moderate" | "Strong" | "Beast"
    versatility: number // 0-100
  }
  bottleShape: "tall" | "square" | "round" | "angular" | "classic"
  accentColor: string
  year: string
}

const fragrances: Fragrance[] = [
  {
    id: "sauvage-elixir",
    name: "Sauvage Elixir",
    house: "Dior",
    tagline: "Aromatic Fougere Reimagined",
    family: "Aromatic Fougere",
    concentration: "Elixir",
    notes: {
      top: [
        { name: "Cinnamon", intensity: 85 },
        { name: "Nutmeg", intensity: 70 },
        { name: "Cardamom", intensity: 60 },
      ],
      heart: [
        { name: "Lavender", intensity: 80 },
        { name: "Licorice", intensity: 65 },
      ],
      base: [
        { name: "Amber", intensity: 90 },
        { name: "Patchouli", intensity: 85 },
        { name: "Sandalwood", intensity: 75 },
      ],
    },
    description:
      "The richest evolution of the Sauvage line, Elixir transforms the bestseller into an evening powerhouse. Warm spices cascade over a dense amber-patchouli foundation, projecting authority and sophistication.",
    sentiment: {
      score: 92,
      label: "Highly Acclaimed",
      compliments: 5,
      longevity: 12,
      sillage: "Beast",
      versatility: 65,
    },
    bottleShape: "square",
    accentColor: "#6B8E9B",
    year: "2021",
  },
  {
    id: "bleu-exclusif",
    name: "Bleu L'Exclusif",
    house: "Chanel",
    tagline: "Deep Sandalwood Authority",
    family: "Woody Amber",
    concentration: "Parfum",
    notes: {
      top: [
        { name: "Citrus", intensity: 55 },
        { name: "Mint", intensity: 50 },
      ],
      heart: [
        { name: "Cedar", intensity: 80 },
        { name: "Labdanum", intensity: 75 },
        { name: "Geranium", intensity: 60 },
      ],
      base: [
        { name: "Sandalwood", intensity: 95 },
        { name: "Amber", intensity: 85 },
        { name: "Tonka Bean", intensity: 70 },
      ],
    },
    description:
      "A meditation in sandalwood. L'Exclusif strips away the familiar Bleu de Chanel brightness, replacing it with an enveloping woody depth that commands presence in any room.",
    sentiment: {
      score: 88,
      label: "Community Favorite",
      compliments: 4,
      longevity: 10,
      sillage: "Strong",
      versatility: 70,
    },
    bottleShape: "tall",
    accentColor: "#1E3A5F",
    year: "2024",
  },
  {
    id: "ysl-y-parfum",
    name: "Y Le Parfum",
    house: "YSL",
    tagline: "Bold Fougere Confidence",
    family: "Aromatic Fougere",
    concentration: "EDP",
    notes: {
      top: [
        { name: "Apple", intensity: 85 },
        { name: "Ginger", intensity: 65 },
      ],
      heart: [
        { name: "Sage", intensity: 80 },
        { name: "Lavender", intensity: 75 },
        { name: "Geranium", intensity: 55 },
      ],
      base: [
        { name: "Tonka Bean", intensity: 85 },
        { name: "Cedar", intensity: 70 },
        { name: "Amber", intensity: 60 },
      ],
    },
    description:
      "A masterclass in approachable boldness. Crisp apple and herbaceous sage create an immediately engaging opening, while tonka and cedar deliver lasting warmth.",
    sentiment: {
      score: 85,
      label: "Crowd Pleaser",
      compliments: 4,
      longevity: 8,
      sillage: "Strong",
      versatility: 80,
    },
    bottleShape: "angular",
    accentColor: "#2D2D3F",
    year: "2021",
  },
  {
    id: "cafe-rose",
    name: "Cafe Rose",
    house: "Tom Ford",
    tagline: "Luxurious Evening Seduction",
    family: "Floral Amber",
    concentration: "EDP",
    notes: {
      top: [
        { name: "Turkish Rose", intensity: 90 },
        { name: "Saffron", intensity: 70 },
      ],
      heart: [
        { name: "Coffee", intensity: 85 },
        { name: "Oud", intensity: 75 },
        { name: "Incense", intensity: 65 },
      ],
      base: [
        { name: "Patchouli", intensity: 80 },
        { name: "Amber", intensity: 85 },
        { name: "Sandalwood", intensity: 60 },
      ],
    },
    description:
      "An intoxicating collision of Turkish rose and roasted coffee. Smoky incense threads through a lush amber base, creating an unforgettable evening signature.",
    sentiment: {
      score: 90,
      label: "Cult Status",
      compliments: 5,
      longevity: 10,
      sillage: "Strong",
      versatility: 50,
    },
    bottleShape: "classic",
    accentColor: "#8B3A4A",
    year: "2012",
  },
  {
    id: "dg-devotion",
    name: "Devotion",
    house: "Dolce & Gabbana",
    tagline: "Modern Espresso Elegance",
    family: "Woody Gourmand",
    concentration: "EDP",
    notes: {
      top: [
        { name: "Lemon", intensity: 80 },
        { name: "Rum", intensity: 65 },
      ],
      heart: [
        { name: "Coffee", intensity: 90 },
        { name: "Lavender", intensity: 60 },
      ],
      base: [
        { name: "Patchouli", intensity: 85 },
        { name: "Tonka Bean", intensity: 75 },
        { name: "Cedar", intensity: 65 },
      ],
    },
    description:
      "Italian sophistication distilled. Bright Amalfi lemon crashes into rich espresso, while patchouli and tonka create a gourmand base that captures effortless Mediterranean style.",
    sentiment: {
      score: 82,
      label: "Rising Star",
      compliments: 4,
      longevity: 8,
      sillage: "Moderate",
      versatility: 75,
    },
    bottleShape: "round",
    accentColor: "#6B4226",
    year: "2022",
  },
]

/* ── Bottle SVG Illustration ── */

function BottleSVG({
  shape,
  accentColor,
  isHovered,
}: {
  shape: Fragrance["bottleShape"]
  accentColor: string
  isHovered: boolean
}) {
  const glowId = `glow-${shape}-${accentColor.replace("#", "")}`

  const bottlePaths: Record<Fragrance["bottleShape"], React.ReactNode> = {
    tall: (
      <>
        {/* Tall rectangular bottle - like Chanel */}
        <rect x="34" y="20" width="12" height="8" rx="1" fill="#2A2A35" stroke="#D4AF37" strokeWidth="0.5" />
        <rect x="36" y="12" width="8" height="10" rx="1.5" fill="#1A1A22" stroke="#D4AF37" strokeWidth="0.5" />
        <rect x="28" y="28" width="24" height="50" rx="2" fill={accentColor} stroke="#D4AF37" strokeWidth="0.7" opacity="0.9" />
        <rect x="30" y="30" width="20" height="46" rx="1" fill="none" stroke="#D4AF37" strokeWidth="0.3" opacity="0.4" />
        <line x1="32" y1="50" x2="48" y2="50" stroke="#D4AF37" strokeWidth="0.3" opacity="0.3" />
        <rect x="33" y="53" width="14" height="6" rx="1" fill="none" stroke="#D4AF37" strokeWidth="0.4" opacity="0.5" />
      </>
    ),
    square: (
      <>
        {/* Square bold bottle - like Dior Sauvage */}
        <rect x="35" y="14" width="10" height="8" rx="1.5" fill="#1A1A22" stroke="#D4AF37" strokeWidth="0.5" />
        <rect x="33" y="20" width="14" height="4" rx="1" fill="#2A2A35" stroke="#D4AF37" strokeWidth="0.5" />
        <rect x="24" y="24" width="32" height="48" rx="3" fill={accentColor} stroke="#D4AF37" strokeWidth="0.7" opacity="0.9" />
        <rect x="27" y="27" width="26" height="42" rx="2" fill="none" stroke="#D4AF37" strokeWidth="0.3" opacity="0.3" />
        <circle cx="40" cy="48" r="6" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
        <circle cx="40" cy="48" r="2" fill="#D4AF37" opacity="0.3" />
      </>
    ),
    round: (
      <>
        {/* Round bottle - like D&G */}
        <rect x="37" y="12" width="6" height="10" rx="2" fill="#1A1A22" stroke="#D4AF37" strokeWidth="0.5" />
        <rect x="34" y="20" width="12" height="5" rx="1.5" fill="#2A2A35" stroke="#D4AF37" strokeWidth="0.5" />
        <ellipse cx="40" cy="50" rx="18" ry="24" fill={accentColor} stroke="#D4AF37" strokeWidth="0.7" opacity="0.9" />
        <ellipse cx="40" cy="50" rx="14" ry="20" fill="none" stroke="#D4AF37" strokeWidth="0.3" opacity="0.3" />
        <ellipse cx="40" cy="46" rx="5" ry="3" fill="none" stroke="#D4AF37" strokeWidth="0.4" opacity="0.4" />
      </>
    ),
    angular: (
      <>
        {/* Angular modern bottle - like YSL Y */}
        <polygon points="38,10 42,10 43,18 37,18" fill="#1A1A22" stroke="#D4AF37" strokeWidth="0.5" />
        <rect x="33" y="18" width="14" height="5" rx="1" fill="#2A2A35" stroke="#D4AF37" strokeWidth="0.5" />
        <polygon points="26,23 54,23 52,74 28,74" fill={accentColor} stroke="#D4AF37" strokeWidth="0.7" opacity="0.9" />
        <polygon points="29,26 51,26 49,71 31,71" fill="none" stroke="#D4AF37" strokeWidth="0.3" opacity="0.3" />
        <line x1="34" y1="48" x2="46" y2="48" stroke="#D4AF37" strokeWidth="0.4" opacity="0.4" />
        <line x1="35" y1="52" x2="45" y2="52" stroke="#D4AF37" strokeWidth="0.3" opacity="0.3" />
      </>
    ),
    classic: (
      <>
        {/* Classic ornate bottle - like Tom Ford */}
        <rect x="36" y="8" width="8" height="6" rx="2" fill="#1A1A22" stroke="#D4AF37" strokeWidth="0.5" />
        <rect x="34" y="14" width="12" height="4" rx="1" fill="#2A2A35" stroke="#D4AF37" strokeWidth="0.6" />
        <path
          d="M28,18 L52,18 Q56,18 56,22 L56,68 Q56,74 52,74 L28,74 Q24,74 24,68 L24,22 Q24,18 28,18 Z"
          fill={accentColor}
          stroke="#D4AF37"
          strokeWidth="0.7"
          opacity="0.9"
        />
        <path
          d="M30,22 L50,22 Q52,22 52,24 L52,66 Q52,70 50,70 L30,70 Q28,70 28,66 L28,24 Q28,22 30,22 Z"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.3"
          opacity="0.3"
        />
        <rect x="34" y="40" width="12" height="16" rx="1" fill="none" stroke="#D4AF37" strokeWidth="0.4" opacity="0.4" />
        <line x1="34" y1="48" x2="46" y2="48" stroke="#D4AF37" strokeWidth="0.3" opacity="0.3" />
      </>
    ),
  }

  return (
    <svg
      viewBox="0 0 80 86"
      className="w-full h-full"
      style={{
        filter: isHovered
          ? `drop-shadow(0 0 12px rgba(212, 175, 55, 0.4)) drop-shadow(0 0 24px rgba(212, 175, 55, 0.15))`
          : `drop-shadow(0 0 4px rgba(212, 175, 55, 0.1))`,
        transition: "filter 0.5s ease",
      }}
    >
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity={isHovered ? 0.15 : 0} />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="46" r="38" fill={`url(#${glowId})`} />
      {bottlePaths[shape]}
    </svg>
  )
}

/* ── Note Pyramid Mini ── */

function NotePyramidMini({
  notes,
}: {
  notes: Fragrance["notes"]
}) {
  const tiers = [
    { label: "Top", items: notes.top, color: "#E8D5A3" },
    { label: "Heart", items: notes.heart, color: "#D4AF37" },
    { label: "Base", items: notes.base, color: "#B8860B" },
  ]

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {tiers.map((tier, ti) => (
        <div key={tier.label} className="w-full">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.12em] w-12"
              style={{ color: tier.color }}
            >
              {tier.label}
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: `${tier.color}30` }} />
          </div>
          <div className="flex flex-wrap gap-1.5 pl-14">
            {tier.items.map((note) => (
              <span
                key={note.name}
                className="relative group/note inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium cursor-default border transition-all duration-200"
                style={{
                  borderColor: `${tier.color}30`,
                  color: tier.color,
                  backgroundColor: `${tier.color}08`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = `${tier.color}60`
                  el.style.backgroundColor = `${tier.color}15`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = `${tier.color}30`
                  el.style.backgroundColor = `${tier.color}08`
                }}
              >
                {note.name}
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: tier.color,
                    opacity: note.intensity / 100,
                  }}
                />
                {/* Tooltip */}
                <span
                  className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover/note:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
                  style={{
                    backgroundColor: "#1C1C24",
                    color: "#E8D5A3",
                    border: `1px solid ${tier.color}40`,
                  }}
                >
                  Intensity: {note.intensity}%
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Sentiment Gauge ── */

function SentimentBar({ value, label, color }: { value: number; label: string; color: string }) {
  const barRef = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-[#C8C8C0] w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[#2A2A35] overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${value}%` : "0%",
            backgroundColor: color,
          }}
        />
      </div>
      <span className="text-[11px] font-medium w-8 text-right" style={{ color }}>
        {value}%
      </span>
    </div>
  )
}

/* ── Modal Detail View ── */

function FragranceModal({
  fragrance,
  onClose,
}: {
  fragrance: Fragrance
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }, [onClose])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleClose])

  const sillageMap = { Intimate: 25, Moderate: 50, Strong: 75, Beast: 100 }

  return (
    <div
      ref={overlayRef}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8",
        "transition-all duration-300",
        isVisible ? "bg-black/80 backdrop-blur-sm" : "bg-black/0"
      )}
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${fragrance.house} ${fragrance.name} details`}
    >
      <div
        ref={contentRef}
        className={cn(
          "relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl",
          "border border-[#D4AF37]/20 bg-[#141419]",
          "transition-all duration-300",
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        )}
        style={{
          boxShadow: "0 0 60px rgba(212, 175, 55, 0.08), 0 25px 50px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full border border-[#2A2A35] bg-[#1A1A22] text-[#C8C8C0] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-200 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-[#2A2A35]">
          <div className="flex items-start gap-5">
            <div className="w-20 h-24 shrink-0">
              <BottleSVG
                shape={fragrance.bottleShape}
                accentColor={fragrance.accentColor}
                isHovered={true}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#D4AF37]/70 mb-1">
                {fragrance.house}
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#F5F5F0] leading-tight">
                {fragrance.name}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] px-2 py-0.5 rounded border border-[#D4AF37]/20 text-[#D4AF37] bg-[#D4AF37]/5">
                  {fragrance.concentration}
                </span>
                <span className="text-[11px] text-[#8A8A8A]">{fragrance.family}</span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[#C8C8C0]">
                {fragrance.description}
              </p>
            </div>
          </div>
        </div>

        {/* Note Pyramid */}
        <div className="px-6 py-5 border-b border-[#2A2A35]">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#D4AF37]">
              Note Pyramid
            </span>
          </div>
          <NotePyramidMini notes={fragrance.notes} />
        </div>

        {/* Sentiment / Performance */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#D4AF37]">
              Community Sentiment
            </span>
          </div>

          {/* Score badge */}
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center border-2"
              style={{
                borderColor: fragrance.sentiment.score >= 90 ? "#D4AF37" : "#B8860B",
                background: `conic-gradient(${
                  fragrance.sentiment.score >= 90 ? "#D4AF37" : "#B8860B"
                } ${fragrance.sentiment.score * 3.6}deg, #2A2A35 0deg)`,
              }}
            >
              <div className="w-10 h-10 rounded-full bg-[#141419] flex items-center justify-center">
                <span className="text-sm font-bold text-[#F5F5F0]">{fragrance.sentiment.score}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#F5F5F0]">
                {fragrance.sentiment.label}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3"
                    fill={i < fragrance.sentiment.compliments ? "#D4AF37" : "none"}
                    stroke={i < fragrance.sentiment.compliments ? "#D4AF37" : "#2A2A35"}
                  />
                ))}
                <span className="text-[10px] text-[#8A8A8A] ml-1">Compliment Factor</span>
              </div>
            </div>
          </div>

          {/* Performance bars */}
          <div className="flex flex-col gap-2.5">
            <SentimentBar
              value={fragrance.sentiment.versatility}
              label="Versatility"
              color="#D4AF37"
            />
            <SentimentBar
              value={sillageMap[fragrance.sentiment.sillage]}
              label="Sillage"
              color="#E8D5A3"
            />
            <SentimentBar
              value={Math.min((fragrance.sentiment.longevity / 14) * 100, 100)}
              label="Longevity"
              color="#B8860B"
            />
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="flex flex-col items-center p-3 rounded-lg bg-[#1A1A22] border border-[#2A2A35]">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37] mb-1" />
              <span className="text-sm font-semibold text-[#F5F5F0]">
                {fragrance.sentiment.longevity}h
              </span>
              <span className="text-[10px] text-[#8A8A8A]">Longevity</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-[#1A1A22] border border-[#2A2A35]">
              <Wind className="w-3.5 h-3.5 text-[#D4AF37] mb-1" />
              <span className="text-sm font-semibold text-[#F5F5F0]">
                {fragrance.sentiment.sillage}
              </span>
              <span className="text-[10px] text-[#8A8A8A]">Sillage</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-[#1A1A22] border border-[#2A2A35]">
              <Flame className="w-3.5 h-3.5 text-[#D4AF37] mb-1" />
              <span className="text-sm font-semibold text-[#F5F5F0]">
                {fragrance.sentiment.compliments}/5
              </span>
              <span className="text-[10px] text-[#8A8A8A]">Compliments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Individual Card ── */

function FragranceCard({
  fragrance,
  index,
}: {
  fragrance: Fragrance
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState(0)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    if (isHovered) {
      let start: number | null = null
      const animate = (ts: number) => {
        if (!start) start = ts
        const elapsed = ts - start
        setRotation(Math.sin(elapsed / 1200) * 12)
        animRef.current = requestAnimationFrame(animate)
      }
      animRef.current = requestAnimationFrame(animate)
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      setRotation(0)
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isHovered])

  return (
    <>
      <div
        ref={cardRef}
        className={cn(
          "scroll-reveal group relative flex flex-col rounded-xl overflow-hidden cursor-pointer",
          "border transition-[border-color,box-shadow] duration-500",
          isHovered
            ? "border-[#D4AF37]/40 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
            : "border-[#2A2A35] shadow-none"
        )}
        style={{
          backgroundColor: "#141419",
          transitionDelay: isHovered ? "0ms" : `${index * 80}ms`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${fragrance.house} ${fragrance.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setIsModalOpen(true)
          }
        }}
      >
        {/* Bottle Area */}
        <div
          className="relative flex items-center justify-center pt-8 pb-4 px-4 overflow-hidden"
          style={{ minHeight: "160px" }}
        >
          {/* Subtle textured background pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 50% 60%, ${fragrance.accentColor}15 0%, transparent 70%)`,
            }}
          />

          {/* Golden glow behind bottle on hover */}
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(circle at 50% 55%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)`,
            }}
          />

          {/* Bottle with rotation */}
          <div
            className="relative w-24 h-28 transition-transform duration-300"
            style={{
              transform: `perspective(400px) rotateY(${rotation}deg) scale(${isHovered ? 1.05 : 1})`,
            }}
          >
            <BottleSVG
              shape={fragrance.bottleShape}
              accentColor={fragrance.accentColor}
              isHovered={isHovered}
            />
          </div>

          {/* Year badge */}
          <div className="absolute top-3 right-3 text-[10px] font-mono text-[#8A8A8A]/60">
            {fragrance.year}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-4 pb-4">
          {/* House name */}
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37]/70 mb-0.5">
            {fragrance.house}
          </div>

          {/* Fragrance name */}
          <h4 className="font-serif text-base font-semibold text-[#F5F5F0] leading-tight">
            {fragrance.name}
          </h4>

          {/* Tagline */}
          <p className="text-[11px] text-[#8A8A8A] mt-1 leading-relaxed">
            {fragrance.tagline}
          </p>

          {/* Quick note preview */}
          <div className="flex flex-wrap gap-1 mt-3">
            {fragrance.notes.heart.slice(0, 2).map((note) => (
              <span
                key={note.name}
                className="text-[10px] px-2 py-0.5 rounded-full border border-[#D4AF37]/15 text-[#D4AF37]/80 bg-[#D4AF37]/5"
              >
                {note.name}
              </span>
            ))}
            {fragrance.notes.base.slice(0, 1).map((note) => (
              <span
                key={note.name}
                className="text-[10px] px-2 py-0.5 rounded-full border border-[#B8860B]/15 text-[#B8860B]/80 bg-[#B8860B]/5"
              >
                {note.name}
              </span>
            ))}
          </div>

          {/* Performance strip */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#2A2A35]">
            <div className="flex items-center gap-1" title="Longevity">
              <Clock className="w-3 h-3 text-[#D4AF37]/60" />
              <span className="text-[10px] text-[#C8C8C0]">
                {fragrance.sentiment.longevity}h
              </span>
            </div>
            <div className="flex items-center gap-1" title="Sillage">
              <Wind className="w-3 h-3 text-[#D4AF37]/60" />
              <span className="text-[10px] text-[#C8C8C0]">
                {fragrance.sentiment.sillage}
              </span>
            </div>
            <div className="flex items-center gap-1 ml-auto" title="Community Score">
              <Droplets className="w-3 h-3 text-[#D4AF37]/60" />
              <span className="text-[10px] font-semibold text-[#D4AF37]">
                {fragrance.sentiment.score}
              </span>
            </div>
          </div>

          {/* Hover CTA */}
          <div
            className={cn(
              "mt-2 text-center text-[10px] uppercase tracking-[0.15em] font-medium text-[#D4AF37] transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            Explore Details
          </div>
        </div>
      </div>

      {isModalOpen && (
        <FragranceModal
          fragrance={fragrance}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}

/* ── Main Grid Component ── */

export function TrendingFragranceCards() {
  return (
    <div className="my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {fragrances.map((fragrance, i) => (
          <FragranceCard key={fragrance.id} fragrance={fragrance} index={i} />
        ))}
      </div>
      <p className="text-center text-[11px] text-[#8A8A8A] mt-4 italic">
        Click any card to explore the full note pyramid and community sentiment
      </p>
    </div>
  )
}
