'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'
import { BookMarked, Heart, Star, ArrowLeft, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fragrances } from '@/lib/fragrances/data'
import { useFragranceCollection } from '@/hooks/useFragranceCollection'
import { StickyNav } from '@/components/scrollytelling/sticky-nav'
import type { Fragrance } from '@/lib/fragrances/types'

type Tab = 'cabinet' | 'wishlist'

export default function CollectionPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const collection = useFragranceCollection()
  const [activeTab, setActiveTab] = useState<Tab>('cabinet')
  const [hoverRatings, setHoverRatings] = useState<Record<string, number>>({})

  const cabinetFragrances = fragrances.filter(f => collection.cabinet.has(f.id))
  const wishlistFragrances = fragrances.filter(f => collection.wishlist.has(f.id))

  const displayed = activeTab === 'cabinet' ? cabinetFragrances : wishlistFragrances
  const isEmpty = displayed.length === 0

  // Not signed in
  if (isLoaded && !isSignedIn) {
    return (
      <>
        <StickyNav />
        <main className="min-h-screen bg-background pt-24 pb-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-surface-elevated">
                <BookMarked className="h-7 w-7 text-gold/40" />
              </div>
            </div>
            <h1 className="font-serif text-3xl text-cream mb-3">Your Collection</h1>
            <p className="text-cream-muted mb-8">
              Sign in to save fragrances to your cabinet, build a wishlist, and track your ratings.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('fragrance:signin-required'))}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-6 py-2.5 text-sm font-medium text-gold hover:bg-gold/20 transition-all duration-200"
            >
              Sign in to get started
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <StickyNav />
      <main className="min-h-screen bg-background pt-16 pb-16">

        {/* Page header */}
        <div className="border-b border-gold/10 bg-[#0A0A0F]/80 backdrop-blur-md">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-8">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-cream-muted/50 hover:text-gold/70 transition-colors"
            >
              <ArrowLeft size={12} />
              Back to guide
            </Link>
            <h1 className="font-serif text-3xl text-cream">My Collection</h1>
            <p className="mt-1 text-sm text-cream-muted/60">
              Your personal fragrance library
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-8">

          {/* Tabs */}
          <div className="mb-8 flex items-center gap-1 border-b border-gold/10">
            <TabButton
              active={activeTab === 'cabinet'}
              onClick={() => setActiveTab('cabinet')}
              icon={<BookMarked size={14} />}
              label="Cabinet"
              count={cabinetFragrances.length}
            />
            <TabButton
              active={activeTab === 'wishlist'}
              onClick={() => setActiveTab('wishlist')}
              icon={<Heart size={14} />}
              label="Wishlist"
              count={wishlistFragrances.length}
            />
          </div>

          {/* Loading state */}
          {collection.loading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 rounded-lg border border-gold/10 bg-surface-elevated animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!collection.loading && isEmpty && (
            <EmptyState tab={activeTab} />
          )}

          {/* Fragrance grid */}
          {!collection.loading && !isEmpty && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayed.map(fragrance => (
                <CollectionCard
                  key={fragrance.id}
                  fragrance={fragrance}
                  inCabinet={collection.cabinet.has(fragrance.id)}
                  inWishlist={collection.wishlist.has(fragrance.id)}
                  userRating={collection.ratings.get(fragrance.id)}
                  hoverRating={hoverRatings[fragrance.id] || 0}
                  onToggleCabinet={() => collection.toggleCabinet(fragrance.id)}
                  onToggleWishlist={() => collection.toggleWishlist(fragrance.id)}
                  onSetRating={(score) => collection.setRating(fragrance.id, score)}
                  onRemoveRating={() => collection.removeRating(fragrance.id)}
                  onHoverRating={(score) => setHoverRatings(p => ({ ...p, [fragrance.id]: score }))}
                />
              ))}
            </div>
          )}

          {/* Cross-tab suggestion */}
          {!collection.loading && !isEmpty && (
            <div className="mt-12 flex items-center justify-between border-t border-gold/10 pt-6">
              <p className="text-xs text-cream-muted/40 uppercase tracking-wider">
                {activeTab === 'cabinet'
                  ? `${cabinetFragrances.length} fragrance${cabinetFragrances.length !== 1 ? 's' : ''} in your cabinet`
                  : `${wishlistFragrances.length} fragrance${wishlistFragrances.length !== 1 ? 's' : ''} on your wishlist`
                }
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-gold/60 hover:text-gold transition-colors"
              >
                <Sparkles size={12} />
                Discover more
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

/* ─── Tab Button ─── */
function TabButton({
  active, onClick, icon, label, count
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all duration-200',
        active
          ? 'border-gold text-gold'
          : 'border-transparent text-cream-muted/50 hover:text-cream-muted hover:border-gold/30'
      )}
    >
      {icon}
      {label}
      <span className={cn(
        'rounded-full px-1.5 py-px text-[10px] font-medium tabular-nums transition-colors',
        active ? 'bg-gold/20 text-gold' : 'bg-surface-elevated text-cream-muted/40'
      )}>
        {count}
      </span>
    </button>
  )
}

