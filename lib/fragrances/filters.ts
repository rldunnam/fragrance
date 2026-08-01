import { Sun, Briefcase, Heart, Wine, Sparkles, Snowflake, Users } from 'lucide-react'

export const occasions = [
  { id: 'Everyday', label: 'Everyday', icon: Sun, description: 'Versatile daily wear' },
  { id: 'Office', label: 'Office', icon: Briefcase, description: 'Professional settings' },
  { id: 'Date Night', label: 'Date Night', icon: Heart, description: 'Intimate evenings' },
  { id: 'Formal', label: 'Formal', icon: Wine, description: 'Black tie events' },
]

export const seasons = [
  { id: 'Spring', label: 'Spring', icon: Sparkles },
  { id: 'Summer', label: 'Summer', icon: Sun },
  { id: 'Fall', label: 'Fall', icon: Users },
  { id: 'Winter', label: 'Winter', icon: Snowflake },
]

// Order runs most-used first, then grouped by character. The grid is
// grid-cols-2 / md:grid-cols-4, so 12 entries lay out as 3 clean rows on
// desktop and 6 on mobile.
//
// Every id here must have a colour in accent-color.ts, and every family used
// in data.ts must appear here or it becomes unreachable by filtering.
// scripts/validate-fragrances.mjs enforces both directions.
export const scentFamilies = [
  { id: 'Woody',    label: 'Woody',    description: 'Cedar, sandalwood, vetiver' },
  { id: 'Amber',    label: 'Amber',    description: 'Vanilla, spice, warmth' },
  { id: 'Fresh',    label: 'Fresh',    description: 'Clean, green, airy' },
  { id: 'Floral',   label: 'Floral',   description: 'Rose, jasmine, peony' },
  { id: 'Aromatic', label: 'Aromatic', description: 'Herbs, lavender, sage' },
  { id: 'Aquatic',  label: 'Aquatic',  description: 'Marine, salt, ozone' },
  { id: 'Spicy',    label: 'Spicy',    description: 'Pepper, cardamom, clove' },
  { id: 'Fougère',  label: 'Fougère',  description: 'Lavender, oakmoss, coumarin' },
  { id: 'Citrus',   label: 'Citrus',   description: 'Bergamot, lemon, mandarin' },
  { id: 'Gourmand', label: 'Gourmand', description: 'Vanilla, caramel, cocoa' },
  { id: 'Leather',  label: 'Leather',  description: 'Suede, birch tar, smoke' },
  { id: 'Powdery',  label: 'Powdery',  description: 'Iris, violet, soft musk' },
]

export const budgetRanges = [
  { id: 'under-75',  label: 'Under $75',   min: 0,   max: 75       },
  { id: '75-150',    label: '$75 – $150',   min: 75,  max: 150      },
  { id: '150-300',   label: '$150 – $300',  min: 150, max: 300      },
  { id: 'over-300',  label: 'Over $300',    min: 300, max: Infinity },
]
