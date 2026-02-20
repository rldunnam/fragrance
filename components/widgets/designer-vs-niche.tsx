'use client'

import { useState } from 'react'
import { Factory, Store, Sparkles, DollarSign, Package, Users, Palette, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type ComparisonCategory = 'price' | 'availability' | 'scent' | 'production'

interface CategoryData {
  id: ComparisonCategory
  label: string
  icon: React.ElementType
  designer: {
    value: string
    description: string
    icon: React.ElementType
  }
  niche: {
    value: string
    description: string
    icon: React.ElementType
  }
}

const categories: CategoryData[] = [
  {
    id: 'price',
    label: 'Price',
    icon: DollarSign,
    designer: {
      value: '€50-€150',
      description: 'Accessible pricing for mass market appeal',
      icon: TrendingUp,
    },
    niche: {
      value: '€100-€500+',
      description: 'Premium pricing reflecting rare ingredients and craftsmanship',
      icon: Sparkles,
    },
  },
  {
    id: 'availability',
    label: 'Availability',
    icon: Store,
    designer: {
      value: 'Widely Available',
      description: 'Department stores, pharmacies, and online retailers globally',
      icon: Store,
    },
    niche: {
      value: 'Selective Distribution',
      description: 'Specialty boutiques and authorized retailers only',
      icon: Package,
    },
  },
  {
    id: 'scent',
    label: 'Scent Profile',
    icon: Palette,
    designer: {
      value: 'Broad Appeal',
      description: 'Familiar, crowd-pleasing compositions designed for mass acceptance',
      icon: Users,
    },
    niche: {
      value: 'Artistic Expression',
      description: 'Experimental, unique blends with rare notes and bold creativity',
      icon: Sparkles,
    },
  },
  {
    id: 'production',
    label: 'Production Scale',
    icon: Factory,
    designer: {
      value: '100,000+ bottles',
      description: 'Mass production with industrial efficiency',
      icon: Factory,
    },
    niche: {
      value: '1,000-5,000 bottles',
      description: 'Small-batch artisanal production with hands-on quality control',
      icon: Package,
    },
  },
]

export function DesignerVsNiche() {
  const [activeCategory, setActiveCategory] = useState<ComparisonCategory>('price')

  const activeCategoryData = categories.find((c) => c.id === activeCategory)

  return (
    <div className="scroll-reveal my-8">
      {/* Category Toggles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                'group relative flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-300',
                'cursor-pointer hover:scale-105 hover:border-gold/50',
                activeCategory === category.id
                  ? 'border-gold bg-surface-elevated shadow-lg shadow-gold/10'
                  : 'border-border bg-surface/50 hover:bg-surface-elevated'
              )}
            >
              <Icon
                className={cn(
                  'w-6 h-6 transition-colors',
                  activeCategory === category.id
                    ? 'text-gold'
                    : 'text-cream-muted group-hover:text-gold'
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  activeCategory === category.id
                    ? 'text-gold'
                    : 'text-cream-muted group-hover:text-cream'
                )}
              >
                {category.label}
              </span>
              {activeCategory === category.id && (
                <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
              )}
            </button>
          )
        })}
      </div>

      {/* Comparison Display */}
      {activeCategoryData && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Designer Side */}
          <div
            className="group relative p-6 rounded-lg border border-border bg-gradient-to-br from-surface to-surface-elevated
              hover:border-gold/30 transition-all duration-500 overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent" />
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)`,
                color: 'rgba(212, 175, 55, 0.1)'
              }} />
            </div>

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.15em] text-gold/60 mb-1">
                    Designer
                  </div>
                  <h3 className="font-serif text-2xl text-cream">
                    {activeCategoryData.designer.value}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center
                  group-hover:bg-gold/20 transition-colors">
                  {(() => {
                    const Icon = activeCategoryData.designer.icon
                    return <Icon className="w-6 h-6 text-gold" />
                  })()}
                </div>
              </div>

              <p className="text-sm text-cream-muted leading-relaxed">
                {activeCategoryData.designer.description}
              </p>

              {/* Characteristic Pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {activeCategory === 'price' && (
                  <>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Accessible
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Mass Market
                    </span>
                  </>
                )}
                {activeCategory === 'availability' && (
                  <>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Global Reach
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Easy to Find
                    </span>
                  </>
                )}
                {activeCategory === 'scent' && (
                  <>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Crowd-Pleasing
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Safe Choices
                    </span>
                  </>
                )}
                {activeCategory === 'production' && (
                  <>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Industrial Scale
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Efficient
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Niche Side */}
          <div
            className="group relative p-6 rounded-lg border border-border bg-gradient-to-br from-surface to-surface-elevated
              hover:border-gold/30 transition-all duration-500 overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gold/20" />
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
                color: 'rgba(212, 175, 55, 0.1)'
              }} />
            </div>

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.15em] text-gold/60 mb-1">
                    Niche
                  </div>
                  <h3 className="font-serif text-2xl text-cream">
                    {activeCategoryData.niche.value}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center
                  group-hover:bg-gold/20 transition-colors">
                  {(() => {
                    const Icon = activeCategoryData.niche.icon
                    return <Icon className="w-6 h-6 text-gold" />
                  })()}
                </div>
              </div>

              <p className="text-sm text-cream-muted leading-relaxed">
                {activeCategoryData.niche.description}
              </p>

              {/* Characteristic Pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {activeCategory === 'price' && (
                  <>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Premium
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Investment Piece
                    </span>
                  </>
                )}
                {activeCategory === 'availability' && (
                  <>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Exclusive
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Hard to Find
                    </span>
                  </>
                )}
                {activeCategory === 'scent' && (
                  <>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Daring
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Unique Identity
                    </span>
                  </>
                )}
                {activeCategory === 'production' && (
                  <>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Artisanal
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gold/10 text-gold border border-gold/20">
                      Limited Edition
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Divider with Animation */}
      <div className="relative mt-8 h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold animate-pulse" />
      </div>

      {/* Additional Context */}
      <div className="mt-6 p-4 rounded-lg bg-surface-elevated/50 border border-gold/10">
        <p className="text-xs text-cream-muted/80 leading-relaxed text-center">
          <span className="text-gold font-medium">Note:</span> The designer-niche distinction
          represents a spectrum rather than a binary. Many houses blur these lines, with designer
          brands launching prestige lines and niche houses expanding distribution.
        </p>
      </div>
    </div>
  )
}
