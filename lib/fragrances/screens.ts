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
    'Hides fragrances that list cinnamon, cassia, Peru balsam or Tolu balsam as a note. ' +
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
