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

export const scentFamilies = [
  { id: 'Fresh', label: 'Fresh', description: 'Citrus, aquatic, green' },
  { id: 'Woody', label: 'Woody', description: 'Cedar, sandalwood, vetiver' },
  { id: 'Amber', label: 'Amber', description: 'Vanilla, spice, warmth' },
  { id: 'Floral', label: 'Floral', description: 'Rose, jasmine, lavender' },
]

export const budgetRanges = [
  { id: 'under-75',  label: 'Under $75',   min: 0,   max: 75       },
  { id: '75-150',    label: '$75 – $150',   min: 75,  max: 150      },
  { id: '150-300',   label: '$150 – $300',  min: 150, max: 300      },
  { id: 'over-300',  label: 'Over $300',    min: 300, max: Infinity },
]
