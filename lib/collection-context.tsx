'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react'
import { useAuth } from '@clerk/nextjs'
import { createAuthClient } from '@/lib/supabase'

interface QuizProfile {
  archetype:       string
  expression:      number
  tradition:       number
  thermal:         number
  sweetness:       number
  projection:      number
  primaryFamily:   string
  secondaryFamily: string
  accentFamily:    string
}

interface CollectionState {
  cabinet: Set<string>
  wishlist: Set<string>
  ratings: Map<string, number>
  quizProfile: QuizProfile | null
  loading: boolean
  toggleCabinet:  (fragranceId: string) => Promise<void>
  toggleWishlist: (fragranceId: string) => Promise<void>
  setRating:      (fragranceId: string, score: number) => Promise<void>
  removeRating:   (fragranceId: string) => Promise<void>
  saveQuizProfile:(profile: QuizProfile) => Promise<void>
  promptSignIn:   () => void
}

const CollectionContext = createContext<CollectionState | null>(null)

export function CollectionProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded, getToken, userId } = useAuth()
  const [cabinet,  setCabinet]  = useState<Set<string>>(new Set())
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [ratings,  setRatings]  = useState<Map<string, number>>(new Map())
  const [quizProfile, setQuizProfile] = useState<QuizProfile | null>(null)
  const [loading,  setLoading]  = useState(false)

  // Use a ref so getClient is always stable and never causes effect re-runs
  const getTokenRef = useRef(getToken)
  useEffect(() => { getTokenRef.current = getToken }, [getToken])

  const getClient = useCallback(async () => {
    const token = await getTokenRef.current({ template: 'supabase' })
    if (!token) throw new Error('No auth token')
    return createAuthClient(token)
  }, [])

  // Load all user data on sign-in
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    async function load() {
      setLoading(true)
      try {
        const client = await getClient()
        const [cabinetRes, wishlistRes, ratingsRes, quizRes] = await Promise.all([
          client.from('cabinet').select('fragrance_id'),
          client.from('wishlist').select('fragrance_id'),
          client.from('ratings').select('fragrance_id, score'),
          client.from('quiz_results').select('*').single(),
        ])
        if (cabinetRes.data)  setCabinet(new Set(cabinetRes.data.map(r => r.fragrance_id)))
        if (wishlistRes.data) setWishlist(new Set(wishlistRes.data.map(r => r.fragrance_id)))
        if (ratingsRes.data)  setRatings(new Map(ratingsRes.data.map(r => [r.fragrance_id, r.score])))
        if (quizRes.data) setQuizProfile({
          archetype:       quizRes.data.archetype,
          expression:      quizRes.data.expression,
          tradition:       quizRes.data.tradition,
          thermal:         quizRes.data.thermal,
          sweetness:       quizRes.data.sweetness,
          projection:      quizRes.data.projection,
          primaryFamily:   quizRes.data.primary_family,
          secondaryFamily: quizRes.data.secondary_family,
          accentFamily:    quizRes.data.accent_family,
        })
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }

    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn])

  // Clear on sign-out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setCabinet(new Set())
      setWishlist(new Set())
      setRatings(new Map())
      setQuizProfile(null)
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
        await client.from('cabinet').insert({ fragrance_id: fragranceId, user_id: userId })
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
        await client.from('wishlist').insert({ fragrance_id: fragranceId, user_id: userId })
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
        { fragrance_id: fragranceId, score, user_id: userId, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,fragrance_id' }
      )
    } catch (err) {
      console.error('Rating update failed:', err)
      setRatings(prev => { const next = new Map(prev); prevScore !== undefined ? next.set(fragranceId, prevScore) : next.delete(fragranceId); return next })
    }
  }, [isSignedIn, ratings, getClient, promptSignIn])

  const saveQuizProfile = useCallback(async (profile: QuizProfile) => {
    if (!isSignedIn) { promptSignIn(); return }
    setQuizProfile(profile)
    try {
      const client = await getClient()
      await client.from('quiz_results').upsert({
        user_id:          userId,
        archetype:        profile.archetype,
        expression:       profile.expression,
        tradition:        profile.tradition,
        thermal:          profile.thermal,
        sweetness:        profile.sweetness,
        projection:       profile.projection,
        primary_family:   profile.primaryFamily,
        secondary_family: profile.secondaryFamily,
        accent_family:    profile.accentFamily,
        taken_at:         new Date().toISOString(),
      }, { onConflict: 'user_id' })
    } catch (err) {
      console.error('Quiz profile save failed:', err)
      setQuizProfile(null)
    }
  }, [isSignedIn, getClient, promptSignIn, userId])

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
      cabinet, wishlist, ratings, quizProfile, loading,
      toggleCabinet, toggleWishlist, setRating, removeRating, saveQuizProfile, promptSignIn,
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
