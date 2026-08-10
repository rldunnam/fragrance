export type Concentration = 'EDC' | 'EDT' | 'EDP' | 'Parfum' | 'Extrait'

/**
 * How a release is marketed and worn — not a prescription about who should
 * wear it. Sourced from the house's own classification, with the community
 * consensus on Fragrantica as the tiebreak where a house declines to gender
 * its line at all.
 *
 * The filter UI never exposes these three values directly. It offers
 * "For Him" (Masculine + Unisex) and "For Her" (Feminine + Unisex), so a
 * unisex entry is reachable from both sides. See audienceViews in filters.ts.
 */
export type Audience = 'Masculine' | 'Feminine' | 'Unisex'

export interface Fragrance {
  id: string
  name: string
  house: string
  audience: Audience
  family: string[]
  occasion: string[]
  season: string[]
  topNotes: string[]
  heartNotes: string[]
  baseNotes: string[]
  rationale: string
  intensity: number // 1-5 scale
  longevity: string
  sillage: string
  projection: number // 1-5 scale
  price: number // USD, typical 100ml bottle
  concentration?: Concentration
  /**
   * The pillar this release belongs to, e.g. 'Sauvage' for Sauvage EDT /
   * Sauvage Elixir / Sauvage Parfum. Marketing suffixes stay in `name`;
   * `line` is what groups a concentration ladder together.
   */
  line?: string
  /** For clone-house releases: the fragrance this one targets. */
  inspiredBy?: string
}
