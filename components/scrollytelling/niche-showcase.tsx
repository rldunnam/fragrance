'use client'

import { EditorialCard, EditorialCarousel } from './editorial-card'
import type { EditorialFragrance } from './editorial-card'

const FRAGRANCES: EditorialFragrance[] = [
  {
    id: 'aventus',
    name: 'Aventus',
    house: 'Creed',
    perfumer: 'Olivier Creed & Erwin Creed',
    year: 2010,
    price: '$300–$470',
    family: 'Fruity Chypre',
    families: ['Fruity', 'Chypre'],
    badge: 'Niche',
    description: 'The modern icon that launched a thousand clones. Smoky pineapple opening gives way to a rich woody dry-down that defined a generation of fragrance enthusiasts.',
    notes: {
      top:   [{ name: 'Pineapple' }, { name: 'Bergamot' }, { name: 'Blackcurrant' }, { name: 'Apple' }],
      heart: [{ name: 'Birch' }, { name: 'Rose' }, { name: 'Jasmine' }, { name: 'Patchouli' }],
      base:  [{ name: 'Oakmoss' }, { name: 'Ambergris' }, { name: 'Musk' }, { name: 'Vanilla' }],
    },
    accords: [
      { name: 'Fruity', strength: 90 }, { name: 'Woody', strength: 85 },
      { name: 'Smoky', strength: 70 }, { name: 'Fresh', strength: 65 },
      { name: 'Mossy', strength: 55 }, { name: 'Sweet', strength: 45 },
    ],
    longevity: 10, sillage: 'Strong', projection: 82,
  },
  {
    id: 'layton',
    name: 'Layton',
    house: 'Parfums de Marly',
    perfumer: 'Hamid Merati-Kashani',
    year: 2016,
    price: '$205–$335',
    family: 'Woody Floral',
    families: ['Woody', 'Floral'],
    badge: 'Niche',
    description: 'An intoxicating crowd-pleaser bridging approachable and complex. Apple-lavender opening leads to an addictive vanilla-guaiac wood base that keeps people leaning in.',
    notes: {
      top:   [{ name: 'Apple' }, { name: 'Lavender' }, { name: 'Bergamot' }, { name: 'Mandarin' }],
      heart: [{ name: 'Jasmine' }, { name: 'Violet' }, { name: 'Iris' }, { name: 'Geranium' }],
      base:  [{ name: 'Vanilla' }, { name: 'Guaiac Wood' }, { name: 'Pepper' }, { name: 'Sandalwood' }],
    },
    accords: [
      { name: 'Sweet', strength: 88 }, { name: 'Woody', strength: 82 },
      { name: 'Floral', strength: 75 }, { name: 'Spicy', strength: 68 },
      { name: 'Powdery', strength: 55 }, { name: 'Fresh', strength: 42 },
    ],
    longevity: 12, sillage: 'Beast', projection: 88,
  },
  {
    id: 'jazz-club',
    name: 'Jazz Club',
    house: 'Maison Margiela',
    perfumer: 'Alienor Massenet',
    year: 2013,
    price: '$100–$160',
    family: 'Tobacco Vanilla',
    families: ['Tobacco', 'Gourmand'],
    badge: 'Niche',
    description: 'Rum-soaked tobacco meets creamy vanilla. The olfactory equivalent of a velvet armchair by a fireplace — atmospheric, warm, unmistakably distinctive.',
    notes: {
      top:   [{ name: 'Pink Pepper' }, { name: 'Lemon' }, { name: 'Neroli' }],
      heart: [{ name: 'Rum Absolute' }, { name: 'Clary Sage' }, { name: 'Tobacco Leaf' }],
      base:  [{ name: 'Vanilla Bean' }, { name: 'Tonka Bean' }, { name: 'Musk' }],
    },
    accords: [
      { name: 'Tobacco', strength: 92 }, { name: 'Sweet', strength: 80 },
      { name: 'Boozy', strength: 78 }, { name: 'Spicy', strength: 65 },
      { name: 'Smoky', strength: 60 }, { name: 'Vanilla', strength: 72 },
    ],
    longevity: 8, sillage: 'Moderate', projection: 65,
  },
  {
    id: 'jubilation-xxv',
    name: 'Jubilation XXV',
    house: 'Amouage',
    perfumer: 'Bertrand Duchaufour',
    year: 2008,
    price: '$270–$430',
    family: 'Oriental Woody',
    families: ['Oriental', 'Woody'],
    badge: 'Niche',
    description: 'An opulent oriental masterpiece. Layer upon layer of spices, florals, and precious resins unfold over hours — fragrance as fine art.',
    notes: {
      top:   [{ name: 'Tarragon' }, { name: 'Coriander' }, { name: 'Orange' }, { name: 'Blackberry' }],
      heart: [{ name: 'Rose' }, { name: 'Guaiac Wood' }, { name: 'Orchid' }, { name: 'Cinnamon' }],
      base:  [{ name: 'Oud' }, { name: 'Amber' }, { name: 'Frankincense' }, { name: 'Musks' }],
    },
    accords: [
      { name: 'Woody', strength: 95 }, { name: 'Resinous', strength: 88 },
      { name: 'Spicy', strength: 85 }, { name: 'Floral', strength: 70 },
      { name: 'Balsamic', strength: 65 }, { name: 'Oud', strength: 60 },
    ],
    longevity: 16, sillage: 'Strong', projection: 78,
  },
  {
    id: 'br540',
    name: 'Baccarat Rouge 540',
    house: 'Maison Francis Kurkdjian',
    year: 2015,
    price: '$325–$525',
    family: 'Floral Woody Amber',
    families: ['Floral', 'Woody', 'Amber'],
    badge: 'Niche',
    description: "Crystalline amber-woody-floral phenomenon. Its warm-metallic character — simultaneously gourmand and mineral — made it the most recognisable fragrance of the 2010s.",
    notes: {
      top:   [{ name: 'Saffron' }, { name: 'Jasmine' }],
      heart: [{ name: 'Amberwood' }, { name: 'Ambergris' }],
      base:  [{ name: 'Fir Resin' }, { name: 'Cedar' }],
    },
    accords: [
      { name: 'Woody', strength: 88 }, { name: 'Sweet', strength: 82 },
      { name: 'Floral', strength: 70 }, { name: 'Amber', strength: 78 },
      { name: 'Spicy', strength: 55 }, { name: 'Musky', strength: 60 },
    ],
    longevity: 12, sillage: 'Strong', projection: 85,
  },
  {
    id: 'oud-wood',
    name: 'Oud Wood',
    house: 'Tom Ford',
    year: 2007,
    price: '$200–$350',
    family: 'Woody Oriental',
    families: ['Woody', 'Oriental'],
    badge: 'Niche',
    description: 'The fragrance that introduced oud to Western audiences. Soft, warm, and inviting rather than medicinal — it opened the door for an entire generation of oud masculines.',
    notes: {
      top:   [{ name: 'Oud' }, { name: 'Rosewood' }, { name: 'Cardamom' }],
      heart: [{ name: 'Sandalwood' }, { name: 'Vetiver' }, { name: 'Tonka Bean' }],
      base:  [{ name: 'Amber' }, { name: 'Musk' }, { name: 'Vanilla' }],
    },
    accords: [
      { name: 'Woody', strength: 92 }, { name: 'Oud', strength: 85 },
      { name: 'Spicy', strength: 65 }, { name: 'Warm', strength: 78 },
      { name: 'Smoky', strength: 55 }, { name: 'Sweet', strength: 48 },
    ],
    longevity: 10, sillage: 'Moderate', projection: 72,
  },
]

export function NicheShowcase() {
  return (
    <EditorialCarousel
      label="Premium Collection"
      sublabel="Click any card to explore its full profile"
    >
      {FRAGRANCES.map((f, i) => (
        <EditorialCard key={f.id} fragrance={f} index={i} />
      ))}
    </EditorialCarousel>
  )
}