/* ─── Empty State ─── */
function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="py-20 text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/15 bg-surface-elevated">
          {tab === 'cabinet'
            ? <BookMarked className="h-6 w-6 text-gold/30" />
            : <Heart className="h-6 w-6 text-gold/30" />
          }
        </div>
      </div>
      <p className="text-sm font-medium text-cream-muted/60 mb-1">
        {tab === 'cabinet' ? 'Your cabinet is empty' : 'Your wishlist is empty'}
      </p>
      <p className="text-xs text-cream-muted/40 mb-6">
        {tab === 'cabinet'
          ? 'Add fragrances you own using the bookmark icon on any card'
          : 'Add fragrances you want to try using the heart icon on any card'
        }
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-5 py-2 text-xs font-medium text-gold/70 hover:border-gold/60 hover:text-gold transition-all duration-200"
      >
        <Sparkles size={12} />
        Browse fragrances
      </Link>
    </div>
  )
}

/* ─── Collection Card ─── */
function CollectionCard({
  fragrance,
  inCabinet,
  inWishlist,
  userRating,
  hoverRating,
  onToggleCabinet,
  onToggleWishlist,
  onSetRating,
  onRemoveRating,
  onHoverRating,
}: {
  fragrance: Fragrance
  inCabinet: boolean
  inWishlist: boolean
  userRating?: number
  hoverRating: number
  onToggleCabinet: () => void
  onToggleWishlist: () => void
  onSetRating: (score: number) => void
  onRemoveRating: () => void
  onHoverRating: (score: number) => void
}) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div className="group flex flex-col rounded-lg border border-gold/20 bg-gradient-to-br from-surface-elevated to-surface overflow-hidden hover:border-gold/40 transition-all duration-300">

      {/* Bottle image */}
      {fragrance.imageUrl && !imgFailed ? (
        <div className="relative flex h-32 items-center justify-center border-b border-gold/10 bg-gradient-to-b from-surface-elevated to-surface">
          <Image
            src={fragrance.imageUrl}
            alt={fragrance.name}
            width={70}
            height={100}
            className="h-24 w-auto object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
            unoptimized
            onError={() => setImgFailed(true)}
          />
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center border-b border-gold/10 bg-surface-elevated">
          <span className="text-2xl opacity-20">◈</span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex-1">
          <h3 className="font-serif text-sm leading-snug text-cream">{fragrance.name}</h3>
          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-gold-light/70">{fragrance.house}</p>
        </div>

        {/* Family tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          {fragrance.family.map(fam => (
            <span
              key={fam}
              className="rounded-full border border-gold/15 bg-gold/5 px-2 py-px text-[10px] text-gold/60"
            >
              {fam}
            </span>
          ))}
        </div>

        {/* Star rating */}
        <div className="mb-3 flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => userRating === star ? onRemoveRating() : onSetRating(star)}
              onMouseEnter={() => onHoverRating(star)}
              onMouseLeave={() => onHoverRating(0)}
              className="transition-transform duration-100 hover:scale-110"
              title={userRating === star ? 'Remove rating' : `Rate ${star}/5`}
            >
              <Star
                className={cn(
                  'h-3.5 w-3.5 transition-colors duration-150',
                  (hoverRating || userRating || 0) >= star
                    ? 'text-gold fill-gold'
                    : 'text-gold/15'
                )}
              />
            </button>
          ))}
          {userRating && (
            <span className="ml-1 text-[10px] text-cream-muted/40">{userRating}/5</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gold/10 pt-3">
          <span className="text-xs font-medium text-gold">${fragrance.price}</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleCabinet}
              title={inCabinet ? 'Remove from cabinet' : 'Add to cabinet'}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200',
                inCabinet
                  ? 'border-gold bg-gold text-surface'
                  : 'border-gold/20 text-cream-muted/40 hover:border-gold hover:text-gold'
              )}
            >
              <BookMarked size={11} />
            </button>
            <button
              onClick={onToggleWishlist}
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200',
                inWishlist
                  ? 'border-rose-400/70 bg-rose-400/15 text-rose-400'
                  : 'border-gold/20 text-cream-muted/40 hover:border-rose-400/50 hover:text-rose-400'
              )}
            >
              <Heart className={cn('h-3 w-3', inWishlist && 'fill-current')} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
