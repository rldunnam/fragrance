'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback, type ReactNode } from 'react'
import { useAuth } from '@clerk/nextjs'
import { createAuthClient } from '@/lib/supabase'
import { fragrances } from '@/lib/fragrances/data'
import { getSimilarFragrances } from '@/lib/fragrances/similarity'

/**
 * How a fragrance was tolerated when sampled. 'none' means sampled without a
 * reaction, which overrides content screens; 'mild' and 'harsh' are reactions.
 * Stored per account in the `reactions` table (see supabase/reactions.sql).
 */
export type ReactionSeverity = 'none' | 'mild' | 'harsh'

export const isReaction = (s: ReactionSeverity | undefined) => s === 'mild' || s === 'harsh'

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
  reactions: Map<string, ReactionSeverity>
  /** fragrance id -> names of reacted-to fragrances it closely resembles */
  similarToReaction: Map<string, string[]>
  loading: boolean
  toggleCabinet:  (fragranceId: string) => Promise<void>
  toggleWishlist: (fragranceId: string) => Promise<void>
  setRating:      (fragranceId: string, score: number) => Promise<void>
  removeRating:   (fragranceId: string) => Promise<void>
  saveQuizProfile:(profile: QuizProfile) => Promise<void>
  setReaction:    (fragranceId: string, severity: ReactionSeverity) => Promise<void>
  clearReaction:  (fragranceId: string) => Promise<void>
  promptSignIn:   () => void
}

const CollectionContext = createContext<CollectionState | null>(null)

