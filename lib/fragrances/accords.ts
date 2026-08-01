import type { Fragrance } from './types'

export interface Accord {
  name: string
  strength: number
}

// Maps note keywords to accord categories
const NOTE_TO_ACCORD: Record<string, string> = {
  // Citrus
  bergamot: 'Citrus', lemon: 'Citrus', grapefruit: 'Citrus',
  // ORDER-SENSITIVE: 'orange blossom' must precede 'orange'. It is also listed
  // in the Floral block below, but that entry has never fired — 'orange' in
  // this block always matched first, resolving Orange Blossom to Citrus.
  'orange blossom': 'Floral', orange: 'Citrus',
  mandarin: 'Citrus', lime: 'Citrus', neroli: 'Citrus', yuzu: 'Citrus',
  tangerine: 'Citrus', petitgrain: 'Citrus', citrus: 'Citrus', verbena: 'Citrus',
  // Woody
  sandalwood: 'Woody', cedar: 'Woody', vetiver: 'Woody', guaiac: 'Woody',
  oud: 'Woody', patchouli: 'Woody', oakmoss: 'Woody', birch: 'Woody',
  'iso e super': 'Woody', agarwood: 'Woody',
  // Explicit rather than a blanket 'wood' substring: a bare `wood` key would
  // also capture Amberwood (Warm) and Violet Wood (Floral), silently
  // reclassifying entries that already resolve correctly.
  'woody notes': 'Woody', 'woodsy notes': 'Woody', wolfwood: 'Woody',
  driftwood: 'Woody', rosewood: 'Woody', oakwood: 'Woody',
  'cashmere wood': 'Woody', 'balsa wood': 'Woody',
  // Pre-existing gaps: the catalog spells these 'Gaiac Wood' (no u) and
  // 'Akigalawood', neither of which matched the 'guaiac' key.
  gaiac: 'Woody', akigalawood: 'Woody',
  cypress: 'Woody', cypriol: 'Woody', papyrus: 'Woody', mahogany: 'Woody',
  cabreuva: 'Woody', 'louro amarelo': 'Woody', sandal: 'Woody', oak: 'Woody',
  moss: 'Woody', evernyl: 'Woody', cashmeran: 'Woody', fir: 'Woody',
  // ORDER-SENSITIVE: 'pineapple' must precede 'pine', or Pineapple and
  // Pineapple Leaf resolve to Woody instead of Fruity.
  pineapple: 'Fruity', pine: 'Woody',
  // Fresh / Aromatic
  lavender: 'Aromatic', mint: 'Aromatic', basil: 'Aromatic', rosemary: 'Aromatic',
  sage: 'Aromatic', thyme: 'Aromatic', artemisia: 'Aromatic', tarragon: 'Aromatic',
  juniper: 'Aromatic', angelica: 'Aromatic', laurel: 'Aromatic', 'bay leaf': 'Aromatic',
  myrtle: 'Aromatic', oregano: 'Aromatic', chamomile: 'Aromatic', galbanum: 'Aromatic',
  tagete: 'Aromatic', mastic: 'Aromatic', herbal: 'Aromatic', heather: 'Aromatic',
  dihydromyrcenol: 'Aromatic', tea: 'Aromatic', mate: 'Aromatic',
  // Floral
  rose: 'Floral', jasmine: 'Floral', iris: 'Floral', violet: 'Floral',
  geranium: 'Floral', peony: 'Floral',
  carnation: 'Floral', lily: 'Floral', magnolia: 'Floral',
  orris: 'Floral', hawthorn: 'Floral', 'white flowers': 'Floral', freesia: 'Floral',
  cyclamen: 'Floral', heliotrope: 'Floral', hyacinth: 'Floral', mimosa: 'Floral',
  orchid: 'Floral', osmanthus: 'Floral', 'olive blossom': 'Floral', lotus: 'Floral',
  pelargonium: 'Floral', hedione: 'Floral', floral: 'Floral',
  // Spicy
  pepper: 'Spicy', cinnamon: 'Spicy', cardamom: 'Spicy', clove: 'Spicy',
  nutmeg: 'Spicy', ginger: 'Spicy', saffron: 'Spicy', cumin: 'Spicy',
  // ORDER-SENSITIVE: 'smoked spices' must precede 'spices', or Smoked Spices
  // moves from Smoky to Spicy.
  'smoked spices': 'Smoky', spices: 'Spicy', spicy: 'Spicy',
  coriander: 'Spicy', pimento: 'Spicy', anise: 'Spicy', cassia: 'Spicy',
  caraway: 'Spicy', chili: 'Spicy', 'carrot seed': 'Spicy',
  // Warm / Amber
  amber: 'Warm', vanilla: 'Warm', tonka: 'Warm', benzoin: 'Warm',
  labdanum: 'Warm', styrax: 'Warm', musk: 'Warm', civet: 'Warm',
  coumarin: 'Warm', resin: 'Warm',
  ambroxan: 'Warm', ambrette: 'Warm', cistus: 'Warm', opoponax: 'Warm',
  beeswax: 'Warm', 'benzyl benzoate': 'Warm',
  // Fresh Aquatic
  calone: 'Aquatic', marine: 'Aquatic', sea: 'Aquatic', aquatic: 'Aquatic',
  mineral: 'Aquatic', flint: 'Aquatic', posidonia: 'Aquatic', cucumber: 'Aquatic',
  // Gourmand
  chocolate: 'Gourmand', caramel: 'Gourmand', coffee: 'Gourmand',
  almond: 'Gourmand', praline: 'Gourmand', toffee: 'Gourmand',
  honey: 'Gourmand', 'butterscotch': 'Gourmand',
  // Boozy — grouped with Gourmand: these read as sweet, warm and edible
  // rather than as their own axis, and the accord list is intentionally short.
  liquor: 'Gourmand', whiskey: 'Gourmand', whisky: 'Gourmand', rum: 'Gourmand',
  cognac: 'Gourmand', absinthe: 'Gourmand', bourbon: 'Gourmand',
  'port wine': 'Gourmand', liqueur: 'Gourmand',
  cacao: 'Gourmand', cocoa: 'Gourmand', chestnut: 'Gourmand', hazelnut: 'Gourmand',
  kulfi: 'Gourmand', licorice: 'Gourmand', candied: 'Gourmand',
  // Smoky / Leathery
  leather: 'Smoky', tobacco: 'Smoky', smoke: 'Smoky', incense: 'Smoky',
  frankincense: 'Smoky', myrrh: 'Smoky',
  suede: 'Smoky', olibanum: 'Smoky', castoreum: 'Smoky', gasoline: 'Smoky',
  'palo santo': 'Smoky',
  // Fruity
  apple: 'Fruity', pear: 'Fruity', peach: 'Fruity',
  blackcurrant: 'Fruity', raspberry: 'Fruity', plum: 'Fruity',
  melon: 'Fruity', cantaloupe: 'Fruity', cranberry: 'Fruity', persimmon: 'Fruity',
  maninka: 'Fruity', cherry: 'Fruity', currant: 'Fruity', mango: 'Fruity',
  dates: 'Fruity', fig: 'Fruity', coconut: 'Fruity',
  // Deliberately explicit rather than a generic 'fruit' key, which would
  // capture Grapefruit and reclassify it from Citrus.
  'dried fruits': 'Fruity', 'fruity notes': 'Fruity',
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
