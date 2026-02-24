"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Database,
  MessageCircle,
  Users,
  Target,
  Sparkles,
  Clock,
  TrendingUp,
  Search,
  Star,
  Hash,
  Award,
} from "lucide-react"

/* ─── Data ─── */
interface PlatformData {
  id: string
  name: string
  tagline: string
  demographic: string
  demographicIcon: React.ReactNode
  primaryFocus: string
  focusIcon: React.ReactNode
  communityVibe: string
  vibeIcon: React.ReactNode
  founded: string
  userBase: string
  color: string
  colorMuted: string
  traits: { label: string; value: number }[]
  highlights: string[]
}

const platforms: PlatformData[] = [
  {
    id: "basenotes",
    name: "Basenotes",
    tagline: "The Connoisseur's Archive",
    demographic: "Veteran Collector",
    demographicIcon: <Award className="w-5 h-5" />,
    primaryFocus: "Vintage & Technical",
    focusIcon: <BookOpen className="w-5 h-5" />,
    communityVibe: "Archival & Expert-led",
    vibeIcon: <Star className="w-5 h-5" />,
    founded: "Est. 2000",
    userBase: "Seasoned Enthusiasts",
    color: "#D4AF37",
    colorMuted: "rgba(212, 175, 55, 0.15)",
    traits: [
      { label: "Technical Depth", value: 95 },
      { label: "Vintage Knowledge", value: 98 },
      { label: "Accessibility", value: 40 },
      { label: "Activity Level", value: 55 },
    ],
    highlights: [
      "Deep-dive vintage discussions",
      "Historical reformulation tracking",
      "Expert-level note analysis",
      "Curated recommendation threads",
    ],
  },
  {
    id: "fragrantica",
    name: "Fragrantica",
    tagline: "The Encyclopedia of Scent",
    demographic: "Research-Oriented",
    demographicIcon: <Search className="w-5 h-5" />,
    primaryFocus: "Database & Reviews",
    focusIcon: <Database className="w-5 h-5" />,
    communityVibe: "Encyclopedic & Data-driven",
    vibeIcon: <TrendingUp className="w-5 h-5" />,
    founded: "Est. 2007",
    userBase: "All Experience Levels",
    color: "#C9A961",
    colorMuted: "rgba(201, 169, 97, 0.15)",
    traits: [
      { label: "Technical Depth", value: 80 },
      { label: "Vintage Knowledge", value: 70 },
      { label: "Accessibility", value: 85 },
      { label: "Activity Level", value: 90 },
    ],
    highlights: [
      "95,000+ fragrance profiles",
      "Detailed note pyramids",
      "User-submitted reviews",
      "Seasonal & occasion tagging",
    ],
  },
  {
    id: "reddit",
    name: "Reddit r/fragrance",
    tagline: "The New Wave Forum",
    demographic: "Newer Enthusiast",
    demographicIcon: <Users className="w-5 h-5" />,
    primaryFocus: "Trending & Accessible",
    focusIcon: <MessageCircle className="w-5 h-5" />,
    communityVibe: "Casual & Democratic",
    vibeIcon: <Sparkles className="w-5 h-5" />,
    founded: "Est. 2010",
    userBase: "Younger Demographic",
    color: "#E8D5A3",
    colorMuted: "rgba(232, 213, 163, 0.15)",
    traits: [
      { label: "Technical Depth", value: 50 },
      { label: "Vintage Knowledge", value: 30 },
      { label: "Accessibility", value: 95 },
      { label: "Activity Level", value: 98 },
    ],
    highlights: [
      "Real-time trend discussions",
      "Beginner-friendly SOTD threads",
      "Active dupe & clone community",
      "Collection-sharing culture",
    ],
  },
]

