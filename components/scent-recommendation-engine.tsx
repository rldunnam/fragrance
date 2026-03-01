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
  price: number // USD, typical 100ml bottle
}

const fragrances: Fragrance[] = [
  {
    id: 'sauvage-elixir',
    name: 'Sauvage Elixir',
    house: 'Dior',
    price: 195,
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
    price: 170,
    family: ['Woody', 'Amber'],
    occasion: ['Office', 'Formal'],
    season: ['Spring', 'Fall'],
    topNotes: ['Citrus', 'Grapefruit'],
    heartNotes: ['Ginger', 'Jasmine', 'Mint'],
    baseNotes: ['Cedar', 'Sandalwood', 'Amber'],
    rationale: 'Timeless sophistication with balanced projection, ideal for professional confidence.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'y-le-parfum',
    name: 'Y Le Parfum',
    house: 'YSL',
    price: 130,
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
    price: 545,
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
    price: 95,
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
    id: 'dg-pour-homme',
    name: 'Pour Homme',
    house: 'Dolce & Gabbana',
    price: 80,
    family: ['Woody', 'Fresh'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Bergamot', 'Neroli', 'Petitgrain'],
    heartNotes: ['Tobacco', 'Geranium', 'Rosewood'],
    baseNotes: ['Tobacco', 'Musk', 'Amber'],
    rationale: 'The 1994 original that put D&G on the fragrance map — a warm, slightly smoky tobacco-neroli composition that remains a study in restrained Italian masculinity and is criminally underrated today.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'layton',
    name: 'Layton',
    house: 'Parfums de Marly',
    price: 320,
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
    price: 85,
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
    id: 'versace-pour-homme',
    name: 'Pour Homme',
    house: 'Versace',
    price: 75,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Lemon', 'Neroli'],
    heartNotes: ['Clary Sage', 'Hyacinth', 'Cedar'],
    baseNotes: ['Tonka Bean', 'Musk', 'Amber'],
    rationale: 'A clean, Mediterranean fresh-woody that consistently outperforms its price point. Versatile, inoffensive, and frequently cited as one of the best entry-level designer masculines available.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'versace-eros-edp',
    name: 'Eros Eau de Parfum',
    house: 'Versace',
    price: 95,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Lemon', 'Bergamot', 'Apple'],
    heartNotes: ['Tonka Bean', 'Ambroxan', 'Vetiver'],
    baseNotes: ['Vanilla', 'Amber', 'Sandalwood'],
    rationale: 'The EDP takes the Eros formula and darkens it considerably — warmer, richer, and more seductive than the original with a stronger amber-vanilla drydown that lasts significantly longer.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'jazz-club',
    name: 'Jazz Club',
    house: 'Maison Margiela',
    price: 165,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Pink Pepper', 'Lemon', 'Neroli'],
    heartNotes: ['Rum', 'Java Vetiver', 'Clary Sage'],
    baseNotes: ['Tobacco Leaf', 'Vanilla', 'Styrax'],
    rationale: 'Smoky, sophisticated warmth evoking intimate evening settings with boozy sweetness.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'acqua-di-gio',
    name: 'Acqua di Giò Profumo',
    house: 'Giorgio Armani',
    price: 125,
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
    price: 105,
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
    price: 175,
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
    price: 120,
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
    price: 290,
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
    price: 115,
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
    price: 110,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Grapefruit', 'Coriander', 'Basil'],
    heartNotes: ['Ginger', 'Cardamom', 'Orange Blossom'],
    baseNotes: ['Amber', 'Tobacco', 'Cedar'],
    rationale: 'Seductive amber-tobacco blend with spicy warmth, perfect for intimate evening occasions.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'one-million',
    name: 'One Million Parfum',
    house: 'Paco Rabanne',
    price: 120,
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
    price: 135,
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
    price: 110,
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
    price: 495,
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
    price: 290,
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
    house: 'Montblanc',
    price: 65,
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
    price: 155,
    family: ['Floral', 'Woody'],
    occasion: ['Office', 'Date Night', 'Formal'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Lavender', 'Sage', 'Bergamot'],
    heartNotes: ['Iris', 'Ambrette', 'Pear'],
    baseNotes: ['Cedar', 'Vetiver', 'Musk'],
    rationale: 'Powdery iris elegance with subtle lipstick accord, refined and distinctive.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'jpg-ultra-male',
    name: 'Ultra Male',
    house: 'Jean Paul Gaultier',
    price: 90,
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
    price: 110,
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
    price: 85,
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
    id: 'azzaro-wanted-intense',
    name: 'The Most Wanted Intense',
    house: 'Azzaro',
    price: 80,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cardamom', 'Ginger', 'Bergamot'],
    heartNotes: ['Toffee', 'Tobacco', 'Cedar'],
    baseNotes: ['Vanilla', 'Tonka Bean', 'Amber'],
    rationale: 'A spicier, smokier take on the Most Wanted DNA — cardamom and tobacco add depth and masculinity to the signature gourmand sweetness, making it the more complex and evening-focused sibling.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'burberry-london',
    name: 'London for Men',
    house: 'Burberry',
    price: 75,
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
    price: 120,
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
    price: 160,
    family: ['Fresh', 'Woody'],
    occasion: ['Office', 'Everyday'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Mandarin', 'Mint', 'Cypress'],
    heartNotes: ['Pepper', 'Neroli', 'Cedar'],
    baseNotes: ['Tonka Bean', 'Musk', 'Sandalwood'],
    rationale: 'Athletic freshness with woody depth, energetic yet sophisticated for active lifestyles.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'mancera-cedrat-boise',
    name: 'Cedrat Boise',
    house: 'Mancera',
    price: 185,
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
    price: 35,
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
  {
    id: 'pdm-pegasus',
    name: 'Pegasus',
    house: 'Parfums de Marly',
    price: 295,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Heliotrope', 'Bergamot', 'Cumin'],
    heartNotes: ['Bitter Almond', 'Lavender', 'Jasmine'],
    baseNotes: ['Vanilla', 'Sandalwood', 'Amber'],
    rationale: 'Enchanting almond-vanilla sweetness with aromatic depth, beloved for its crowd-pleasing warmth.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'versace-dylan-blue',
    name: 'Dylan Blue',
    house: 'Versace',
    price: 80,
    family: ['Fresh', 'Woody'],
    occasion: ['Office', 'Everyday'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Grapefruit', 'Fig Leaves', 'Bergamot'],
    heartNotes: ['Violet Leaves', 'Papyrus', 'Black Pepper'],
    baseNotes: ['Musk', 'Tonka Bean', 'Incense'],
    rationale: 'Fresh aquatic with woody depth and subtle incense, a versatile modern classic.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'creed-aventus-cologne',
    name: 'Aventus Cologne',
    house: 'Creed',
    price: 430,
    family: ['Fresh', 'Woody'],
    occasion: ['Office', 'Everyday'],
    season: ['Spring', 'Summer'],
    topNotes: ['Mandarin', 'Ginger', 'Pink Pepper'],
    heartNotes: ['Patchouli', 'Vetiver', 'Sandalwood'],
    baseNotes: ['Birch', 'Musk', 'Styrax'],
    rationale: 'Fresher interpretation of Aventus with citrus brightness, perfect for warmer weather.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'le-labo-santal',
    name: 'Santal 33',
    house: 'Le Labo',
    price: 310,
    family: ['Woody', 'Amber'],
    occasion: ['Everyday', 'Office', 'Date Night'],
    season: ['Spring', 'Summer', 'Fall', 'Winter'],
    topNotes: ['Cardamom', 'Iris', 'Violet'],
    heartNotes: ['Sandalwood', 'Papyrus', 'Cedar'],
    baseNotes: ['Leather', 'Amber', 'Musk'],
    rationale: 'Iconic modern unisex sandalwood with leathery undertones, a cult favorite among fragrance enthusiasts.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'ysl-lhomme',
    name: 'L\'Homme Ultime',
    house: 'YSL',
    price: 130,
    family: ['Woody', 'Fresh'],
    occasion: ['Office', 'Date Night', 'Formal'],
    season: ['Spring', 'Fall', 'Winter'],
    topNotes: ['Mint', 'Lavender', 'Bergamot'],
    heartNotes: ['Geranium', 'Vetiver'],
    baseNotes: ['Tonka Bean', 'Cedar', 'Patchouli'],
    rationale: 'Sophisticated fresh aromatic with warm woody base, refined and versatile for modern gentlemen.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'amouage-interlude',
    name: 'Interlude Man',
    house: 'Amouage',
    price: 380,
    family: ['Amber', 'Woody'],
    occasion: ['Formal', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Oregano', 'Pepper', 'Bergamot'],
    heartNotes: ['Amber', 'Incense', 'Opoponax'],
    baseNotes: ['Leather', 'Agarwood', 'Patchouli'],
    rationale: 'Complex, resinous masterpiece with smoky incense and leather, bold niche artistry.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'nasomatto-black-afgano',
    name: 'Black Afgano',
    house: 'Nasomatto',
    price: 225,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cannabis', 'Green Notes'],
    heartNotes: ['Coffee', 'Tobacco', 'Oud'],
    baseNotes: ['Incense', 'Woody Notes', 'Resins'],
    rationale: 'Dark, mysterious composition with earthy cannabis and resinous depth for adventurous wearers.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'roja-elysium',
    name: 'Elysium Pour Homme',
    house: 'Roja Parfums',
    price: 595,
    family: ['Fresh', 'Woody'],
    occasion: ['Office', 'Formal', 'Everyday'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Grapefruit', 'Lime', 'Lavender'],
    heartNotes: ['Lily of the Valley', 'Rose de Mai', 'Jasmine'],
    baseNotes: ['Vetiver', 'Cedar', 'Musk'],
    rationale: 'Luxurious fresh citrus with sophisticated floral-woody blend, impeccably balanced.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'byredo-bal-dafrique',
    name: 'Bal d\'Afrique',
    house: 'Byredo',
    price: 265,
    family: ['Woody', 'Floral'],
    occasion: ['Everyday', 'Date Night'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Bergamot', 'Lemon', 'Neroli'],
    heartNotes: ['African Marigold', 'Violet', 'Cyclamen'],
    baseNotes: ['Vetiver', 'Musk', 'Amber'],
    rationale: 'Bright, optimistic floral-woody blend with unique marigold character, artistic and uplifting.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'initio-side-effect',
    name: 'Side Effect',
    house: 'Initio',
    price: 285,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Rum', 'Cinnamon'],
    heartNotes: ['Tobacco', 'Vanilla', 'Hedione'],
    baseNotes: ['Sandalwood', 'Vetiver'],
    rationale: 'Intoxicating boozy-vanilla with smooth tobacco, addictively sensual and warm.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'atelier-cologne-orange-sanguine',
    name: 'Orange Sanguine',
    house: 'Atelier Cologne',
    price: 165,
    family: ['Fresh'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Blood Orange', 'Bitter Orange', 'Sweet Orange'],
    heartNotes: ['Geranium', 'Jasmine', 'Apple Tree Flowers'],
    baseNotes: ['Sandalwood', 'Amber', 'Tonka Bean'],
    rationale: 'Vibrant, realistic blood orange freshness perfect for bright summer days.',
    intensity: 3,
    longevity: '4-6 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'penhaligon-halfeti',
    name: 'Halfeti',
    house: 'Penhaligon\'s',
    price: 290,
    family: ['Woody', 'Amber'],
    occasion: ['Formal', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Grapefruit', 'Green Notes'],
    heartNotes: ['Rose', 'Saffron', 'Cardamom'],
    baseNotes: ['Oud', 'Leather', 'Amber'],
    rationale: 'Rich Turkish rose meets dark leather and oud, exotic and luxuriously refined.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'xerjoff-naxos',
    name: 'Naxos',
    house: 'Xerjoff',
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Lavender', 'Bergamot', 'Lemon'],
    heartNotes: ['Honey', 'Cinnamon', 'Jasmine'],
    baseNotes: ['Tobacco', 'Vanilla', 'Tonka Bean'],
    rationale: 'Luxurious honey-tobacco blend with aromatic lavender, exquisitely crafted sweetness.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'memo-irish-leather',
    name: 'Irish Leather',
    house: 'Memo Paris',
    price: 310,
    family: ['Woody', 'Amber'],
    occasion: ['Office', 'Everyday', 'Formal'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Pink Pepper', 'Juniper Berries', 'Clary Sage'],
    heartNotes: ['Leather', 'Mate Absolute', 'Iris'],
    baseNotes: ['Amber', 'Tonka Bean'],
    rationale: 'Fresh, green leather with herbal nuances, refined and uniquely approachable.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'hermessence-vetiver-tonka',
    name: 'Vétiver Tonka',
    house: 'Hermès',
    price: 220,
    family: ['Woody'],
    occasion: ['Office', 'Everyday', 'Formal'],
    season: ['Spring', 'Summer', 'Fall', 'Winter'],
    topNotes: ['Vetiver'],
    heartNotes: ['Tonka Bean'],
    baseNotes: ['Cedarwood', 'Oakmoss'],
    rationale: 'Minimalist elegance pairing earthy vetiver with creamy tonka, timeless sophistication.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'frederic-malle-musc-ravageur',
    name: 'Musc Ravageur',
    house: 'Frédéric Malle',
    price: 295,
    family: ['Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Tangerine', 'Lavender'],
    heartNotes: ['Musk', 'Cinnamon', 'Clove'],
    baseNotes: ['Vanilla', 'Amber', 'Sandalwood'],
    rationale: 'Opulent, sensual musk with warm spices and vanilla, intimate and captivating.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'parfums-de-nicolai-new-york',
    name: 'New York',
    house: 'Parfums de Nicolaï',
    price: 175,
    family: ['Woody', 'Fresh'],
    occasion: ['Office', 'Everyday'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Grapefruit', 'Lavender', 'Thyme'],
    heartNotes: ['Geranium', 'Vetiver'],
    baseNotes: ['Oakmoss', 'Leather', 'Musk'],
    rationale: 'Urban chypre with fresh aromatic opening and woody leather base, effortlessly sophisticated.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'nishane-hacivat',
    name: 'Hacivat',
    house: 'Nishane',
    price: 195,
    family: ['Woody', 'Fresh'],
    occasion: ['Office', 'Everyday', 'Date Night'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Pineapple', 'Grapefruit', 'Bergamot'],
    heartNotes: ['Cedar', 'Patchouli', 'Jasmine'],
    baseNotes: ['Oakmoss', 'Woody Notes'],
    rationale: 'Fruity-woody powerhouse with exceptional longevity, a niche alternative to Aventus.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'prada-lhomme-intense',
    name: 'L\'Homme Prada Intense',
    house: 'Prada',
    price: 125,
    family: ['Amber', 'Woody'],
    occasion: ['Office', 'Date Night', 'Formal'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Iris', 'Neroli'],
    heartNotes: ['Amber', 'Tonka Bean', 'Patchouli'],
    baseNotes: ['Sandalwood', 'Leather'],
    rationale: 'Powdery iris meets warm amber and tonka, sophisticated warmth with refined character.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'montale-intense-cafe',
    name: 'Intense Café',
    house: 'Montale',
    price: 110,
    family: ['Amber'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Coffee', 'Rose'],
    heartNotes: ['Incense', 'White Florals'],
    baseNotes: ['Vanilla', 'Amber', 'Woody Notes'],
    rationale: 'Rich coffee-rose gourmand with smooth vanilla, uniquely comforting and addictive.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  // ── TIMELESS CLASSICS (Pre-1990) ──────────────────────────────────────────
  {
    id: 'dior-eau-sauvage',
    name: 'Eau Sauvage',
    house: 'Dior',
    price: 130,
    family: ['Fresh'],
    occasion: ['Everyday', 'Office', 'Formal'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Bergamot', 'Lemon', 'Rosemary'],
    heartNotes: ['Hedione', 'Jasmine', 'Iris'],
    baseNotes: ['Oakmoss', 'Vetiver', 'Musk'],
    rationale: 'The 1966 original that invented modern masculinity. First use of hedione gave it an airy, almost supernatural freshness that still feels contemporary today.',
    intensity: 2,
    longevity: '4-6 hrs',
    sillage: 'Moderate',
    projection: 2,
  },
  {
    id: 'guerlain-vetiver',
    name: 'Vetiver',
    house: 'Guerlain',
    price: 120,
    family: ['Woody', 'Fresh'],
    occasion: ['Office', 'Formal', 'Everyday'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Lemon', 'Bergamot', 'Coriander'],
    heartNotes: ['Tobacco', 'Nutmeg', 'Pepper'],
    baseNotes: ['Vetiver', 'Cedar', 'Oakmoss'],
    rationale: 'The 1961 benchmark that defined vetiver in fine fragrance. Earthy, green, and smoky — a masterclass in understated masculine elegance.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'ysl-kouros',
    name: 'Kouros',
    house: 'YSL',
    price: 80,
    family: ['Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Aldehydes', 'Bergamot', 'Coriander'],
    heartNotes: ['Civet', 'Leather', 'Patchouli'],
    baseNotes: ['Oakmoss', 'Vanilla', 'Musk'],
    rationale: 'Sweaty, animalic, and daring — Kouros rewrote the rules of masculinity in 1981. A polarizing benchmark every fragrance lover must smell at least once.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'guerlain-habit-rouge',
    name: 'Habit Rouge',
    house: 'Guerlain',
    price: 115,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Lemon', 'Neroli'],
    heartNotes: ['Carnation', 'Cinnamon', 'Rose'],
    baseNotes: ['Rum', 'Leather', 'Vanilla'],
    rationale: 'The 1965 pioneer of oriental masculinity. A warm, spiced-citrus composition of extraordinary elegance that still has no true rival.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'drakkar-noir',
    name: 'Drakkar Noir',
    house: 'Guy Laroche',
    price: 45,
    family: ['Woody', 'Fresh'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Lemon', 'Bergamot', 'Lavender'],
    heartNotes: ['Juniper', 'Coriander', 'Artemisia'],
    baseNotes: ['Cedarwood', 'Pine', 'Musk'],
    rationale: 'The defining fougère of the 1980s. Its spicy-lavender swagger dominated an era and still smells powerfully distinct — essential fragrance history.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'polo-green',
    name: 'Polo Green',
    house: 'Ralph Lauren',
    price: 60,
    family: ['Woody', 'Fresh'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Pine', 'Basil', 'Citrus'],
    heartNotes: ['Leather', 'Tobacco', 'Coriander'],
    baseNotes: ['Patchouli', 'Oakmoss', 'Vetiver'],
    rationale: 'A distinctly American icon from 1978. Bold, green, and outdoorsy with leather and oakmoss — foundational to understanding the chypre family.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'davidoff-cool-water',
    name: 'Cool Water',
    house: 'Davidoff',
    price: 50,
    family: ['Fresh'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Dihydromyrcenol', 'Mint', 'Lavender'],
    heartNotes: ['Geranium', 'Rosemary', 'Sandalwood'],
    baseNotes: ['Musk', 'Amber', 'Oakmoss'],
    rationale: 'The 1988 aquatic that launched a thousand imitators. Understanding Cool Water is understanding the entire fresh-aquatic genre that dominated the 1990s.',
    intensity: 3,
    longevity: '4-6 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'dior-fahrenheit',
    name: 'Fahrenheit',
    house: 'Dior',
    price: 140,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Violet', 'Mandarin', 'Hawthorn'],
    heartNotes: ['Leather', 'Nutmeg', 'Gasoline Accord'],
    baseNotes: ['Vetiver', 'Cedar', 'Musk'],
    rationale: 'A 1988 avant-garde masterpiece — violet, gasoline, and leather in impossible harmony. Nothing smells like it. A mandatory experience for any fragrance enthusiast.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'aramis-classic',
    name: 'Aramis',
    house: 'Aramis',
    price: 55,
    family: ['Woody', 'Amber'],
    occasion: ['Office', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Aldehydes', 'Artemisia', 'Bergamot'],
    heartNotes: ['Leather', 'Patchouli', 'Vetiver'],
    baseNotes: ['Oakmoss', 'Amber', 'Musk'],
    rationale: 'The 1966 leather-chypre that shaped American masculine perfumery. A cornerstone of fragrance history — dark, animalic, and utterly confident.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'givenchy-gentleman-original',
    name: 'Gentleman (Original 1974)',
    house: 'Givenchy',
    price: 95,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cinnamon', 'Honey', 'Aldehydes'],
    heartNotes: ['Patchouli', 'Civet', 'Orris'],
    baseNotes: ['Oakmoss', 'Leather', 'Vetiver'],
    rationale: 'Simultaneously carnal and edible — animalic civet, sweet honey, and dank patchouli in perfect tension. A masterpiece that the 2018 reboot cannot fully replace.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  // ── MODERN DESIGNER ICONS ────────────────────────────────────────────────
  {
    id: 'terre-hermes-parfum',
    name: 'Terre d\'Hermès Parfum',
    house: 'Hermès',
    price: 195,
    family: ['Woody', 'Amber'],
    occasion: ['Office', 'Formal', 'Date Night'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Grapefruit', 'Pepper'],
    heartNotes: ['Vetiver', 'Flint'],
    baseNotes: ['Benzoin', 'Cedar', 'Patchouli'],
    rationale: 'The deeper, richer parfum concentration of the iconic Terre d\'Hermès. More resinous and earthy, moving closer to pure mineral-citrus perfection.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'bleu-chanel-parfum',
    name: 'Bleu de Chanel Parfum',
    house: 'Chanel',
    price: 195,
    family: ['Woody', 'Amber'],
    occasion: ['Office', 'Formal', 'Date Night'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Citrus', 'Grapefruit', 'Mint'],
    heartNotes: ['Ginger', 'Nutmeg', 'Jasmine'],
    baseNotes: ['Labdanum', 'Sandalwood', 'Vetiver'],
    rationale: 'The finest iteration of the Bleu line — deeper labdanum and sandalwood base lifts it from mass-market into something genuinely luxurious and complex.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'jpg-le-male',
    name: 'Le Male',
    house: 'Jean Paul Gaultier',
    price: 75,
    family: ['Fresh', 'Amber'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Mint', 'Lavender', 'Bergamot'],
    heartNotes: ['Cumin', 'Cinnamon', 'Orange Blossom'],
    baseNotes: ['Vanilla', 'Sandalwood', 'Amber'],
    rationale: 'The 1995 icon that defined a generation. Lavender-vanilla-mint in a sailor torso bottle — seductive, approachable, and still influential on men\'s fragrance today.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'acqua-di-gio-original',
    name: 'Acqua di Giò',
    house: 'Giorgio Armani',
    price: 85,
    family: ['Fresh'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Neroli', 'Green Tangerine'],
    heartNotes: ['Jasmine', 'Calone', 'Persimmon'],
    baseNotes: ['Cedar', 'Patchouli', 'Musk'],
    rationale: 'The world\'s best-selling men\'s fragrance for decades. Its jasmine-calone marine freshness set the blueprint for an entire generation of summer colognes.',
    intensity: 3,
    longevity: '4-6 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'dior-homme-parfum',
    name: 'Dior Homme Parfum',
    house: 'Dior',
    price: 175,
    family: ['Floral', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Iris'],
    heartNotes: ['Rose', 'Iris Absolute', 'Chocolate'],
    baseNotes: ['Smoked Vetiver', 'Leather', 'Incense'],
    rationale: 'A polarizing 2014 masterwork — iris, rose, and chocolate over a smoky leather base. Considered by many connoisseurs to be the finest Dior Homme expression.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'jpg-le-male-le-parfum',
    name: 'Le Male Le Parfum',
    house: 'Jean Paul Gaultier',
    price: 110,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cardamom', 'Lavender', 'Mint'],
    heartNotes: ['Iris', 'Orange Blossom'],
    baseNotes: ['Vanilla', 'Sandalwood', 'Tonka Bean'],
    rationale: 'The mature, luxurious evolution of Le Male — deeper cardamom and vanilla intensity, with Fragrantica naming it among the best men\'s fragrances of all time.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'issey-miyake-leau',
    name: 'L\'Eau d\'Issey Pour Homme',
    house: 'Issey Miyake',
    price: 80,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Yuzu', 'Mandarin', 'Verbena'],
    heartNotes: ['Cinnamon', 'Nutmeg', 'Saffron'],
    baseNotes: ['Sandalwood', 'Vetiver', 'Musk'],
    rationale: 'A 1994 revolution — the first true aquatic-woody masculine, with a watery yuzu clarity that changed the direction of men\'s perfumery permanently.',
    intensity: 3,
    longevity: '4-6 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'hugo-boss-bottled',
    name: 'Boss Bottled',
    house: 'Hugo Boss',
    price: 75,
    family: ['Woody', 'Amber'],
    occasion: ['Office', 'Everyday'],
    season: ['Spring', 'Fall'],
    topNotes: ['Apple', 'Plum', 'Citrus'],
    heartNotes: ['Cinnamon', 'Geranium', 'Mahogany'],
    baseNotes: ['Sandalwood', 'Vanilla', 'Vetiver'],
    rationale: 'The 1998 apple-spice-sandalwood blueprint that shaped a decade of men\'s fragrance. Groundbreaking in its approachability — and still the best at what it does.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'hugo-boss-bottled-absolu',
    name: 'Boss Bottled Absolu',
    house: 'Hugo Boss',
    price: 95,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cardamom', 'Ginger', 'Bergamot'],
    heartNotes: ['Vetiver', 'Geranium', 'Cedarwood'],
    baseNotes: ['Benzyl Benzoate', 'Amber', 'Musk'],
    rationale: 'The richest, most seductive Boss Bottled to date — warm cardamom and amber give the classic DNA a darker, more sophisticated edge. A significant upgrade for evening wear.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'hugo-boss-cologne',
    name: 'Hugo Boss Cologne',
    house: 'Hugo Boss',
    price: 65,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Apple', 'Citrus'],
    heartNotes: ['Geranium', 'Lavender', 'Cinnamon'],
    baseNotes: ['Sandalwood', 'Oakmoss', 'Musk'],
    rationale: 'The clean, accessible blue-bottle classic that introduced countless men to designer fragrance. Fresh citrus-lavender simplicity done reliably well at an honest price.',
    intensity: 3,
    longevity: '4-6 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'stetson-classic',
    name: 'Stetson Classic',
    house: 'Coty',
    price: 20,
    family: ['Woody', 'Fresh'],
    occasion: ['Everyday'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Bergamot', 'Lemon', 'Aldehydes'],
    heartNotes: ['Geranium', 'Oakmoss', 'Spices'],
    baseNotes: ['Sandalwood', 'Musk', 'Amber'],
    rationale: 'A 1981 American classic that punches well above its drugstore price. Woody, clean, and unpretentious — a reminder that great fragrance doesn\'t require a luxury price tag.',
    intensity: 3,
    longevity: '4-6 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'paco-1-million-original',
    name: '1 Million',
    house: 'Paco Rabanne',
    price: 95,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Grapefruit', 'Blood Mandarin', 'Peppermint'],
    heartNotes: ['Rose', 'Cinnamon', 'Spices'],
    baseNotes: ['Leather', 'Amber', 'Patchouli'],
    rationale: 'An unapologetically bold sweet-leather statement that became a global phenomenon. Love it or hate it, this 2008 release is impossible to ignore or forget.',
    intensity: 5,
    longevity: '8-10 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'ysl-la-nuit',
    name: 'La Nuit de L\'Homme',
    house: 'YSL',
    price: 100,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cardamom', 'Bergamot'],
    heartNotes: ['Lavender', 'Cedar', 'Caraway'],
    baseNotes: ['Vetiver', 'Coumarin', 'Sandalwood'],
    rationale: 'The 2009 cardamom-cedar seduction that redefined "date night" fragrance for an entire generation. Three perfumers collaborated to create this singular achievement.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'ysl-myslf',
    name: 'MYSLF',
    house: 'YSL',
    price: 130,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office', 'Date Night'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Bergamot', 'Orange Blossom', 'Grapefruit'],
    heartNotes: ['Ambroxan', 'Cedarwood', 'Cardamom'],
    baseNotes: ['Sandalwood', 'Vetiver', 'Musk'],
    rationale: 'YSL\'s most acclaimed masculine release in years — a radiant orange blossom-ambroxan-cedar composition that balances freshness and warmth with effortless versatility. Fragrantica 2024 award winner.',
    intensity: 3,
    longevity: '7-9 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'dior-sauvage-edt',
    name: 'Sauvage EDT',
    house: 'Dior',
    price: 135,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Bergamot', 'Pepper'],
    heartNotes: ['Lavender', 'Pink Pepper', 'Geranium'],
    baseNotes: ['Ambroxan', 'Cedar', 'Vetiver'],
    rationale: 'The world\'s best-selling fragrance — a bottle sells every three seconds globally. Its bergamot-ambroxan freshness is the definitive entry point into modern masculinity and an essential reference for any collection.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'dior-sauvage-edp',
    name: 'Sauvage EDP',
    house: 'Dior',
    price: 155,
    family: ['Fresh', 'Woody'],
    occasion: ['Office', 'Everyday', 'Date Night'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Bergamot', 'Sichuan Pepper'],
    heartNotes: ['Lavender', 'Pink Pepper', 'Vetiver'],
    baseNotes: ['Ambroxan', 'Vanilla', 'Patchouli'],
    rationale: 'The best-selling fragrance in the world. Its ambroxan-lavender skin-scent quality has a near-universal appeal that makes it an essential reference point.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'chanel-allure-sport-original',
    name: 'Allure Homme Sport',
    house: 'Chanel',
    price: 150,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Citrus', 'Aldehydes', 'Grapefruit'],
    heartNotes: ['Spices', 'Tonka Bean', 'Cedar'],
    baseNotes: ['White Musk', 'Vetiver', 'Sandalwood'],
    rationale: 'Jacques Polge\'s 2004 feat of making a fresh sport fragrance genuinely sexy. A masterclass in contradiction — sporty yet sophisticated, with bags of sex appeal.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  // ── NICHE & PRESTIGE ─────────────────────────────────────────────────────
  {
    id: 'kilian-angels-share',
    name: 'Angels\' Share',
    house: 'By Kilian',
    price: 295,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cognac', 'Cinnamon'],
    heartNotes: ['Oak', 'Oakwood'],
    baseNotes: ['Tonka Bean', 'Praline', 'Vanilla'],
    rationale: 'The definitive boozy gourmand — cognac and cinnamon over praline and oak. A Reddit and fragrance community obsession for good reason: it\'s genuinely brilliant.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'serge-lutens-ambre-sultan',
    name: 'Ambre Sultan',
    house: 'Serge Lutens',
    price: 175,
    family: ['Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Coriander', 'Oregano', 'Bay Leaf'],
    heartNotes: ['Amber', 'Benzoin', 'Styrax'],
    baseNotes: ['Patchouli', 'Sandalwood', 'Vanilla'],
    rationale: 'The 2000 niche amber benchmark. Its herbaceous opening sets it apart from every other amber fragrance — and its influence on the decade that followed is immeasurable.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'pdm-althaïr',
    name: 'Althaïr',
    house: 'Parfums de Marly',
    price: 320,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Cardamom'],
    heartNotes: ['Iris', 'Orris', 'Rose'],
    baseNotes: ['Vanilla', 'Amber', 'Tonka Bean', 'Musk'],
    rationale: 'PdM\'s most elegant creation — a powdery vanilla-iris warmth that was voted among women\'s favorite men\'s fragrances at the Fragrantica Community Awards.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'fm-portrait-of-a-lady',
    name: 'Portrait of a Lady',
    house: 'Frédéric Malle',
    price: 310,
    family: ['Floral', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Turkish Rose', 'Blackcurrant', 'Raspberry'],
    heartNotes: ['Patchouli', 'Geranium', 'Incense'],
    baseNotes: ['Sandalwood', 'Musk', 'Amber'],
    rationale: 'Technically unisex but commonly worn by men who appreciate its stunning rose-patchouli architecture. One of the most critically acclaimed fragrances of the modern era.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'mfk-baccarat-rouge-540',
    name: 'Baccarat Rouge 540',
    house: 'Maison Francis Kurkdjian',
    price: 325,
    family: ['Amber', 'Floral'],
    occasion: ['Date Night', 'Formal', 'Everyday'],
    season: ['Spring', 'Fall', 'Winter'],
    topNotes: ['Jasmine', 'Saffron'],
    heartNotes: ['Amberwood', 'Ambergris'],
    baseNotes: ['Fir Resin', 'Cedar'],
    rationale: 'The most-duplicated fragrance of the 2010s — its sweet, caramelized jasmine-cedar signature became a cultural phenomenon. An essential modern benchmark.',
    intensity: 4,
    longevity: '10-12 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'xerjoff-erba-pura',
    name: 'Erba Pura',
    house: 'Xerjoff',
    price: 245,
    family: ['Fresh', 'Amber'],
    occasion: ['Everyday', 'Date Night'],
    season: ['Spring', 'Summer'],
    topNotes: ['Sicilian Lemon', 'Calabrian Bergamot', 'Mango'],
    heartNotes: ['White Flowers', 'Fruity Notes'],
    baseNotes: ['Amberwood', 'White Musk', 'Sandalwood'],
    rationale: 'A sunshine-in-a-bottle citrus-fruity-amber that gets universal compliments. Carefree and joyful, with extraordinary longevity for its genre.',
    intensity: 4,
    longevity: '8-12 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'lv-ombre-nomade',
    name: 'Ombre Nomade',
    house: 'Louis Vuitton',
    price: 475,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Oud', 'Raspberry'],
    heartNotes: ['Turkish Rose', 'Incense'],
    baseNotes: ['Birch', 'Benzoin', 'Labdanum'],
    rationale: 'Considered by experts the finest contemporary oud fragrance available — its dark, berry-rose-oud combination is a statement of genuine niche artistry.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'amouage-reflection-man',
    name: 'Reflection Man',
    house: 'Amouage',
    price: 360,
    family: ['Floral', 'Woody'],
    occasion: ['Office', 'Everyday', 'Formal'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Neroli', 'Rosemary', 'Lemon'],
    heartNotes: ['Iris', 'Jasmine', 'Rose'],
    baseNotes: ['Sandalwood', 'Musk', 'Amber'],
    rationale: 'Amouage\'s most wearable masterpiece — a refined neroli-iris-sandalwood that proves grand perfumery doesn\'t require aggression. Effortlessly aristocratic.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'amouage-jubilation-xxv',
    name: 'Jubilation XXV Man',
    house: 'Amouage',
    price: 395,
    family: ['Amber', 'Woody'],
    occasion: ['Formal', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Frankincense', 'Cardamom', 'Myrrh'],
    heartNotes: ['Oud', 'Rose', 'Patchouli'],
    baseNotes: ['Labdanum', 'Sandalwood', 'Cistus'],
    rationale: 'Grand ceremonial perfumery at its absolute peak — frankincense, oud, and rose in majestic proportion. A once-in-a-lifetime fragrance experience.',
    intensity: 5,
    longevity: '12+ hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'tom-ford-neroli-portofino',
    name: 'Neroli Portofino',
    house: 'Tom Ford',
    price: 290,
    family: ['Fresh', 'Floral'],
    occasion: ['Everyday', 'Office', 'Date Night'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Mandarin', 'Lemon'],
    heartNotes: ['Neroli', 'Lavender', 'Rosemary'],
    baseNotes: ['Amber', 'Oakmoss', 'Angelica'],
    rationale: 'The definitive luxury Italian summer fragrance — a turquoise-bottle icon that transports you to the Ligurian coast. Sets the standard for high-end citrus-neroli.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'amouage-decision',
    name: 'Decision',
    house: 'Amouage',
    price: 375,
    family: ['Amber', 'Woody'],
    occasion: ['Office', 'Formal', 'Date Night'],
    season: ['Spring', 'Fall', 'Winter'],
    topNotes: ['Bergamot', 'Juniper Berries'],
    heartNotes: ['Frankincense', 'Myrrh', 'Geranium'],
    baseNotes: ['Cedarwood', 'Vanilla', 'Patchouli'],
    rationale: 'Robb Report\'s #1 greatest men\'s cologne of 2025 — a resinous, sweet, aromatic masterwork by Quentin Bisch with mass appeal unprecedented for Amouage.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'jpg-le-male-elixir',
    name: 'Le Male Elixir',
    house: 'Jean Paul Gaultier',
    price: 130,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Lavender', 'Cardamom', 'Mint'],
    heartNotes: ['Vanilla', 'Hawthorn', 'Iris'],
    baseNotes: ['Tonka Bean', 'Amber', 'Sandalwood'],
    rationale: 'The richest, most opulent Le Male to date — a warm amber-lavender-vanilla concentration that turns the iconic DNA into something worthy of a luxury house.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'jpg-le-beau',
    name: 'Le Beau',
    house: 'Jean Paul Gaultier',
    price: 95,
    family: ['Fresh', 'Amber'],
    occasion: ['Everyday', 'Date Night'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Coconut', 'Grapefruit'],
    heartNotes: ['Vetiver', 'Iris'],
    baseNotes: ['Tonka Bean', 'Amber', 'Vanilla'],
    rationale: 'A tropical, solar take on the Le Male universe — coconut brightness over warm tonka creates a seductive summer masculine that punches well above its price.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'azzaro-pour-homme',
    name: 'Azzaro Pour Homme',
    house: 'Azzaro',
    price: 55,
    family: ['Woody', 'Fresh'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Anise', 'Basil', 'Bergamot'],
    heartNotes: ['Oakmoss', 'Clary Sage', 'Geranium'],
    baseNotes: ['Vetiver', 'Tonka Bean', 'Cedar'],
    rationale: 'The 1978 aromatic fougère that defined a genre. Anise-basil freshness over mossy warmth — a stone-cold classic studied by every perfumer and loved by their grandfathers.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'azzaro-chrome',
    name: 'Chrome',
    house: 'Azzaro',
    price: 60,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Lemon', 'Pineapple'],
    heartNotes: ['Coriander', 'Oakmoss', 'Rosemary'],
    baseNotes: ['Tonka Bean', 'Sandalwood', 'Cedar'],
    rationale: 'A 1996 fresh aromatic that became one of Europe\'s best-selling masculines — clean, bright, and universally inoffensive in the best possible way. The definition of crowd-pleasing.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'polo-blue-edp',
    name: 'Polo Blue EDP',
    house: 'Ralph Lauren',
    price: 85,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Cantaloupe', 'Cucumber', 'Sage'],
    heartNotes: ['Basil', 'Suede'],
    baseNotes: ['Vetiver', 'Patchouli', 'Musk'],
    rationale: 'The EDP takes the aquatic-melon freshness of the original and grounds it with a suede-vetiver base — more complex, longer-lasting, and universally praised as the superior version.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'paco-rabanne-pour-homme',
    name: 'Paco Rabanne Pour Homme',
    house: 'Paco Rabanne',
    price: 65,
    family: ['Woody', 'Fresh'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Rosemary', 'Basil', 'Bergamot'],
    heartNotes: ['Oakmoss', 'Geranium', 'Clary Sage'],
    baseNotes: ['Vetiver', 'Labdanum', 'Tonka Bean'],
    rationale: 'The 1973 aromatic fougère alongside Azzaro Pour Homme as foundational masculine perfumery. Herbal, mossy, and unmistakably masculine — essential fragrance history.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'paco-invictus-edp',
    name: 'Invictus EDP',
    house: 'Paco Rabanne',
    price: 110,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office', 'Date Night'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Grapefruit', 'Sea Notes', 'Bay Laurel'],
    heartNotes: ['Hedione', 'Jasmine'],
    baseNotes: ['Guaiac Wood', 'Patchouli', 'Oakmoss'],
    rationale: 'One of the best-selling masculines globally — a clean, sporty aquatic with a woody drydown that strikes the perfect balance between fresh and warm. Universally liked.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'paco-phantom',
    name: 'Phantom',
    house: 'Paco Rabanne',
    price: 105,
    family: ['Amber', 'Fresh'],
    occasion: ['Everyday', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Lemon', 'Lavender', 'Robot Head'],
    heartNotes: ['Vetiver', 'Vanilla'],
    baseNotes: ['Woody Notes', 'Musk', 'Mineral'],
    rationale: 'A 2021 standout in a sea of safe releases — lemon-lavender freshness pivots into a warm vanilla-vetiver base with surprising depth. The futuristic robot bottle is just a bonus.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'versace-eros-energy',
    name: 'Eros Energy Eau de Parfum',
    house: 'Versace',
    price: 95,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Lemon', 'Bergamot', 'Apple'],
    heartNotes: ['Mint', 'Geranium', 'Black Pepper'],
    baseNotes: ['Sandalwood', 'Musk', 'Amber'],
    rationale: 'A crisper, more energetic take on the Eros line — citrus-mint freshness with a clean woody base makes it the most versatile and office-appropriate entry in the Eros family.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'valentino-born-in-roma-intense',
    name: 'Born In Roma Uomo EDP Intense',
    house: 'Valentino',
    price: 130,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Black Pepper', 'Cardamom'],
    heartNotes: ['Vetiver', 'Hawthorn', 'Leather'],
    baseNotes: ['Tonka Bean', 'Vanilla', 'Iso E Super'],
    rationale: 'A brooding, intensified take on Born In Roma — black pepper and leather give it an edge the original lacks, making it one of Valentino\'s most compelling masculine releases.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'prada-paradigme',
    name: 'Paradoxe Pour Homme',
    house: 'Prada',
    price: 135,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office', 'Date Night'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Bergamot', 'Neroli', 'Mandarin'],
    heartNotes: ['Iris', 'Vetiver', 'Patchouli'],
    baseNotes: ['Sandalwood', 'Amber', 'Musk'],
    rationale: 'Prada\'s 2023 masculine statement — a refined iris-vetiver-sandalwood composition that sits confidently between fresh and warm. Polished, modern, and broadly wearable.',
    intensity: 3,
    longevity: '7-9 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'prada-luna-rossa-black',
    name: 'Luna Rossa Black',
    house: 'Prada',
    price: 115,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Iris', 'Angelica'],
    heartNotes: ['Ambroxan', 'Labdanum'],
    baseNotes: ['Patchouli', 'Coumarin', 'Musk'],
    rationale: 'A sleek, modern take on the Luna Rossa line — iris and ambroxan create a cool, skin-close sensuality over a warm patchouli base. One of Prada\'s most seductive and underrated masculines.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'jo-malone-wood-sage-sea-salt',
    name: 'Wood Sage & Sea Salt',
    house: 'Jo Malone',
    price: 165,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Sea Salt', 'Ambrette'],
    heartNotes: ['Sage', 'Driftwood'],
    baseNotes: ['Mineral Notes', 'Musk'],
    rationale: 'Jo Malone\'s most beloved cologne — a coastal, mineral freshness that manages to smell both effortless and expensive. The gold standard for understated summer luxury.',
    intensity: 2,
    longevity: '4-6 hrs',
    sillage: 'Moderate',
    projection: 2,
  },
  {
    id: 'gucci-guilty-edp',
    name: 'Guilty Eau de Parfum Pour Homme',
    house: 'Gucci',
    price: 115,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Lemon', 'Lavender', 'Orange'],
    heartNotes: ['Neroli', 'Cedar', 'Patchouli'],
    baseNotes: ['Vetiver', 'Amber', 'Musk'],
    rationale: 'A warm, confident lavender-patchouli-amber that strikes a perfect balance between approachable and sophisticated. One of Gucci\'s most consistently praised masculine releases.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'pdm-perseus',
    name: 'Perseus',
    house: 'Parfums de Marly',
    price: 320,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office', 'Date Night'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Bergamot', 'Grapefruit', 'Elemi'],
    heartNotes: ['Cardamom', 'Vetiver', 'Patchouli'],
    baseNotes: ['Sandalwood', 'Amber', 'Musk'],
    rationale: 'A masterclass in fresh-woody balance from PdM — citrus brightness gives way to a cardamom-vetiver heart before landing on a warm sandalwood base. Versatile enough for any occasion.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'mercedes-benz-club-black-edt',
    name: 'Club Black EDT',
    house: 'Mercedes-Benz',
    price: 45,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot'],
    heartNotes: ['Incense', 'Jasmine'],
    baseNotes: ['Vanilla', 'Benzoin', 'Ambroxan', 'Woodsy Notes'],
    rationale: 'The fragrance community\'s best-kept secret — a dark, smoky vanilla-benzoin that punches absurdly above its price point. Rich, masculine, and cozy without being cloying. Widely regarded as one of the best value vanilla fragrances ever made.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'mercedes-benz-club-black-edp',
    name: 'Club Black EDP',
    house: 'Mercedes-Benz',
    price: 60,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Vanilla'],
    heartNotes: ['Jasmine', 'Myrrh', 'Incense'],
    baseNotes: ['Elemi Resin', 'Vanilla', 'Woody Notes'],
    rationale: 'The 2025 EDP evolution of the beloved Club Black — spicier and more resinous than the EDT, with myrrh and elemi lending an oriental depth. More mature and woody, while retaining the signature vanilla-benzoin DNA that made the original iconic.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'montblanc-legend-edt',
    name: 'Legend EDT',
    house: 'Montblanc',
    price: 55,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Bergamot', 'Lavender', 'Pineapple Leaf', 'Verbena'],
    heartNotes: ['Oakmoss', 'Geranium', 'Coumarin', 'Apple', 'Rose'],
    baseNotes: ['Sandalwood', 'Tonka Bean', 'Evernyl'],
    rationale: 'The definitive entry-level aromatic fougère — a fresh, approachable masculine that works in any context and any season. Its clean pineapple-lavender DNA has made it one of the best-selling and most recommended "safe blind buys" in the fragrance world.',
    intensity: 2,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 2,
  },
  {
    id: 'montblanc-legend-edp',
    name: 'Legend EDP',
    house: 'Montblanc',
    price: 70,
    family: ['Woody', 'Fresh'],
    occasion: ['Office', 'Date Night', 'Everyday'],
    season: ['Spring', 'Fall', 'Winter'],
    topNotes: ['Violet Leaves', 'Bergamot'],
    heartNotes: ['Oakmoss', 'Jasmine', 'Cedar'],
    baseNotes: ['Sandalwood', 'Tonka Bean', 'Musk'],
    rationale: 'The richer, more complex sibling of Legend EDT — violet leaves and jasmine give it a distinctly floral-woody character that feels more sophisticated and mature. Outstanding performer for the price with near-universal compliment appeal.',
    intensity: 3,
    longevity: '8-10 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'montblanc-legend-night',
    name: 'Legend Night',
    house: 'Montblanc',
    price: 65,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cardamom', 'Mint', 'Clary Sage', 'Bergamot'],
    heartNotes: ['Apple', 'Lavender', 'Cedar', 'Violet', 'Fir Resin'],
    baseNotes: ['Black Vanilla Husk', 'Akigalawood', 'Musk', 'Patchouli', 'Vetiver'],
    rationale: 'Montblanc\'s most seductive release — a dark, sweet vanilla-cardamom-apple EDP that sits confidently between Layton and La Nuit de L\'Homme. A criminally underrated date-night fragrance with strong projection in its opening hours.',
    intensity: 4,
    longevity: '6-8 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'montblanc-legend-red',
    name: 'Legend Red',
    house: 'Montblanc',
    price: 65,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Blood Orange', 'Grapefruit', 'Cardamom'],
    heartNotes: ['Cedar', 'Clary Sage', 'Juniper Berries'],
    baseNotes: ['Atlas Cedar', 'Mahogany', 'Tonka Bean'],
    rationale: 'A vibrant blood-orange and cardamom opening that dries down into a clean cedar-mahogany base reminiscent of Bleu de Chanel Parfum. An inoffensive, versatile daily driver that rewards generous application.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'montblanc-explorer-edp',
    name: 'Explorer EDP',
    house: 'Montblanc',
    price: 80,
    family: ['Woody', 'Fresh'],
    occasion: ['Everyday', 'Office', 'Date Night'],
    season: ['Spring', 'Summer', 'Fall'],
    topNotes: ['Bergamot', 'Pink Pepper'],
    heartNotes: ['Vetiver', 'Cacao', 'Patchouli'],
    baseNotes: ['Ambroxan', 'Leather', 'Sandalwood'],
    rationale: 'The fragrance community\'s go-to Aventus alternative — shares the same airy, ambroxan-driven DNA without the fruit and smoke. A clean, woody-leather EDP that works year-round and earns compliments without demanding attention.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'montblanc-explorer-platinum',
    name: 'Explorer Platinum',
    house: 'Montblanc',
    price: 85,
    family: ['Fresh', 'Woody'],
    occasion: ['Office', 'Everyday'],
    season: ['Spring', 'Summer'],
    topNotes: ['Violet Leaves', 'Grapefruit'],
    heartNotes: ['Clary Sage'],
    baseNotes: ['Cedarwood'],
    rationale: 'A pared-back, minimalist woody-aromatic built around a creamy violet-sage-cedar accord. Understated and clean — the kind of scent people notice without being able to name it. Perfect for the office or any setting where restraint is a virtue.',
    intensity: 2,
    longevity: '6-8 hrs',
    sillage: 'Soft',
    projection: 2,
  },
  {
    id: 'creed-silver-mountain-water',
    name: 'Silver Mountain Water',
    house: 'Creed',
    price: 345,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Mandarin'],
    heartNotes: ['Green Tea', 'Black Currant'],
    baseNotes: ['Galbanum', 'Musk', 'Sandalwood', 'Petitgrain'],
    rationale: 'Inspired by Olivier Creed\'s love of Alpine skiing, this 1995 classic captures high-altitude freshness like nothing else — bergamot and mandarin give way to a stunning green tea and blackcurrant heart over a musky sandalwood base. The definition of clean, sophisticated luxury.',
    intensity: 2,
    longevity: '6-8 hrs',
    sillage: 'Soft',
    projection: 2,
  },
  {
    id: 'initio-oud-for-greatness',
    name: 'Oud for Greatness',
    house: 'Initio Parfums Privés',
    price: 350,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Saffron', 'Nutmeg', 'Lavender'],
    heartNotes: ['Agarwood', 'Natural Oud Wood'],
    baseNotes: ['Patchouli', 'Musk'],
    rationale: 'Initio\'s crown jewel and one of the most respected western ouds ever made — saffron and nutmeg soften the oud\'s intensity into something bold yet approachable. Often described as a darker, earthier sibling to Baccarat Rouge 540. Nuclear longevity, commanding presence, and unmistakably masculine character. Not for the timid.',
    intensity: 5,
    longevity: '12+ hrs',
    sillage: 'Strong',
    projection: 5,
  },
  {
    id: 'initio-rehab',
    name: 'Rehab',
    house: 'Initio Parfums Privés',
    price: 430,
    family: ['Woody', 'Fresh'],
    occasion: ['Office', 'Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Lavender', 'Black Pepper'],
    heartNotes: ['Cedarwood', 'Vetiver', 'Patchouli'],
    baseNotes: ['Sandalwood', 'Vanilla', 'Musk'],
    rationale: 'The Hedonist collection\'s most masculine entry — a niche-quality take on the Spicebomb DNA that elevates lavender, cedar, and patchouli over a creamy sandalwood-vanilla base. Barbershop sophistication done at the highest level. Versatile enough for the office yet interesting enough to wear out.',
    intensity: 3,
    longevity: '10-12 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'initio-blessed-baraka',
    name: 'Blessed Baraka',
    house: 'Initio Parfums Privés',
    price: 350,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['White Flowers', 'Amber'],
    heartNotes: ['Sandalwood', 'Vanilla'],
    baseNotes: ['Musk', 'Amber'],
    rationale: 'One of the most underrated fragrances in the entire Initio line — a silky, balsamic amber-sandalwood that wears like warm skin in the cold. Reviewers often describe it as dark dried fruits and creamy vanilla powder; intimate rather than loud, yet with genuine beast-mode longevity. A winter signature for those who want presence without shouting.',
    intensity: 3,
    longevity: '10-12 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'initio-oud-for-happiness',
    name: 'Oud for Happiness',
    house: 'Initio Parfums Privés',
    price: 420,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Everyday', 'Office'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Bergamot', 'Ginger'],
    heartNotes: ['Agarwood', 'Licorice', 'Cedar'],
    baseNotes: ['Vanilla', 'Herbal Notes', 'Musk'],
    rationale: 'The most approachable oud in the Initio catalog — ginger and bergamot keep the opening bright and energetic before the licorice-oud heart emerges, sweet and slightly herbal. Far less demanding than Oud for Greatness, yet still unmistakably niche in character. Community consensus: OFG is the evening king, OFH is the daytime oud you can actually wear year-round.',
    intensity: 3,
    longevity: '8-10 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'initio-atomic-rose',
    name: 'Atomic Rose',
    house: 'Initio Parfums Privés',
    price: 430,
    family: ['Floral', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Pink Pepper', 'Bergamot'],
    heartNotes: ['Bulgarian Rose', 'Turkish Rose', 'Egyptian Jasmine'],
    baseNotes: ['Madagascar Vanilla', 'Amber'],
    rationale: 'Initio\'s answer to Parfums de Marly Delina — a high-octane rose bomb built on dual Turkish and Bulgarian roses amplified by Hedione for maximum sensuality. The pink pepper and bergamot opening gives it an edge Delina lacks, and the vanilla-amber base anchors it into something seductive rather than purely feminine. Nuclear sillage; not subtle in any sense.',
    intensity: 4,
    longevity: '10-12 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'initio-absolute-aphrodisiac',
    name: 'Absolute Aphrodisiac',
    house: 'Initio Parfums Privés',
    price: 350,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['White Flowers', 'Amber'],
    heartNotes: ['Vanilla', 'Leather'],
    baseNotes: ['Musk', 'Castoreum', 'Amber'],
    rationale: 'The most primal fragrance in the Initio line — creamy vanilla and amber are cut through by castoreum, giving it a warm, skin-close animalic edge that earns its name. Reviewers call it chocolate vanilla with a masculine backbone. Wears intimate and close rather than projecting, which makes it devastating in the right context. A polarizing skin scent: people either can\'t stop sniffing their wrist or scrub it immediately.',
    intensity: 3,
    longevity: '8-10 hrs',
    sillage: 'Soft',
    projection: 2,
  },
  {
    id: 'initio-paragon',
    name: 'Paragon',
    house: 'Initio Parfums Privés',
    price: 430,
    family: ['Woody', 'Amber'],
    occasion: ['Everyday', 'Office', 'Date Night'],
    season: ['Fall', 'Winter', 'Spring'],
    topNotes: ['Lavender', 'Sage', 'Bergamot'],
    heartNotes: ['Palo Santo', 'Black Pepper'],
    baseNotes: ['Sandalwood', 'Agarwood'],
    rationale: 'Kai Cenat\'s signature and one of Initio\'s most versatile releases — palo santo and white sage create a warm, almost spiritual woody-aromatic that dries into a creamy sandalwood base. Masculine-leaning but approachable enough for any context. The kind of scent people notice without being able to identify.',
    intensity: 3,
    longevity: '10-12 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  // ---- TOM FORD: Private Blend ----
  {
    id: 'tom-ford-tuscan-leather',
    name: 'Tuscan Leather',
    house: 'Tom Ford',
    price: 310,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Saffron', 'Raspberry'],
    heartNotes: ['Jasmine', 'Thyme'],
    baseNotes: ['Leather', 'Suede', 'Amber'],
    rationale: 'The definitive leather fragrance — raspberry and saffron open into one of the most convincing raw leather base notes in modern perfumery. Aggressive, confident, and polarising in the best way.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'tom-ford-fucking-fabulous',
    name: 'Fucking Fabulous',
    house: 'Tom Ford',
    price: 310,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Clary Sage', 'Lavender'],
    heartNotes: ['Leather', 'Orris'],
    baseNotes: ['Tonka Bean', 'Cashmeran', 'Almond'],
    rationale: 'Warm, creamy, and animalic — leather and tonka wrapped in sage and almond create a uniquely intimate scent that is impossible to ignore up close.',
    intensity: 4,
    longevity: '9-11 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'tom-ford-grey-vetiver',
    name: 'Grey Vetiver',
    house: 'Tom Ford',
    price: 310,
    family: ['Woody', 'Fresh'],
    occasion: ['Office', 'Formal'],
    season: ['Spring', 'Fall'],
    topNotes: ['Grapefruit', 'Sage', 'Orange Flower'],
    heartNotes: ['Orris', 'Vetiver', 'Nutmeg'],
    baseNotes: ['Vetiver', 'Oakmoss', 'Amber'],
    rationale: 'The understated masterpiece of the Private Blend line — earthy, smoky vetiver lifted by crisp citrus. The antidote to sweet mass-market masculines; effortlessly elegant.',
    intensity: 3,
    longevity: '8-10 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'tom-ford-noir-de-noir',
    name: 'Noir de Noir',
    house: 'Tom Ford',
    price: 310,
    family: ['Amber', 'Floral'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Black Truffle', 'Rum', 'Saffron'],
    heartNotes: ['Black Rose', 'Oud', 'Patchouli'],
    baseNotes: ['Sandalwood', 'Black Musk', 'Vanilla'],
    rationale: 'Dark, opulent, and deeply sensual — truffle and black rose over oud and sandalwood. One of the great luxurious evening fragrances; commanding presence.',
    intensity: 5,
    longevity: '10-14 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'tom-ford-lost-cherry',
    name: 'Lost Cherry',
    house: 'Tom Ford',
    price: 310,
    family: ['Amber', 'Floral'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Black Cherry', 'Cherry Liqueur'],
    heartNotes: ['Turkish Rose', 'Jasmine Sambac'],
    baseNotes: ['Tonka Bean', 'Sandalwood', 'Vetiver'],
    rationale: 'Intoxicating ripe cherry over a rose-and-tonka heart — gourmand without being sweet, it walks the line between indulgent and sophisticated with considerable skill.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'tom-ford-beau-de-jour',
    name: 'Beau de Jour',
    house: 'Tom Ford',
    price: 310,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Fall'],
    topNotes: ['Lavender', 'Lavender Extract'],
    heartNotes: ['Oakmoss', 'Rosemary', 'Mint', 'Geranium'],
    baseNotes: ['Patchouli', 'Amber'],
    rationale: 'A masterclass in the classic fougère — oakmoss and lavender grounded by patchouli and amber. Barbershop-sharp with Private Blend richness; the thinking man\'s everyday fragrance.',
    intensity: 3,
    longevity: '8-10 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'tom-ford-costa-azzurra',
    name: 'Costa Azzurra',
    house: 'Tom Ford',
    price: 310,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Sea Notes', 'Juniper', 'Petitgrain'],
    heartNotes: ['Mastic', 'Cypress', 'Sage'],
    baseNotes: ['Oakmoss', 'Amber', 'Cedarwood'],
    rationale: 'Crisp Mediterranean coastal air captured in fragrance — juniper and sea notes over cypress and mastic. One of the best warm-weather niche releases; effortless and refined.',
    intensity: 3,
    longevity: '7-9 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'tom-ford-oud-minerale',
    name: 'Oud Minérale',
    house: 'Tom Ford',
    price: 425,
    family: ['Fresh', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Spring', 'Summer'],
    topNotes: ['Ambergris', 'Sea Notes'],
    heartNotes: ['Oud', 'Mineral Accord'],
    baseNotes: ['Vetiver', 'Musk'],
    rationale: 'Oud meets the ocean — a rare aquatic-oud composition that smells of salt spray and rare woods simultaneously. Unusual, striking, and unlike anything else in the designer-adjacent space.',
    intensity: 4,
    longevity: '9-11 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'tom-ford-mandarino-di-amalfi',
    name: 'Mandarino di Amalfi',
    house: 'Tom Ford',
    price: 310,
    family: ['Fresh', 'Floral'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Mandarin', 'Lemon', 'Bergamot'],
    heartNotes: ['Jasmine', 'Basil', 'Orange Blossom'],
    baseNotes: ['White Musk', 'Cedarwood'],
    rationale: 'The Amalfi Coast distilled into a spray — sun-warm citrus and jasmine over clean white musk. A warm-weather essential that manages to smell expensive without trying.',
    intensity: 2,
    longevity: '5-7 hrs',
    sillage: 'Light',
    projection: 2,
  },
  {
    id: 'tom-ford-bois-pacifique',
    name: 'Bois Pacifique',
    house: 'Tom Ford',
    price: 190,
    family: ['Woody', 'Amber'],
    occasion: ['Everyday', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cardamom', 'Saffron'],
    heartNotes: ['Akigalawood', 'Frankincense'],
    baseNotes: ['Amber', 'Sandalwood'],
    rationale: 'Tom Ford\'s 2024 Signature release — spiced cardamom and saffron over a resinous frankincense and sandalwood core. Private Blend quality at a Signature price; quietly one of the best releases of recent years.',
    intensity: 4,
    longevity: '9-11 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'tom-ford-eau-ombre-leather',
    name: 'Eau d\'Ombré Leather',
    house: 'Tom Ford',
    price: 160,
    family: ['Woody', 'Amber'],
    occasion: ['Everyday', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Ginger', 'Cardamom'],
    heartNotes: ['Leather', 'Jasmine'],
    baseNotes: ['Vanilla', 'Amber', 'Cedarwood'],
    rationale: 'The lighter, sweeter sibling of Ombré Leather — gingerbread leather with a vanilla warmth that\'s wildly accessible and punches far above its EDT price point in terms of performance.',
    intensity: 4,
    longevity: '10-12 hrs',
    sillage: 'Strong',
    projection: 4,
  },

  // ---- TOM FORD: Signature ----
  {
    id: 'tom-ford-ombre-leather',
    name: 'Ombré Leather',
    house: 'Tom Ford',
    price: 175,
    family: ['Woody', 'Amber'],
    occasion: ['Everyday', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cardamom', 'Jasmine'],
    heartNotes: ['Leather', 'Patchouli'],
    baseNotes: ['White Musk', 'Amber', 'Moss'],
    rationale: 'Leather with warmth and accessibility — the gateway leather fragrance that converted a generation. A leather accord done right: not harsh, not synthetic, with enough depth to reward close attention.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'tom-ford-noir',
    name: 'Noir',
    house: 'Tom Ford',
    price: 160,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Pepper', 'Cardamom'],
    heartNotes: ['Geranium', 'Rose', 'Iris'],
    baseNotes: ['Vetiver', 'Amber', 'Patchouli'],
    rationale: 'Dark, refined, and unmistakably Tom Ford — a sophisticated spiced floral-amber with a vetiver and patchouli base that reads as genuinely luxurious. One of the better evening fragrances in the Signature line.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'tom-ford-noir-extreme',
    name: 'Noir Extreme',
    house: 'Tom Ford',
    price: 160,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cardamom', 'Mandarin', 'Nutmeg'],
    heartNotes: ['Kulfi', 'Rose', 'Orange Blossom'],
    baseNotes: ['Sandalwood', 'Amber', 'Vanilla'],
    rationale: 'Spiced kulfi sweetness over a creamy sandalwood base — one of the most seductive, intimate fragrances in the TF line. Warm, rich, and deeply memorable in evening wear.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'tom-ford-noir-extreme-parfum',
    name: 'Noir Extreme Parfum',
    house: 'Tom Ford',
    price: 185,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cardamom', 'Ginger'],
    heartNotes: ['Kulfi', 'Leather', 'Rose'],
    baseNotes: ['Sandalwood', 'Amber', 'Vanilla'],
    rationale: 'The Parfum concentration adds leather depth and more pronounced ginger to the Noir Extreme accord, creating a richer, duskier take that feels distinctly more formal and opulent.',
    intensity: 5,
    longevity: '10-14 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },

  // ---- YSL ----
  {
    id: 'ysl-y-edt',
    name: 'Y',
    house: 'YSL',
    price: 110,
    concentration: 'EDT',
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Ginger', 'Apple'],
    heartNotes: ['Sage', 'Geranium', 'Juniper'],
    baseNotes: ['Cedar', 'Amber', 'Fir Balsam'],
    rationale: 'The entry point to the Y line — lighter and breezier than the EDP, with the same fresh sage and cedar backbone. A reliable daily driver for warm months.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'ysl-y-edp',
    name: 'Y',
    house: 'YSL',
    price: 125,
    concentration: 'EDP',
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Fall'],
    topNotes: ['Bergamot', 'Ginger', 'Apple'],
    heartNotes: ['Sage', 'Geranium'],
    baseNotes: ['Cedar', 'Amber', 'Fir Balsam'],
    rationale: 'The benchmark modern fresh-woody — apple and bergamot open into a sage and cedar core that is endlessly wearable. One of the most-complimented designer fragrances on the market for good reason.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'ysl-y-edp-intense',
    name: 'Y Eau de Parfum Intense',
    house: 'YSL',
    price: 130,
    family: ['Fresh', 'Woody'],
    occasion: ['Office', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Sage', 'Lavender'],
    heartNotes: ['Geranium', 'Vetiver'],
    baseNotes: ['Cedar', 'Amber', 'Fir Balsam'],
    rationale: 'A darker, moodier Y — the apple note is replaced with lavender and vetiver for a more serious, mature profile. Bridges the gap between the EDP and the Parfum.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'ysl-y-elixir',
    name: 'Y L\'Elixir',
    house: 'YSL',
    price: 150,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Lavender', 'Geranium'],
    heartNotes: ['Incense', 'Oud'],
    baseNotes: ['Patchouli', 'Amber'],
    rationale: 'The apex of the Y line — oud and incense give this a smoky, resinous depth that far exceeds its designer origins. A genuinely impressive dark-woods fragrance at a reasonable price.',
    intensity: 5,
    longevity: '10-14 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'ysl-y-iced-cologne',
    name: 'Y Iced Cologne',
    house: 'YSL',
    price: 110,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Ice Mint', 'Peppermint'],
    heartNotes: ['Blue Sage', 'Mint'],
    baseNotes: ['Patchouli', 'Ambroxan'],
    rationale: 'An icy, high-intensity mint-sage opening anchored by patchouli and ambroxan — YSL\'s freshest offering, designed for heat and built for lasting power despite the cologne concentration.',
    intensity: 3,
    longevity: '7-9 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'ysl-myslf-le-parfum',
    name: 'MYSLF Le Parfum',
    house: 'YSL',
    price: 150,
    family: ['Amber', 'Floral'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Black Pepper'],
    heartNotes: ['Orange Blossom', 'Vanilla Bourbon'],
    baseNotes: ['Patchouli', 'Sandalwood'],
    rationale: 'The richer, spicier take on MYSLF — vanilla bourbon and black pepper deepen the orange blossom heart into something genuinely evening-worthy. More complex and polarising than the EDP.',
    intensity: 4,
    longevity: '9-11 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'ysl-myslf-labsolu',
    name: 'MYSLF L\'Absolu',
    house: 'YSL',
    price: 160,
    family: ['Floral', 'Woody'],
    occasion: ['Everyday', 'Date Night'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Ginger', 'Cardamom'],
    heartNotes: ['Orange Blossom', 'Patchouli'],
    baseNotes: ['Patchouli', 'Ambroxan'],
    rationale: 'The boldest MYSLF flanker — amplified florals with ginger and cardamom adding a spiced, vibrant energy. Darker and more distinctive than the original EDP.',
    intensity: 4,
    longevity: '9-11 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'ysl-lhomme-edt',
    name: 'L\'Homme',
    house: 'YSL',
    price: 100,
    concentration: 'EDT',
    family: ['Woody', 'Fresh'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Ginger', 'Cardamom'],
    heartNotes: ['Vetiver', 'Sage', 'Violet'],
    baseNotes: ['Cedar', 'Tonka Bean', 'White Musk'],
    rationale: 'A modern classic — the original 2006 L\'Homme still holds up as an archetypal refined masculine. Clean vetiver and cedar with a gentle spice; quietly sophisticated and thoroughly wearable.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'ysl-lhomme-edp',
    name: 'L\'Homme',
    house: 'YSL',
    price: 120,
    concentration: 'EDP',
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bitter Orange', 'Bergamot'],
    heartNotes: ['Lavender', 'Cedar', 'Cognac'],
    baseNotes: ['Vetiver', 'Amber'],
    rationale: 'A boozy, amber-warmed evolution of the L\'Homme DNA — cedar, cognac, and bitter orange create a cocktail-esque elegance. More complex than the EDT with a richer, more seductive drydown.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'ysl-la-nuit-edp',
    name: 'La Nuit de L\'Homme',
    house: 'YSL',
    price: 110,
    concentration: 'EDP',
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Lavender', 'Cardamom'],
    heartNotes: ['Cedar', 'Vetiver', 'Tonka Bean'],
    baseNotes: ['Coumarin', 'Amber', 'Benzoin'],
    rationale: 'The warmer, richer brother of La Nuit EDT — a coumarin-heavy dry-down with a spiced lavender opening. One of the finest evening fragrances in the designer space at a remarkable price.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },

  // ---- VERSACE ----
  {
    id: 'versace-eros-parfum',
    name: 'Eros Parfum',
    house: 'Versace',
    price: 120,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Mint', 'Black Pepper', 'Elemi'],
    heartNotes: ['Tonka Bean', 'Geranium', 'Patchouli'],
    baseNotes: ['Benzoin', 'Vetiver', 'Vanilla'],
    rationale: 'The darkest, densest Eros — patchouli and benzoin give the familiar mint-vanilla accord a smokier, more grown-up dimension. The version that converts Eros sceptics.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'versace-eros-flame',
    name: 'Eros Flame',
    house: 'Versace',
    price: 100,
    family: ['Amber', 'Fresh'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Spring', 'Fall'],
    topNotes: ['Lemon', 'Blood Orange', 'Black Pepper'],
    heartNotes: ['Rosewood', 'Rose', 'Geranium'],
    baseNotes: ['Tonka Bean', 'Sandalwood', 'Oakmoss'],
    rationale: 'Fiery citrus over a warm woody-amber base — the most wearable Eros flanker, trading the original\'s minty sweetness for pepper and orange. Excellent year-round versatility.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'versace-eros-najim',
    name: 'Eros Najim',
    house: 'Versace',
    price: 140,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Yellow Mandarin', 'Saffron', 'Cardamom'],
    heartNotes: ['Caramel', 'Floral'],
    baseNotes: ['Oud', 'Patchouli', 'Vetiver'],
    rationale: 'The oriental Eros — caramel and saffron over oud and patchouli, with the Eros DNA still audible underneath. Bold, sweet, and luxurious in a Middle Eastern-inspired direction.',
    intensity: 5,
    longevity: '10-12 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'versace-dylan-blue-edp',
    name: 'Dylan Blue',
    house: 'Versace',
    price: 100,
    concentration: 'EDP',
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Office'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Grapefruit', 'Mineral Notes'],
    heartNotes: ['Patchouli', 'Black Pepper', 'Violet'],
    baseNotes: ['Tonka Bean', 'Musk', 'Saffron'],
    rationale: 'A warmer, deeper Dylan Blue — the EDP adds saffron and tonka to the aquatic-woody foundation, creating a more evening-appropriate version with greater projection and depth.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },

  // ---- HUGO BOSS ----
  {
    id: 'boss-bottled-parfum',
    name: 'Boss Bottled Parfum',
    house: 'Hugo Boss',
    price: 130,
    family: ['Woody', 'Amber'],
    occasion: ['Office', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Apple', 'Grapefruit'],
    heartNotes: ['Orris', 'Fig Tree', 'Geranium'],
    baseNotes: ['Sandalwood', 'Vetiver', 'Cedar'],
    rationale: 'The Parfum concentration takes the original Boss Bottled DNA into richer territory — orris and fig tree root add iris-woody depth to the familiar apple-spice structure.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'boss-bottled-elixir',
    name: 'Boss Bottled Elixir',
    house: 'Hugo Boss',
    price: 130,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Incense', 'Citrus'],
    heartNotes: ['Vetiver', 'Patchouli'],
    baseNotes: ['Cedarwood', 'Labdanum'],
    rationale: 'Smoky, dark, and aggressively woody — incense and vetiver ground this in a near-niche quality that surprised the fragrance community on release. One of the best Boss releases in years.',
    intensity: 5,
    longevity: '10-14 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'boss-the-scent',
    name: 'Boss The Scent',
    house: 'Hugo Boss',
    price: 90,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Ginger', 'Mandarin'],
    heartNotes: ['Maninka', 'Lavender'],
    baseNotes: ['Leather', 'Patchouli'],
    rationale: 'Built around the exotic maninka flower — a warm, smooth leather-spice fragrance with ginger up top and a quietly seductive drydown. Refined and understated in a way Boss doesn\'t always manage.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'boss-the-scent-private-accord',
    name: 'Boss The Scent Private Accord',
    house: 'Hugo Boss',
    price: 110,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cardamom', 'Cacao'],
    heartNotes: ['Maninka', 'Vetiver'],
    baseNotes: ['Leather', 'Tonka Bean'],
    rationale: 'A deeper, darker take on Boss The Scent — cacao and cardamom add gourmand warmth to the maninka-leather core, creating something richer and more complex than the original.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'boss-bottled-night',
    name: 'Boss Bottled Night',
    house: 'Hugo Boss',
    price: 85,
    family: ['Woody', 'Fresh'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Lavender', 'Birch Leaf'],
    heartNotes: ['African Cardamom', 'Louro Amarelo'],
    baseNotes: ['Musk', 'Tonka Bean'],
    rationale: 'Dark lavender-birch over a tonka musk base — Boss Bottled Night wears more confidently than the original, with an intriguingly smoky quality that works across casual and formal settings.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'hugo-man-edt',
    name: 'Hugo Man',
    house: 'Hugo Boss',
    price: 65,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Apple', 'Juniper', 'Basil'],
    heartNotes: ['Geranium', 'Sage', 'Jasmine'],
    baseNotes: ['Cedarwood', 'Oakmoss', 'Patchouli'],
    rationale: 'The 1995 original that defined a decade of men\'s fragrance — green apple and basil over an earthy, slightly bitter cedar-oakmoss base. Surprisingly complex for the price.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'boss-stronger-with-you-edt',
    name: 'Stronger With You',
    house: 'Emporio Armani',
    price: 95,
    concentration: 'EDT',
    family: ['Amber', 'Woody'],
    occasion: ['Everyday', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Pink Pepper', 'Cardamom', 'Sage'],
    heartNotes: ['Chestnut', 'Freesia'],
    baseNotes: ['Vanilla', 'Caramel', 'Musk'],
    rationale: 'The original Stronger With You — sweet chestnut and vanilla warmed by pink pepper and cardamom. A reliably complimented, accessible amber-woody for cooler weather.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'boss-stronger-with-you-absolutely',
    name: 'Stronger With You Absolutely',
    house: 'Emporio Armani',
    price: 130,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Pink Pepper'],
    heartNotes: ['Chestnut', 'Sage'],
    baseNotes: ['Vanilla', 'Oakwood', 'Suede'],
    rationale: 'The Parfum concentration of Stronger With You — suede and oakwood deepen the familiar chestnut-vanilla accord considerably, creating a richer, more opulent result.',
    intensity: 5,
    longevity: '10-14 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'boss-stronger-with-you-leather',
    name: 'Stronger With You Leather',
    house: 'Emporio Armani',
    price: 120,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Pink Pepper', 'Bergamot'],
    heartNotes: ['Lavender', 'Leather'],
    baseNotes: ['Suede', 'Vanilla', 'Oak'],
    rationale: 'A leathered evolution of the SWY line — dry suede and lavender over vanilla, adding an elegant rough edge to the house\'s signature chestnut-sweet DNA.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },

  // ---- DOLCE & GABBANA ----
  {
    id: 'dg-light-blue-pour-homme',
    name: 'Light Blue Pour Homme',
    house: 'Dolce & Gabbana',
    price: 90,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Sicilian Mandarin', 'Grapefruit', 'Juniper'],
    heartNotes: ['Rosewood', 'Pepper', 'Rosemary'],
    baseNotes: ['Musk', 'Oakmoss', 'Incense'],
    rationale: 'The men\'s companion to the iconic Light Blue — a Mediterranean fresh-woody with Sicilian citrus and rosewood over a clean musk-oakmoss finish. A summer staple.',
    intensity: 3,
    longevity: '4-6 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'dg-the-one-edt',
    name: 'The One',
    house: 'Dolce & Gabbana',
    price: 100,
    concentration: 'EDT',
    family: ['Woody', 'Amber'],
    occasion: ['Everyday', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Grapefruit', 'Coriander', 'Basil'],
    heartNotes: ['Ginger', 'Tobacco', 'Orange Blossom'],
    baseNotes: ['Cedar', 'Amber', 'Musk'],
    rationale: 'The EDT is lighter and airier than the EDP — the same tobacco and amber structure but with more citrus lift and a cleaner, less intense finish. A classic that rewards the patient.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'dg-k-edt',
    name: 'K by Dolce&Gabbana',
    house: 'Dolce & Gabbana',
    price: 95,
    concentration: 'EDT',
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Fall'],
    topNotes: ['Cypriol', 'Bergamot', 'Mandarin'],
    heartNotes: ['Geranium', 'Cardamom'],
    baseNotes: ['Vetiver', 'Patchouli'],
    rationale: 'A modern fougère built around cypriol oil — a smoky, earthy fresh-woody that is more sophisticated than it appears. Solid projection and a distinctive, underrated profile.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },

  // ---- PACO RABANNE ----
  {
    id: 'paco-invictus-platinum',
    name: 'Invictus Platinum',
    house: 'Paco Rabanne',
    price: 110,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Grapefruit', 'Green Mandarin'],
    heartNotes: ['Ambergris', 'Mineral Notes'],
    baseNotes: ['Guaiac Wood', 'Oakmoss'],
    rationale: 'The refined, grown-up Invictus — aquatic mineral freshness over guaiac wood and oakmoss, shedding the fruitier sweetness of the original for something more restrained and elegant.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'paco-invictus-victory',
    name: 'Invictus Victory',
    house: 'Paco Rabanne',
    price: 120,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Mandarin', 'Grapefruit'],
    heartNotes: ['Ambrette', 'Laurel'],
    baseNotes: ['Guaiac Wood', 'Oakmoss', 'Amber'],
    rationale: 'A darker, richer Invictus flanker — the EDP concentration adds depth to the aquatic-woody frame without losing the sporty energy the line is known for.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'paco-1-million-lucky',
    name: '1 Million Lucky',
    house: 'Paco Rabanne',
    price: 100,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Date Night'],
    season: ['Spring', 'Fall'],
    topNotes: ['Grapefruit', 'Plum'],
    heartNotes: ['Hazelnut', 'Rosemary'],
    baseNotes: ['Vetiver', 'Patchouli'],
    rationale: 'A fresh, lighter take on the 1 Million DNA — plum and hazelnut replace the gold-leather richness with something more casual and wearable. One of the more approachable entries in the line.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'paco-1-million-elixir',
    name: '1 Million Elixir',
    house: 'Paco Rabanne',
    price: 130,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Blood Mandarin', 'Spicy Accord'],
    heartNotes: ['Leather', 'Coffee'],
    baseNotes: ['Papyrus', 'Amber', 'Patchouli'],
    rationale: 'The darkest, most intense 1 Million — coffee and leather take the gold accord into smoky, sophisticated territory. A serious flanker for those who find the original too bright.',
    intensity: 5,
    longevity: '10-14 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'paco-phantom-parfum',
    name: 'Phantom Parfum',
    house: 'Paco Rabanne',
    price: 140,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Lemon'],
    heartNotes: ['Lavender', 'Vanilla'],
    baseNotes: ['Vetiver', 'Beeswax', 'Sandalwood'],
    rationale: 'The Parfum takes the Phantom\'s electronic-vanilla DNA to a richer, more somber place — beeswax and vetiver ground the sweetness in a way the EDT cannot. A growers fragrance.',
    intensity: 5,
    longevity: '10-14 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },

  // ---- RALPH LAUREN ----
  {
    id: 'polo-blue-edt',
    name: 'Polo Blue',
    house: 'Ralph Lauren',
    price: 80,
    concentration: 'EDT',
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Melon', 'Cucumber', 'Sage'],
    heartNotes: ['Suede', 'Geranium'],
    baseNotes: ['Musk', 'Patchouli', 'Suede'],
    rationale: 'The lighter, crisper Polo Blue — melon and cucumber open into suede and geranium for a clean, inoffensive aquatic-woody that defined casual American masculinity in the 2000s.',
    intensity: 2,
    longevity: '4-6 hrs',
    sillage: 'Light',
    projection: 2,
  },
  {
    id: 'polo-red-edt',
    name: 'Polo Red',
    house: 'Ralph Lauren',
    price: 75,
    concentration: 'EDT',
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Date Night'],
    season: ['Spring', 'Summer'],
    topNotes: ['Grapefruit', 'Lemon', 'Cranberry'],
    heartNotes: ['Saffron', 'Coffee', 'Geranium'],
    baseNotes: ['Cedarwood', 'Guaiac Wood', 'Amber'],
    rationale: 'A sporty, citrus-driven fresh-woody with a hint of coffee and saffron — accessible, confident, and built for warm weather. A steady performer at an honest price.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'polo-red-edp',
    name: 'Polo Red',
    house: 'Ralph Lauren',
    price: 90,
    concentration: 'EDP',
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cranberry', 'Bergamot'],
    heartNotes: ['Coffee', 'Saffron', 'Geranium'],
    baseNotes: ['Amber', 'Guaiac Wood', 'Vetiver'],
    rationale: 'The EDP leans harder into the coffee and saffron, creating a warmer, richer version that works significantly better in cold weather. A genuine step up from the EDT.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'polo-ultra-blue',
    name: 'Polo Ultra Blue',
    house: 'Ralph Lauren',
    price: 85,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Green Mandarin', 'Frozen Melon', 'Bergamot'],
    heartNotes: ['Aquatic Notes', 'Geranium'],
    baseNotes: ['Musk', 'Vetiver', 'Cedar'],
    rationale: 'A cooler, more intense Polo Blue — the ultra-marine aquatic qualities are cranked up while keeping the suede-wood base. Better performance than the original EDT.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'polo-ralpha-club',
    name: 'Ralph\'s Club',
    house: 'Ralph Lauren',
    price: 115,
    concentration: 'EDP',
    family: ['Amber', 'Floral'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Iris', 'Bergamot'],
    heartNotes: ['Vetiver', 'Sage', 'Juniper'],
    baseNotes: ['Sandalwood', 'Amber', 'Musk'],
    rationale: 'A sophisticated iris-vetiver EDP that marks a real quality step up for Ralph Lauren — elegant and restrained with a sandalwood-amber base that rewards patience.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'polo-est-67',
    name: 'Polo Est. 67',
    house: 'Ralph Lauren',
    price: 95,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Green Tea', 'Ginger'],
    heartNotes: ['Tonka Bean', 'Vetiver'],
    baseNotes: ['Cedar', 'Musk', 'Sandalwood'],
    rationale: 'Clean, unforced, and quietly confident — green tea and bergamot over a tonka-vetiver heart. Captures the effortless preppy ease of the original Polo aesthetic in a contemporary format.',
    intensity: 2,
    longevity: '5-7 hrs',
    sillage: 'Light',
    projection: 2,
  },

  // ---- VALENTINO ----
  {
    id: 'valentino-uomo-born-in-roma-edt',
    name: 'Born In Roma Uomo',
    house: 'Valentino',
    price: 95,
    concentration: 'EDT',
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Pepper'],
    heartNotes: ['Vetiver', 'Geranium'],
    baseNotes: ['Musk', 'Cedarwood'],
    rationale: 'The lighter Born In Roma entry — bergamot and pepper over vetiver and cedar. A clean, versatile fresh-woody that performs better than its modest price suggests.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'valentino-uomo-born-in-roma-extradose',
    name: 'Born In Roma Uomo Extradose',
    house: 'Valentino',
    price: 130,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Mandarin', 'Ginger'],
    heartNotes: ['Vetiver', 'Geranium', 'Leather'],
    baseNotes: ['Sandalwood', 'Amber', 'Musk'],
    rationale: 'The 2025 Extradose intensity — extra ginger and leather depth transform the Born In Roma DNA into something more dramatic and formal. A significant step up in character from the EDT.',
    intensity: 4,
    longevity: '9-11 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'valentino-uomo-edt-original',
    name: 'Uomo',
    house: 'Valentino',
    price: 100,
    concentration: 'EDT',
    family: ['Woody', 'Floral'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Fall'],
    topNotes: ['Bergamot', 'Myrtle'],
    heartNotes: ['Iris', 'Geranium', 'Hawthorn'],
    baseNotes: ['Leather', 'Vetiver', 'Patchouli'],
    rationale: 'The original 2014 Valentino Uomo EDT — a restrained, iris-led masculine with leather and vetiver depth. Underrated and overlooked compared to the Intense, but worth seeking out.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },

  // ---- BURBERRY ----
  {
    id: 'burberry-hero-edt',
    name: 'Hero',
    house: 'Burberry',
    price: 95,
    concentration: 'EDT',
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Juniper'],
    heartNotes: ['Cypress', 'Black Pepper'],
    baseNotes: ['Cedarwood', 'Patchouli'],
    rationale: 'The lighter, breezier Hero — juniper and bergamot over a cedar-cypress heart. Exceptional performance for an EDT, fresh but with enough woody backbone to avoid being one-dimensional.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'burberry-touch-for-men',
    name: 'Touch for Men',
    house: 'Burberry',
    price: 65,
    family: ['Woody', 'Amber'],
    occasion: ['Everyday', 'Office'],
    season: ['Fall', 'Winter'],
    topNotes: ['Mandarin', 'Lemon', 'White Pepper'],
    heartNotes: ['Moroccan Cedarwood', 'Nutmeg', 'Artemisia'],
    baseNotes: ['Amber', 'Musk', 'Sandalwood'],
    rationale: 'A quietly confident woody-amber that predates the current cedar obsession by decades — Moroccan cedar and nutmeg with a warm amber base. Unfairly overlooked as an excellent office scent.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'burberry-mr-burberry-edt',
    name: 'Mr. Burberry',
    house: 'Burberry',
    price: 85,
    concentration: 'EDT',
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Grapefruit', 'Cardamom'],
    heartNotes: ['Leather', 'Petitgrain'],
    baseNotes: ['Sandalwood', 'Vetiver', 'Musk'],
    rationale: 'A refined British take on fresh-leather — grapefruit and cardamom open into a petitgrain leather accord over sandalwood. Smart, professional, and more complex than the price implies.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'burberry-mr-burberry-edp',
    name: 'Mr. Burberry',
    house: 'Burberry',
    price: 100,
    concentration: 'EDP',
    family: ['Woody', 'Amber'],
    occasion: ['Office', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Cardamom', 'Bergamot'],
    heartNotes: ['Leather', 'Cedar'],
    baseNotes: ['Sandalwood', 'Amber', 'Musk'],
    rationale: 'The EDP deepens Mr. Burberry considerably — more amber warmth and leather presence create a more formal, evening-appropriate character from the same framework.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },

  // ---- GIVENCHY ----
  {
    id: 'givenchy-gentleman-edt',
    name: 'Gentleman',
    house: 'Givenchy',
    price: 90,
    concentration: 'EDT',
    family: ['Woody', 'Floral'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Fall'],
    topNotes: ['Bergamot', 'Lavender'],
    heartNotes: ['Iris', 'Patchouli'],
    baseNotes: ['Vetiver', 'Cedar'],
    rationale: 'The accessible Gentleman entry — bergamot and lavender over iris and patchouli. A wearable, refined fougère that rewards daily use without overwhelming.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'givenchy-gentleman-society',
    name: 'Gentleman Society',
    house: 'Givenchy',
    price: 130,
    family: ['Woody', 'Amber'],
    occasion: ['Office', 'Date Night'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Ginger'],
    heartNotes: ['Vetiver', 'Cedar', 'Geranium'],
    baseNotes: ['Amber', 'Musk', 'Benzoin'],
    rationale: 'The standout of the 2024 Givenchy releases — amber and benzoin warm a vetiver-cedar heart into something genuinely sophisticated. Widely praised as Givenchy\'s best men\'s release in years.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'givenchy-pi',
    name: 'Pi',
    house: 'Givenchy',
    price: 80,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Tarragon', 'Basil', 'Mandarin'],
    heartNotes: ['Geranium', 'Tonka Bean', 'Rose'],
    baseNotes: ['Benzoin', 'Sandalwood', 'Amber'],
    rationale: 'The 1998 cult classic — sweet benzoin and tonka with a herbal tarragon top. Still one of the best warm amber fragrances available at any price; a timeless nerd\'s favourite.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },

  // ---- GUCCI ----
  {
    id: 'gucci-guilty-edt',
    name: 'Guilty',
    house: 'Gucci',
    price: 80,
    concentration: 'EDT',
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Lemon', 'Lavender', 'Pink Pepper'],
    heartNotes: ['Orange Flower', 'Neroli'],
    baseNotes: ['Cedar', 'Patchouli', 'Amber'],
    rationale: 'The original Guilty Pour Homme EDT — citrus lavender over a cedar-amber base. Slightly sharp on opening but mellows to a genuinely wearable masculine amber.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'gucci-guilty-cologne-edt',
    name: 'Guilty Cologne',
    house: 'Gucci',
    price: 85,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Neroli', 'Bergamot', 'Lemon'],
    heartNotes: ['Lavender', 'Orange'],
    baseNotes: ['Cedar', 'Amber'],
    rationale: 'A fresher, lighter Guilty — the cologne concentration swaps punch for refinement, leading with neroli and bergamot. An accessible summer option within the Guilty family.',
    intensity: 2,
    longevity: '4-6 hrs',
    sillage: 'Light',
    projection: 2,
  },
  {
    id: 'gucci-memoire-dune-odeur',
    name: 'Mémoire d\'une Odeur',
    house: 'Gucci',
    price: 120,
    family: ['Floral', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Roman Chamomile', 'Indian Coral Jasmine'],
    heartNotes: ['Jasmine', 'Musk'],
    baseNotes: ['Sandalwood', 'Musk', 'Vanilla'],
    rationale: 'Gucci\'s most avant-garde fragrance — chamomile and jasmine over sandalwood in a clean, almost medicinal composition that is genuinely unlike anything else in their catalog. Unisex and polarising.',
    intensity: 2,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 2,
  },

  // ---- CAROLINA HERRERA ----
  {
    id: 'ch-bad-boy-edt',
    name: 'Bad Boy',
    house: 'Carolina Herrera',
    price: 100,
    concentration: 'EDT',
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Black Pepper'],
    heartNotes: ['Sage', 'Vetiver'],
    baseNotes: ['Cacao', 'Styrax', 'Violet Wood'],
    rationale: 'Styrax and cacao over sage and vetiver create an intensely smoky, unusual masculine that breaks the mould. Genuinely distinctive — neither fresh nor sweet but somewhere more interesting.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'ch-bad-boy-edp',
    name: 'Bad Boy',
    house: 'Carolina Herrera',
    price: 115,
    concentration: 'EDP',
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Black Pepper', 'Bergamot'],
    heartNotes: ['Styrax', 'Sage'],
    baseNotes: ['Cacao', 'Tonka Bean', 'Sandalwood'],
    rationale: 'The EDP adds tonka and sandalwood warmth to the Bad Boy formula — sweeter and more enveloping than the EDT while keeping the distinctive styrax smokiness. A very strong performer.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'ch-bad-boy-elixir',
    name: 'Bad Boy Elixir',
    house: 'Carolina Herrera',
    price: 130,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Red Pepper', 'Black Pepper'],
    heartNotes: ['Styrax', 'Iris'],
    baseNotes: ['Cacao', 'Leather', 'Musk'],
    rationale: 'The darkest, most intense Bad Boy — leather and iris deepen the styrax-cacao accord considerably. Beast mode projection and longevity make this one of the most assertive expressions in the designer category.',
    intensity: 5,
    longevity: '10-14 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'ch-212-sexy-men',
    name: '212 Sexy Men',
    house: 'Carolina Herrera',
    price: 85,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Violet Leaf', 'Bergamot'],
    heartNotes: ['Sandalwood', 'Vetiver'],
    baseNotes: ['Musks', 'Woody Notes'],
    rationale: 'A sleek, polished amber-woody that feels effortlessly confident — violet leaf and sandalwood anchor a composition that rewards proximity. One of the most underappreciated CH releases.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'ch-212-heroes',
    name: '212 Heroes',
    house: 'Carolina Herrera',
    price: 90,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Sparkling Yuzu', 'Bergamot'],
    heartNotes: ['Ambrette', 'Geranium'],
    baseNotes: ['Sandalwood', 'Musk'],
    rationale: 'The contemporary casual CH masculine — yuzu and ambrette over sandalwood and musk. Accessible, clean, and well-suited to warm weather and daily wear.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },

  // ---- CHANEL ----
  {
    id: 'chanel-bleu-edt',
    name: 'Bleu de Chanel',
    house: 'Chanel',
    price: 155,
    concentration: 'EDT',
    family: ['Woody', 'Fresh'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Citrus', 'Grapefruit', 'Mint'],
    heartNotes: ['Ginger', 'Jasmine', 'Nutmeg'],
    baseNotes: ['Cedar', 'Sandalwood', 'Vetiver'],
    rationale: 'The original, lighter Bleu — fresh citrus and mint over cedar and vetiver. The EDT is crisper and better for warm weather than the EDP; a clean, effortless masculine.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'chanel-allure-homme',
    name: 'Allure Homme',
    house: 'Chanel',
    price: 145,
    family: ['Woody', 'Amber'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Fall'],
    topNotes: ['Bergamot', 'Cardamom', 'Mandarin'],
    heartNotes: ['Vetiver', 'Pepper', 'Ginger'],
    baseNotes: ['Tonka Bean', 'White Musk', 'Vanilla'],
    rationale: 'The underrated original — warm spice over a tonka-vanilla dry-down. More complex and interesting than Allure Homme Sport, yet consistently overlooked. A quiet Chanel classic.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'chanel-egoiste',
    name: 'Égoïste',
    house: 'Chanel',
    price: 145,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Rosewood', 'Coriander', 'Geranium'],
    heartNotes: ['Sandalwood', 'Rose', 'Amber'],
    baseNotes: ['Cistus', 'Vanilla', 'Cedar'],
    rationale: 'The great forgotten Chanel masculine — rosewood and sandalwood over cistus and vanilla. Rich, warm, and deeply unfashionable in the best possible way; a connoisseur\'s pick.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'chanel-pour-monsieur',
    name: 'Pour Monsieur',
    house: 'Chanel',
    price: 120,
    family: ['Fresh', 'Woody'],
    occasion: ['Office', 'Formal'],
    season: ['Spring', 'Fall'],
    topNotes: ['Bergamot', 'Neroli', 'Lemon'],
    heartNotes: ['Oak Moss', 'Patchouli'],
    baseNotes: ['Vetiver', 'Musk', 'Amber'],
    rationale: 'Chanel\'s 1955 chypre benchmark — neroli and oakmoss over vetiver in a composition that remains one of the finest in the entire masculine canon. Genuinely timeless.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },

  // ---- AZZARO ----
  {
    id: 'azzaro-wanted-edt',
    name: 'Wanted',
    house: 'Azzaro',
    price: 75,
    concentration: 'EDT',
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Lemon', 'Ginger', 'Juniperberry'],
    heartNotes: ['Cardamom', 'Violet Wood'],
    baseNotes: ['Vetiver', 'Amber', 'Tonka Bean'],
    rationale: 'A clean, well-structured fresh-woody built on juniper and violet wood over vetiver and tonka. Reliable and under-discussed; solid performance for the price.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'azzaro-wanted-by-night',
    name: 'Wanted by Night',
    house: 'Azzaro',
    price: 90,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Lemon', 'Bay Leaf'],
    heartNotes: ['Tobacco', 'Gaiac Wood'],
    baseNotes: ['Musk', 'Patchouli', 'Amber'],
    rationale: 'A tobacco-amber powerhouse that outperforms its price significantly — bay leaf and tobacco over patchouli and amber creates a genuinely compelling evening fragrance.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'azzaro-most-wanted-edt',
    name: 'The Most Wanted',
    house: 'Azzaro',
    price: 85,
    concentration: 'EDT',
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Fall'],
    topNotes: ['Bergamot', 'Cardamom'],
    heartNotes: ['Lavender', 'Vetiver'],
    baseNotes: ['Tonka Bean', 'Cedarwood'],
    rationale: 'The lighter sibling to the Parfum — bergamot and cardamom over lavender and tonka in a clean, wearable fresh-woody. More versatile than the intense flankers.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'azzaro-most-wanted-edp',
    name: 'The Most Wanted',
    house: 'Azzaro',
    price: 95,
    concentration: 'EDP',
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Cardamom'],
    heartNotes: ['Lavender', 'Vetiver', 'Almond'],
    baseNotes: ['Tonka Bean', 'Leather'],
    rationale: 'A warming, almond-leather take on the Most Wanted framework — richer than the EDT with a leathery drydown that adds genuine evening presence.',
    intensity: 4,
    longevity: '7-9 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  // ---- MONTBLANC merge: remove Mont Blanc, consolidate under Montblanc ----
  // (Legend Spirit was listed under 'Mont Blanc' — it will be removed via the data fix step)

  // ---- DIOR ----
  {
    id: 'dior-sauvage-parfum',
    name: 'Sauvage Parfum',
    house: 'Dior',
    price: 200,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Lavender'],
    heartNotes: ['Sichuan Pepper', 'Lavender'],
    baseNotes: ['Sandalwood', 'Vanilla', 'Tonka Bean'],
    rationale: 'The pinnacle of the Sauvage line — sandalwood and vanilla ground the bergamot freshness in a warm, resinous base that is far more complex than the EDT. The most compelling evening expression.',
    intensity: 5,
    longevity: '10-14 hrs',
    sillage: 'Very Strong',
    projection: 5,
  },
  {
    id: 'dior-homme-sport',
    name: 'Dior Homme Sport',
    house: 'Dior',
    price: 140,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Blood Orange', 'Lemon'],
    heartNotes: ['Iris', 'Pepper'],
    baseNotes: ['Cedar', 'Elemi', 'Amber'],
    rationale: 'A crisp, citrus-fresh take on the Dior Homme DNA — the iris-cedar structure is lightened considerably by blood orange and elemi. A better warm-weather option within the DH line.',
    intensity: 3,
    longevity: '5-7 hrs',
    sillage: 'Moderate',
    projection: 3,
  },

  // ---- GIORGIO ARMANI ----
  {
    id: 'acqua-di-gio-profondo',
    name: 'Acqua di Giò Profondo',
    house: 'Giorgio Armani',
    price: 130,
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Green Mandarin', 'Aquatic Notes'],
    heartNotes: ['Mastic', 'Rosemary'],
    baseNotes: ['Patchouli', 'Mineral Musk'],
    rationale: 'The deepest, most aquatic AdG — mastic and rosemary over patchouli and mineral musk give a darker, more substantive character than the original. A summer fragrance with genuine depth.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'acqua-di-gio-edp',
    name: 'Acqua di Giò',
    house: 'Giorgio Armani',
    price: 120,
    concentration: 'EDP',
    family: ['Fresh', 'Woody'],
    occasion: ['Everyday', 'Office'],
    season: ['Spring', 'Summer'],
    topNotes: ['Bergamot', 'Neroli', 'Mandarin'],
    heartNotes: ['Rosemary', 'Jasmine'],
    baseNotes: ['Cedar', 'Musk'],
    rationale: 'The EDP concentration of AdG — crisper and slightly more structured than the original EDT, with better longevity and a cleaner mineral finish. The modern way to wear the classic.',
    intensity: 3,
    longevity: '6-8 hrs',
    sillage: 'Moderate',
    projection: 3,
  },
  {
    id: 'acqua-di-gio-absolu',
    name: 'Acqua di Giò Absolu',
    house: 'Giorgio Armani',
    price: 160,
    family: ['Woody', 'Amber'],
    occasion: ['Date Night', 'Everyday'],
    season: ['Fall', 'Winter'],
    topNotes: ['Bergamot', 'Green Mandarin'],
    heartNotes: ['Rosemary', 'Incense'],
    baseNotes: ['Patchouli', 'Amber', 'Vetiver'],
    rationale: 'Incense and patchouli transform the familiar AdG aquatic-citrus into something warmer and more substantial. The best cold-weather entry point into the AdG family.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
  },
  {
    id: 'armani-code-absolu',
    name: 'Armani Code Absolu',
    house: 'Giorgio Armani',
    price: 140,
    family: ['Amber', 'Woody'],
    occasion: ['Date Night', 'Formal'],
    season: ['Fall', 'Winter'],
    topNotes: ['Blood Orange'],
    heartNotes: ['Cardamom', 'Vanilla'],
    baseNotes: ['Tobacco', 'Tonka Bean', 'Amber'],
    rationale: 'Blood orange and cardamom open into a dark tobacco-vanilla core — one of Armani\'s best evening fragrances and consistently underrated relative to its quality and performance.',
    intensity: 4,
    longevity: '8-10 hrs',
    sillage: 'Strong',
    projection: 4,
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

const budgetRanges = [
  { id: 'under-75',    label: 'Under $75',      min: 0,   max: 75  },
  { id: '75-150',      label: '$75 – $150',      min: 75,  max: 150 },
  { id: '150-300',     label: '$150 – $300',     min: 150, max: 300 },
  { id: 'over-300',    label: 'Over $300',       min: 300, max: Infinity },
]

export function ScentRecommendationEngine() {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null)
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([])
  const [familyMode, setFamilyMode] = useState<'any' | 'all'>('any')
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([])
  const [selectedIntensities, setSelectedIntensities] = useState<number[]>([])
  const [sortBy, setSortBy] = useState<'intensity' | 'price-asc' | 'price-desc'>('intensity')
  const [searchQuery, setSearchQuery] = useState('')
  const [shortlist, setShortlist] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleShortlist = (id: string) => {
    setShortlist(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

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
        familyMode === 'all'
          ? selectedFamilies.every(fam => f.family.includes(fam))
          : f.family.some(fam => selectedFamilies.includes(fam))
      )
    }

    if (selectedBudgets.length > 0) {
      results = results.filter(f =>
        selectedBudgets.some(budgetId => {
          const range = budgetRanges.find(b => b.id === budgetId)
          return range ? f.price >= range.min && f.price < range.max : false
        })
      )
    }

    if (selectedIntensities.length > 0) {
      results = results.filter(f => selectedIntensities.includes(f.intensity))
    }

    if (searchQuery.trim()) {
      const terms = searchQuery.toLowerCase().trim().split(/[\s,]+/).filter(Boolean)
      results = results.filter(f => {
        const searchable = [
          f.name, f.house,
          ...f.topNotes, ...f.heartNotes, ...f.baseNotes
        ].map(s => s.toLowerCase())
        return terms.every(term => searchable.some(s => s.includes(term)))
      })
    }

    if (sortBy === 'price-asc') return results.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') return results.sort((a, b) => b.price - a.price)
    return results.sort((a, b) => b.intensity - a.intensity)
  }, [selectedOccasion, selectedSeasons, selectedFamilies, familyMode, selectedBudgets, selectedIntensities, sortBy, searchQuery])

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

  const toggleBudget = (budgetId: string) => {
    setSelectedBudgets(prev =>
      prev.includes(budgetId)
        ? prev.filter(b => b !== budgetId)
        : [...prev, budgetId]
    )
  }

  const toggleIntensity = (level: number) => {
    setSelectedIntensities(prev =>
      prev.includes(level)
        ? prev.filter(i => i !== level)
        : [...prev, level]
    )
  }

  const clearAllFilters = () => {
    setSelectedOccasion(null)
    setSelectedSeasons([])
    setSelectedFamilies([])
    setFamilyMode('any')
    setSelectedBudgets([])
    setSelectedIntensities([])
    setSortBy('intensity')
    setSearchQuery('')
  }

  const hasActiveFilters = selectedOccasion || selectedSeasons.length > 0 || selectedFamilies.length > 0 || selectedBudgets.length > 0 || selectedIntensities.length > 0 || searchQuery.length > 0

  return (
    <div className="my-8">
      <div className="rounded-lg border border-gold/20 bg-surface overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-surface-elevated to-surface-hover px-6 py-5 border-b border-gold/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl text-cream">Find Your Perfect Scent</h3>
              <p className="text-sm text-cream-muted">
                Select your preferences to discover personalized recommendations
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-medium uppercase tracking-[0.12em] text-cream-muted hover:text-gold border border-gold/20 hover:border-gold/50 rounded-lg px-3 py-2 transition-all duration-200"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 space-y-6">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream-muted/40 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by brand, name, or note — e.g. iris vetiver, Dior oud…"
              className="w-full rounded-lg border border-gold/20 bg-surface-elevated/50 pl-9 pr-9 py-3 text-sm text-cream placeholder:text-cream-muted/40 focus:outline-none focus:border-gold/50 focus:bg-surface-elevated transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-muted/40 hover:text-cream-muted transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
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
            <div className="mb-3 flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                Preferred Scent Family <span className="text-cream-muted/60 normal-case">(multi-select)</span>
              </label>
              {selectedFamilies.length > 1 && (
                <div className="flex items-center gap-1 rounded-lg border border-gold/20 bg-surface p-0.5 text-xs">
                  <button
                    onClick={() => setFamilyMode('any')}
                    className={cn(
                      'rounded px-2 py-1 transition-all duration-200 font-medium',
                      familyMode === 'any' ? 'bg-gold/20 text-gold' : 'text-cream-muted hover:text-cream'
                    )}
                  >
                    Match any
                  </button>
                  <button
                    onClick={() => setFamilyMode('all')}
                    className={cn(
                      'rounded px-2 py-1 transition-all duration-200 font-medium',
                      familyMode === 'all' ? 'bg-gold/20 text-gold' : 'text-cream-muted hover:text-cream'
                    )}
                  >
                    Match all
                  </button>
                </div>
              )}
            </div>
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
          {/* Budget Selection */}
          <div>
            <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-gold">
              Budget <span className="text-cream-muted/60 normal-case">(multi-select)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {budgetRanges.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => toggleBudget(id)}
                  className={cn(
                    'group flex items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-all duration-300',
                    'hover:border-gold/50 hover:bg-surface-elevated hover:scale-105',
                    selectedBudgets.includes(id)
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                      : 'border-gold/20 bg-surface-elevated/50'
                  )}
                  style={{ cursor: 'pointer' }}
                >
                  <span className={cn(
                    'text-sm font-medium transition-colors',
                    selectedBudgets.includes(id) ? 'text-cream' : 'text-cream-muted'
                  )}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Selection */}
          <div>
            <label className="mb-3 block text-xs font-medium uppercase tracking-[0.15em] text-gold">
              Intensity <span className="text-cream-muted/60 normal-case">(multi-select)</span>
            </label>
            <div className="grid grid-cols-5 gap-3">
              {[
                { level: 1, label: 'Very Light' },
                { level: 2, label: 'Light' },
                { level: 3, label: 'Moderate' },
                { level: 4, label: 'Strong' },
                { level: 5, label: 'Very Strong' },
              ].map(({ level, label }) => (
                <button
                  key={level}
                  onClick={() => toggleIntensity(level)}
                  className={cn(
                    'group flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 transition-all duration-300',
                    'hover:border-gold/50 hover:bg-surface-elevated hover:scale-105',
                    selectedIntensities.includes(level)
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                      : 'border-gold/20 bg-surface-elevated/50'
                  )}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <div
                        key={i}
                        className={cn(
                          'h-1.5 w-1.5 rounded-full transition-colors',
                          i <= level
                            ? selectedIntensities.includes(level) ? 'bg-gold' : 'bg-cream-muted/50'
                            : 'bg-cream-muted/15'
                        )}
                      />
                    ))}
                  </div>
                  <span className={cn(
                    'text-[10px] font-medium text-center leading-tight transition-colors',
                    selectedIntensities.includes(level) ? 'text-cream' : 'text-cream-muted/70'
                  )}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gold/20 bg-surface-elevated/30 px-6 py-6">
          <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
            <h4 className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
              {hasActiveFilters ? 'Filtered Results' : 'All Fragrances'}
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg border border-gold/20 bg-surface p-0.5 text-xs">
                <button
                  onClick={() => setSortBy('intensity')}
                  className={cn(
                    'rounded px-2 py-1 transition-all duration-200 font-medium',
                    sortBy === 'intensity' ? 'bg-gold/20 text-gold' : 'text-cream-muted hover:text-cream'
                  )}
                >
                  Best match
                </button>
                <button
                  onClick={() => setSortBy('price-asc')}
                  className={cn(
                    'rounded px-2 py-1 transition-all duration-200 font-medium',
                    sortBy === 'price-asc' ? 'bg-gold/20 text-gold' : 'text-cream-muted hover:text-cream'
                  )}
                >
                  Price ↑
                </button>
                <button
                  onClick={() => setSortBy('price-desc')}
                  className={cn(
                    'rounded px-2 py-1 transition-all duration-200 font-medium',
                    sortBy === 'price-desc' ? 'bg-gold/20 text-gold' : 'text-cream-muted hover:text-cream'
                  )}
                >
                  Price ↓
                </button>
              </div>
              <div className="text-sm text-cream-muted">
                {filteredFragrances.length} {filteredFragrances.length === 1 ? 'match' : 'matches'}
              </div>
            </div>
          </div>

          {filteredFragrances.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gold/20 bg-surface/50 px-6 py-12 text-center">
              <p className="text-cream-muted">
                No fragrances match your current selection. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFragrances.map((fragrance) => (
                <FragranceCard
                  key={fragrance.id}
                  fragrance={fragrance}
                  isShortlisted={shortlist.includes(fragrance.id)}
                  canShortlist={shortlist.length < 3 || shortlist.includes(fragrance.id)}
                  onToggleShortlist={() => toggleShortlist(fragrance.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Compare Button */}
      {shortlist.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <button
            onClick={() => setDrawerOpen(v => !v)}
            className="flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-surface shadow-lg shadow-gold/30 transition-all duration-200 hover:bg-gold-light hover:shadow-xl hover:shadow-gold/40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 0-2 2h-2a2 2 0 0 0-2-2z" />
            </svg>
            Compare {shortlist.length}
          </button>
        </div>
      )}

      {/* Comparison Drawer */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[9998] transition-transform duration-500',
          drawerOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="border-t border-gold/20 bg-[#0D0D12]/97 shadow-2xl backdrop-blur-xl">

          {/* Drag handle / close */}
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex w-full items-center justify-center py-3 hover:opacity-70 transition-opacity"
            aria-label="Close comparison"
          >
            <div className="h-1 w-10 rounded-full bg-gold/25" />
          </button>

          <div className="mx-auto max-w-[1100px] px-4 pb-6 sm:px-6 lg:px-8">

            {/* Header row */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
                Side-by-Side Comparison
              </span>
              <button
                onClick={() => { setShortlist([]); setDrawerOpen(false) }}
                className="rounded border border-white/10 px-3 py-1 text-xs text-cream-muted transition-colors hover:border-gold/30 hover:text-cream"
              >
                Clear All
              </button>
            </div>

            {/* Grid: label column + one column per shortlisted fragrance */}
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: `120px repeat(${shortlist.length}, 1fr)` }}
            >
              {/* Row labels */}
              <div className="flex flex-col pt-[68px]">
                {['Family', 'Longevity', 'Sillage', 'Intensity', 'Projection', 'Top Notes', 'Heart Notes', 'Base Notes'].map(label => (
                  <div
                    key={label}
                    className="border-b border-white/[0.04] py-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-cream-muted/40"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* One column per shortlisted fragrance */}
              {shortlist.map(id => {
                const f = fragrances.find(fr => fr.id === id)!
                return (
                  <div key={id} className="overflow-hidden rounded-lg border border-gold/20 bg-surface-elevated">

                    {/* Card header */}
                    <div className="relative border-b border-gold/10 bg-gold/[0.04] p-3 pr-7">
                      <button
                        onClick={() => toggleShortlist(id)}
                        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 text-cream-muted/40 transition-colors hover:border-gold/40 hover:text-gold"
                        aria-label={`Remove ${f.name}`}
                      >
                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="font-serif text-sm leading-snug text-cream">{f.name}</div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-gold-light">{f.house}</div>
                      <div className="mt-1 text-sm font-medium text-gold">${f.price}</div>
                    </div>

                    {/* Data rows */}
                    <div className="divide-y divide-white/[0.04] px-3">
                      <div className="py-2.5 text-xs text-cream-muted">{f.family.join(', ')}</div>
                      <div className="py-2.5 text-xs text-cream-muted">{f.longevity}</div>
                      <div className="py-2.5 text-xs text-cream-muted">{f.sillage}</div>
                      <div className="py-2.5">
                        <div className="mb-1.5 text-xs text-cream-muted">{f.intensity}/5</div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-surface">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold"
                            style={{ width: `${(f.intensity / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="py-2.5">
                        <div className="mb-1.5 text-xs text-cream-muted">{f.projection}/5</div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-surface">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold"
                            style={{ width: `${(f.projection / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="py-2.5 text-xs text-cream-muted leading-relaxed">{f.topNotes.join(', ')}</div>
                      <div className="py-2.5 text-xs text-cream-muted leading-relaxed">{f.heartNotes.join(', ')}</div>
                      <div className="py-2.5 text-xs text-cream-muted leading-relaxed">{f.baseNotes.join(', ')}</div>
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
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

function FragranceCard({
  fragrance,
  isShortlisted,
  canShortlist,
  onToggleShortlist,
}: {
  fragrance: Fragrance
  isShortlisted: boolean
  canShortlist: boolean
  onToggleShortlist: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border border-gold/30 bg-gradient-to-br from-surface-elevated to-surface transition-all duration-500',
        'hover:border-gold hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02]',
        isExpanded ? 'border-gold shadow-lg shadow-gold/20' : '',
        isShortlisted ? 'border-gold/60 shadow-md shadow-gold/15' : ''
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
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-sm font-medium text-gold whitespace-nowrap">${fragrance.price}</span>

              {/* Shortlist / compare button */}
              <button
                onClick={(e) => { e.stopPropagation(); onToggleShortlist() }}
                disabled={!canShortlist}
                title={isShortlisted ? 'Remove from comparison' : canShortlist ? 'Add to comparison' : 'Max 3 fragrances selected'}
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200',
                  isShortlisted
                    ? 'border-gold bg-gold text-surface'
                    : canShortlist
                    ? 'border-gold/30 bg-gold/5 text-cream-muted hover:border-gold hover:bg-gold/10 hover:text-gold'
                    : 'border-white/10 bg-transparent text-white/20 cursor-not-allowed'
                )}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 0-2 2h-2a2 2 0 0 0-2-2z" />
                </svg>
              </button>

              {/* Expand chevron */}
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
            isExpanded ? 'mt-4 max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
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