export function CollectionProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded, getToken, userId } = useAuth()
  const [cabinet,  setCabinet]  = useState<Set<string>>(new Set())
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [ratings,  setRatings]  = useState<Map<string, number>>(new Map())
  const [quizProfile, setQuizProfile] = useState<QuizProfile | null>(null)
  const [reactions, setReactions] = useState<Map<string, ReactionSeverity>>(new Map())
  const [loading,  setLoading]  = useState(false)

  // Use a ref so getClient is always stable and never causes effect re-runs
  const getTokenRef = useRef(getToken)
  useEffect(() => { getTokenRef.current = getToken }, [getToken])

  const getClient = useCallback(async () => {
    const token = await getTokenRef.current({ template: 'supabase' })
    if (!token) throw new Error('No auth token')
    return createAuthClient(token)
  }, [])

  // Reset every slice of state when the ACTIVE USER changes.
  //
  // This is React's "adjust state during render" pattern, not an effect.
  // setState during render is legal and re-renders before children observe the
  // stale values; the same assignments inside an effect cause a cascading
  // render, which is what react-hooks/set-state-in-effect flags.
  //
  // It also fixes a real bug. The previous version cleared state in an effect
  // keyed only on isSignedIn, so switching accounts through Clerk's
  // multi-session UserButton -- where isSignedIn never goes false -- left the
  // previous user's cabinet, wishlist and ratings on screen.
  const [activeUserId, setActiveUserId] = useState(userId)
  if (userId !== activeUserId) {
    setActiveUserId(userId)
    setCabinet(new Set())
    setWishlist(new Set())
    setRatings(new Map())
    setQuizProfile(null)
    setReactions(new Map())
  }

  // Load all user data on sign-in, and again whenever the user changes.
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return

    // Guards against an in-flight response from the previous user landing
    // after a fast account switch and overwriting the new user's data.
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const client = await getClient()
        const [cabinetRes, wishlistRes, ratingsRes, quizRes, reactionsRes] = await Promise.all([
          client.from('cabinet').select('fragrance_id'),
          client.from('wishlist').select('fragrance_id'),
          client.from('ratings').select('fragrance_id, score'),
          client.from('quiz_results').select('*').single(),
          client.from('reactions').select('fragrance_id, severity'),
        ])
        if (cancelled) return
        if (cabinetRes.data)  setCabinet(new Set(cabinetRes.data.map(r => r.fragrance_id)))
        if (wishlistRes.data) setWishlist(new Set(wishlistRes.data.map(r => r.fragrance_id)))
        if (ratingsRes.data)  setRatings(new Map(ratingsRes.data.map(r => [r.fragrance_id, r.score])))
        // A missing table (supabase/reactions.sql not yet applied) arrives as
        // an error result, not a throw — log it rather than failing the load.
        if (reactionsRes.error) console.error('Reactions load failed:', reactionsRes.error)
        if (reactionsRes.data) {
          setReactions(new Map(reactionsRes.data.map(r => [r.fragrance_id, r.severity as ReactionSeverity])))
        }
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
        // Previously swallowed. A missing or renamed Clerk "supabase" JWT
        // template throws here, and silence made it look like an empty
        // collection rather than a configuration error.
        console.error('Collection load failed:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [isLoaded, isSignedIn, userId, getClient])

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
  }, [isSignedIn, cabinet, getClient, promptSignIn, userId])

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
  }, [isSignedIn, wishlist, getClient, promptSignIn, userId])

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
  }, [isSignedIn, ratings, getClient, promptSignIn, userId])

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

  const setReaction = useCallback(async (fragranceId: string, severity: ReactionSeverity) => {
    if (!isSignedIn) { promptSignIn(); return }
    const prev = reactions.get(fragranceId)
    setReactions(m => new Map(m).set(fragranceId, severity))
    try {
      const client = await getClient()
      const { error } = await client.from('reactions').upsert(
        { fragrance_id: fragranceId, severity, user_id: userId, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,fragrance_id' }
      )
      if (error) throw error
    } catch (err) {
      console.error('Reaction update failed:', err)
      setReactions(m => { const next = new Map(m); prev ? next.set(fragranceId, prev) : next.delete(fragranceId); return next })
    }
  }, [isSignedIn, reactions, getClient, promptSignIn, userId])

  const clearReaction = useCallback(async (fragranceId: string) => {
    if (!isSignedIn) { promptSignIn(); return }
    const prev = reactions.get(fragranceId)
    setReactions(m => { const next = new Map(m); next.delete(fragranceId); return next })
    try {
      const client = await getClient()
      const { error } = await client.from('reactions').delete().eq('fragrance_id', fragranceId)
      if (error) throw error
    } catch (err) {
      console.error('Reaction removal failed:', err)
      if (prev) setReactions(m => new Map(m).set(fragranceId, prev))
    }
  }, [isSignedIn, reactions, getClient, promptSignIn])

  // For every fragrance that caused a reaction, its closest matches by the
  // same similarity measure the cards use. This catches reactions no note
  // screen can explain, by flagging whatever resembles them.
  const similarToReaction = useMemo(() => {
    const out = new Map<string, string[]>()
    for (const [id, severity] of reactions) {
      if (!isReaction(severity)) continue
      const reacted = fragrances.find(f => f.id === id)
      if (!reacted) continue
      for (const similar of getSimilarFragrances(reacted, fragrances)) {
        if (!out.has(similar.id)) out.set(similar.id, [])
        out.get(similar.id)!.push(reacted.name)
      }
    }
    return out
  }, [reactions])

  const removeRating = useCallback(async (fragranceId: string) => {
    if (!isSignedIn) { promptSignIn(); return }
    const prevScore = ratings.get(fragranceId)
    setRatings(prev => { const next = new Map(prev); next.delete(fragranceId); return next })
    try {
      const client = await getClient()
      await client.from('ratings').delete().eq('fragrance_id', fragranceId)
    } catch (err) {
      console.error('Rating removal failed:', err)
      if (prevScore !== undefined) setRatings(prev => new Map(prev).set(fragranceId, prevScore))
    }
  }, [isSignedIn, ratings, getClient, promptSignIn])

  return (
    <CollectionContext.Provider value={{
      cabinet, wishlist, ratings, quizProfile, reactions, similarToReaction, loading,
      toggleCabinet, toggleWishlist, setRating, removeRating, saveQuizProfile,
      setReaction, clearReaction, promptSignIn,
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
