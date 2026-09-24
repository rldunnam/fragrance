import type { Fragrance } from './types'

/**
 * Free-text search over the catalog.
 *
 * Terms are ANDed. A leading "-" turns a term into an exclusion, and double
 * quotes group words into one term: `vanilla -"hexyl cinnamal"`. An unclosed
 * quote runs to the end of the query. A bare "-" or empty "" carries no term
 * and is ignored.
 *
 * A term matches a fragrance when either
 *   - it appears as a whole word in the name, house or any note, or
 *   - it equals one of the fragrance's ingredients exactly (case-insensitive).
 *
 * Ingredients are matched exactly, never by word, because label names nest:
 * "Cinnamal" is a word inside "Hexyl Cinnamal" and "Amyl Cinnamal", which are
 * different substances. `-cinnamal` must not remove those.
 */
export interface SearchTerm {
  /** Lower-cased term text, quotes removed. */
  text: string
  negated: boolean
  /** Whole-word pattern for name, house and notes. */
  pattern: RegExp
}

const TOKEN = /-?"[^"]*"?|[^\s,]+/g

export function parseSearchQuery(query: string): { include: SearchTerm[]; exclude: SearchTerm[] } {
  const include: SearchTerm[] = []
  const exclude: SearchTerm[] = []
  for (const raw of query.toLowerCase().match(TOKEN) ?? []) {
    const negated = raw.startsWith('-')
    const text = (negated ? raw.slice(1) : raw).replace(/^"|"$/g, '').trim()
    if (!text) continue
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const term = { text, negated, pattern: new RegExp(`(?<![a-z])${escaped}(?![a-z])`, 'i') }
    if (negated) exclude.push(term)
    else include.push(term)
  }
  return { include, exclude }
}

/** Builds a matcher for one fragrance; call it once per fragrance, then per term. */
export function termMatcher(f: Fragrance): (term: SearchTerm) => boolean {
  const searchable = [f.name, f.house, ...f.topNotes, ...f.heartNotes, ...f.baseNotes]
  const ingredients = new Set((f.ingredients ?? []).map((i) => i.toLowerCase()))
  return (term) => ingredients.has(term.text) || searchable.some((s) => term.pattern.test(s))
}

/** How a note should be appended to a query: quoted when it has several words. */
export function noteAsTerm(note: string): string {
  return /\s/.test(note.trim()) ? `"${note.trim()}"` : note.trim()
}
