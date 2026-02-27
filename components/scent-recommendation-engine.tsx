'use client'

import { useState, useMemo, Fragment, useCallback, type ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Sparkles, BookMarked, Heart, Star } from 'lucide-react'
import type { Fragrance } from '@/lib/fragrances/types'
import { fragrances } from '@/lib/fragrances/data'
import { occasions, seasons, scentFamilies, budgetRanges } from '@/lib/fragrances/filters'
import { getSimilarFragrances } from '@/lib/fragrances/similarity'
import { useCollection } from '@/lib/collection-context'

export function ScentRecommendationEngine() {
  const collection = useCollection()
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

  const toggleShortlist = (id: string) => {
    setShortlist((prev: string[]) => {
      if (prev.includes(id)) return prev.filter((s: string) => s !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

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

    if (sortBy === 'price-asc') return [...results].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') return [...results].sort((a, b) => b.price - a.price)
    return [...results].sort((a, b) => b.intensity - a.intensity)
  }, [selectedOccasion, selectedSeasons, selectedFamilies, familyMode, selectedBudgets, selectedIntensities, sortBy, searchQuery])

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
  }

  const hasActiveFilters = selectedOccasion || selectedSeasons.length > 0 || selectedFamilies.length > 0 || selectedBudgets.length > 0 || selectedIntensities.length > 0 || searchQuery.length > 0

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

          <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
            <h4 className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
              {hasActiveFilters ? 'Filtered Results' : 'All Fragrances'}
            </h4>
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

// Projection rating visualizer with gold icons
function ProjectionRating({ rating }: { rating: number }) {
  const getProjectionLabel = (rating: number) => {
    if (rating === 1) return 'Low'
    if (rating === 2) return 'Moderate'
    if (rating === 3) return 'Good'
    if (rating === 4) return 'Strong'
    return 'Very Strong'
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={cn(
              'h-3 w-3 transition-all duration-300',
              star <= rating ? 'text-gold fill-gold' : 'text-gold/20 fill-none'
            )}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
        ))}
      </div>
      <span className="text-[10px] uppercase tracking-wider text-gold/70 font-medium">
        {getProjectionLabel(rating)}
      </span>
    </div>
  )
}

/* ─── Bottle Image Banner ─── */

