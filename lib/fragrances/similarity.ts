import type { Fragrance } from './types'

export function getSimilarFragrances(
  target: Fragrance,
  all: Fragrance[],
  count = 4
): Fragrance[] {
  const targetNotes = new Set(
    [...target.topNotes, ...target.heartNotes, ...target.baseNotes].map(n => n.toLowerCase())
  )

  const scored = all
    .filter(f => f.id !== target.id)
    .map(f => {
      let score = 0

      // Family overlap — strongest signal (shared DNA)
      const famOverlap = f.family.filter(fam => target.family.includes(fam)).length
      score += famOverlap * 3

      // Note overlap across all layers
      const fNotes = new Set(
        [...f.topNotes, ...f.heartNotes, ...f.baseNotes].map(n => n.toLowerCase())
      )
      const noteOverlap = [...targetNotes].filter(n => fNotes.has(n)).length
      score += noteOverlap * 2

      // Season overlap
      const seasonOverlap = f.season.filter(s => target.season.includes(s)).length
      score += seasonOverlap * 1

      // Intensity proximity — penalise big gaps
      score += Math.max(0, 2 - Math.abs(f.intensity - target.intensity))

      return { fragrance: f, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, count).map(s => s.fragrance)
}
