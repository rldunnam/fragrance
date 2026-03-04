// ─── Types ───────────────────────────────────────────────────────────────────

export type Intent = 'refine' | 'reinvent' | 'reinvent_contrast'
export type Diversification = 'low' | 'moderate' | 'high'

export interface QuizAnswers {
  Q1: Intent
  Q2: Diversification
  Q3?: 'Observe' | 'Engage'
  Q4?: 'Clean' | 'Incredible'
  Q5?: 'Quiet' | 'Visible'
  Q6?: 'Classic' | 'Modern'
  Q7?: 'Timeless' | 'Innovative'
  Q8?: 'Dependable' | 'Captivating'
  Q9?: 'Rooftop' | 'Lounge'
  Q10?: 'Rain' | 'Wood/Spice'
  Q11?: 'Black Coffee' | 'Latte/Old Fashioned'
  Q12?: 'Earth tones' | 'Rich textures'
  Q13?: 'Intimate' | 'Noticeable'
  Q14?: 'Sensitive' | 'Tolerant'
  Q15?: 'Hot/Humid' | 'Mild' | 'Cold/Dry'
  Q16?: 'Corporate' | 'Business Casual' | 'Creative'
  Q17?: '0-2' | '3-7' | '8+'
  Q18?: string  // free text — current fragrances
}

export interface AxisScores {
  Expression: number
  Tradition:  number
  Thermal:    number
  Sweetness:  number
  Projection: number
}

export interface QuizResult {
  archetype:       string
  description:     string
  axisScores:      AxisScores
  primaryFamily:   string
  secondaryFamily: string
  accentFamily:    string
  notesToSeek:     string[]
  notesToAvoid:    string[]
  diversification: string[]
  experienceLevel: 'beginner' | 'intermediate' | 'collector'
}

// ─── Intent Multipliers ───────────────────────────────────────────────────────

const INTENT_MULTIPLIERS: Record<Intent, AxisScores> = {
  refine:            { Expression: 0.85, Tradition: 1.0, Thermal: 0.9,  Sweetness: 0.85, Projection: 0.85 },
  reinvent:          { Expression: 1.0,  Tradition: 1.0, Thermal: 1.0,  Sweetness: 1.0,  Projection: 1.0  },
  reinvent_contrast: { Expression: 1.2,  Tradition: 1.1, Thermal: 1.1,  Sweetness: 1.2,  Projection: 1.2  },
}

// ─── Answer → Axis Scores ────────────────────────────────────────────────────

type AxisDelta = Partial<AxisScores>

const ANSWER_SCORES: Record<string, Record<string, AxisDelta>> = {
  Q3:  { Observe:              { Expression: -8, Projection: -5 },
         Engage:               { Expression:  8, Projection:  5 } },
  Q4:  { Clean:                { Expression: -5, Sweetness: -3, Projection: -5 },
         Incredible:           { Expression:  5, Sweetness:  3, Projection:  5 } },
  Q5:  { Quiet:                { Expression: -5, Projection: -3 },
         Visible:              { Expression:  5, Projection:  3 } },
  Q6:  { Classic:              { Tradition: -8 },
         Modern:               { Tradition:  8 } },
  Q7:  { Timeless:             { Tradition: -5 },
         Innovative:           { Tradition:  5 } },
  Q8:  { Dependable:           { Expression: -3, Tradition: -5 },
         Captivating:          { Expression:  3, Tradition:  5 } },
  Q9:  { Rooftop:              { Thermal: -8 },
         Lounge:               { Thermal:  8 } },
  Q10: { Rain:                 { Thermal: -5 },
         'Wood/Spice':         { Thermal:  5 } },
  Q11: { 'Black Coffee':       { Sweetness: -8 },
         'Latte/Old Fashioned':{ Sweetness:  8 } },
  Q12: { 'Earth tones':        { Sweetness: -5 },
         'Rich textures':      { Sweetness:  5 } },
  Q13: { Intimate:             { Expression: -5, Projection: -8 },
         Noticeable:           { Expression:  5, Projection:  8 } },
  Q15: { 'Hot/Humid':          { Sweetness: -2, Projection: -2 },
         Mild:                 {},
         'Cold/Dry':           { Sweetness:  2, Projection:  2 } },
}

// ─── Archetypes ───────────────────────────────────────────────────────────────

interface ArchetypeZone {
  Expression: [number, number]
  Tradition:  [number, number]
  Thermal:    [number, number]
  Sweetness:  [number, number]
  Projection: [number, number]
}

interface Archetype {
  name:        string
  description: string
  zones:       ArchetypeZone
  primary:     string
  secondary:   string
  accent:      string
  notesToSeek: string[]
  notesToAvoid: string[]
}

