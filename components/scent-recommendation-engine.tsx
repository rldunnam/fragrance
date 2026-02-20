'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, Sun, Snowflake, Briefcase, Heart, Wine, Users } from 'lucide-react'

interface Fragrance {
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
}

const fragrances: Fragrance[] = [
  {
    id: 'sauvage-elixir',
    name: 'Sauvage Elixir',
    house: 'Dior',
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Grapefruit', 'Cinnamon', 'Nutmeg'],
    heartNotes: ['Lavender', 'Licorice'],
    baseNotes: ['Sandalwood', 'Amber', 'Patchouli'],
    rationale: 'A powerful, sophisticated evolution with warm spices perfect for evening elegance.',
    intensity: 5,
    longevity: '8-10 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'bleu-chanel',
    name: 'Bleu de Chanel EDP',
    house: 'Chanel',
    family: ['Woody', 'Amber'],
    occasion: ['Office', 'Formal'],
    season: ['Spring', 'Fall'],
    topNotes: ['Citrus', 'Grapefruit'],
    heartNotes: ['Ginger', 'Jasmine', 'Mint'],
    baseNotes: ['Cedar', 'Sandalwood', 'Amber'],
    rationale: 'Timeless sophistication with balanced projection, ideal for professional confidence.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Moderate-Strong',
    projection: 4,
  },
  {
    id: 'y-le-parfum',
    name: 'Y Le Parfum',
    house: 'YSL',
    family: ['Woody', 'Fresh'],
    occasion: ['Everyday', 'Date Night'],
    season: ['Spring', 'Summer'],
    topNotes: ['Apple', 'Ginger', 'Bergamot'],
    heartNotes: ['Sage', 'Lavender'],
    baseNotes: ['Tonka Bean', 'Cedar', 'Olibanum'],
    rationale: 'Modern and bold with fruity freshness balanced by warm woods for versatile wear.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'aventus',
    name: 'Aventus',
    house: 'Creed',
    family: ['Woody', 'Fresh'],
    occasion: ['Office', 'Formal', 'Date Night'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Pineapple', 'Bergamot', 'Apple'],
    heartNotes: ['Birch', 'Patchouli', 'Jasmine'],
    baseNotes: ['Oakmoss', 'Ambergris', 'Vanilla'],
    rationale: 'The iconic niche powerhouse combining fruity freshness with smoky depth.',
    intensity: 5,
    longevity: '8-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'light-blue',
    name: 'Light Blue Eau Intense',
    house: 'Dolce & Gabbana',
    family: ['Fresh', 'Floral'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Grapefruit', 'Mandarin'],
    heartNotes: ['Juniper', 'Sea Notes'],
    baseNotes: ['Musk', 'Amber'],
    rationale: 'Crisp Mediterranean freshness that remains approachable in warm weather.',
    intensity: 3,
    longevity: '4-6 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'layton',
    name: 'Layton',
    house: 'Parfums de Marly',
    family: ['Woody', 'Floral'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Apple', 'Lavender', 'Mandarin'],
    heartNotes: ['Geranium', 'Jasmine', 'Violet'],
    baseNotes: ['Vanilla', 'Patchouli', 'Guaiac Wood'],
    rationale: 'Intoxicating sweetness with floral sophistication, a crowd-pleasing evening masterpiece.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'versace-eros',
    name: 'Eros',
    house: 'Versace',
    family: ['Fresh', 'Woody'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Mint', 'Lemon', 'Apple'],
    heartNotes: ['Tonka Bean', 'Ambroxan', 'Geranium'],
    baseNotes: ['Vanilla', 'Cedar', 'Oakmoss'],
    rationale: 'Youthful and vibrant with fresh mint opening and sweet dry-down for confident presence.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'jazz-club',
    name: 'Jazz Club',
    house: 'Maison Margiela',
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Pink Pepper', 'Lemon', 'Neroli'],
    heartNotes: ['Rum', 'Java Vetiver', 'Clary Sage'],
    baseNotes: ['Tobacco Leaf', 'Vanilla', 'Styrax'],
    rationale: 'Smoky, sophisticated warmth evoking intimate evening settings with boozy sweetness.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Moderate-Strong',
    projection: 4,
  },
  {
    id: 'acqua-di-gio',
    name: 'Acqua di Giò Profumo',
    house: 'Giorgio Armani',
    family: ['Fresh', 'Woody'],
    occasion: ['Office', 'Everyday'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Sea Notes'],
    heartNotes: ['Geranium', 'Rosemary', 'Sage'],
    baseNotes: ['Patchouli', 'Incense'],
    rationale: 'Refined aquatic freshness with aromatic depth, perfect for professional versatility.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'stronger-with-you',
    name: 'Stronger With You Intensely',
    house: 'Emporio Armani',
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Pink Pepper', 'Juniper'],
    heartNotes: ['Cinnamon', 'Lavender', 'Sage'],
    baseNotes: ['Tonka Bean', 'Vanilla', 'Amber'],
    rationale: 'Warm, inviting sweetness with spicy depth that creates intimate connection.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'terre-hermes',
    name: 'Terre d\'Hermès',
    house: 'Hermès',
    family: ['Woody', 'Fresh'],
    occasion: ['Office', 'Formal', 'Everyday'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Grapefruit', 'Orange'],
    heartNotes: ['Pepper', 'Pelargonium'],
    baseNotes: ['Vetiver', 'Cedar', 'Patchouli'],
    rationale: 'Sophisticated earthiness with citrus brightness, the epitome of refined masculinity.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'spicebomb-extreme',
    name: 'Spicebomb Extreme',
    house: 'Viktor & Rolf',
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Black Pepper', 'Grapefruit'],
    heartNotes: ['Cinnamon', 'Saffron', 'Lavender'],
    baseNotes: ['Tobacco', 'Vanilla', 'Bourbon'],
    rationale: 'Explosive warmth with rich spices and tobacco, commanding attention in cold weather.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'tom-ford-oud',
    name: 'Oud Wood',
    house: 'Tom Ford',
    family: ['Woody', 'Amber'],
    occasion: ['Formal', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Rosewood', 'Cardamom', 'Chinese Pepper'],
    heartNotes: ['Oud', 'Sandalwood', 'Vetiver'],
    baseNotes: ['Amber', 'Tonka Bean', 'Vanilla'],
    rationale: 'Smooth, approachable oud with velvety woods and subtle sweetness for sophisticated elegance.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'prada-lhomme',
    name: 'L\'Homme Prada',
    house: 'Prada',
    family: ['Fresh', 'Amber'],
    occasion: ['Office', 'Everyday'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Neroli', 'Black Pepper', 'Carrot Seeds'],
    heartNotes: ['Iris', 'Geranium', 'Mate'],
    baseNotes: ['Amber', 'Cedar', 'Patchouli'],
    rationale: 'Clean, powdery iris creates understated elegance perfect for refined modern professionals.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'the-one-edp',
    name: 'The One EDP',
    house: 'Dolce & Gabbana',
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Grapefruit', 'Coriander', 'Basil'],
    heartNotes: ['Ginger', 'Cardamom', 'Orange Blossom'],
    baseNotes: ['Amber', 'Tobacco', 'Cedar'],
    rationale: 'Seductive amber-tobacco blend with spicy warmth, perfect for intimate evening occasions.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Moderate-Strong',
    projection: 4,
  },
  {
    id: 'one-million',
    name: 'One Million Parfum',
    house: 'Paco Rabanne',
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Blood Mandarin', 'Sage', 'Cardamom'],
    heartNotes: ['Rose', 'Cinnamon', 'Neroli'],
    baseNotes: ['Tonka Bean', 'Amber', 'Leather'],
    rationale: 'Bold, attention-grabbing sweetness with spicy leather undertones for confident statements.',
    intensity: 5,
    longevity: '8-10 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'givenchy-gentleman',
    name: 'Gentleman Réserve Privée',
    house: 'Givenchy',
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Whiskey', 'Cinnamon'],
    heartNotes: ['Iris', 'Orris'],
    baseNotes: ['Leather', 'Tonka Bean', 'Patchouli'],
    rationale: 'Refined whiskey-iris composition with smooth leather, embodying evening sophistication.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'valentino-uomo',
    name: 'Uomo Intense',
    house: 'Valentino',
    family: ['Amber', 'Woody'],
    occasion: ['Office', 'Everyday', 'Date Night'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Mandarin', 'Clary Sage'],
    heartNotes: ['Iris', 'Tonka Bean'],
    baseNotes: ['Vanilla', 'Leather', 'Amber'],
    rationale: 'Powdery iris meets creamy vanilla in a versatile, comforting signature scent.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'green-irish-tweed',
    name: 'Green Irish Tweed',
    house: 'Creed',
    family: ['Fresh', 'Woody'],
    occasion: ['Office', 'Everyday', 'Formal'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Lemon Verbena', 'Peppermint'],
    heartNotes: ['Violet Leaves', 'Iris'],
    baseNotes: ['Sandalwood', 'Ambergris'],
    rationale: 'Fresh, green elegance with a classic masculine edge, timeless and refined.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'tobacco-vanille',
    name: 'Tobacco Vanille',
    house: 'Tom Ford',
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Tobacco Leaf', 'Spicy Notes'],
    heartNotes: ['Vanilla', 'Cocoa', 'Tonka Bean'],
    baseNotes: ['Dried Fruits', 'Woody Notes'],
    rationale: 'Decadent tobacco-vanilla pairing creates luxurious warmth for cold-weather evenings.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'mont-blanc-legend',
    name: 'Legend Spirit',
    house: 'Mont Blanc',
    family: ['Fresh', 'Woody'],
    occasion: ['Office', 'Everyday'],
    season: ['Spring', 'Summer'],
    topNotes: ['Pink Pepper', 'Grapefruit', 'Bergamot'],
    heartNotes: ['Aquatic Notes', 'Lavender', 'Cardamom'],
    baseNotes: ['White Musk', 'Cashmere Wood', 'Oakmoss'],
    rationale: 'Fresh aquatic brightness with woody drydown, offering accessible everyday versatility.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 2,
  },
  {
    id: 'dior-homme-intense',
    name: 'Dior Homme Intense',
    house: 'Dior',
    family: ['Floral', 'Woody'],
    occasion: ['Office', 'Date Night', 'Formal'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Lavender', 'Sage', 'Bergamot'],
    heartNotes: ['Iris', 'Ambrette', 'Pear'],
    baseNotes: ['Cedar', 'Vetiver', 'Musk'],
    rationale: 'Powdery iris elegance with subtle lipstick accord, refined and distinctive.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Moderate-Strong',
    projection: 4,
  },
  {
    id: 'jpg-ultra-male',
    name: 'Ultra Male',
    house: 'Jean Paul Gaultier',
    family: ['Amber', 'Fresh'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Pear', 'Bergamot', 'Black Lavender'],
    heartNotes: ['Mint', 'Cinnamon', 'Cumin'],
    baseNotes: ['Vanilla', 'Amber', 'Cedar'],
    rationale: 'Sweet, spicy powerhouse with fresh opening, polarizing but unforgettable.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'bvlgari-man',
    name: 'Man in Black',
    house: 'Bvlgari',
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Rum', 'Spices'],
    heartNotes: ['Iris', 'Tuberose', 'Leather'],
    baseNotes: ['Benzoin', 'Tonka Bean', 'Guaiac Wood'],
    rationale: 'Dark, mysterious composition with boozy spices and smooth leather depth.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'azzaro-wanted',
    name: 'The Most Wanted Parfum',
    house: 'Azzaro',
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Ginger', 'Red Ginger'],
    heartNotes: ['Toffee', 'Woody Notes'],
    baseNotes: ['Bourbon Vanilla', 'Tonka Bean', 'Caramel'],
    rationale: 'Sweet, gourmand warmth with spicy ginger kick, boldly modern and seductive.',
    intensity: 5,
    longevity: '8-10 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'burberry-london',
    name: 'London for Men',
    house: 'Burberry',
    family: ['Woody', 'Fresh'],
    occasion: ['Office', 'Formal', 'Everyday'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Bergamot', 'Lavender', 'Cinnamon'],
    heartNotes: ['Mimosa', 'Leather', 'Port Wine'],
    baseNotes: ['Tobacco Leaf', 'Guaiac Wood', 'Oud'],
    rationale: 'Warm, gentlemanly tobacco-leather blend with boozy character, refined and classic.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'carolina-herrera',
    name: 'Bad Boy Cobalt',
    house: 'Carolina Herrera',
    family: ['Amber', 'Fresh'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Pink Pepper', 'Plum'],
    heartNotes: ['Sage', 'Lavender'],
    baseNotes: ['Tonka Bean', 'Amber', 'Cedarwood'],
    rationale: 'Fresh spicy opening mellows into warm amber sweetness, youthful and versatile.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'chanel-allure-sport',
    name: 'Allure Homme Sport Eau Extrême',
    house: 'Chanel',
    family: ['Fresh', 'Woody'],
    occasion: ['Office', 'Everyday'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Mandarin', 'Mint', 'Cypress'],
    heartNotes: ['Pepper', 'Neroli', 'Cedar'],
    baseNotes: ['Tonka Bean', 'Musk', 'Sandalwood'],
    rationale: 'Athletic freshness with woody depth, energetic yet sophisticated for active lifestyles.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Moderate-Strong',
    projection: 4,
  },
  {
    id: 'mancera-cedrat-boise',
    name: 'Cedrat Boise',
    house: 'Mancera',
    family: ['Woody', 'Fresh'],
    occasion: ['Office', 'Everyday', 'Date Night'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Blackcurrant', 'Lemon', 'Bergamot'],
    heartNotes: ['Patchouli', 'Jasmine', 'Fruits'],
    baseNotes: ['Leather', 'Oakmoss', 'Vanilla', 'White Musk'],
    rationale: 'Fresh citrus opening transitions to woody leather, versatile and long-lasting niche option.',
    intensity: 4,
    longevity: '10-12 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'armaf-cdnim',
    name: 'Club de Nuit Intense Man',
    house: 'Armaf',
    family: ['Woody', 'Fresh'],
    occasion: ['Office', 'Everyday', 'Date Night'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Pineapple', 'Lemon', 'Bergamot', 'Blackcurrant'],
    heartNotes: ['Birch', 'Jasmine', 'Rose'],
    baseNotes: ['Musk', 'Oakmoss', 'Ambergris', 'Vanilla'],
    rationale: 'Accessible alternative to luxury fragrances, fruity-smoky profile with impressive longevity.',
    intensity: 5,
    longevity: '8-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
]

const occasions = [
  { id: 'Everyday', label: 'Everyday', icon: Sun, description: 'Versatile daily wear' },
  { id: 'Office', label: 'Office', icon: Briefcase, description: 'Professional settings' },
  { id: 'Date Night', label: 'Date Night', icon: Heart, description: 'Intimate evenings' },
  { id: 'Formal', label: 'Formal', icon: Wine, description: 'Black tie events' },
]

const seasons = [
  { id: 'Spring', label: 'Spring', icon: Sparkles },
  { id: 'Summer', label: 'Summer', icon: Sun },
  { id: 'Fall', label: 'Fall', icon: Users },
  { id: 'Winter', label: 'Winter', icon: Snowflake },
]

const scentFamilies = [
  { id: 'Fresh', label: 'Fresh', description: 'Citrus, aquatic, green' },
  { id: 'Woody', label: 'Woody', description: 'Cedar, sandalwood, vetiver' },
  { id: 'Amber', label: 'Amber', description: 'Vanilla, spice, warmth' },
  { id: 'Floral', label: 'Floral', description: 'Rose, jasmine, lavender' },
]

export function ScentRecommendationEngine() {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null)
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([])

  const filteredFragrances = useMemo(() => {
    let results = fragrances

    if (selectedOccasion) {
      results = results.filter(f => f.occasion.includes(selectedOccasion))
    }

    if (selectedSeasons.length > 0) {
      results = results.filter(f => 
        f.season.some(s => selectedSeasons.includes(s))
      )
    }

    if (selectedFamilies.length > 0) {
      results = results.filter(f => 
        f.family.some(fam => selectedFamilies.includes(fam))
      )
    }

    // Sort by intensity and longevity for best recommendations first
    return results.sort((a, b) => b.intensity - a.intensity)
  }, [selectedOccasion, selectedSeasons, selectedFamilies])

  const toggleSeason = (seasonId: string) => {
    setSelectedSeasons(prev => 
      prev.includes(seasonId) 
        ? prev.filter(s => s !== seasonId)
        : [...prev, seasonId]
    )
  }

  const toggleFamily = (familyId: string) => {
    setSelectedFamilies(prev => 
      prev.includes(familyId) 
        ? prev.filter(f => f !== familyId)
        : [...prev, familyId]
    )
  }

  const hasActiveFilters = selectedOccasion || selectedSeasons.length > 0 || selectedFamilies.length > 0

  return (
    <div className="scroll-reveal my-8">
      <div className="rounded-lg border border-gold/20 bg-surface overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-surface-elevated to-surface-hover px-6 py-5 border-b border-gold/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-cream">Find Your Perfect Scent</h3>
              <p className="text-sm text-cream-muted">
                Select your preferences to discover personalized recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 space-y-6">
          {/* Occasion Selection */}
          <div>
            <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-gold">
              Occasion
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {occasions.map(({ id, label, icon: Icon, description }) => (
                <button
                  key={id}
                  onClick={() => setSelectedOccasion(selectedOccasion === id ? null : id)}
                  className={cn(
                    'group relative flex flex-col items-center gap-2 rounded-lg border px-4 py-4 transition-all duration-300',
                    'hover:border-gold/50 hover:bg-surface-elevated hover:scale-105',
                    selectedOccasion === id
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                      : 'border-gold/20 bg-surface-elevated/50'
                  )}
                  style={{ cursor: 'pointer' }}
                >
                  <Icon
                    className={cn(
                      'h-6 w-6 transition-colors',
                      selectedOccasion === id ? 'text-gold' : 'text-cream-muted'
                    )}
                  />
                  <span className={cn(
                    'text-sm font-medium transition-colors',
                    selectedOccasion === id ? 'text-cream' : 'text-cream-muted'
                  )}>
                    {label}
                  </span>
                  <span className="text-xs text-cream-muted/70">{description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Season Selection */}
          <div>
            <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-gold">
              Season <span className="text-cream-muted/60 normal-case">(multi-select)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {seasons.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => toggleSeason(id)}
                  className={cn(
                    'group flex items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-all duration-300',
                    'hover:border-gold/50 hover:bg-surface-elevated hover:scale-105',
                    selectedSeasons.includes(id)
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                      : 'border-gold/20 bg-surface-elevated/50'
                  )}
                  style={{ cursor: 'pointer' }}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-colors',
                      selectedSeasons.includes(id) ? 'text-gold' : 'text-cream-muted'
                    )}
                  />
                  <span className={cn(
                    'text-sm font-medium transition-colors',
                    selectedSeasons.includes(id) ? 'text-cream' : 'text-cream-muted'
                  )}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Scent Family Selection */}
          <div>
            <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-gold">
              Preferred Scent Family <span className="text-cream-muted/60 normal-case">(multi-select)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {scentFamilies.map(({ id, label, description }) => (
                <button
                  key={id}
                  onClick={() => toggleFamily(id)}
                  className={cn(
                    'group flex flex-col items-start gap-1 rounded-lg border px-4 py-3 transition-all duration-300 text-left',
                    'hover:border-gold/50 hover:bg-surface-elevated hover:scale-105',
                    selectedFamilies.includes(id)
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                      : 'border-gold/20 bg-surface-elevated/50'
                  )}
                  style={{ cursor: 'pointer' }}
                >
                  <span className={cn(
                    'text-sm font-medium transition-colors',
                    selectedFamilies.includes(id) ? 'text-cream' : 'text-cream-muted'
                  )}>
                    {label}
                  </span>
                  <span className="text-xs text-cream-muted/70 leading-tight">{description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="border-t border-gold/20 bg-surface-elevated/30 px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
              Recommendations
            </h4>
            <div className="text-sm text-cream-muted">
              {filteredFragrances.length} {filteredFragrances.length === 1 ? 'match' : 'matches'}
            </div>
          </div>

          {!hasActiveFilters ? (
            <div className="rounded-lg border border-dashed border-gold/20 bg-surface/50 px-6 py-12 text-center">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-gold/40" />
              <p className="text-cream-muted">
                Select your preferences above to discover your perfect fragrance
              </p>
            </div>
          ) : filteredFragrances.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gold/20 bg-surface/50 px-6 py-12 text-center">
              <p className="text-cream-muted">
                No fragrances match your current selection. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFragrances.map((fragrance) => (
                <FragranceCard key={fragrance.id} fragrance={fragrance} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Projection rating visualizer with gold icons
function ProjectionRating({ rating }: { rating: number }) {
  const getProjectionLabel = (rating: number) => {
    if (rating === 1) return 'Low'
    if (rating === 2) return 'Moderate'
    if (rating === 3) return 'Good'
    if (rating === 4) return 'Strong'
    return 'Very Strong'
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={cn(
              'h-3 w-3 transition-all duration-300',
              star <= rating ? 'text-gold fill-gold' : 'text-gold/20 fill-none'
            )}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
        ))}
      </div>
      <span className="text-[10px] uppercase tracking-wider text-gold/70 font-medium">
        {getProjectionLabel(rating)}
      </span>
    </div>
  )
}

function FragranceCard({ fragrance }: { fragrance: Fragrance }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border border-gold/30 bg-gradient-to-br from-surface-elevated to-surface transition-all duration-500',
        'hover:border-gold hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02]',
        isExpanded ? 'border-gold shadow-lg shadow-gold/20' : ''
      )}
      style={{ cursor: 'pointer' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-5"
      >
        {/* Header */}
        <div className="mb-3">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h5 className="font-serif text-lg leading-tight text-cream">{fragrance.name}</h5>
            <div className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full border transition-all',
              isExpanded 
                ? 'border-gold bg-gold/20 rotate-180' 
                : 'border-gold/30 bg-gold/5'
            )}>
              <svg
                className={cn('h-3 w-3', isExpanded ? 'text-gold' : 'text-cream-muted')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-gold-light">{fragrance.house}</div>
        </div>

        {/* Families */}
        <div className="mb-3 flex flex-wrap gap-2">
          {fragrance.family.map((fam) => (
            <span
              key={fam}
              className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs text-gold-light"
            >
              {fam}
            </span>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-cream-muted/70">Longevity:</span>{' '}
              <span className="text-cream-muted">{fragrance.longevity}</span>
            </div>
            <div>
              <span className="text-cream-muted/70">Sillage:</span>{' '}
              <span className="text-cream-muted">{fragrance.sillage}</span>
            </div>
          </div>
          <div className="pt-1 border-t border-gold/10">
            <div className="flex items-center justify-between">
              <span className="text-cream-muted/70">Projection:</span>
              <ProjectionRating rating={fragrance.projection} />
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-500',
            isExpanded ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="space-y-3 border-t border-gold/20 pt-4">
            {/* Rationale */}
            <p className="text-sm leading-relaxed text-cream-muted italic">
              {fragrance.rationale}
            </p>

            {/* Notes */}
            <div className="space-y-2">
              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-gold/80">
                  Top Notes
                </div>
                <div className="text-sm text-cream-muted">{fragrance.topNotes.join(', ')}</div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-gold/80">
                  Heart Notes
                </div>
                <div className="text-sm text-cream-muted">{fragrance.heartNotes.join(', ')}</div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-gold/80">
                  Base Notes
                </div>
                <div className="text-sm text-cream-muted">{fragrance.baseNotes.join(', ')}</div>
              </div>
            </div>

            {/* Intensity Bar */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium uppercase tracking-wider text-gold/80">Intensity</span>
                <span className="text-cream-muted">{fragrance.intensity}/5</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-1000"
                  style={{ width: `${(fragrance.intensity / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}