/* ─── Trait Bar ─── */
function TraitBar({
  label,
  value,
  accentColor,
  delay,
  isVisible,
}: {
  key?: React.Key
  label: string
  value: number
  accentColor: string
  delay: number
  isVisible: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-cream-muted w-[110px] shrink-0 text-right">
        {label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-surface overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: isVisible ? `${value}%` : "0%",
            backgroundColor: accentColor,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      <span
        className="text-xs font-medium w-8 text-right transition-opacity duration-500"
        style={{
          color: accentColor,
          opacity: isVisible ? 1 : 0,
          transitionDelay: `${delay + 200}ms`,
        }}
      >
        {value}
      </span>
    </div>
  )
}

/* ─── Info Row ─── */
function InfoRow({
  icon,
  label,
  value,
  accentColor,
}: {
  icon: React.ReactNode
  label: string
  value: string
  accentColor: string
}) {
  return (
    <div className="flex items-start gap-3 group cursor-default">
      <div
        className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors duration-300"
        style={{ backgroundColor: `${accentColor}15` }}
      >
        <span style={{ color: accentColor }}>{icon}</span>
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-medium text-cream leading-snug">
          {value}
        </span>
      </div>
    </div>
  )
}

/* ─── Platform Tab Button ─── */
function PlatformTab({
  platform,
  isActive,
  onClick,
}: {
  key?: React.Key
  platform: PlatformData
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex-1 px-3 py-3 md:py-3.5 rounded-lg text-center transition-all duration-400 cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2",
        isActive
          ? "bg-surface-elevated border border-gold/30"
          : "bg-transparent border border-transparent hover:bg-surface-elevated/50 hover:border-border/50"
      )}
    >
      <span
        className={cn(
          "text-xs md:text-sm font-medium tracking-wide transition-colors duration-300",
          isActive ? "text-cream" : "text-cream-muted/70"
        )}
      >
        {platform.name}
      </span>
      {isActive && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-10 rounded-full transition-all duration-500"
          style={{ backgroundColor: platform.color }}
        />
      )}
    </button>
  )
}

/* ─── Highlight Pill ─── */
function HighlightPill({
  text,
  accentColor,
  delay,
  isVisible,
}: {
  key?: React.Key
  text: string
  accentColor: string
  delay: number
  isVisible: boolean
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-500"
      style={{
        borderColor: `${accentColor}20`,
        backgroundColor: `${accentColor}08`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(8px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <Hash className="w-3 h-3 shrink-0" style={{ color: accentColor }} />
      <span className="text-xs text-cream-muted leading-snug">{text}</span>
    </div>
  )
}

/* ─── Main Component ─── */
export function PlatformComparison() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [visibleIndex, setVisibleIndex] = useState(0)

  const handleSelect = useCallback(
    (index: number) => {
      if (index === activeIndex || isTransitioning) return
      setIsTransitioning(true)
      // Start fade-out
      setTimeout(() => {
        setVisibleIndex(index)
        setActiveIndex(index)
        // Allow content to mount, then fade in
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 250)
    },
    [activeIndex, isTransitioning]
  )

  const current = platforms[visibleIndex]

  return (
    <div
      id="widget-platform-comparison"
      className="scroll-reveal my-8 rounded-lg border border-border bg-surface-elevated overflow-hidden"
    >
      {/* Tab Selector */}
      <div className="flex items-center gap-1 p-2 bg-surface border-b border-border">
        {platforms.map((platform, i) => (
          <PlatformTab
            key={platform.id}
            platform={platform}
            isActive={activeIndex === i}
            onClick={() => handleSelect(i)}
          />
        ))}
      </div>

      {/* Content Panel */}
      <div
        className={cn(
          "transition-opacity duration-250 ease-in-out",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 md:px-7 md:pt-6 md:pb-5 border-b border-border/50">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: current.color }}
                />
                <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  {current.founded}
                </span>
              </div>
              <h4 className="font-serif text-xl md:text-2xl text-cream tracking-tight">
                {current.name}
              </h4>
            </div>
            <span
              className="text-sm italic font-serif"
              style={{ color: current.color }}
            >
              {current.tagline}
            </span>
          </div>
        </div>

        <div className="p-5 md:p-7">
          {/* Key Characteristics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <InfoRow
              icon={current.demographicIcon}
              label="Typical User"
              value={current.demographic}
              accentColor={current.color}
            />
            <InfoRow
              icon={current.focusIcon}
              label="Primary Focus"
              value={current.primaryFocus}
              accentColor={current.color}
            />
            <InfoRow
              icon={current.vibeIcon}
              label="Community Vibe"
              value={current.communityVibe}
              accentColor={current.color}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50 mb-6" />

          {/* Two-column layout: Traits + Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trait Bars */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock
                  className="w-3.5 h-3.5"
                  style={{ color: current.color }}
                />
                <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Platform Characteristics
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {current.traits.map((trait, i) => (
                  <TraitBar
                    key={`${current.id}-${trait.label}`}
                    label={trait.label}
                    value={trait.value}
                    accentColor={current.color}
                    delay={i * 100}
                    isVisible={!isTransitioning}
                  />
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target
                  className="w-3.5 h-3.5"
                  style={{ color: current.color }}
                />
                <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Key Strengths
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {current.highlights.map((highlight, i) => (
                  <HighlightPill
                    key={`${current.id}-${highlight}`}
                    text={highlight}
                    accentColor={current.color}
                    delay={i * 80}
                    isVisible={!isTransitioning}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* User Base Tag */}
          <div className="mt-6 pt-4 border-t border-border/30 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Core Audience:
            </span>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${current.color}15`,
                color: current.color,
              }}
            >
              {current.userBase}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
