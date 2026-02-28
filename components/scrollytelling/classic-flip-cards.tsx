'use client'

import { EditorialCard, EditorialCarousel } from './editorial-card'
import type { EditorialFragrance } from './editorial-card'

const CLASSICS: EditorialFragrance[] = [
  {
    id: 'eau-sauvage',
    name: 'Dior Eau Sauvage',
    house: 'Dior',
    year: 1966,
    family: 'Aromatic Citrus',
    families: ['Aromatic', 'Citrus'],
    badge: 'Classic',
    description: 'The aromatic chypre that defined masculine freshness. Eau Sauvage revolutionised men\'s fragrance with its clean hedione-based composition, creating the blueprint for modern aromatics.',
    notes: {
      top:   [{ name: 'Bergamot' }, { name: 'Lemon' }, { name: 'Basil' }],
      heart: [{ name: 'Hedione' }, { name: 'Lavender' }, { name: 'Jasmine' }],
      base:  [{ name: 'Oakmoss' }, { name: 'Vetiver' }, { name: 'Patchouli' }],
    },
    accords: [
      { name: 'Citrus', strength: 88 }, { name: 'Aromatic', strength: 82 },
      { name: 'Floral', strength: 65 }, { name: 'Mossy', strength: 72 },
      { name: 'Fresh', strength: 78 }, { name: 'Woody', strength: 55 },
    ],
  },
  {
    id: 'polo-rl',
    name: 'Polo Ralph Lauren',
    house: 'Ralph Lauren',
    year: 1978,
    family: 'Green Fougère',
    families: ['Aromatic', 'Fougère'],
    badge: 'Classic',
    description: 'A green powerhouse of American masculinity. Bold tobacco-laced woods and leather created an olfactory signature of confidence — the definitive scent of classic American style.',
    notes: {
      top:   [{ name: 'Pine' }, { name: 'Artemisia' }, { name: 'Basil' }],
      heart: [{ name: 'Carnation' }, { name: 'Geranium' }, { name: 'Jasmine' }],
      base:  [{ name: 'Tobacco' }, { name: 'Leather' }, { name: 'Oakmoss' }],
    },
    accords: [
      { name: 'Aromatic', strength: 90 }, { name: 'Tobacco', strength: 82 },
      { name: 'Leather', strength: 78 }, { name: 'Green', strength: 85 },
      { name: 'Floral', strength: 55 }, { name: 'Mossy', strength: 72 },
    ],
  },
  {
    id: 'azzaro-ph',
    name: 'Azzaro Pour Homme',
    house: 'Azzaro',
    year: 1978,
    family: 'Aromatic Fougère',
    families: ['Aromatic', 'Fougère'],
    badge: 'Classic',
    description: 'Mediterranean aromatic fougère with a 40+ year legacy. Lavender, anise, and warm woods capture the essence of French Riviera sophistication.',
    notes: {
      top:   [{ name: 'Lavender' }, { name: 'Anise' }, { name: 'Caraway' }],
      heart: [{ name: 'Basil' }, { name: 'Sandalwood' }, { name: 'Iris' }],
      base:  [{ name: 'Vetiver' }, { name: 'Oakmoss' }, { name: 'Leather' }],
    },
    accords: [
      { name: 'Aromatic', strength: 92 }, { name: 'Lavender', strength: 88 },
      { name: 'Woody', strength: 70 }, { name: 'Spicy', strength: 65 },
      { name: 'Mossy', strength: 75 }, { name: 'Leather', strength: 60 },
    ],
  },
  {
    id: 'cool-water',
    name: 'Davidoff Cool Water',
    house: 'Davidoff',
    year: 1988,
    family: 'Aquatic Aromatic',
    families: ['Aquatic', 'Aromatic'],
    badge: 'Classic',
    description: 'The marine revolution that spawned countless imitators. Cool Water introduced the fresh oceanic accord that dominated 90s masculinity and created an entirely new fragrance category.',
    notes: {
      top:   [{ name: 'Mint' }, { name: 'Lavender' }, { name: 'Coriander' }],
      heart: [{ name: 'Jasmine' }, { name: 'Neroli' }, { name: 'Geranium' }],
      base:  [{ name: 'Musk' }, { name: 'Sandalwood' }, { name: 'Amber' }],
    },
    accords: [
      { name: 'Aquatic', strength: 92 }, { name: 'Aromatic', strength: 82 },
      { name: 'Fresh', strength: 88 }, { name: 'Floral', strength: 60 },
      { name: 'Woody', strength: 55 }, { name: 'Musky', strength: 68 },
    ],
  },
  {
    id: 'acqua-di-gio',
    name: 'Acqua di Giò EDT',
    house: 'Giorgio Armani',
    year: 1996,
    family: 'Aquatic Floral',
    families: ['Aquatic', 'Floral'],
    badge: 'Classic',
    description: "The world's best-selling men's fragrance for decades. Jasmine-calone marine freshness set the blueprint for summer colognes and remains the definitive entry point into fragrance.",
    notes: {
      top:   [{ name: 'Bergamot' }, { name: 'Neroli' }, { name: 'Green Tangerine' }],
      heart: [{ name: 'Jasmine' }, { name: 'Calone' }, { name: 'Persimmon' }],
      base:  [{ name: 'Cedar' }, { name: 'Patchouli' }, { name: 'Musk' }],
    },
    accords: [
      { name: 'Aquatic', strength: 88 }, { name: 'Citrus', strength: 85 },
      { name: 'Floral', strength: 72 }, { name: 'Fresh', strength: 90 },
      { name: 'Woody', strength: 55 }, { name: 'Musky', strength: 62 },
    ],
  },
  {
    id: 'fahrenheit',
    name: 'Dior Fahrenheit',
    house: 'Dior',
    year: 1988,
    family: 'Woody Leather',
    families: ['Woody', 'Leather'],
    badge: 'Classic',
    description: "One of the most distinctive and divisive masculines ever made. Fahrenheit's petrol-violet-leather composition divides opinion but commands respect — a singular achievement in perfumery.",
    notes: {
      top:   [{ name: 'Violet' }, { name: 'Mandarin' }, { name: 'Hawthorn' }],
      heart: [{ name: 'Leather' }, { name: 'Nutmeg' }, { name: 'Jasmine' }],
      base:  [{ name: 'Vetiver' }, { name: 'Sandalwood' }, { name: 'Musk' }],
    },
    accords: [
      { name: 'Leather', strength: 90 }, { name: 'Woody', strength: 85 },
      { name: 'Floral', strength: 65 }, { name: 'Petrol', strength: 78 },
      { name: 'Spicy', strength: 60 }, { name: 'Musky', strength: 70 },
    ],
  },
  {
    id: 'terre-hermes-edt',
    name: "Terre d'Hermès EDT",
    house: 'Hermès',
    year: 2006,
    family: 'Woody Mineral',
    families: ['Woody', 'Aromatic'],
    badge: 'Classic',
    description: "Jean-Claude Ellena's mineral-woody masterpiece. Flint-and-pepper mineral quality over warm cedar and vetiver created a new genre of earthy elegance that continues to influence perfumery.",
    notes: {
      top:   [{ name: 'Grapefruit' }, { name: 'Orange' }, { name: 'Flint' }],
      heart: [{ name: 'Pepper' }, { name: 'Geranium' }, { name: 'Pelargonium' }],
      base:  [{ name: 'Vetiver' }, { name: 'Benzoin' }, { name: 'Cedar' }],
    },
    accords: [
      { name: 'Woody', strength: 90 }, { name: 'Citrus', strength: 82 },
      { name: 'Mineral', strength: 85 }, { name: 'Spicy', strength: 72 },
      { name: 'Earthy', strength: 78 }, { name: 'Fresh', strength: 65 },
    ],
  },
  {
    id: 'bleu-chanel-edp',
    name: 'Bleu de Chanel EDP',
    house: 'Chanel',
    year: 2010,
    family: 'Fresh Woody',
    families: ['Fresh', 'Woody'],
    badge: 'Classic',
    description: "Chanel's most successful masculine launch in decades. Fresh citrus-woody structure deepened with a richer amber base — the ideal balance between approachability and sophistication.",
    notes: {
      top:   [{ name: 'Citrus' }, { name: 'Grapefruit' }, { name: 'Mint' }],
      heart: [{ name: 'Ginger' }, { name: 'Jasmine' }, { name: 'Nutmeg' }],
      base:  [{ name: 'Cedar' }, { name: 'Sandalwood' }, { name: 'Amber' }],
    },
    accords: [
      { name: 'Fresh', strength: 88 }, { name: 'Woody', strength: 85 },
      { name: 'Citrus', strength: 82 }, { name: 'Spicy', strength: 65 },
      { name: 'Aromatic', strength: 70 }, { name: 'Amber', strength: 72 },
    ],
  },
  {
    id: 'le-male',
    name: 'Jean Paul Gaultier Le Male',
    house: 'Jean Paul Gaultier',
    year: 1995,
    family: 'Fougère Oriental',
    families: ['Fougère', 'Oriental'],
    badge: 'Classic',
    description: 'The 1995 icon that defined a generation. Lavender-vanilla-mint in a sailor torso bottle — seductive, approachable, and endlessly imitated.',
    notes: {
      top:   [{ name: 'Mint' }, { name: 'Lavender' }, { name: 'Bergamot' }],
      heart: [{ name: 'Cumin' }, { name: 'Cinnamon' }, { name: 'Orange Blossom' }],
      base:  [{ name: 'Vanilla' }, { name: 'Sandalwood' }, { name: 'Amber' }],
    },
    accords: [
      { name: 'Aromatic', strength: 90 }, { name: 'Sweet', strength: 85 },
      { name: 'Vanilla', strength: 88 }, { name: 'Spicy', strength: 72 },
      { name: 'Floral', strength: 65 }, { name: 'Warm', strength: 80 },
    ],
  },
  {
    id: 'green-irish-tweed',
    name: 'Green Irish Tweed',
    house: 'Creed',
    year: 1985,
    family: 'Fresh Aromatic',
    families: ['Fresh', 'Aromatic'],
    badge: 'Classic',
    description: 'The grandfather of aquatic masculines, predating Cool Water by three years. Violet-verbena freshness over mossy warmth defined the refined outdoor fragrance.',
    notes: {
      top:   [{ name: 'Lemon Verbena' }, { name: 'Iris' }, { name: 'Violet Leaves' }],
      heart: [{ name: 'Dianthus' }, { name: 'Sandalwood' }],
      base:  [{ name: 'Ambergris' }, { name: 'Oakmoss' }, { name: 'Vetiver' }],
    },
    accords: [
      { name: 'Fresh', strength: 90 }, { name: 'Aromatic', strength: 85 },
      { name: 'Floral', strength: 72 }, { name: 'Mossy', strength: 78 },
      { name: 'Woody', strength: 65 }, { name: 'Citrus', strength: 70 },
    ],
  },
]

export function ClassicFlipCards() {
  return (
    <EditorialCarousel
      label="Timeless Classics"
      sublabel="The foundations of masculine perfumery"
    >
      {CLASSICS.map((f, i) => (
        <EditorialCard key={f.id} fragrance={f} index={i} />
      ))}
    </EditorialCarousel>
  )
}
