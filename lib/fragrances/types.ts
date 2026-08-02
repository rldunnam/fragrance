export type Concentration = 'EDC' | 'EDT' | 'EDP' | 'Parfum' | 'Extrait'

export interface Fragrance {
  id: string
  name: string
  house: string
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
