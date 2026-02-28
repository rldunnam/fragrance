import type { Fragrance } from './types'

export interface Accord {
  name: string
  strength: number
}

// Maps note keywords to accord categories
const NOTE_TO_ACCORD: Record<string, string> = {
  // Citrus
  bergamot: 'Citrus', lemon: 'Citrus', grapefruit: 'Citrus', orange: 'Citrus',
  mandarin: 'Citrus', lime: 'Citrus', neroli: 'Citrus', yuzu: 'Citrus',
  tangerine: 'Citrus', petitgrain: 'Citrus',
  // Woody
  sandalwood: 'Woody', cedar: 'Woody', vetiver: 'Woody', guaiac: 'Woody',
  oud: 'Woody', patchouli: 'Woody', oakmoss: 'Woody', birch: 'Woody',
  'iso e super': 'Woody', agarwood: 'Woody',
  // Fresh / Aromatic
  lavender: 'Aromatic', mint: 'Aromatic', basil: 'Aromatic', rosemary: 'Aromatic',
  sage: 'Aromatic', thyme: 'Aromatic', artemisia: 'Aromatic', tarragon: 'Aromatic',
  // Floral
  rose: 'Floral', jasmine: 'Floral', iris: 'Floral', violet: 'Floral',
  geranium: 'Floral', 'orange blossom': 'Floral', peony: 'Floral',
  carnation: 'Floral', lily: 'Floral', magnolia: 'Floral',
  // Spicy
  pepper: 'Spicy', cinnamon: 'Spicy', cardamom: 'Spicy', clove: 'Spicy',
  nutmeg: 'Spicy', ginger: 'Spicy', saffron: 'Spicy', cumin: 'Spicy',
  // Warm / Amber
  amber: 'Warm', vanilla: 'Warm', tonka: 'Warm', benzoin: 'Warm',
  labdanum: 'Warm', styrax: 'Warm', musk: 'Warm', civet: 'Warm',
  coumarin: 'Warm', resin: 'Warm',
  // Fresh Aquatic
  calone: 'Aquatic', marine: 'Aquatic', sea: 'Aquatic', aquatic: 'Aquatic',
  // Gourmand
  chocolate: 'Gourmand', caramel: 'Gourmand', coffee: 'Gourmand',
  almond: 'Gourmand', praline: 'Gourmand',
  // Smoky / Leathery
  leather: 'Smoky', tobacco: 'Smoky', smoke: 'Smoky', incense: 'Smoky',
  frankincense: 'Smoky', myrrh: 'Smoky',
  // Fruity
  apple: 'Fruity', pear: 'Fruity', peach: 'Fruity', pineapple: 'Fruity',
  blackcurrant: 'Fruity', raspberry: 'Fruity', plum: 'Fruity',
}

// Maps family tags to accord boosts
const FAMILY_BOOSTS: Record<string, Record<string, number>> = {
  'Woody':     { Woody: 25 },
  'Fresh':     { Citrus: 20, Aromatic: 15 },
  'Aromatic':  { Aromatic: 25 },
  'Oriental':  { Warm: 25, Spicy: 15 },
  'Amber':     { Warm: 30 },
  'Floral':    { Floral: 25 },
  'Aquatic':   { Aquatic: 30, Citrus: 10 },
  'Fougère':   { Aromatic: 20, Woody: 15 },
  'Chypre':    { Woody: 20, Floral: 10 },
  'Gourmand':  { Gourmand: 30, Warm: 15 },
  'Citrus':    { Citrus: 30 },
  'Spicy':     { Spicy: 25, Warm: 10 },
}

// Note layer weights — top notes matter less for character than base
const LAYER_WEIGHTS = { top: 0.7, heart: 1.0, base: 1.3 }

export function deriveAccords(fragrance: Fragrance): Accord[] {
  const scores: Record<string, number> = {}

  const addNote = (note: string, weight: number) => {
    const lower = note.toLowerCase()
    for (const [keyword, accord] of Object.entries(NOTE_TO_ACCORD)) {
      if (lower.includes(keyword)) {
        scores[accord] = (scores[accord] || 0) + weight * 20
        break
      }
    }
  }

  fragrance.topNotes.forEach(n => addNote(n, LAYER_WEIGHTS.top))
  fragrance.heartNotes.forEach(n => addNote(n, LAYER_WEIGHTS.heart))
  fragrance.baseNotes.forEach(n => addNote(n, LAYER_WEIGHTS.heart))

  // Apply family boosts
  fragrance.family.forEach(fam => {
    const boosts = FAMILY_BOOSTS[fam]
    if (boosts) {
      Object.entries(boosts).forEach(([accord, boost]) => {
        scores[accord] = (scores[accord] || 0) + boost
      })
    }
  })

  if (Object.keys(scores).length === 0) return []

  // Normalise to 40-95 range so chart always looks good
  const max = Math.max(...Object.values(scores))
  const accords = Object.entries(scores)
    .map(([name, raw]) => ({
      name,
      strength: Math.round(40 + (raw / max) * 55),
    }))
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 6) // max 6 for readability

  return accords
}
