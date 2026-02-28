'use client'

import { useState, useMemo, Fragment, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import type { Fragrance } from '@/lib/fragrances/types'
import { fragrances } from '@/lib/fragrances/data'
import { occasions, seasons, scentFamilies, budgetRanges } from '@/lib/fragrances/filters'
import { useCollection } from '@/lib/collection-context'
import { useAuth } from '@clerk/nextjs'
import { FragranceCard } from '@/components/fragrance-card'
import { buildTasteProfile, blendScore } from '@/lib/fragrances/taste-profile'
import { BookMarked } from 'lucide-react'

export function ScentRecommendationEngine() {
  const collection = useCollection()
  const { isSignedIn } = useAuth()
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null)
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([])
  const [familyMode, setFamilyMode] = useState<'any' | 'all'>('any')
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([])
  const [selectedIntensities, setSelectedIntensities] = useState<number[]>([])
  const [sortBy, setSortBy] = useState<'intensity' | 'price-asc' | 'price-desc'>('intensity')
  const [searchQuery, setSearchQuery] = useState('')
  const [shortlist, setShortlist] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cabinetFilter, setCabinetFilter] = useState(false)

  const toggleShortlist = (id: string) => {
    setShortlist((prev: string[]) => {
      if (prev.includes(id)) return prev.filter((s: string) => s !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  // Build taste profile from current ratings
  const tasteProfile = useMemo(() => {
    const ratings = Array.from(collection.ratings.entries()).map(([fragranceId, score]) => ({ fragranceId, score }))
    if (ratings.length === 0) return null
    return buildTasteProfile(ratings, fragrances)
  }, [collection.ratings])

  const filteredFragrances = useMemo(() => {
    let results = fragrances

    if (selectedOccasion) {
      results = results.filter(f => f.occasion.includes(selectedOccasion))
    }

    if (selectedSeasons.length > 0) {
      results = results.filter(f => 
        f.season.some(s => selectedSeasons.includes(s))
      )
    }

    if (selectedFamilies.length > 0) {
      results = results.filter(f =>
        familyMode === 'all'
          ? selectedFamilies.every(fam => f.family.includes(fam))
          : f.family.some(fam => selectedFamilies.includes(fam))
      )
    }

    if (selectedBudgets.length > 0) {
      results = results.filter(f =>
        selectedBudgets.some(budgetId => {
          const range = budgetRanges.find(b => b.id === budgetId)
          return range ? f.price >= range.min && f.price < range.max : false
        })
      )
    }

    if (selectedIntensities.length > 0) {
      results = results.filter(f => selectedIntensities.includes(f.intensity))
    }

    if (searchQuery.trim()) {
      const terms = searchQuery.toLowerCase().trim().split(/[\s,]+/).filter(Boolean)
      results = results.filter(f => {
        const searchable = [
          f.name, f.house,
          ...f.topNotes, ...f.heartNotes, ...f.baseNotes
        ].map(s => s.toLowerCase())
        return terms.every(term => searchable.some(s => new RegExp(`(?<![a-z])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z])`, 'i').test(s)))
      })
    }

    // Cabinet filter
    if (cabinetFilter) {
      results = results.filter(f => collection.cabinet.has(f.id))
    }

    // Personalised ranking — blend personal score with default sort
    if (tasteProfile && tasteProfile.confidenceWeight > 0) {
      if (sortBy === 'price-asc') return [...results].sort((a, b) => a.price - b.price)
      if (sortBy === 'price-desc') return [...results].sort((a, b) => b.price - a.price)
      return [...results].sort((a, b) => {
        const aPersonal = blendScore(tasteProfile.scoreFragrance(a), tasteProfile.confidenceWeight)
        const bPersonal = blendScore(tasteProfile.scoreFragrance(b), tasteProfile.confidenceWeight)
        // Blend: personal score + normalised intensity as tiebreaker
        const aScore = aPersonal + (a.intensity / 5) * (1 - tasteProfile.confidenceWeight)
        const bScore = bPersonal + (b.intensity / 5) * (1 - tasteProfile.confidenceWeight)
        return bScore - aScore
      })
    }

    if (sortBy === 'price-asc') return [...results].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') return [...results].sort((a, b) => b.price - a.price)
    return [...results].sort((a, b) => b.intensity - a.intensity)
  }, [selectedOccasion, selectedSeasons, selectedFamilies, familyMode, selectedBudgets, selectedIntensities, sortBy, searchQuery, cabinetFilter, collection.cabinet, tasteProfile])

  const toggleSeason = (seasonId: string) => {
    setSelectedSeasons(prev => 
      prev.includes(seasonId) 
        ? prev.filter(s => s !== seasonId)
        : [...prev, seasonId]
    )
  }

  const toggleFamily = (familyId: string) => {
    setSelectedFamilies(prev => 
      prev.includes(familyId) 
        ? prev.filter(f => f !== familyId)
        : [...prev, familyId]
    )
  }

  const toggleBudget = (budgetId: string) => {
    setSelectedBudgets(prev =>
      prev.includes(budgetId)
        ? prev.filter(b => b !== budgetId)
        : [...prev, budgetId]
    )
  }

  const toggleIntensity = (level: number) => {
    setSelectedIntensities(prev =>
      prev.includes(level)
        ? prev.filter(i => i !== level)
        : [...prev, level]
    )
  }

  const clearAllFilters = () => {
    setSelectedOccasion(null)
    setSelectedSeasons([])
    setSelectedFamilies([])
    setFamilyMode('any')
    setSelectedBudgets([])
    setSelectedIntensities([])
    setSortBy('intensity')
    setSearchQuery('')
    setCabinetFilter(false)
  }

  const hasActiveFilters = selectedOccasion || selectedSeasons.length > 0 || selectedFamilies.length > 0 || selectedBudgets.length > 0 || selectedIntensities.length > 0 || searchQuery.length > 0 || cabinetFilter

  return (
    <div className="my-8">
      <div className="rounded-lg border border-gold/20 bg-surface overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-surface-elevated to-surface-hover px-6 py-5 border-b border-gold/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl text-cream">Find Your Perfect Scent</h3>
              <p className="text-sm text-cream-muted">
                Select your preferences to discover personalized recommendations
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-medium uppercase tracking-[0.12em] text-cream-muted hover:text-gold border border-gold/20 hover:border-gold/50 rounded-lg px-3 py-2 transition-all duration-200"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 space-y-6">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream-muted/40 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by brand, name, or note — e.g. iris vetiver, Dior oud…"
              className="w-full rounded-lg border border-gold/20 bg-surface-elevated/50 pl-9 pr-9 py-3 text-sm text-cream placeholder:text-cream-muted/40 focus:outline-none focus:border-gold/50 focus:bg-surface-elevated transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-muted/40 hover:text-cream-muted transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {/* Occasion Selection */}
          <div>
            <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-gold">
              Occasion
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {occasions.map(({ id, label, icon: Icon, description }) => (
                <button
                  key={id}
                  onClick={() => setSelectedOccasion(selectedOccasion === id ? null : id)}
                  className={cn(
                    'group relative flex flex-col items-center gap-2 rounded-lg border px-4 py-4 transition-all duration-300',
                    'hover:border-gold/50 hover:bg-surface-elevated hover:scale-105',
                    selectedOccasion === id
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                      : 'border-gold/20 bg-surface-elevated/50'
                  )}
                  style={{ cursor: 'pointer' }}
                >
                  <Icon
                    className={cn(
                      'h-6 w-6 transition-colors',
                      selectedOccasion === id ? 'text-gold' : 'text-cream-muted'
                    )}
                  />
                  <span className={cn(
                    'text-sm font-medium transition-colors',
                    selectedOccasion === id ? 'text-cream' : 'text-cream-muted'
                  )}>
                    {label}
                  </span>
                  <span className="text-xs text-cream-muted/70">{description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Season Selection */}
          <div>
            <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-gold">
              Season <span className="text-cream-muted/60 normal-case">(multi-select)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {seasons.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => toggleSeason(id)}
                  className={cn(
                    'group flex items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-all duration-300',
                    'hover:border-gold/50 hover:bg-surface-elevated hover:scale-105',
                    selectedSeasons.includes(id)
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                      : 'border-gold/20 bg-surface-elevated/50'
                  )}
                  style={{ cursor: 'pointer' }}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-colors',
                      selectedSeasons.includes(id) ? 'text-gold' : 'text-cream-muted'
                    )}
                  />
                  <span className={cn(
                    'text-sm font-medium transition-colors',
                    selectedSeasons.includes(id) ? 'text-cream' : 'text-cream-muted'
                  )}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Scent Family Selection */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                Preferred Scent Family <span className="text-cream-muted/60 normal-case">(multi-select)</span>
              </label>
              {selectedFamilies.length > 1 && (
                <div className="flex items-center gap-1 rounded-lg border border-gold/20 bg-surface p-0.5 text-xs">
                  <button
                    onClick={() => setFamilyMode('any')}
                    className={cn(
                      'rounded px-2 py-1 transition-all duration-200 font-medium',
                      familyMode === 'any' ? 'bg-gold/20 text-gold' : 'text-cream-muted hover:text-cream'
                    )}
                  >
                    Match any
                  </button>
                  <button
                    onClick={() => setFamilyMode('all')}
                    className={cn(
                      'rounded px-2 py-1 transition-all duration-200 font-medium',
                      familyMode === 'all' ? 'bg-gold/20 text-gold' : 'text-cream-muted hover:text-cream'
                    )}
                  >
                    Match all
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {scentFamilies.map(({ id, label, description }) => (
                <button
                  key={id}
                  onClick={() => toggleFamily(id)}
                  className={cn(
                    'group flex flex-col items-start gap-1 rounded-lg border px-4 py-3 transition-all duration-300 text-left',
                    'hover:border-gold/50 hover:bg-surface-elevated hover:scale-105',
                    selectedFamilies.includes(id)
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                      : 'border-gold/20 bg-surface-elevated/50'
                  )}
                  style={{ cursor: 'pointer' }}
                >
                  <span className={cn(
                    'text-sm font-medium transition-colors',
                    selectedFamilies.includes(id) ? 'text-cream' : 'text-cream-muted'
                  )}>
                    {label}
                  </span>
                  <span className="text-xs text-cream-muted/70 leading-tight">{description}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Budget Selection */}
          <div>
            <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-gold">
              Budget <span className="text-cream-muted/60 normal-case">(multi-select)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {budgetRanges.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => toggleBudget(id)}
                  className={cn(
                    'group flex items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-all duration-300',
                    'hover:border-gold/50 hover:bg-surface-elevated hover:scale-105',
                    selectedBudgets.includes(id)
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                      : 'border-gold/20 bg-surface-elevated/50'
                  )}
                  style={{ cursor: 'pointer' }}
                >
                  <span className={cn(
                    'text-sm font-medium transition-colors',
                    selectedBudgets.includes(id) ? 'text-cream' : 'text-cream-muted'
                  )}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Selection */}
          <div>
            <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-gold">
              Intensity <span className="text-cream-muted/60 normal-case">(multi-select)</span>
            </label>
            <div className="grid grid-cols-5 gap-3">
              {[
                { level: 1, label: 'Very Light' },
                { level: 2, label: 'Light' },
                { level: 3, label: 'Moderate' },
                { level: 4, label: 'Strong' },
                { level: 5, label: 'Very Strong' },
              ].map(({ level, label }) => (
                <button
                  key={level}
                  onClick={() => toggleIntensity(level)}
                  className={cn(
                    'group flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 transition-all duration-300',
                    'hover:border-gold/50 hover:bg-surface-elevated hover:scale-105',
                    selectedIntensities.includes(level)
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                      : 'border-gold/20 bg-surface-elevated/50'
                  )}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <div
                        key={i}
                        className={cn(
                          'h-1.5 w-1.5 rounded-full transition-colors',
                          i <= level
                            ? selectedIntensities.includes(level) ? 'bg-gold' : 'bg-cream-muted/50'
                            : 'bg-cream-muted/15'
                        )}
                      />
                    ))}
                  </div>
                  <span className={cn(
                    'text-[10px] font-medium text-center leading-tight transition-colors',
                    selectedIntensities.includes(level) ? 'text-cream' : 'text-cream-muted/70'
                  )}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gold/20 bg-surface-elevated/30 px-6 py-6">

          {/* Active filter pills */}
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {selectedOccasion && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 pl-3 pr-1.5 py-1 text-xs font-medium text-gold">
                  {occasions.find(o => o.id === selectedOccasion)?.label}
                  <button onClick={() => setSelectedOccasion(null)} className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-gold/20 transition-colors" aria-label="Remove occasion filter">
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              )}
              {selectedSeasons.map(s => (
                <span key={s} className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 pl-3 pr-1.5 py-1 text-xs font-medium text-gold">
                  {seasons.find(x => x.id === s)?.label}
                  <button onClick={() => toggleSeason(s)} className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-gold/20 transition-colors" aria-label={`Remove ${s} filter`}>
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
              {selectedFamilies.map(f => (
                <span key={f} className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 pl-3 pr-1.5 py-1 text-xs font-medium text-gold">
                  {scentFamilies.find(x => x.id === f)?.label}
                  <button onClick={() => toggleFamily(f)} className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-gold/20 transition-colors" aria-label={`Remove ${f} filter`}>
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
              {selectedBudgets.map(b => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 pl-3 pr-1.5 py-1 text-xs font-medium text-gold">
                  {budgetRanges.find(x => x.id === b)?.label}
                  <button onClick={() => toggleBudget(b)} className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-gold/20 transition-colors" aria-label={`Remove ${b} filter`}>
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
              {selectedIntensities.map(i => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 pl-3 pr-1.5 py-1 text-xs font-medium text-gold">
                  Intensity {i}
                  <button onClick={() => toggleIntensity(i)} className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-gold/20 transition-colors" aria-label={`Remove intensity ${i} filter`}>
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 pl-3 pr-1.5 py-1 text-xs font-medium text-gold">
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')} className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-gold/20 transition-colors" aria-label="Clear search">
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Personalisation status */}
          {isSignedIn && tasteProfile && tasteProfile.ratingCount >= 3 && (
            <div className={cn(
              "mb-4 flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs transition-all duration-500",
              tasteProfile.confidenceLevel === 'high'
                ? "border-gold/40 bg-gold/8 text-gold"
                : "border-gold/20 bg-surface-elevated text-cream-muted"
            )}>
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-5.303 0l-.347-.347z" />
              </svg>
              {tasteProfile.confidenceLevel === 'medium' && tasteProfile.ratingCount < 10 && (
                <span>
                  Learning your taste — rate {tasteProfile.ratingsNeededForNext} more {tasteProfile.ratingsNeededForNext === 1 ? 'fragrance' : 'fragrances'} to improve recommendations
                </span>
              )}
              {tasteProfile.confidenceLevel === 'medium' && tasteProfile.ratingCount >= 10 && (
                <span>Personalised for you — results ranked by your taste profile</span>
              )}
              {tasteProfile.confidenceLevel === 'high' && (
                <span className="text-gold font-medium">Highly personalised — ranked to match your taste</span>
              )}
            </div>
          )}
          {isSignedIn && tasteProfile && tasteProfile.ratingCount > 0 && tasteProfile.ratingCount < 3 && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-gold/10 bg-surface-elevated px-4 py-2.5 text-xs text-cream-muted/60">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>Rate {3 - tasteProfile.ratingCount} more {3 - tasteProfile.ratingCount === 1 ? 'fragrance' : 'fragrances'} to unlock personalised recommendations</span>
              <div className="ml-auto flex gap-1">
                {[1,2,3].map(i => (
                  <div key={i} className={cn("h-1.5 w-4 rounded-full", i <= tasteProfile.ratingCount ? "bg-gold/60" : "bg-border")} />
                ))}
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
                {cabinetFilter ? 'My Cabinet' : hasActiveFilters ? 'Filtered Results' : 'All Fragrances'}
              </h4>
              {/* Cabinet filter toggle */}
              {isSignedIn && collection.cabinet.size > 0 && (
                <button
                  onClick={() => setCabinetFilter(v => !v)}
                  title={cabinetFilter ? 'Show all fragrances' : 'Show only my cabinet'}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-all duration-200',
                    cabinetFilter
                      ? 'border-gold bg-gold/15 text-gold'
                      : 'border-gold/20 text-cream-muted/60 hover:border-gold/40 hover:text-gold/80'
                  )}
                >
                  <BookMarked className="h-3 w-3" />
                  Cabinet
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg border border-gold/20 bg-surface p-0.5 text-xs">
                <button
                  onClick={() => setSortBy('intensity')}
                  className={cn(
                    'rounded px-2 py-1 transition-all duration-200 font-medium',
                    sortBy === 'intensity' ? 'bg-gold/20 text-gold' : 'text-cream-muted hover:text-cream'
                  )}
                >
                  Best match
                </button>
                <button
                  onClick={() => setSortBy('price-asc')}
                  className={cn(
                    'rounded px-2 py-1 transition-all duration-200 font-medium',
                    sortBy === 'price-asc' ? 'bg-gold/20 text-gold' : 'text-cream-muted hover:text-cream'
                  )}
                >
                  Price ↑
                </button>
                <button
                  onClick={() => setSortBy('price-desc')}
                  className={cn(
                    'rounded px-2 py-1 transition-all duration-200 font-medium',
                    sortBy === 'price-desc' ? 'bg-gold/20 text-gold' : 'text-cream-muted hover:text-cream'
                  )}
                >
                  Price ↓
                </button>
              </div>
              <div className="text-sm text-cream-muted">
                {filteredFragrances.length} {filteredFragrances.length === 1 ? 'match' : 'matches'}
              </div>
            </div>
          </div>

          {filteredFragrances.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gold/20 bg-surface/50 px-6 py-12 text-center">
              <p className="text-cream-muted">
                No fragrances match your current selection. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFragrances.map((fragrance) => (
                <FragranceCard
                  key={fragrance.id}
                  fragrance={fragrance}
                  isShortlisted={shortlist.includes(fragrance.id)}
                  canShortlist={shortlist.length < 3 || shortlist.includes(fragrance.id)}
                  onToggleShortlist={() => toggleShortlist(fragrance.id)}
                  inCabinet={collection.cabinet.has(fragrance.id)}
                  inWishlist={collection.wishlist.has(fragrance.id)}
                  userRating={collection.ratings.get(fragrance.id)}
                  onToggleCabinet={() => collection.toggleCabinet(fragrance.id)}
                  onToggleWishlist={() => collection.toggleWishlist(fragrance.id)}
                  onSetRating={(score) => collection.setRating(fragrance.id, score)}
                  onRemoveRating={() => collection.removeRating(fragrance.id)}
                  onNoteClick={(note) => {
                    const terms = searchQuery.trim().split(/[\s,]+/).filter(Boolean)
                    if (!terms.map(t => t.toLowerCase()).includes(note.toLowerCase())) {
                      setSearchQuery(prev => prev.trim() ? `${prev.trim()} ${note}` : note)
                    }
                  }}
                  allFragrances={fragrances}
                  onSimilarClick={(id) => {
                    setSearchQuery('')
                    clearAllFilters()
                    setTimeout(() => {
                      const el = document.getElementById(`fragrance-card-${id}`)
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        el.click()
                      }
                    }, 150)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Compare Button */}
      {shortlist.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <button
            onClick={() => setDrawerOpen(v => !v)}
            className="flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-surface shadow-lg shadow-gold/30 transition-all duration-200 hover:bg-gold-light hover:shadow-xl hover:shadow-gold/40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 0-2 2h-2a2 2 0 0 0-2-2z" />
            </svg>
            Compare {shortlist.length}
          </button>
        </div>
      )}

      {/* Comparison Drawer */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[9998] transition-transform duration-500',
          drawerOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="border-t border-gold/20 bg-[#0D0D12]/97 shadow-2xl backdrop-blur-xl">

          {/* Drag handle / close */}
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex w-full items-center justify-center py-3 hover:opacity-70 transition-opacity"
            aria-label="Close comparison"
          >
            <div className="h-1 w-10 rounded-full bg-gold/25" />
          </button>

          <div className="mx-auto max-w-[1100px] px-4 pb-6 sm:px-6 lg:px-8">

            {/* Header row */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
                Side-by-Side Comparison
              </span>
              <button
                onClick={() => { setShortlist([]); setDrawerOpen(false) }}
                className="rounded border border-white/10 px-3 py-1 text-xs text-cream-muted transition-colors hover:border-gold/30 hover:text-cream"
              >
                Clear All
              </button>
            </div>

            {/* True row-aligned grid — label + all fragrance values in same grid row */}
            {(() => {
              const cols = shortlist.length
              const fragrancesInList = shortlist.map(id => fragrances.find(fr => fr.id === id)!)

              const rows: { label: string; render: (f: typeof fragrancesInList[0]) => ReactNode }[] = [
                { label: 'Family',      render: f => f.family.join(', ') },
                { label: 'Longevity',   render: f => f.longevity },
                { label: 'Sillage',     render: f => f.sillage },
                { label: 'Intensity',   render: f => (
                  <div>
                    <div className="mb-1 text-xs text-cream-muted">{f.intensity}/5</div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-surface">
                      <div className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold" style={{ width: `${(f.intensity / 5) * 100}%` }} />
                    </div>
                  </div>
                )},
                { label: 'Projection',  render: f => (
                  <div>
                    <div className="mb-1 text-xs text-cream-muted">{f.projection}/5</div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-surface">
                      <div className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold" style={{ width: `${(f.projection / 5) * 100}%` }} />
                    </div>
                  </div>
                )},
                { label: 'Top Notes',   render: f => <span className="leading-relaxed">{f.topNotes.join(', ')}</span> },
                { label: 'Heart Notes', render: f => <span className="leading-relaxed">{f.heartNotes.join(', ')}</span> },
                { label: 'Base Notes',  render: f => <span className="leading-relaxed">{f.baseNotes.join(', ')}</span> },
              ]

              return (
                <div
                  className="grid gap-x-3"
                  style={{ gridTemplateColumns: `110px repeat(${cols}, 1fr)` }}
                >
                  {/* Header row: empty label cell + one card header per fragrance */}
                  <div /> {/* spacer */}
                  {fragrancesInList.map(f => (
                    <div key={f.id} className="overflow-hidden rounded-t-lg border border-b-0 border-gold/20 bg-surface-elevated">
                      <div className="relative border-b border-gold/10 bg-gold/[0.04] p-3 pr-7">
                        <button
                          onClick={() => toggleShortlist(f.id)}
                          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 text-cream-muted/40 transition-colors hover:border-gold/40 hover:text-gold"
                          aria-label={`Remove ${f.name}`}
                        >
                          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="font-serif text-sm leading-snug text-cream">{f.name}</div>
                        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-gold-light">{f.house}</div>
                        <div className="mt-1 text-sm font-medium text-gold">${f.price}</div>
                      </div>
                    </div>
                  ))}

                  {/* Data rows — label cell + one value cell per fragrance, all in same grid row */}
                  {rows.map((row, ri) => {
                    const isLast = ri === rows.length - 1
                    return (
                      <Fragment key={row.label}>
                        {/* Label cell */}
                        <div className="flex items-center border-b border-white/[0.04] py-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-cream-muted/40">
                          {row.label}
                        </div>
                        {/* Value cells */}
                        {fragrancesInList.map((f, fi) => (
                          <div
                            key={f.id}
                            className={cn(
                              'border-x border-b border-white/[0.04] bg-surface-elevated px-3 py-2.5 text-xs text-cream-muted',
                              fi === 0 && 'border-l-gold/20',
                              fi === cols - 1 && 'border-r-gold/20',
                              isLast && fi === 0 && 'rounded-bl-lg border-b-gold/20',
                              isLast && fi === cols - 1 && 'rounded-br-lg border-b-gold/20',
                              isLast && 'border-b-gold/20',
                            )}
                          >
                            {row.render(f)}
                          </div>
                        ))}
                      </Fragment>
                    )
                  })}
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
