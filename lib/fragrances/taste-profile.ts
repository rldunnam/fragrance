import type { Fragrance } from './types'

/* ─── Types ─── */

export interface RatingInput {
  fragranceId: string
  score: number // 1-5
}

export interface NoteWeight {
  [note: string]: number
}

export interface TasteProfile {
  // Note-level weights (positive = liked, negative = disliked)
  noteWeights: NoteWeight

  // Characteristic preferences
  preferredIntensity: number       // weighted average, 1-5
  preferredProjection: number      // weighted average, 1-5
  occasionAffinities: Record<string, number>  // occasion → weight
  seasonAffinities: Record<string, number>    // season → weight
  sillageAffinities: Record<string, number>   // sillage → weight

  // Confidence
  ratingCount: number
  confidenceLevel: 'none' | 'low' | 'medium' | 'high'
  confidenceWeight: number         // 0–1, how much to blend personal score
  ratingsNeededForNext: number     // 0 when at max tier

  // Core function
  scoreFragrance: (fragrance: Fragrance) => number
}

/* ─── Rating → signal weight ─── */

const RATING_WEIGHTS: Record<number, number> = {
  5: +2.0,
  4: +1.0,
  3:  0.0,  // no signal
  2: -1.0,
  1: -2.0,
}

/* ─── Note layer multipliers ─── */
// Base notes most defining of character, top notes ephemeral

const LAYER_MULTIPLIERS = {
  base:  1.5,
  heart: 1.0,
  top:   0.6,
}

/* ─── Confidence tiers ─── */

function getConfidence(count: number): {
  level: TasteProfile['confidenceLevel']
  weight: number
  needed: number
} {
  if (count < 3)  return { level: 'none',   weight: 0,    needed: 3 - count }
  if (count < 5)  return { level: 'low',    weight: 0,    needed: 5 - count }
  if (count < 10) return { level: 'medium', weight: 0.30, needed: 10 - count }
  if (count < 20) return { level: 'medium', weight: 0.60, needed: 20 - count }
  return             { level: 'high',   weight: 0.85, needed: 0 }
}

/* ─── Sillage text → numeric ─── */

function sillageToNumber(sillage: string): number {
  const s = sillage.toLowerCase()
  if (s.includes('intimate') || s.includes('soft'))  return 1
  if (s.includes('light') || s.includes('moderate')) return 2
  if (s.includes('strong'))                           return 3
  if (s.includes('beast') || s.includes('very'))     return 4
  return 2 // default moderate
}

/* ─── Build taste profile ─── */

