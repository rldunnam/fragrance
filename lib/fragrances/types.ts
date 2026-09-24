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

/**
 * Whether a release can be bought at ordinary US retail today. Absent means
 * 'current'. Anything else is an exception to the catalog's default inclusion
 * rule (currently produced, broadly distributed) and must carry an
 * `includeReason` — scripts/validate-fragrances.mjs enforces this.
 *
 *   discontinued — no longer produced; secondary market only
 *   limited      — limited or seasonal edition
 *   regional     — exclusive to a market outside the US (e.g. Middle East)
 */
export type ReleaseStatus = 'current' | 'discontinued' | 'limited' | 'regional'

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
  /** Availability. Omitted means 'current'. Shown as a badge on the card. */
  status?: ReleaseStatus
  /**
   * Why a non-current release is in the catalog anyway, e.g. hype and US
   * popularity despite a regional launch. Required when status is set to
   * anything other than 'current'; not allowed otherwise. Editorial, not shown.
   */
  includeReason?: string
  /** Where the note pyramid was verified, normally the Fragrantica page. */
  source?: string
  /**
   * The source lists notes without top/heart/base tiers. All notes go in
   * heartNotes and topNotes/baseNotes stay empty, rather than inventing a
   * split; the card then shows a single "Notes" group.
   */
  notesFlat?: true
  /**
   * The published ingredient label, verbatim and in label order (INCI names,
   * e.g. 'Cinnamal', 'Hexyl Cinnamal'). Searchable but not part of the note
   * breakdown. Declares listed allergens above a legal threshold; everything
   * else is hidden inside 'Parfum', so absence here is not proof of absence.
   */
  ingredients?: string[]
  /** Where the ingredient list came from: the house's page, then a major retailer. */
  ingredientsSource?: string
  /** Formula or batch code printed with the list (e.g. Dior's '#15755'); changes on reformulation. */
  formulaCode?: string
  /**
   * Manual content-screen flags, keyed by screen id (see screens.ts), each with
   * a short sourced reason. The fragrance is hidden under that screen even
   * though no billed note matches. Reserved for the rare case where the
   * pyramid demonstrably under-reports a screened material; the note rule
   * stays the default, and a logged "tolerated" verdict still wins.
   */
  screenFlags?: Record<string, string>
}
