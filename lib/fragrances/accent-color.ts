/**
 * Derives a systematic accent color from a fragrance's family tags.
 * Priority: first matching family tag wins. Falls back to gold if no match.
 *
 * Design rationale:
 *   Woody      → warm brown-amber   — earth, bark, resin
 *   Fresh      → slate blue         — air, water, clean linen
 *   Aromatic   → sage green         — herbs, fields, botanicals
 *   Oriental   → deep copper        — spice routes, incense, silk
 *   Amber      → rich gold-amber    — warmth, resin, honey
 *   Floral     → dusty rose         — petals, soft femininity
 *   Aquatic    → steel teal         — ocean, minerals, salt air
 *   Fougère    → muted green-grey   — ferns, moss, masculine classic
 *   Chypre     → bronze-green       — oakmoss, labdanum, forest floor
 *   Gourmand   → caramel            — sweetness, bakery, warmth
 *   Citrus     → warm yellow        — zest, brightness, morning
 *   Spicy      → burnt sienna       — pepper, cardamom, heat
 *   Tobacco    → rich tan           — cured leaf, leather, smoke
 *   Leather    → dark saddle        — tannins, smoke, animalic
 */

const FAMILY_COLORS: Record<string, string> = {
  // Fresh / clean
  'Fresh':      '#6B8FA8',  // slate blue
  'Aquatic':    '#4A7D8C',  // steel teal
  'Citrus':     '#A08B3A',  // warm antique gold

  // Green / herbal
  'Aromatic':   '#6B8A6B',  // sage green
  'Fougère':    '#5C7A6B',  // muted green-grey
  'Chypre':     '#6B7A4A',  // bronze-green

  // Floral
  'Floral':     '#8A6B7A',  // dusty rose-mauve

  // Warm / spicy
  'Spicy':      '#9A5C3A',  // burnt sienna
  'Oriental':   '#8A5C32',  // deep copper
  'Amber':      '#9A7A3A',  // rich amber-gold

  // Woody
  'Woody':      '#7A6248',  // warm brown
  'Leather':    '#6A4A30',  // dark saddle
  'Tobacco':    '#7A5A38',  // rich tan

  // Sweet
  'Gourmand':   '#8A6A3A',  // caramel

  // Default
  'default':    '#D4AF37',  // gold
}

export function getAccentColor(families: string[]): string {
  for (const fam of families) {
    // Partial match — "Woody Amber" matches "Woody"
    for (const [key, color] of Object.entries(FAMILY_COLORS)) {
      if (key === 'default') continue
      if (fam.toLowerCase().includes(key.toLowerCase())) return color
    }
  }
  return FAMILY_COLORS['default']
}

export function getBottleGradient(accentColor: string): [string, string] {
  // Darken the accent by ~60% for gradient bottom
  return [
    blendWithDark(accentColor, 0.35),
    blendWithDark(accentColor, 0.15),
  ]
}

function blendWithDark(hex: string, t: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const dr = Math.round(r * t)
  const dg = Math.round(g * t)
  const db = Math.round(b * t)
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`
}
