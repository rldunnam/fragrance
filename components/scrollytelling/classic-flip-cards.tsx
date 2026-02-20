'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ClassicFragrance {
  name: string
  year: number
  subtitle: string
  notes: {
    top: string[]
    heart: string[]
    base: string[]
  }
  description: string
}

const classics: ClassicFragrance[] = [
  {
    name: 'Dior Eau Sauvage',
    year: 1966,
    subtitle: 'The Aromatic Revolution',
    notes: {
      top: ['Bergamot', 'Lemon', 'Basil'],
      heart: ['Hedione', 'Lavender', 'Jasmine'],
      base: ['Oakmoss', 'Vetiver', 'Patchouli']
    },
    description: 'The aromatic chypre that defined masculine freshness. Eau Sauvage revolutionized men\'s fragrance with its clean, sophisticated hedione-based composition, creating the blueprint for modern aromatic scents that remains influential six decades later.'
  },
  {
    name: 'Polo Ralph Lauren',
    year: 1978,
    subtitle: 'American Powerhouse',
    notes: {
      top: ['Pine', 'Artemisia', 'Basil'],
      heart: ['Carnation', 'Geranium', 'Jasmine'],
      base: ['Tobacco', 'Leather', 'Oakmoss']
    },
    description: 'A green powerhouse of American masculinity. Polo\'s bold, tobacco-laced woods and leather created an olfactory signature of confidence and tradition, embodying the polo player\'s rugged elegance and becoming synonymous with classic American style.'
  },
  {
    name: 'Azzaro Pour Homme',
    year: 1978,
    subtitle: 'Mediterranean Elegance',
    notes: {
      top: ['Lavender', 'Anise', 'Caraway'],
      heart: ['Basil', 'Sandalwood', 'Iris'],
      base: ['Vetiver', 'Oakmoss', 'Leather']
    },
    description: 'Mediterranean aromatic fougère with 40+ year legacy. Azzaro\'s masterful balance of lavender, anise, and warm woods captures the essence of French Riviera sophistication, creating a timeless scent that bridges casual elegance and formal refinement.'
  },
  {
    name: 'Davidoff Cool Water',
    year: 1988,
    subtitle: 'The Aquatic Pioneer',
    notes: {
      top: ['Mint', 'Lavender', 'Coriander'],
      heart: ['Jasmine', 'Neroli', 'Geranium'],
      base: ['Musk', 'Sandalwood', 'Amber']
    },
    description: 'The marine revolution that spawned countless aquatics. Cool Water introduced the fresh, oceanic accord that dominated 90s masculinity, combining synthetic sea notes with classic aromatics to create an entirely new fragrance category that remains popular today.'
  }
]

export function ClassicFlipCards() {
  const [flipped, setFlipped] = useState<number | null>(null)

  const handleCardClick = (index: number) => {
    setFlipped(flipped === index ? null : index)
  }

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {flipped !== null && `Now showing details for ${classics[flipped].name}`}
      </div>
      <div className="my-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {classics.map((fragrance, index) => (
        <div
          key={fragrance.name}
          className="scroll-reveal h-96 perspective cursor-pointer"
          onClick={() => handleCardClick(index)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleCardClick(index)
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`${fragrance.name} card. ${flipped === index ? 'Showing details' : 'Click to flip'}`}
          style={{ perspective: '1000px' }}
        >
          <div
            className={cn(
              'relative w-full h-full transition-transform duration-600',
              'transform-style-3d',
              flipped === index && 'rotate-y-180'
            )}
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped === index ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front of Card */}
            <div
              className={cn(
                'absolute inset-0 rounded-lg border border-gold/30 bg-surface',
                'flex flex-col items-center justify-center p-6',
                'backface-hidden overflow-hidden group',
                'hover:border-gold/50 transition-all duration-300'
              )}
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Shimmer Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent shimmer-animation" />
              </div>

              {/* CLASSIC Badge */}
              <div className="absolute top-4 right-4 px-2.5 py-1 bg-gold/10 border border-gold/40 rounded">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                  Classic
                </span>
              </div>

              {/* Bottle Illustration - Monochrome */}
              <div className="flex-1 flex items-center justify-center mb-4">
                <div className="relative w-20 h-32">
                  {/* Simple bottle shape */}
                  <svg
                    viewBox="0 0 100 160"
                    className="w-full h-full text-cream/80 filter drop-shadow-lg"
                    fill="currentColor"
                  >
                    {/* Bottle cap */}
                    <rect x="35" y="5" width="30" height="15" rx="2" />
                    {/* Bottle neck */}
                    <rect x="38" y="20" width="24" height="25" />
                    {/* Bottle body */}
                    <path d="M 25 45 L 25 140 Q 25 150 35 150 L 65 150 Q 75 150 75 140 L 75 45 Z" />
                    {/* Decorative elements */}
                    <line x1="30" y1="60" x2="70" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                    <line x1="30" y1="130" x2="70" y2="130" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                  </svg>
                  {/* Subtle glow */}
                  <div className="absolute inset-0 bg-gold/5 blur-xl rounded-full" />
                </div>
              </div>

              {/* Name and Year */}
              <div className="text-center">
                <h3 className="font-serif text-xl text-cream leading-tight mb-1">
                  {fragrance.name}
                </h3>
                <div className="text-gold text-sm font-medium">
                  {fragrance.year}
                </div>
              </div>

              {/* Tap to flip hint */}
              <div className="mt-4 text-[10px] uppercase tracking-widest text-cream-muted/40">
                Click to explore
              </div>
            </div>

            {/* Back of Card */}
            <div
              className={cn(
                'absolute inset-0 rounded-lg border border-gold/30 bg-surface-elevated',
                'p-6 backface-hidden overflow-auto'
              )}
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              {/* Header */}
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-gold/60 mb-1">
                  Est. {fragrance.year}
                </div>
                <h3 className="font-serif text-lg text-cream leading-tight mb-1">
                  {fragrance.name}
                </h3>
                <div className="text-xs text-cream-muted italic">
                  {fragrance.subtitle}
                </div>
              </div>

              {/* Note Breakdown */}
              <div className="mb-4 space-y-2.5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gold/80 font-medium mb-1">
                    Top Notes
                  </div>
                  <div className="text-xs text-cream-muted leading-relaxed">
                    {fragrance.notes.top.join(' • ')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gold/80 font-medium mb-1">
                    Heart Notes
                  </div>
                  <div className="text-xs text-cream-muted leading-relaxed">
                    {fragrance.notes.heart.join(' • ')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gold/80 font-medium mb-1">
                    Base Notes
                  </div>
                  <div className="text-xs text-cream-muted leading-relaxed">
                    {fragrance.notes.base.join(' • ')}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-3 border-t border-gold/10">
                <p className="text-xs text-cream-muted/90 leading-relaxed">
                  {fragrance.description}
                </p>
              </div>

              {/* Back hint */}
              <div className="mt-4 text-center text-[10px] uppercase tracking-widest text-cream-muted/40">
                Click to return
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx global>{`
        @keyframes shimmer-slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .shimmer-animation {
          animation: shimmer-slide 2s ease-in-out infinite;
        }
      `}</style>
      </div>
    </>
  )
}