const ARCHETYPES: Archetype[] = [
  {
    name: 'The Executive',
    description: 'Confident and understated — your scent commands respect without demanding attention. You gravitate toward precision and quality over novelty.',
    zones: { Expression: [-2, 5], Tradition: [-10, -2], Thermal: [-10, 2], Sweetness: [-10, 2], Projection: [-5, 5] },
    primary: 'Woody Spicy', secondary: 'Fresh Aromatic', accent: 'Leather Tobacco',
    notesToSeek: ['Vetiver', 'Cedarwood', 'Cardamom', 'Grey Amber'],
    notesToAvoid: ['Heavy vanilla', 'Tropical fruits', 'Loud synthetics'],
  },
  {
    name: 'The Charismatic Seducer',
    description: 'Magnetic and memorable — you wear fragrance as a statement. Your presence lingers long after you\'ve left the room.',
    zones: { Expression: [4, 10], Tradition: [-2, 8], Thermal: [2, 10], Sweetness: [2, 10], Projection: [4, 10] },
    primary: 'Amber Sweet', secondary: 'Spicy Oriental', accent: 'Gourmand',
    notesToSeek: ['Vanilla', 'Tonka Bean', 'Amber', 'Oud', 'Saffron'],
    notesToAvoid: ['Aquatic notes', 'Clean musks', 'Green herbals'],
  },
  {
    name: 'The Grounded Craftsman',
    description: 'Reliable and earthy — your scent reflects substance over show. You appreciate tradition, natural materials, and quiet confidence.',
    zones: { Expression: [-2, 4], Tradition: [-10, -2], Thermal: [2, 10], Sweetness: [-10, 2], Projection: [-5, 3] },
    primary: 'Woody Spicy', secondary: 'Leather Tobacco', accent: 'Green Herbal',
    notesToSeek: ['Leather', 'Patchouli', 'Birch', 'Sandalwood', 'Tobacco'],
    notesToAvoid: ['Sweet gourmands', 'Florals', 'Marine accords'],
  },
  {
    name: 'The Modern Minimalist',
    description: 'Clean and contemporary — you believe restraint is its own statement. Your fragrance is precision-engineered: nothing superfluous, everything intentional.',
    zones: { Expression: [-5, 2], Tradition: [2, 10], Thermal: [-10, 2], Sweetness: [-10, 3], Projection: [-5, 3] },
    primary: 'Fresh Aromatic', secondary: 'Green Herbal', accent: 'Mineral',
    notesToSeek: ['Bergamot', 'Lavender', 'Sage', 'Iso E Super', 'Salt Accord'],
    notesToAvoid: ['Heavy ambers', 'Gourmands', 'Tobacco'],
  },
  {
    name: 'The Social Explorer',
    description: 'Versatile and adventurous — you use fragrance to navigate different worlds. You want a scent that works at dinner and at midnight.',
    zones: { Expression: [2, 10], Tradition: [2, 10], Thermal: [-2, 10], Sweetness: [-2, 10], Projection: [2, 10] },
    primary: 'Spicy Oriental', secondary: 'Amber Sweet', accent: 'Citrus Aromatic',
    notesToSeek: ['Nutmeg', 'Cinnamon', 'Cardamom', 'Bergamot', 'Amber'],
    notesToAvoid: ['Single-note fragrances', 'Overly safe office scents'],
  },
  {
    name: 'The Quiet Operator',
    description: 'Subtle and precise — your scent is a private pleasure, not a public broadcast. Those who notice are the ones worth impressing.',
    zones: { Expression: [-10, 2], Tradition: [-10, -2], Thermal: [-10, 2], Sweetness: [-10, 2], Projection: [-10, 2] },
    primary: 'Green Herbal', secondary: 'Woody Spicy', accent: 'Amber',
    notesToSeek: ['Green Tea', 'Galbanum', 'Basil', 'Light Cedarwood', 'Subtle Musk'],
    notesToAvoid: ['Beast-mode projection', 'Heavy oud', 'Sweet gourmands'],
  },
]

// ─── Scoring ──────────────────────────────────────────────────────────────────

function scoreAxes(answers: QuizAnswers): AxisScores {
  const intent = answers.Q1
  const multipliers = INTENT_MULTIPLIERS[intent]
  const totals: AxisScores = { Expression: 0, Tradition: 0, Thermal: 0, Sweetness: 0, Projection: 0 }

  for (const [q, answer] of Object.entries(answers)) {
    if (q === 'Q1' || q === 'Q2' || q === 'Q17' || q === 'Q18') continue
    const questionScores = ANSWER_SCORES[q]
    if (!questionScores || !answer) continue
    const delta = questionScores[answer as string]
    if (!delta) continue
    for (const [axis, value] of Object.entries(delta)) {
      const a = axis as keyof AxisScores
      totals[a] += (value as number) * multipliers[a]
    }
  }

  // Environmental / sensory caps (applied after scoring)
  if (answers.Q14 === 'Sensitive') {
    totals.Projection = Math.min(totals.Projection, 3)
    totals.Sweetness  = Math.min(totals.Sweetness,  3)
  }
  if (answers.Q16 === 'Corporate') {
    totals.Projection = Math.min(totals.Projection, 2)
  }

  return totals
}