function ImageBanner({
  imageUrl,
  name,
  house,
}: {
  imageUrl: string
  name: string
  house: string
}) {
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

function FragranceCard({
  fragrance,
  isShortlisted,
  canShortlist,
  allFragrances,
  onToggleShortlist,
  onNoteClick,
  onSimilarClick,
  inCabinet,
  inWishlist,
  userRating,
  onToggleCabinet,
  onToggleWishlist,
  onSetRating,
  onRemoveRating,
}: {
  key?: React.Key
  fragrance: Fragrance
  isShortlisted: boolean
  canShortlist: boolean
  allFragrances: Fragrance[]
  onToggleShortlist: () => void
  onNoteClick: (note: string) => void
  onSimilarClick: (id: string) => void
  inCabinet: boolean
  inWishlist: boolean
  userRating?: number
  onToggleCabinet: () => void
  onToggleWishlist: () => void
  onSetRating: (score: number) => void
  onRemoveRating: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

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
      {/* Bottle image banner — renders when imageUrl present; falls back to nothing on error */}
      {fragrance.imageUrl && (
        <ImageBanner
          imageUrl={fragrance.imageUrl}
          name={fragrance.name}
          house={fragrance.house}
        />
      )}
      <div className="w-full text-left p-5">
        {/* Header */}
        <div className="mb-3">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h5 className="font-serif text-lg leading-tight text-cream">{fragrance.name}</h5>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-sm font-medium text-gold whitespace-nowrap">${fragrance.price}</span>

              {/* Cabinet button */}
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

              {/* Wishlist button */}
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

              {/* Shortlist / compare button */}
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

              {/* Expand chevron */}
              <div className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border transition-all',
                isExpanded
                  ? 'border-gold bg-gold/20 rotate-180'
                  : 'border-gold/30 bg-gold/5'
              )}>
                <svg
                  className={cn('h-3 w-3', isExpanded ? 'text-gold' : 'text-cream-muted')}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="text-sm text-gold-light">{fragrance.house}</div>
        </div>

        {/* Families */}
        <div className="mb-3 flex flex-wrap gap-2">
          {fragrance.family.map((fam) => (
            <span
              key={fam}
              className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs text-gold-light"
            >
              {fam}
            </span>
          ))}
        </div>

        {/* Quick Stats */}
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

        {/* Expanded Content */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-500',
            isExpanded ? 'mt-4 max-h-[900px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="space-y-3 border-t border-gold/20 pt-4">
            {/* Rationale */}
            <p className="text-sm leading-relaxed text-cream-muted italic">
              {fragrance.rationale}
            </p>

            {/* Notes */}
            <div className="space-y-2">
              {([
                { label: 'Top Notes', notes: fragrance.topNotes },
                { label: 'Heart Notes', notes: fragrance.heartNotes },
                { label: 'Base Notes', notes: fragrance.baseNotes },
              ] as { label: string; notes: string[] }[]).map(({ label, notes }) => (
                <div key={label}>
                  <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-gold/80">
                    {label}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {notes.map(note => (
                      <button
                        key={note}
                        onClick={(e) => { e.stopPropagation(); onNoteClick(note) }}
                        className="rounded-full border border-gold/20 bg-surface px-2.5 py-0.5 text-xs text-cream-muted transition-all duration-200 hover:border-gold/60 hover:bg-gold/10 hover:text-gold cursor-pointer"
                        title={`Filter by ${note}`}
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Intensity Bar */}
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

            {/* Personal Rating */}
            <div className="border-t border-gold/10 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-gold/80">My Rating</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={(e) => {
                        e.stopPropagation()
                        userRating === star ? onRemoveRating() : onSetRating(star)
                      }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform duration-100 hover:scale-110"
                      title={userRating === star ? 'Remove rating' : `Rate ${star}/5`}
                    >
                      <Star
                        className={cn(
                          'h-4 w-4 transition-colors duration-150',
                          (hoverRating || userRating || 0) >= star
                            ? 'text-gold fill-gold'
                            : 'text-gold/20'
                        )}
                      />
                    </button>
                  ))}
                  {userRating && (
                    <span className="ml-1 text-[10px] text-cream-muted/50">{userRating}/5</span>
                  )}
                </div>
              </div>
            </div>

            {/* You Might Also Like */}
            {(() => {
              const similar = getSimilarFragrances(fragrance, allFragrances)
              if (similar.length === 0) return null
              return (
                <div className="border-t border-gold/10 pt-3">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wider text-gold/80">
                    You Might Also Like
                  </div>
                  <div className="flex flex-col gap-2">
                    {similar.map(s => (
                      <button
                        key={s.id}
                        onClick={(e) => { e.stopPropagation(); onSimilarClick(s.id) }}
                        className="flex items-center justify-between rounded-lg border border-gold/15 bg-surface px-3 py-2 text-left transition-all duration-200 hover:border-gold/40 hover:bg-gold/5 group"
                      >
                        <div>
                          <div className="text-xs font-medium text-cream group-hover:text-gold-light transition-colors">
                            {s.name}
                          </div>
                          <div className="text-[10px] text-cream-muted/50 uppercase tracking-wider mt-0.5">
                            {s.house}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="text-xs text-gold/60">${s.price}</span>
                          <div className="flex gap-0.5">
                            {s.family.map(fam => (
                              <span
                                key={fam}
                                className="rounded-full border border-gold/20 bg-gold/8 px-1.5 py-0.5 text-[9px] text-gold-light"
                              >
                                {fam}
                              </span>
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
