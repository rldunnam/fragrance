'use client'

import { EditorialCard, EditorialCarousel } from './editorial-card'
import type { EditorialFragrance } from './editorial-card'

const TRENDING: EditorialFragrance[] = [
  {
    id: 'versace-eros-edp',
    name: 'Eros Eau de Parfum',
    house: 'Versace',
    year: 2021,
    family: 'Woody Amber',
    families: ['Woody', 'Amber'],
    concentration: 'EDP',
    badge: 'Trending',
    description: 'The EDP deepens the iconic Eros DNA considerably — warmer, richer, more seductive with a powerful amber-vanilla drydown that commands the room.',
    notes: {
      top:   [{ name: 'Lemon' }, { name: 'Bergamot' }, { name: 'Apple' }],
      heart: [{ name: 'Tonka Bean' }, { name: 'Ambroxan' }, { name: 'Vetiver' }],
      base:  [{ name: 'Vanilla' }, { name: 'Amber' }, { name: 'Sandalwood' }],
    },
    accords: [
      { name: 'Warm', strength: 90 }, { name: 'Sweet', strength: 85 },
      { name: 'Woody', strength: 78 }, { name: 'Citrus', strength: 65 },
      { name: 'Musky', strength: 72 }, { name: 'Spicy', strength: 55 },
    ],
    longevity: 10, sillage: 'Strong', projection: 85,
  },
  {
    id: 'spicebomb-extreme',
    name: 'Spicebomb Extreme',
    house: 'Viktor & Rolf',
    year: 2015,
    family: 'Amber Spicy',
    families: ['Amber', 'Spicy'],
    concentration: 'EDP',
    badge: 'Trending',
    description: 'A cold-weather powerhouse — cinnamon and tobacco ignite over a dense vanilla-amber base. One of the most complimented men\'s fragrances of the decade.',
    notes: {
      top:   [{ name: 'Cinnamon' }, { name: 'Grapefruit' }],
      heart: [{ name: 'Tobacco' }, { name: 'Papyrus' }, { name: 'Vetiver' }],
      base:  [{ name: 'Vanilla' }, { name: 'Amber' }, { name: 'Musk' }],
    },
    accords: [
      { name: 'Spicy', strength: 92 }, { name: 'Tobacco', strength: 85 },
      { name: 'Sweet', strength: 88 }, { name: 'Amber', strength: 90 },
      { name: 'Woody', strength: 65 }, { name: 'Musky', strength: 72 },
    ],
    longevity: 11, sillage: 'Beast', projection: 92,
  },
  {
    id: 'valentino-born-in-roma-intense',
    name: 'Born In Roma Intense',
    house: 'Valentino',
    year: 2022,
    family: 'Woody Amber',
    families: ['Woody', 'Amber'],
    concentration: 'EDP Intense',
    badge: 'Trending',
    description: 'A brooding, intensified take — black pepper and leather give it a darker edge the original lacks, making it one of Valentino\'s most compelling masculine releases.',
    notes: {
      top:   [{ name: 'Bergamot' }, { name: 'Black Pepper' }, { name: 'Cardamom' }],
      heart: [{ name: 'Vetiver' }, { name: 'Hawthorn' }, { name: 'Leather' }],
      base:  [{ name: 'Tonka Bean' }, { name: 'Vanilla' }, { name: 'Iso E Super' }],
    },
    accords: [
      { name: 'Woody', strength: 88 }, { name: 'Spicy', strength: 82 },
      { name: 'Leather', strength: 78 }, { name: 'Warm', strength: 85 },
      { name: 'Citrus', strength: 65 }, { name: 'Sweet', strength: 70 },
    ],
    longevity: 9, sillage: 'Strong', projection: 82,
  },
  {
    id: 'azzaro-most-wanted',
    name: 'The Most Wanted Parfum',
    house: 'Azzaro',
    year: 2021,
    family: 'Amber Gourmand',
    families: ['Amber', 'Gourmand'],
    concentration: 'Parfum',
    badge: 'Trending',
    description: 'Sweet, boldly gourmand warmth with a spicy ginger kick. Unapologetically seductive — toffee-vanilla-caramel pushed to maximum richness.',
    notes: {
      top:   [{ name: 'Ginger' }, { name: 'Red Ginger' }],
      heart: [{ name: 'Toffee' }, { name: 'Woody Notes' }],
      base:  [{ name: 'Bourbon Vanilla' }, { name: 'Tonka Bean' }, { name: 'Caramel' }],
    },
    accords: [
      { name: 'Gourmand', strength: 95 }, { name: 'Sweet', strength: 90 },
      { name: 'Spicy', strength: 78 }, { name: 'Warm', strength: 85 },
      { name: 'Vanilla', strength: 92 }, { name: 'Woody', strength: 55 },
    ],
    longevity: 10, sillage: 'Beast', projection: 90,
  },
  {
    id: 'prada-paradoxe',
    name: 'Paradoxe Pour Homme',
    house: 'Prada',
    year: 2023,
    family: 'Fresh Woody',
    families: ['Fresh', 'Woody'],
    concentration: 'EDP',
    badge: 'Trending',
    description: 'A refined iris-vetiver-sandalwood sitting confidently between fresh and warm. Polished, modern, and broad enough for any occasion.',
    notes: {
      top:   [{ name: 'Bergamot' }, { name: 'Neroli' }, { name: 'Mandarin' }],
      heart: [{ name: 'Iris' }, { name: 'Vetiver' }, { name: 'Patchouli' }],
      base:  [{ name: 'Sandalwood' }, { name: 'Amber' }, { name: 'Musk' }],
    },
    accords: [
      { name: 'Fresh', strength: 85 }, { name: 'Woody', strength: 88 },
      { name: 'Floral', strength: 78 }, { name: 'Citrus', strength: 80 },
      { name: 'Earthy', strength: 72 }, { name: 'Musky', strength: 65 },
    ],
    longevity: 8, sillage: 'Moderate', projection: 78,
  },
  {
    id: 'jo-malone-wood-sage',
    name: 'Wood Sage & Sea Salt',
    house: 'Jo Malone',
    year: 2014,
    family: 'Fresh Aromatic',
    families: ['Fresh', 'Aromatic'],
    concentration: 'Cologne',
    badge: 'Trending',
    description: 'Coastal, mineral freshness that smells both effortless and expensive. The gold standard for understated summer luxury and the art of the cologne.',
    notes: {
      top:   [{ name: 'Sea Salt' }, { name: 'Ambrette' }],
      heart: [{ name: 'Sage' }, { name: 'Driftwood' }],
      base:  [{ name: 'Mineral Notes' }, { name: 'Musk' }],
    },
    accords: [
      { name: 'Aquatic', strength: 90 }, { name: 'Aromatic', strength: 85 },
      { name: 'Woody', strength: 72 }, { name: 'Fresh', strength: 92 },
      { name: 'Mineral', strength: 88 }, { name: 'Musky', strength: 65 },
    ],
    longevity: 5, sillage: 'Moderate', projection: 65,
  },
  {
    id: 'gucci-guilty-edp',
    name: 'Guilty EDP Pour Homme',
    house: 'Gucci',
    year: 2023,
    family: 'Woody Aromatic',
    families: ['Woody', 'Aromatic'],
    concentration: 'EDP',
    badge: 'Trending',
    description: 'Warm, confident lavender-patchouli-amber striking a perfect balance between approachable and sophisticated — one of Gucci\'s most broadly wearable releases.',
    notes: {
      top:   [{ name: 'Lemon' }, { name: 'Lavender' }, { name: 'Orange' }],
      heart: [{ name: 'Neroli' }, { name: 'Cedar' }, { name: 'Patchouli' }],
      base:  [{ name: 'Vetiver' }, { name: 'Amber' }, { name: 'Musk' }],
    },
    accords: [
      { name: 'Aromatic', strength: 88 }, { name: 'Woody', strength: 85 },
      { name: 'Warm', strength: 80 }, { name: 'Citrus', strength: 72 },
      { name: 'Earthy', strength: 78 }, { name: 'Musky', strength: 68 },
    ],
    longevity: 8, sillage: 'Strong', projection: 80,
  },
  {
    id: 'pdm-perseus',
    name: 'Perseus',
    house: 'Parfums de Marly',
    year: 2023,
    family: 'Fresh Woody',
    families: ['Fresh', 'Woody'],
    concentration: 'EDP',
    badge: 'Trending',
    description: 'A masterclass in fresh-woody balance — citrus brightness through a cardamom-vetiver heart landing on warm sandalwood. Versatile, refined, unmistakably luxurious.',
    notes: {
      top:   [{ name: 'Bergamot' }, { name: 'Grapefruit' }, { name: 'Elemi' }],
      heart: [{ name: 'Cardamom' }, { name: 'Vetiver' }, { name: 'Patchouli' }],
      base:  [{ name: 'Sandalwood' }, { name: 'Amber' }, { name: 'Musk' }],
    },
    accords: [
      { name: 'Fresh', strength: 88 }, { name: 'Woody', strength: 85 },
      { name: 'Citrus', strength: 82 }, { name: 'Spicy', strength: 72 },
      { name: 'Warm', strength: 78 }, { name: 'Musky', strength: 65 },
    ],
    longevity: 9, sillage: 'Strong', projection: 85,
  },
]

export function TrendingFragranceCards() {
  return (
    <EditorialCarousel
      label="Currently Trending"
      sublabel="Click any card to explore its full profile"
    >
      {TRENDING.map((f, i) => (
        <EditorialCard key={f.id} fragrance={f} index={i} />
      ))}
    </EditorialCarousel>
  )
}
