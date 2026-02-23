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
  },
  {
    name: 'Acqua di Giò EDT',
    year: 1996,
    subtitle: 'The Aquatic Bestseller',
    notes: {
      top: ['Bergamot', 'Neroli', 'Green Tangerine'],
      heart: ['Jasmine', 'Calone', 'Persimmon'],
      base: ['Cedar', 'Patchouli', 'Musk']
    },
    description: 'The world\'s best-selling men\'s fragrance for decades. Its jasmine-calone marine freshness set the blueprint for an entire generation of summer colognes, making it the definitive entry point for men exploring fragrance for the first time.'
  },
  {
    name: 'Drakkar Noir',
    year: 1982,
    subtitle: 'The Fougère Icon',
    notes: {
      top: ['Bergamot', 'Lavender', 'Artemisia'],
      heart: ['Geranium', 'Juniper', 'Rosewood'],
      base: ['Amber', 'Oakmoss', 'Leather']
    },
    description: 'The defining fougère of the 1980s. Its spicy-lavender swagger dominated an era and still smells powerfully distinct — a cultural artifact that captures the unapologetic masculinity of its decade and remains essential fragrance history.'
  },
  {
    name: 'Dior Fahrenheit',
    year: 1988,
    subtitle: 'The Petrol Paradox',
    notes: {
      top: ['Violet', 'Mandarin', 'Hawthorn'],
      heart: ['Leather', 'Nutmeg', 'Jasmine'],
      base: ['Vetiver', 'Sandalwood', 'Musk']
    },
    description: 'One of the most distinctive and divisive masculines ever made. Fahrenheit\'s unique petrol-violet-leather composition divides opinion but commands respect — a singular achievement that perfumers still study as an example of daring creative vision.'
  },
  {
    name: 'Givenchy Gentleman',
    year: 1974,
    subtitle: 'The Patchouli Standard',
    notes: {
      top: ['Bergamot', 'Honey', 'Iris'],
      heart: ['Rose', 'Jasmine', 'Leather'],
      base: ['Patchouli', 'Vetiver', 'Oakmoss']
    },
    description: 'The original 1974 formula stands as one of perfumery\'s great patchouli studies — iris and rose over a deep, dirty patchouli base. A masterwork of balance that defined tailored masculine elegance and influenced every leather-floral that followed.'
  },
  {
    name: 'Paco Rabanne Pour Homme',
    year: 1973,
    subtitle: 'The Fougère Archetype',
    notes: {
      top: ['Rosemary', 'Basil', 'Bergamot'],
      heart: ['Oakmoss', 'Geranium', 'Clary Sage'],
      base: ['Vetiver', 'Labdanum', 'Tonka Bean']
    },
    description: 'One of the foundational aromatic fougères alongside Azzaro Pour Homme. Herbal, mossy, and unmistakably masculine — this 1973 classic is studied by perfumers as a benchmark of the genre and loved by those who appreciate fragrance history.'
  },
  {
    name: 'Jean Paul Gaultier Le Male',
    year: 1995,
    subtitle: 'The Lavender-Vanilla Icon',
    notes: {
      top: ['Mint', 'Lavender', 'Bergamot'],
      heart: ['Cumin', 'Cinnamon', 'Orange Blossom'],
      base: ['Vanilla', 'Sandalwood', 'Amber']
    },
    description: 'The 1995 icon that defined a generation. Lavender-vanilla-mint in a sailor torso bottle — seductive, approachable, and endlessly imitated. Le Male sits at the intersection of fashion and fragrance and remains one of the most influential masculines ever created.'
  },
  {
    name: 'Terre d\'Hermès EDT',
    year: 2006,
    subtitle: 'Earth & Mineral Mastery',
    notes: {
      top: ['Grapefruit', 'Orange', 'Flint'],
      heart: ['Pepper', 'Geranium', 'Pelargonium'],
      base: ['Vetiver', 'Benzoin', 'Cedar']
    },
    description: 'Jean-Claude Ellena\'s mineral-woody masterpiece redefined what a masculine fragrance could be. Its flint-and-pepper mineral quality over warm cedar and vetiver created a new genre of earthy elegance that continues to influence contemporary perfumery.'
  },
  {
    name: 'Terre d\'Hermès Parfum',
    year: 2009,
    subtitle: 'The Deeper Earth',
    notes: {
      top: ['Grapefruit', 'Pepper', 'Flint'],
      heart: ['Vetiver', 'Geranium', 'Iso E Super'],
      base: ['Sandalwood', 'Cedar', 'Patchouli']
    },
    description: 'The Parfum concentration deepens the Terre experience with a denser, more resinous character. The mineral flint sharpness softens into a richer sandalwood and patchouli base — a more intimate, skin-close interpretation of one of perfumery\'s great modern classics.'
  },
  {
    name: 'Bleu de Chanel EDP',
    year: 2010,
    subtitle: 'Polished Modern Luxury',
    notes: {
      top: ['Citrus', 'Grapefruit', 'Mint'],
      heart: ['Ginger', 'Jasmine', 'Nutmeg'],
      base: ['Cedar', 'Sandalwood', 'Amber']
    },
    description: 'Chanel\'s most successful masculine launch in decades. Bleu EDP takes the fresh citrus-woody structure of the EDT and deepens it with a richer woody-amber base, striking the ideal balance between approachability and sophistication for the modern man.'
  },
  {
    name: 'Bleu de Chanel Parfum',
    year: 2018,
    subtitle: 'The Sandalwood Summit',
    notes: {
      top: ['Citrus', 'Labdanum', 'Mint'],
      heart: ['Cedar', 'Labdanum', 'Geranium'],
      base: ['Sandalwood', 'Amber', 'Tonka Bean']
    },
    description: 'The Parfum lifts Bleu into genuine luxury territory. Labdanum and sandalwood dominate, stripping away the familiar brightness and replacing it with an enveloping woody depth — the finest and most complex expression in the Bleu de Chanel lineage.'
  },
  {
    name: 'Creed Green Irish Tweed',
    year: 1985,
    subtitle: 'The Aquatic Ancestor',
    notes: {
      top: ['Lemon Verbena', 'Iris', 'Violet Leaves'],
      heart: ['Dianthus', 'Sandalwood'],
      base: ['Ambergris', 'Oakmoss', 'Vetiver']
    },
    description: 'The grandfather of aquatic masculines, predating Cool Water by three years. Green Irish Tweed\'s violet-verbena freshness over mossy warmth defined what a refined, aristocratic outdoor fragrance should smell like and inspired an entire genre.'
  },
  {
    name: 'Creed Aventus',
    year: 2010,
    subtitle: 'The Niche Benchmark',
    notes: {
      top: ['Pineapple', 'Bergamot', 'Apple'],
      heart: ['Birch', 'Patchouli', 'Jasmine'],
      base: ['Oakmoss', 'Ambergris', 'Vanilla']
    },
    description: 'The fragrance that put niche perfumery on the mainstream map. Aventus\'s smoky pineapple-birch opening over oakmoss and ambergris created a phenomenon — arguably the most discussed and imitated masculine of the 21st century.'
  },
  {
    name: 'Tom Ford Oud Wood',
    year: 2007,
    subtitle: 'Oud Made Accessible',
    notes: {
      top: ['Oud', 'Rosewood', 'Cardamom'],
      heart: ['Sandalwood', 'Vetiver', 'Tonka Bean'],
      base: ['Amber', 'Musk', 'Vanilla']
    },
    description: 'The fragrance that introduced oud to Western mainstream audiences. Oud Wood\'s genius was making the challenging Middle Eastern ingredient approachable — soft, warm, and woody rather than medicinal — opening the door for an entire generation of oud masculines.'
  },
  {
    name: 'Baccarat Rouge 540',
    year: 2015,
    subtitle: 'The New Classic',
    notes: {
      top: ['Saffron', 'Jasmine'],
      heart: ['Amberwood', 'Ambergris'],
      base: ['Fir Resin', 'Cedar']
    },
    description: 'Maison Francis Kurkdjian\'s crystalline amber-woody-floral became a cultural phenomenon almost overnight. BR540\'s distinctive warm-metallic character — simultaneously gourmand and mineral — made it the most recognisable and copied fragrance of the 2010s decade.'
  },
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
