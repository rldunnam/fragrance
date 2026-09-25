import type { Fragrance } from './types'

/**
 * Opt-in content screens: named sets of note patterns a viewer can switch on
 * to hide fragrances from the selector.
 *
 * Screens match the note pyramid rather than the ingredient label on purpose.
 * A label declares a listed allergen at any concentration above a tiny legal
 * threshold, so a trace of cinnamon oil and a cinnamon-forward composition
 * look identical there. A house only bills a note when it is perceptible,
 * which makes note billing a rough proxy for dose. Checked against real
 * reactions, the pyramid tracked them; the label did not.
 *
 * Screens are deliberately generic and carry no personal information.
 */
export interface NoteScreen {
  id: string
  label: string
  description: string
  /** Matched against every top, heart and base note, case-insensitively. */
  patterns: RegExp[]
}

const word = (w: string) => new RegExp(`(?<![a-z])${w}(?![a-z])`, 'i')

export const cinnamonBalsamScreen: NoteScreen = {
  id: 'cinnamon-balsam',
  label: 'Cinnamon & balsam screen',
  description:
    'Hides fragrances that list cinnamon, cassia, Peru balsam or Tolu balsam as a note, ' +
    'plus a few flagged by hand where the note list under-reports it. ' +
    'Anything you have marked as tolerated stays visible; anything you have marked ' +
    'as causing a reaction is hidden whatever its notes.',
  patterns: [word('cinnamon'), word('cassia'), word('peru'), word('tolu')],
}

/** The notes of `fragrance` that the screen matches, in pyramid order. */
export function screenMatches(fragrance: Fragrance, screen: NoteScreen = cinnamonBalsamScreen): string[] {
  return [...fragrance.topNotes, ...fragrance.heartNotes, ...fragrance.baseNotes].filter((note) =>
    screen.patterns.some((p) => p.test(note)),
  )
}

/** The manual flag reason for `fragrance` under `screen`, if it carries one. */
export function screenFlag(fragrance: Fragrance, screen: NoteScreen = cinnamonBalsamScreen): string | undefined {
  return fragrance.screenFlags?.[screen.id]
}

/** Whether the screen hides `fragrance`: a matching note, or a manual flag. */
export function isScreened(fragrance: Fragrance, screen: NoteScreen = cinnamonBalsamScreen): boolean {
  return screenMatches(fragrance, screen).length > 0 || screenFlag(fragrance, screen) !== undefined
}

/**
 * Label ingredients that earn a caution badge, not a hide. They are close
 * chemical relatives of what the screen targets (cinnamates, Cinnamal, the
 * cinnamon and cassia oils of genus Cinnamomum, and Peru and Tolu balsam,
 * whose Latin genus is Myroxylon), but label presence alone did not track
 * real reactions, so they inform rather than filter.
 *
 * Cinnamal is matched exactly: Amyl Cinnamal and Hexyl Cinnamal are separate
 * jasmine-type materials and do not earn the badge.
 */
const CAUTION_PATTERNS: { label: string; pattern: RegExp }[] = [
  { label: 'Cinnamal', pattern: /^cinnamal$/i },
  { label: 'Cinnamon Oil (Cinnamomum)', pattern: /cinnamomum/i },
  { label: 'Cinnamyl Alcohol', pattern: /^cinnamyl alcohol$/i },
  { label: 'Benzyl Cinnamate', pattern: /^benzyl cinnamate$/i },
  { label: 'Balsam (Myroxylon)', pattern: /myroxylon|balsam peru|peru balsam|tolu/i },
]

/** Caution labels for the fragrance's listed ingredients, deduplicated. */
export function cautionMatches(fragrance: Fragrance): string[] {
  const found = new Set<string>()
  for (const ingredient of fragrance.ingredients ?? []) {
    for (const { label, pattern } of CAUTION_PATTERNS) if (pattern.test(ingredient)) found.add(label)
  }
  return [...found]
}
