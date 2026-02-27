'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useAuth } from '@clerk/nextjs'
import { createAuthClient } from '@/lib/supabase'

interface CollectionState {
  cabinet: Set<string>
  wishlist: Set<string>
  ratings: Map<string, number>
  loading: boolean
  toggleCabinet:  (fragranceId: string) => Promise<void>
  toggleWishlist: (fragranceId: string) => Promise<void>
  setRating:      (fragranceId: string, score: number) => Promise<void>
  removeRating:   (fragranceId: string) => Promise<void>
  promptSignIn:   () => void
}

const CollectionContext = createContext<CollectionState | null>(null)

export function CollectionProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const [cabinet,  setCabinet]  = useState<Set<string>>(new Set())
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [ratings,  setRatings]  = useState<Map<string, number>>(new Map())
  const [loading,  setLoading]  = useState(false)

  const getClient = useCallback(async () => {
    const token = await getToken({ template: 'supabase' })
    if (!token) throw new Error('No auth token')
    return createAuthClient(token)
  }, [getToken])

  // Load all user data on sign-in
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    async function load() {
      setLoading(true)
      try {
        const client = await getClient()
        const [cabinetRes, wishlistRes, ratingsRes] = await Promise.all([
          client.from('cabinet').select('fragrance_id'),
          client.from('wishlist').select('fragrance_id'),
          client.from('ratings').select('fragrance_id, score'),
        ])
        if (cabinetRes.data)  setCabinet(new Set(cabinetRes.data.map(r => r.fragrance_id)))
        if (wishlistRes.data) setWishlist(new Set(wishlistRes.data.map(r => r.fragrance_id)))
        if (ratingsRes.data)  setRatings(new Map(ratingsRes.data.map(r => [r.fragrance_id, r.score])))
      } catch (err) {
        console.error('Failed to load collection:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isLoaded, isSignedIn, getClient])

  // Clear on sign-out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setCabinet(new Set())
      setWishlist(new Set())
      setRatings(new Map())
    }
  }, [isLoaded, isSignedIn])

  const promptSignIn = useCallback(() => {
    window.dispatchEvent(new CustomEvent('fragrance:signin-required'))
  }, [])

  const toggleCabinet = useCallback(async (fragranceId: string) => {
    if (!isSignedIn) { promptSignIn(); return }
    const inCabinet = cabinet.has(fragranceId)
    setCabinet(prev => { const next = new Set(prev); inCabinet ? next.delete(fragranceId) : next.add(fragranceId); return next })
    try {
      const client = await getClient()
      if (inCabinet) {
        await client.from('cabinet').delete().eq('fragrance_id', fragranceId)
      } else {
        await client.from('cabinet').insert({ fragrance_id: fragranceId })
      }
    } catch (err) {
      console.error('Cabinet update failed:', err)
      setCabinet(prev => { const next = new Set(prev); inCabinet ? next.add(fragranceId) : next.delete(fragranceId); return next })
    }
  }, [isSignedIn, cabinet, getClient, promptSignIn])

  const toggleWishlist = useCallback(async (fragranceId: string) => {
    if (!isSignedIn) { promptSignIn(); return }
    const inWishlist = wishlist.has(fragranceId)
    setWishlist(prev => { const next = new Set(prev); inWishlist ? next.delete(fragranceId) : next.add(fragranceId); return next })
    try {
      const client = await getClient()
      if (inWishlist) {
        await client.from('wishlist').delete().eq('fragrance_id', fragranceId)
      } else {
        await client.from('wishlist').insert({ fragrance_id: fragranceId })
      }
    } catch (err) {
      console.error('Wishlist update failed:', err)
      setWishlist(prev => { const next = new Set(prev); inWishlist ? next.add(fragranceId) : next.delete(fragranceId); return next })
    }
  }, [isSignedIn, wishlist, getClient, promptSignIn])

  const setRating = useCallback(async (fragranceId: string, score: number) => {
    if (!isSignedIn) { promptSignIn(); return }
    const prevScore = ratings.get(fragranceId)
    setRatings(prev => new Map(prev).set(fragranceId, score))
    try {
      const client = await getClient()
      await client.from('ratings').upsert(
        { fragrance_id: fragranceId, score, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,fragrance_id' }
      )
    } catch (err) {
      console.error('Rating update failed:', err)
      setRatings(prev => { const next = new Map(prev); prevScore !== undefined ? next.set(fragranceId, prevScore) : next.delete(fragranceId); return next })
    }
  }, [isSignedIn, ratings, getClient, promptSignIn])

  const removeRating = useCallback(async (fragranceId: string) => {
    if (!isSignedIn) return
    const prevScore = ratings.get(fragranceId)
    setRatings(prev => { const next = new Map(prev); next.delete(fragranceId); return next })
    try {
      const client = await getClient()
      await client.from('ratings').delete().eq('fragrance_id', fragranceId)
    } catch (err) {
      console.error('Rating removal failed:', err)
      if (prevScore !== undefined) setRatings(prev => new Map(prev).set(fragranceId, prevScore))
    }
  }, [isSignedIn, ratings, getClient])

  return (
    <CollectionContext.Provider value={{
      cabinet, wishlist, ratings, loading,
      toggleCabinet, toggleWishlist, setRating, removeRating, promptSignIn,
    }}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  const ctx = useContext(CollectionContext)
  if (!ctx) throw new Error('useCollection must be used within CollectionProvider')
  return ctx
}
