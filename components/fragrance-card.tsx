'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookMarked, Heart, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSimilarFragrances } from '@/lib/fragrances/similarity'
import { deriveAccords } from '@/lib/fragrances/accords'
import type { Fragrance } from '@/lib/fragrances/types'

/* ─── Bottle Image Banner ─── */

function ImageBanner({ imageUrl, name, house }: { imageUrl: string; name: string; house: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <div className="relative flex h-36 items-center justify-center overflow-hidden border-b border-gold/10 bg-gradient-to-b from-surface-elevated to-surface">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{ background: 'radial-gradient(ellipse at 50% 80%, #D4AF3720 0%, transparent 70%)' }}
      />
      <Image
        src={imageUrl}
        alt={`${name} by ${house}`}
        width={90}
        height={120}
        className="relative z-10 h-28 w-auto object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
        unoptimized
        onError={() => setFailed(true)}
      />
    </div>
  )
}

/* ─── Projection Rating ─── */

function ProjectionRating({ rating }: { rating: number }) {
  const label = rating === 1 ? 'Low' : rating === 2 ? 'Moderate' : rating === 3 ? 'Good' : rating === 4 ? 'Strong' : 'Very Strong'
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            className={cn('h-3 w-3 transition-all duration-300', s <= rating ? 'text-gold fill-gold' : 'text-gold/20 fill-none')}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        ))}
      </div>
      <span className="text-[10px] uppercase tracking-wider text-gold/70 font-medium">{label}</span>
    </div>
  )
}

/* ─── Radial Accord Chart ─── */