export function buildTasteProfile(
  ratings: RatingInput[],
  allFragrances: Fragrance[]
): TasteProfile {
  const fragranceMap = new Map(allFragrances.map(f => [f.id, f]))

  // Only use ratings with actual signal (not 3★)
  const signalRatings = ratings.filter(r => r.score !== 3)

  const noteWeights: NoteWeight = {}
  const occasionWeights: Record<string, number[]> = {}
  const seasonWeights: Record<string, number[]> = {}
  const sillageWeights: Record<string, number[]> = {}
  const intensityPoints: { value: number; weight: number }[] = []
  const projectionPoints: { value: number; weight: number }[] = []

  for (const rating of signalRatings) {
    const fragrance = fragranceMap.get(rating.fragranceId)
    if (!fragrance) continue

    const signal = RATING_WEIGHTS[rating.score] ?? 0
    if (signal === 0) continue

    // ── Notes ──
    const noteLayers: [string[], number][] = [
      [fragrance.topNotes,   LAYER_MULTIPLIERS.top],
      [fragrance.heartNotes, LAYER_MULTIPLIERS.heart],
      [fragrance.baseNotes,  LAYER_MULTIPLIERS.base],
    ]

    for (const [notes, multiplier] of noteLayers) {
      for (const note of notes) {
        const key = note.toLowerCase().trim()
        noteWeights[key] = (noteWeights[key] ?? 0) + signal * multiplier
      }
    }

    // ── Intensity ──
    // Only track positive signal for preference (we want what they like, not what they dislike)
    if (signal > 0) {
      intensityPoints.push({ value: fragrance.intensity, weight: signal })
      projectionPoints.push({ value: fragrance.projection, weight: signal })
    }

    // ── Occasions ──
    for (const occ of fragrance.occasion) {
      if (!occasionWeights[occ]) occasionWeights[occ] = []
      occasionWeights[occ].push(signal)
    }

    // ── Seasons ──
    for (const season of fragrance.season) {
      if (!seasonWeights[season]) seasonWeights[season] = []
      seasonWeights[season].push(signal)
    }

    // ── Sillage ──
    const sKey = fragrance.sillage.toLowerCase()
    if (!sillageWeights[sKey]) sillageWeights[sKey] = []
    sillageWeights[sKey].push(signal)
  }

  // ── Compute weighted averages ──

  const preferredIntensity = weightedAverage(intensityPoints) ?? 3
  const preferredProjection = weightedAverage(projectionPoints) ?? 3

  const occasionAffinities = sumArrays(occasionWeights)
  const seasonAffinities = sumArrays(seasonWeights)
  const sillageAffinities = sumArrays(sillageWeights)

  const confidence = getConfidence(ratings.length)

  // ── Scoring function ──

  function scoreFragrance(fragrance: Fragrance): number {
    let score = 0

    // Note matching
    const noteLayers: [string[], number][] = [
      [fragrance.topNotes,   LAYER_MULTIPLIERS.top],
      [fragrance.heartNotes, LAYER_MULTIPLIERS.heart],
      [fragrance.baseNotes,  LAYER_MULTIPLIERS.base],
    ]

    for (const [notes, multiplier] of noteLayers) {
      for (const note of notes) {
        const key = note.toLowerCase().trim()
        const weight = noteWeights[key] ?? 0
        score += weight * multiplier
      }
    }

    // Intensity proximity (closer to preferred = higher score)
    const intensityDiff = Math.abs(fragrance.intensity - preferredIntensity)
    score += (2.5 - intensityDiff) * 0.4

    // Projection proximity
    const projectionDiff = Math.abs(fragrance.projection - preferredProjection)
    score += (2.5 - projectionDiff) * 0.3

    // Occasion affinity bonus
    for (const occ of fragrance.occasion) {
      score += (occasionAffinities[occ] ?? 0) * 0.3
    }

    // Season affinity bonus
    for (const season of fragrance.season) {
      score += (seasonAffinities[season] ?? 0) * 0.2
    }

    // Sillage affinity bonus
    const sKey = fragrance.sillage.toLowerCase()
    score += (sillageAffinities[sKey] ?? 0) * 0.2

    return score
  }

  return {
    noteWeights,
    preferredIntensity,
    preferredProjection,
    occasionAffinities,
    seasonAffinities,
    sillageAffinities,
    ratingCount: ratings.length,
    confidenceLevel: confidence.level,
    confidenceWeight: confidence.weight,
    ratingsNeededForNext: confidence.needed,
    scoreFragrance,
  }
}

/* ─── Helpers ─── */

function weightedAverage(points: { value: number; weight: number }[]): number | null {
  if (points.length === 0) return null
  const totalWeight = points.reduce((sum, p) => sum + p.weight, 0)
  if (totalWeight === 0) return null
  return points.reduce((sum, p) => sum + p.value * p.weight, 0) / totalWeight
}

function sumArrays(map: Record<string, number[]>): Record<string, number> {
  const result: Record<string, number> = {}
  for (const [key, values] of Object.entries(map)) {
    result[key] = values.reduce((sum, v) => sum + v, 0)
  }
  return result
}

/* ─── Blend personal score with neutral ranking ─── */
// neutral score = 0 (all fragrances start equal without personalisation)

export function blendScore(
  personalScore: number,
  confidenceWeight: number
): number {
  // Normalise personal score to roughly 0-1 range for blending
  // Personal scores can range widely; we sigmoid-squash them
  const normalised = personalScore / (Math.abs(personalScore) + 5)
  return normalised * confidenceWeight
}
