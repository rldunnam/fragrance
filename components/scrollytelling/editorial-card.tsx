'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, Wind, Clock, Droplets } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAccentColor, getBottleGradient } from '@/lib/fragrances/accent-color'

/* ─── Types ─── */

export interface EditorialNote {
  name: string
  duration?: string
}

export interface EditorialFragrance {
  id: string
  name: string
  house: string
  year: number | string
  family: string       // single display string e.g. "Fruity Chypre"
  families: string[]   // for color derivation e.g. ["Fruity", "Chypre"]
  price?: string
  concentration?: string
  perfumer?: string
  description: string
  notes: {
    top: EditorialNote[]
    heart: EditorialNote[]
    base: EditorialNote[]
  }
  accords: { name: string; strength: number }[]
  longevity?: number   // hours
  sillage?: string
  projection?: number  // 0-100
  badge?: string       // e.g. "Classic" | "Niche" | "Trending"
}

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
  const id = `b-${accent.replace('#', '')}`
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
      <rect x="38" y="2" width="24" height="18" rx="4" fill={accent} opacity="0.7" />
      <rect x="42" y="20" width="16" height="28" rx="2" fill={gradient[0]} stroke={accent} strokeWidth="0.5" strokeOpacity="0.3" />
      <path d="M42 48 L22 72 L22 76 L78 76 L78 72 L58 48Z" fill={`url(#${id}-body)`} stroke={accent} strokeWidth="0.5" strokeOpacity="0.2" />
      <rect x="22" y="76" width="56" height="130" rx="6" fill={`url(#${id}-body)`} stroke={accent} strokeWidth="0.8" strokeOpacity="0.3" />
      <rect x="26" y="100" width="48" height="100" rx="4" fill={`url(#${id}-liquid)`} />
      <rect x="30" y="82" width="6" height="90" rx="3" fill={accent} opacity="0.08" />
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
  const [hovered, setHovered] = useState<number | null>(null)
  const size = 280
  const cx = size / 2
  const cy = size / 2
  const maxR = 110
  const angleStep = (2 * Math.PI) / accords.length

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

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
      {[25, 50, 75, 100].map(pct => (
        <circle key={pct} cx={cx} cy={cy} r={(pct / 100) * maxR}
          fill="none" stroke={accent} strokeOpacity="0.08" strokeWidth="0.5" />
      ))}
      {accords.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2
        return <line key={i} x1={cx} y1={cy}
          x2={cx + maxR * Math.cos(angle)} y2={cy + maxR * Math.sin(angle)}
          stroke={accent} strokeOpacity="0.1" strokeWidth="0.5" />
      })}
      <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')}
        fill={accent} fillOpacity="0.12"
        stroke={accent} strokeWidth="1.5" strokeOpacity="0.6" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'default' }}>
          <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
          <circle cx={p.x} cy={p.y} r={hovered === i ? 5 : 3.5}
            fill={accent} stroke="#0A0A0F" strokeWidth="1.5"
            style={{ transition: 'r 0.2s ease' }} />
          <text x={p.labelX} y={p.labelY} textAnchor="middle" dominantBaseline="middle"
            fill={hovered === i ? '#F5F5F0' : '#8A8A8A'}
            fontSize="10" fontFamily="Inter, sans-serif"
            style={{ transition: 'fill 0.2s ease' }}>
            {p.name}
          </text>
          {hovered === i && (
            <text x={p.labelX} y={p.labelY + 13} textAnchor="middle" dominantBaseline="middle"
              fill={accent} fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">
              {p.strength}%
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

/* ─── Detail Modal ─── */

function DetailModal({
  fragrance,
  accent,
  gradient,
  onClose,
}: {
  fragrance: EditorialFragrance
  accent: string
  gradient: [string, string]
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      role="dialog" aria-modal="true"
      aria-label={`${fragrance.name} by ${fragrance.house} details`}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl border-2 bg-surface"
        style={{ borderColor: `${accent}33` }}
      >
        {/* Close */}
        <button onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full border border-border bg-surface-elevated p-2 text-cream-muted transition-colors hover:border-gold/40 hover:text-cream cursor-pointer"
          aria-label="Close">
          <X size={16} />
        </button>

        {/* Header */}
        <div className="relative px-6 pt-8 pb-6 md:px-10 md:pt-10"
          style={{ background: `linear-gradient(180deg, ${accent}08 0%, transparent 100%)` }}>
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
            <div className="shrink-0 mx-auto md:mx-0">
              <BottleIllustration gradient={gradient} accent={accent} className="w-24 h-auto md:w-28" />
            </div>
            <div className="flex-1 min-w-0 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: accent }}>
                  {fragrance.family}
                </span>
                {fragrance.badge && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                    style={{ color: accent, borderColor: `${accent}40`, background: `${accent}10` }}>
                    {fragrance.badge}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-cream font-semibold">{fragrance.name}</h3>
              <p className="mt-1 text-sm text-cream-muted">{fragrance.house} &middot; {fragrance.year}</p>
              {fragrance.perfumer && (
                <p className="mt-0.5 text-xs text-cream-muted/60">Perfumer: {fragrance.perfumer}</p>
              )}
              <p className="mt-4 text-sm text-cream-muted leading-relaxed">{fragrance.description}</p>
              {fragrance.price && (
                <span className="mt-3 inline-block text-sm font-semibold" style={{ color: accent }}>
                  {fragrance.price}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-8 md:px-10 md:pb-10">
          <div className="h-px w-full bg-border/40 mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Accord chart */}
            <div>
              <h4 className="font-serif text-base text-cream font-medium mb-4">Accord Profile</h4>
              {fragrance.accords.length > 0
                ? <RadialAccordChart accords={fragrance.accords} accent={accent} />
                : <p className="text-xs text-cream-muted/50 italic">Accord data unavailable</p>
              }
            </div>

            {/* Note pyramid */}
            <div>
              <h4 className="font-serif text-base text-cream font-medium mb-4">Note Pyramid</h4>
              <div className="flex flex-col gap-3">
                {([
                  { label: 'Top', notes: fragrance.notes.top, color: '#E8D5A3' },
                  { label: 'Heart', notes: fragrance.notes.heart, color: accent },
                  { label: 'Base', notes: fragrance.notes.base, color: '#B8860B' },
                ] as const).map(tier => (
                  <div key={tier.label}
                    className="rounded-lg border border-border/50 bg-surface-elevated px-4 py-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: tier.color }}>
                        {tier.label} Notes
                      </span>
                      {tier.notes[0]?.duration && (
                        <span className="text-[10px] text-cream-muted/50">
                          {tier.notes[0].duration}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tier.notes.map(n => (
                        <span key={n.name}
                          className="rounded-full px-2.5 py-0.5 text-[11px] text-cream-muted border"
                          style={{ borderColor: `${tier.color}30`, background: `${tier.color}08` }}>
                          {n.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance */}
              {(fragrance.longevity || fragrance.sillage || fragrance.projection) && (
                <div className="mt-5">
                  <h4 className="font-serif text-base text-cream font-medium mb-3">Performance</h4>
                  <div className="flex flex-col gap-2.5">
                    {fragrance.longevity && (
                      <div className="flex items-center gap-3">
                        <Clock size={14} style={{ color: accent }} className="shrink-0" />
                        <span className="text-xs text-cream-muted w-20 shrink-0">Longevity</span>
                        <span className="text-xs text-cream-muted">{fragrance.longevity}h</span>
                      </div>
                    )}
                    {fragrance.sillage && (
                      <div className="flex items-center gap-3">
                        <Wind size={14} style={{ color: accent }} className="shrink-0" />
                        <span className="text-xs text-cream-muted w-20 shrink-0">Sillage</span>
                        <span className="text-xs text-cream-muted">{fragrance.sillage}</span>
                      </div>
                    )}
                    {fragrance.projection !== undefined && (
                      <div className="flex items-center gap-3">
                        <Droplets size={14} style={{ color: accent }} className="shrink-0" />
                        <span className="text-xs text-cream-muted w-20 shrink-0">Projection</span>
                        <div className="flex-1 h-1.5 rounded-full bg-border/60 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${fragrance.projection}%`, background: `linear-gradient(90deg, ${accent}88, ${accent})` }} />
                        </div>
                        <span className="text-xs text-cream-muted/80 w-8 text-right tabular-nums">
                          {fragrance.projection}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ─── Editorial Card ─── */

export function EditorialCard({
  fragrance,
  index = 0,
}: {
  fragrance: EditorialFragrance
  index?: number
}) {
  const [selected, setSelected] = useState(false)
  const cardRef = useRef<HTMLButtonElement>(null)
  const [parallaxY, setParallaxY] = useState(0)

  const accent = getAccentColor(fragrance.families)
  const gradient = getBottleGradient(accent)

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      const el = cardRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
      setParallaxY(offset * -18)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClose = useCallback(() => setSelected(false), [])

  // Top 3 accords for card preview
  const topAccords = fragrance.accords.slice(0, 3)

  return (
    <>
      <button
        ref={cardRef}
        onClick={() => setSelected(true)}
        className={cn(
          'group relative flex-shrink-0 w-[280px] md:w-[300px] rounded-xl',
          'border-2 bg-surface overflow-hidden text-left',
          'transition-all duration-500 ease-out',
          'hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(212,175,55,0.12)]',
          'focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2',
          'cursor-pointer'
        )}
        style={{
          borderColor: `${accent}40`,
          animationDelay: `${index * 100}ms`,
        }}
        aria-label={`View details for ${fragrance.name} by ${fragrance.house}`}
      >
        {/* Top accent line */}
        <div className="h-[3px] w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }} />

        {/* Bottle area */}
        <div className="relative flex items-center justify-center py-8 px-6"
          style={{ background: `radial-gradient(ellipse at center, ${accent}06 0%, transparent 70%)` }}>
          <div style={{ transform: `translateY(${parallaxY}px)`, transition: 'transform 0.1s linear' }}>
            <BottleIllustration
              gradient={gradient}
              accent={accent}
              className="w-20 h-auto transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Badge + family */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
            {fragrance.badge && (
              <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border"
                style={{ color: accent, borderColor: `${accent}40`, background: `${accent}10` }}>
                {fragrance.badge}
              </span>
            )}
            <span className="rounded-full px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider border"
              style={{ color: accent, borderColor: `${accent}30`, background: `${accent}0A` }}>
              {fragrance.family}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-5 pb-5">
          <h4 className="font-serif text-xl text-cream font-semibold">{fragrance.name}</h4>
          <p className="mt-0.5 text-xs text-cream-muted">
            {fragrance.house} &middot; {fragrance.year}
          </p>

          {/* Accord mini-bars */}
          {topAccords.length > 0 && (
            <div className="mt-4 flex flex-col gap-1.5">
              {topAccords.map(accord => (
                <div key={accord.name} className="flex items-center gap-2">
                  <span className="text-[10px] text-cream-muted/70 w-16 shrink-0 truncate">{accord.name}</span>
                  <div className="flex-1 h-1 rounded-full bg-border/40 overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{ width: `${accord.strength}%`, background: accent, opacity: 0.6 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Price + CTA */}
          <div className="mt-4 flex items-center justify-between">
            {fragrance.price
              ? <span className="text-sm font-semibold" style={{ color: accent }}>{fragrance.price}</span>
              : <span />
            }
            <span className="text-[10px] text-cream-muted/40 uppercase tracking-wider transition-colors duration-300 group-hover:text-cream-muted">
              Explore
            </span>
          </div>
        </div>

        {/* Bottom accent line on hover */}
        <div className="h-[2px] w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }} />
      </button>

      {selected && (
        <DetailModal
          fragrance={fragrance}
          accent={accent}
          gradient={gradient}
          onClose={handleClose}
        />
      )}
    </>
  )
}

/* ─── Scroll Carousel Wrapper ─── */

export function EditorialCarousel({
  children,
  label,
  sublabel,
}: {
  children: React.ReactNode
  label?: string
  sublabel?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const updateState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 10)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateState, { passive: true })
    updateState()
    return () => el.removeEventListener('scroll', updateState)
  }, [updateState])

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -330 : 330, behavior: 'smooth' })
  }

  return (
    <div className="scroll-reveal my-8">
      {(label || sublabel) && (
        <div className="flex items-end justify-between mb-6">
          <div>
            {label && <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold/70">{label}</span>}
            {sublabel && <p className="mt-1 text-sm text-cream-muted/60">{sublabel}</p>}
          </div>
          <div className="hidden md:flex items-center gap-2">
            {(['left', 'right'] as const).map(dir => (
              <button key={dir}
                onClick={() => scroll(dir)}
                disabled={dir === 'left' ? !canLeft : !canRight}
                className={cn(
                  'rounded-full border border-border bg-surface-elevated p-2 transition-all duration-200 cursor-pointer',
                  (dir === 'left' ? canLeft : canRight)
                    ? 'hover:border-gold/40 hover:text-gold text-cream-muted'
                    : 'opacity-30 cursor-not-allowed text-cream-muted/40'
                )}
                aria-label={`Scroll ${dir}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d={dir === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        {canLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-background to-transparent" />
        )}
        {canRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-background to-transparent" />
        )}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