function RadialAccordChart({ accords }: { accords: { name: string; strength: number }[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const accent = '#D4AF37'
  const size = 240
  const cx = size / 2
  const cy = size / 2
  const maxR = 88
  const rings = [25, 50, 75, 100]
  const angleStep = (2 * Math.PI) / accords.length

  const points = accords.map((a, i) => {
    const angle = i * angleStep - Math.PI / 2
    const r = (a.strength / 100) * maxR
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      labelX: cx + (maxR + 22) * Math.cos(angle),
      labelY: cy + (maxR + 22) * Math.sin(angle),
      ...a,
    }
  })

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[240px] mx-auto">
      {rings.map((pct) => (
        <circle key={pct} cx={cx} cy={cy} r={(pct / 100) * maxR}
          fill="none" stroke="#D4AF37" strokeOpacity="0.08" strokeWidth="0.5" />
      ))}
      {accords.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2
        return (
          <line key={i} x1={cx} y1={cy}
            x2={cx + maxR * Math.cos(angle)} y2={cy + maxR * Math.sin(angle)}
            stroke="#D4AF37" strokeOpacity="0.1" strokeWidth="0.5" />
        )
      })}
      <polygon points={polygonPoints}
        fill={accent} fillOpacity="0.12"
        stroke={accent} strokeWidth="1.5" strokeOpacity="0.6" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}
          style={{ cursor: 'default' }}>
          <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
          <circle cx={p.x} cy={p.y} r={hoveredIndex === i ? 5 : 3.5}
            fill={accent} stroke="#0A0A0F" strokeWidth="1.5"
            style={{ transition: 'r 0.2s ease' }} />
          <text x={p.labelX} y={p.labelY} textAnchor="middle" dominantBaseline="middle"
            fill={hoveredIndex === i ? '#F5F5F0' : '#8A8A8A'}
            fontSize="9" fontFamily="Inter, sans-serif"
            style={{ transition: 'fill 0.2s ease' }}>
            {p.name}
          </text>
          {hoveredIndex === i && (
            <text x={p.labelX} y={p.labelY + 11} textAnchor="middle" dominantBaseline="middle"
              fill={accent} fontSize="8" fontWeight="600" fontFamily="Inter, sans-serif">
              {p.strength}%
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

/* ─── Shared Fragrance Card ─── */

export interface FragranceCardProps {
  fragrance: Fragrance
  // Collection state
  inCabinet: boolean
  inWishlist: boolean
  userRating?: number
  onToggleCabinet: () => void
  onToggleWishlist: () => void
  onSetRating: (score: number) => void
  onRemoveRating: () => void
  // Recommendation-engine-specific (optional — omit on collection page)
  isShortlisted?: boolean
  canShortlist?: boolean
  allFragrances?: Fragrance[]
  onToggleShortlist?: () => void
  onNoteClick?: (note: string) => void
  onSimilarClick?: (id: string) => void
}

export function FragranceCard({
  fragrance,
  inCabinet,
  inWishlist,
  userRating,
  onToggleCabinet,
  onToggleWishlist,
  onSetRating,
  onRemoveRating,
  isShortlisted = false,
  canShortlist = false,
  allFragrances = [],
  onToggleShortlist,
  onNoteClick,
  onSimilarClick,
}: FragranceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const accords = deriveAccords(fragrance)

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border border-gold/30 bg-gradient-to-br from-surface-elevated to-surface transition-all duration-500',
        'hover:border-gold hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02]',
        isExpanded ? 'border-gold shadow-lg shadow-gold/20' : '',
        isShortlisted ? 'border-gold/60 shadow-md shadow-gold/15' : ''
      )}
      id={`fragrance-card-${fragrance.id}`}
      style={{ cursor: 'pointer' }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Bottle image */}
      {fragrance.imageUrl && (
        <ImageBanner imageUrl={fragrance.imageUrl} name={fragrance.name} house={fragrance.house} />
      )}

      <div className="w-full text-left p-5">
        {/* Header row */}
        <div className="mb-3">
          <div className="mb-1 flex items-start justify-between gap-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h5 className="font-serif text-lg leading-tight text-cream">{fragrance.name}</h5>
              {fragrance.concentration && (
                <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-gold/60 border border-gold/20 rounded px-1.5 py-0.5 leading-none">
                  {fragrance.concentration}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-sm font-medium text-gold whitespace-nowrap">${fragrance.price}</span>

              {/* Cabinet */}
              <button
                onClick={(e) => { e.stopPropagation(); onToggleCabinet() }}
                title={inCabinet ? 'Remove from cabinet' : 'Add to cabinet'}
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200',
                  inCabinet
                    ? 'border-gold bg-gold text-surface'
                    : 'border-gold/30 bg-gold/5 text-cream-muted hover:border-gold hover:bg-gold/10 hover:text-gold'
                )}
              >
                <BookMarked className="h-3 w-3" />
              </button>

              {/* Wishlist */}
              <button
                onClick={(e) => { e.stopPropagation(); onToggleWishlist() }}
                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200',
                  inWishlist
                    ? 'border-rose-400/80 bg-rose-400/20 text-rose-400'
                    : 'border-gold/30 bg-gold/5 text-cream-muted hover:border-rose-400/50 hover:bg-rose-400/10 hover:text-rose-400'
                )}
              >
                <Heart className={cn('h-3 w-3', inWishlist && 'fill-current')} />
              </button>

              {/* Shortlist / compare — only shown in recommendation engine */}
              {onToggleShortlist && (
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleShortlist() }}
                  disabled={!canShortlist}
                  title={isShortlisted ? 'Remove from comparison' : canShortlist ? 'Add to comparison' : 'Max 3 fragrances selected'}
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200',
                    isShortlisted
                      ? 'border-gold bg-gold text-surface'
                      : canShortlist
                        ? 'border-gold/30 bg-gold/5 text-cream-muted hover:border-gold hover:bg-gold/10 hover:text-gold'
                        : 'border-white/10 bg-transparent text-white/20 cursor-not-allowed'
                  )}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 0-2 2h-2a2 2 0 0 0-2-2z" />
                  </svg>
                </button>
              )}

              {/* Expand chevron */}
              <div className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border transition-all',
                isExpanded ? 'border-gold bg-gold/20 rotate-180' : 'border-gold/30 bg-gold/5'
              )}>
                <svg
                  className={cn('h-3 w-3', isExpanded ? 'text-gold' : 'text-cream-muted')}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="text-sm text-gold-light">{fragrance.house}</div>
        </div>

        {/* Family tags */}
        <div className="mb-3 flex flex-wrap gap-2">
          {fragrance.family.map((fam) => (
            <span key={fam} className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs text-gold-light">
              {fam}
            </span>
          ))}
        </div>

        {/* Quick stats */}
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-cream-muted/70">Longevity:</span>{' '}
              <span className="text-cream-muted">{fragrance.longevity}</span>
            </div>
            <div>
              <span className="text-cream-muted/70">Sillage:</span>{' '}
              <span className="text-cream-muted">{fragrance.sillage}</span>
            </div>
          </div>
          <div className="pt-1 border-t border-gold/10">
            <div className="flex items-center justify-between">
              <span className="text-cream-muted/70">Projection:</span>
              <ProjectionRating rating={fragrance.projection} />
            </div>
          </div>
        </div>

        {/* Expanded content */}
        <div className={cn(
          'overflow-hidden transition-all duration-500',
          isExpanded ? 'mt-4 max-h-[900px] opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="space-y-3 border-t border-gold/20 pt-4">

            {/* Rationale */}
            <p className="text-sm leading-relaxed text-cream-muted italic">{fragrance.rationale}</p>

            {/* Notes */}
            <div className="space-y-2">
              {([
                { label: 'Top Notes', notes: fragrance.topNotes },
                { label: 'Heart Notes', notes: fragrance.heartNotes },
                { label: 'Base Notes', notes: fragrance.baseNotes },
              ] as { label: string; notes: string[] }[]).map(({ label, notes }) => (
                <div key={label}>
                  <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-gold/80">{label}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {notes.map(note => (
                      <button
                        key={note}
                        onClick={(e) => { e.stopPropagation(); onNoteClick?.(note) }}
                        className={cn(
                          'rounded-full border border-gold/20 bg-surface px-2.5 py-0.5 text-xs text-cream-muted transition-all duration-200',
                          onNoteClick ? 'hover:border-gold/60 hover:bg-gold/10 hover:text-gold cursor-pointer' : 'cursor-default'
                        )}
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Intensity */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium uppercase tracking-wider text-gold/80">Intensity</span>
                <span className="text-cream-muted">{fragrance.intensity}/5</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-1000"
                  style={{ width: `${(fragrance.intensity / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Accord Profile */}
            {accords.length > 0 && (
              <div className="border-t border-gold/10 pt-3">
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-gold/80">Accord Profile</div>
                <RadialAccordChart accords={accords} />
              </div>
            )}

            {/* My Rating */}
            <div className="border-t border-gold/10 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-gold/80">My Rating</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={(e) => { e.stopPropagation(); userRating === star ? onRemoveRating() : onSetRating(star) }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform duration-100 hover:scale-110"
                      title={userRating === star ? 'Remove rating' : `Rate ${star}/5`}
                    >
                      <Star className={cn(
                        'h-4 w-4 transition-colors duration-150',
                        (hoverRating || userRating || 0) >= star ? 'text-gold fill-gold' : 'text-gold/20'
                      )} />
                    </button>
                  ))}
                  {userRating && <span className="ml-1 text-[10px] text-cream-muted/50">{userRating}/5</span>}
                </div>
              </div>
            </div>

            {/* You Might Also Like — only when allFragrances provided */}
            {allFragrances.length > 0 && onSimilarClick && (() => {
              const similar = getSimilarFragrances(fragrance, allFragrances)
              if (similar.length === 0) return null
              return (
                <div className="border-t border-gold/10 pt-3">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wider text-gold/80">You Might Also Like</div>
                  <div className="flex flex-col gap-2">
                    {similar.map(s => (
                      <button
                        key={s.id}
                        onClick={(e) => { e.stopPropagation(); onSimilarClick(s.id) }}
                        className="flex items-center justify-between rounded-lg border border-gold/15 bg-surface px-3 py-2 text-left transition-all duration-200 hover:border-gold/40 hover:bg-gold/5 group"
                      >
                        <div>
                          <div className="text-xs font-medium text-cream group-hover:text-gold-light transition-colors">{s.name}</div>
                          <div className="text-[10px] text-cream-muted/50 uppercase tracking-wider mt-0.5">{s.house}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="text-xs text-gold/60">${s.price}</span>
                          <div className="flex gap-0.5">
                            {s.family.map(fam => (
                              <span key={fam} className="rounded-full border border-gold/20 bg-gold/8 px-1.5 py-0.5 text-[9px] text-gold-light">{fam}</span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
