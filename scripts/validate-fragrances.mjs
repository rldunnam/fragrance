#!/usr/bin/env node
/**
 * Catalog integrity checks for lib/fragrances/data.ts.
 *
 * These are the invariants TypeScript cannot express: the Fragrance interface
 * types family/occasion/season as `string[]`, so any string compiles even when
 * it makes the entry unreachable by filtering. This is exactly how the catalog
 * accumulated 13 families and 9 occasions against 6 and 4 defined in
 * filters.ts, with three entries that no filter combination could surface.
 *
 * Run: pnpm validate
 * Exits non-zero on any ERROR; warnings are reported but do not fail.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const warnings = []

const err = (m) => errors.push(m)
const warn = (m) => warnings.push(m)

// ---------------------------------------------------------------------------
// Parse the source files textually rather than importing them: data.ts pulls in
// filters.ts, which imports lucide-react, which needs a bundler. A regex parse
// keeps this dependency-free and fast enough to sit in CI.
// ---------------------------------------------------------------------------
const dataSrc = readFileSync(resolve(root, 'lib/fragrances/data.ts'), 'utf8')
const filtersSrc = readFileSync(resolve(root, 'lib/fragrances/filters.ts'), 'utf8')
const accentSrc = readFileSync(resolve(root, 'lib/fragrances/accent-color.ts'), 'utf8')

const idsFrom = (src, exportName) => {
  const block = src.match(new RegExp(`export const ${exportName} = \\[([\\s\\S]*?)\\n\\]`))
  if (!block) throw new Error(`Could not locate export "${exportName}" in filters.ts`)
  return new Set([...block[1].matchAll(/id: '([^']+)'/g)].map((m) => m[1]))
}

const FAMILIES = idsFrom(filtersSrc, 'scentFamilies')
const OCCASIONS = idsFrom(filtersSrc, 'occasions')
const SEASONS = idsFrom(filtersSrc, 'seasons')
const ACCENT_COLORS = new Set(
  [...accentSrc.matchAll(/^\s*'([^']+)':\s*'#/gm)].map((m) => m[1]),
)

// Controlled vocabularies not driven by filters.ts. Kept deliberately small:
// every new value here is a value the UI has to render sensibly.
const SILLAGE = new Set(['Soft', 'Light', 'Moderate', 'Strong', 'Very Strong'])
// Mirrors the Concentration union in lib/fragrances/types.ts. Marketing tiers
// (Elixir, Absolu, Profumo, Eau Extrême) belong in `name`, not here.
const CONCENTRATIONS = new Set(['EDC', 'EDT', 'EDP', 'Parfum', 'Extrait'])
const LONGEVITY_RE = /^(\d+-\d+ hrs|\d+\+ hrs)$/

// ---------------------------------------------------------------------------
// Split data.ts into entries
// ---------------------------------------------------------------------------
const entries = [...dataSrc.matchAll(/\{\s*id: '([^']+)'([\s\S]*?)\n {2}\}/g)].map(
  ([, id, body]) => ({ id, body }),
)

if (entries.length === 0) {
  err('Parsed zero entries from data.ts — the file shape may have changed.')
}

const list = (body, field) => {
  const m = body.match(new RegExp(`${field}: \\[([^\\]]*)\\]`))
  if (!m) return null
  return m[1]
    .split(',')
    .map((v) => v.trim().replace(/^'|'$/g, ''))
    .filter(Boolean)
}
// Values may be single- or double-quoted: entries containing an apostrophe
// (e.g. "Dior's signature") use double quotes.
const str = (body, field) => {
  const m = body.match(new RegExp(`${field}: (?:'([^']*)'|"([^"]*)")`))
  if (!m) return null
  return m[1] ?? m[2]
}
const num = (body, field) => {
  const m = body.match(new RegExp(`${field}: (-?[\\d.]+)`))
  return m ? Number(m[1]) : null
}

const seenIds = new Map()
const seenNames = new Map()

for (const { id, body } of entries) {
  const where = `[${id}]`

  // --- identity -------------------------------------------------------------
  if (seenIds.has(id)) err(`${where} duplicate id (also at entry #${seenIds.get(id)})`)
  seenIds.set(id, seenIds.size + 1)

  // Accented characters are permitted (e.g. pdm-hermès) but flagged, since
  // they are easy to mistype when cross-referencing an id by hand.
  if (!/^[\p{Ll}\p{N}]+(-[\p{Ll}\p{N}]+)*$/u.test(id)) {
    err(`${where} id must be lowercase kebab-case`)
  } else if (!/^[a-z0-9-]+$/.test(id)) {
    warn(`${where} id contains non-ASCII characters`)
  }

  // --- required scalars -----------------------------------------------------
  for (const field of ['name', 'house', 'rationale', 'longevity', 'sillage']) {
    if (!str(body, field)) err(`${where} missing required field "${field}"`)
  }

  const name = str(body, 'name')
  const house = str(body, 'house')
  if (name && house) {
    const key = `${house}::${name}::${str(body, 'concentration') ?? ''}`
    if (seenNames.has(key)) {
      warn(`${where} same house+name+concentration as [${seenNames.get(key)}]`)
    }
    seenNames.set(key, id)
  }

  // --- controlled vocabularies ---------------------------------------------
  const checkList = (field, allowed, allowedName) => {
    const vals = list(body, field)
    if (!vals) return err(`${where} missing required field "${field}"`)
    if (vals.length === 0) return err(`${where} "${field}" is empty`)
    if (new Set(vals).size !== vals.length) err(`${where} "${field}" has duplicates`)
    for (const v of vals) {
      if (!allowed.has(v)) {
        err(`${where} ${field} "${v}" is not in ${allowedName} — entry will be unreachable by that filter`)
      }
    }
  }
  checkList('family', FAMILIES, 'filters.ts scentFamilies')
  checkList('occasion', OCCASIONS, 'filters.ts occasions')
  checkList('season', SEASONS, 'filters.ts seasons')

  // Every family must also have an accent colour, or cards fall back to gold.
  for (const f of list(body, 'family') ?? []) {
    if (!ACCENT_COLORS.has(f)) {
      err(`${where} family "${f}" has no colour in accent-color.ts`)
    }
  }

  const sillage = str(body, 'sillage')
  if (sillage && !SILLAGE.has(sillage)) {
    err(`${where} sillage "${sillage}" not in ${[...SILLAGE].join(' | ')}`)
  }

  const conc = str(body, 'concentration')
  if (conc && !CONCENTRATIONS.has(conc)) {
    warn(`${where} unusual concentration "${conc}"`)
  }

  const longevity = str(body, 'longevity')
  if (longevity && !LONGEVITY_RE.test(longevity)) {
    err(`${where} longevity "${longevity}" must look like "6-8 hrs" or "12+ hrs"`)
  }

  // --- notes ----------------------------------------------------------------
  for (const field of ['topNotes', 'heartNotes', 'baseNotes']) {
    const vals = list(body, field)
    if (!vals) err(`${where} missing required field "${field}"`)
    else if (vals.length === 0) err(`${where} "${field}" is empty`)
  }

  // --- numeric ranges -------------------------------------------------------
  for (const field of ['intensity', 'projection']) {
    const v = num(body, field)
    if (v === null) err(`${where} missing required field "${field}"`)
    else if (!Number.isInteger(v) || v < 1 || v > 5) {
      err(`${where} ${field} must be an integer 1-5, got ${v}`)
    }
  }
  const price = num(body, 'price')
  if (price === null) err(`${where} missing required field "price"`)
  else if (price <= 0) err(`${where} price must be positive, got ${price}`)
  else if (price > 2000) warn(`${where} price $${price} looks high — verify`)

  // --- no images ------------------------------------------------------------
  // The catalog deliberately carries no bottle imagery. Sourcing official brand
  // photography for 231 entries is not maintainable, and 24 of the 94 previous
  // imageUrl values pointed at a different fragrance's filename. Fail on any
  // reappearance so the field cannot creep back one entry at a time.
  if (/imageUrl:/.test(body)) {
    err(`${where} has an imageUrl — the catalog no longer carries bottle images`)
  }
}

// ---------------------------------------------------------------------------
// Catalog-wide checks
// ---------------------------------------------------------------------------
const usedFamilies = new Set(entries.flatMap((e) => list(e.body, 'family') ?? []))
for (const f of FAMILIES) {
  if (!usedFamilies.has(f)) {
    warn(`family "${f}" is offered as a filter but no fragrance uses it — filtering by it returns nothing`)
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
console.log(`Validated ${entries.length} fragrances.`)
console.log(
  `  families: ${FAMILIES.size} defined, ${usedFamilies.size} in use` +
    `  |  occasions: ${OCCASIONS.size}  |  seasons: ${SEASONS.size}`,
)

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`)
  for (const w of warnings) console.log(`  WARN  ${w}`)
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`)
  for (const e of errors) console.error(`  ERROR ${e}`)
  process.exit(1)
}

console.log('\nNo errors.')