function assignArchetype(scores: AxisScores): Archetype {
  let best = ARCHETYPES[0]
  let bestMatches = -1

  for (const archetype of ARCHETYPES) {
    let matches = 0
    for (const [axis, [low, high]] of Object.entries(archetype.zones)) {
      const val = scores[axis as keyof AxisScores]
      if (val >= low && val <= high) matches++
    }
    if (matches > bestMatches) {
      bestMatches = matches
      best = archetype
    }
  }

  return best
}

function getDiversification(answers: QuizAnswers, archetype: Archetype): string[] {
  const tips: string[] = []
  const current = answers.Q18?.toLowerCase() ?? ''

  if (current.includes(archetype.primary.toLowerCase())) {
    tips.push(`Your collection leans heavily ${archetype.primary} — consider exploring ${archetype.secondary} for contrast.`)
  } else {
    tips.push(`${archetype.secondary} fragrances would complement your ${archetype.primary} preference well.`)
  }

  if (answers.Q2 === 'high') {
    tips.push(`You're open to contrast — ${archetype.accent} would push your palette into new territory.`)
  }

  if (answers.Q15 === 'Hot/Humid') {
    tips.push('In hot climates, lean toward lighter concentrations (EDT) within your primary family.')
  } else if (answers.Q15 === 'Cold/Dry') {
    tips.push('Cold weather is your advantage — this is when richer, denser fragrances project best.')
  }

  return tips
}

function getExperienceLevel(answers: QuizAnswers): QuizResult['experienceLevel'] {
  if (answers.Q17 === '8+') return 'collector'
  if (answers.Q17 === '3-7') return 'intermediate'
  return 'beginner'
}

// ─── Main Engine ──────────────────────────────────────────────────────────────

export function runQuiz(answers: QuizAnswers): QuizResult {
  const axisScores    = scoreAxes(answers)
  const archetype     = assignArchetype(axisScores)
  const diversification = getDiversification(answers, archetype)
  const experienceLevel = getExperienceLevel(answers)

  return {
    archetype:       archetype.name,
    description:     archetype.description,
    axisScores,
    primaryFamily:   archetype.primary,
    secondaryFamily: archetype.secondary,
    accentFamily:    archetype.accent,
    notesToSeek:     archetype.notesToSeek,
    notesToAvoid:    archetype.notesToAvoid,
    diversification,
    experienceLevel,
  }
}

// ─── Quiz Result → Selector Filter Params ────────────────────────────────────
// Maps quiz output to selector filter state, encoded as URL search params.

export interface QuizFilterParams {
  families:  string[]   // catalog family IDs: Fresh | Woody | Amber | Floral
  seasons:   string[]   // catalog season IDs: Spring | Summer | Fall | Winter
  occasion:  string | null  // catalog occasion ID
}

// Quiz scent family → catalog family IDs
const QUIZ_TO_CATALOG_FAMILY: Record<string, string[]> = {
  'Woody Spicy':     ['Woody'],
  'Fresh Aromatic':  ['Fresh'],
  'Amber Sweet':     ['Amber'],
  'Spicy Oriental':  ['Amber'],
  'Leather Tobacco': ['Woody'],
  'Green Herbal':    ['Fresh'],
  'Gourmand':        ['Amber'],
  'Mineral':         ['Fresh'],
  'Citrus Aromatic': ['Fresh'],
}

// Q15 climate → catalog seasons
const CLIMATE_TO_SEASONS: Record<string, string[]> = {
  'Hot/Humid':  ['Summer', 'Spring'],
  'Mild':       [],
  'Cold/Dry':   ['Fall', 'Winter'],
}

// Q16 environment → catalog occasion
const ENV_TO_OCCASION: Record<string, string | null> = {
  'Corporate':       'Office',
  'Business Casual': 'Everyday',
  'Creative':        null,
}

export function quizResultToFilters(result: QuizResult, answers: QuizAnswers): QuizFilterParams {
  // Families — dedupe primary + secondary mapped to catalog
  const familySet = new Set<string>([
    ...(QUIZ_TO_CATALOG_FAMILY[result.primaryFamily]   ?? []),
    ...(QUIZ_TO_CATALOG_FAMILY[result.secondaryFamily] ?? []),
  ])

  const seasons = answers.Q15 ? (CLIMATE_TO_SEASONS[answers.Q15] ?? []) : []
  const occasion = answers.Q16 ? (ENV_TO_OCCASION[answers.Q16] ?? null) : null

  return {
    families:  Array.from(familySet),
    seasons,
    occasion,
  }
}

export function encodeFiltersToParams(filters: QuizFilterParams): string {
  const params = new URLSearchParams()
  if (filters.families.length)  params.set('families',  filters.families.join(','))
  if (filters.seasons.length)   params.set('seasons',   filters.seasons.join(','))
  if (filters.occasion)         params.set('occasion',  filters.occasion)
  params.set('fromQuiz', '1')
  return params.toString()
}
