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

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
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
const typesSrc = readFileSync(resolve(root, 'lib/fragrances/types.ts'), 'utf8')

const idsFrom = (src, exportName) => {
  const block = src.match(new RegExp(`export const ${exportName} = \\[([\\s\\S]*?)\\n\\]`))
  if (!block) throw new Error(`Could not locate export "${exportName}" in filters.ts`)
  return new Set([...block[1].matchAll(/id: '([^']+)'/g)].map((m) => m[1]))
}

// Audience is read from the `Audience` union in types.ts rather than from
// filters.ts, because the filter UI deliberately does not offer these three
// values one-to-one — audienceViews maps them onto two overlapping views.
const unionFrom = (src, typeName) => {
  const m = src.match(new RegExp(`export type ${typeName} = ([^\\n]+)`))
  if (!m) throw new Error(`Could not locate type "${typeName}" in types.ts`)
  return new Set([...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]))
}

const AUDIENCES = unionFrom(typesSrc, 'Audience')
const STATUSES = unionFrom(typesSrc, 'ReleaseStatus')
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
    .map((v) => v.trim().replace(/^['"]|['"]$/g, ''))
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
// lowercased note -> Map(spelling -> first entry id using it)
const noteSpellings = new Map()
let missingSource = 0
let withIngredients = 0

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

  const audience = str(body, 'audience')
  if (!audience) {
    err(`${where} missing required field "audience"`)
  } else if (!AUDIENCES.has(audience)) {
    err(`${where} audience "${audience}" not in ${[...AUDIENCES].join(' | ')}`)
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
  // notesFlat: the source gives no tiers, so every note lives in heartNotes
  // and the other two stay empty instead of carrying an invented split.
  const flat = /\bnotesFlat: true\b/.test(body)
  for (const field of ['topNotes', 'heartNotes', 'baseNotes']) {
    const vals = list(body, field)
    const mustBeEmpty = flat && field !== 'heartNotes'
    if (!vals) err(`${where} missing required field "${field}"`)
    else if (mustBeEmpty && vals.length > 0) err(`${where} notesFlat entries keep all notes in heartNotes; "${field}" must be empty`)
    else if (!mustBeEmpty && vals.length === 0) err(`${where} "${field}" is empty`)
    for (const note of vals ?? []) {
      const key = note.toLowerCase()
      if (!noteSpellings.has(key)) noteSpellings.set(key, new Map())
      const spellings = noteSpellings.get(key)
      if (!spellings.has(note)) spellings.set(note, id)
    }
  }

  // --- ingredient label -----------------------------------------------------
  const ingredients = list(body, 'ingredients')
  const ingredientsSource = str(body, 'ingredientsSource')
  const formulaCode = str(body, 'formulaCode')
  if (ingredients) {
    if (ingredients.length === 0) err(`${where} ingredients is empty — omit the field instead`)
    if (!ingredientsSource) err(`${where} ingredients need an ingredientsSource`)
    const seen = new Set()
    for (const ing of ingredients) {
      const k = ing.toLowerCase()
      if (seen.has(k)) err(`${where} ingredient "${ing}" listed twice`)
      seen.add(k)
    }
  } else {
    if (ingredientsSource) err(`${where} ingredientsSource without ingredients`)
    if (formulaCode) err(`${where} formulaCode without ingredients`)
  }
  if (ingredientsSource && !/^https:\/\/\S+$/.test(ingredientsSource)) {
    err(`${where} ingredientsSource must be an https URL, got "${ingredientsSource}"`)
  }
  if (ingredients) withIngredients++

  // --- release status -------------------------------------------------------
  // The default inclusion rule is "currently produced and broadly distributed".
  // Anything else is an exception and has to say why it is here, so each
  // exception is decided once, in writing, rather than by an unwritten rule.
  const status = str(body, 'status')
  const includeReason = str(body, 'includeReason')
  if (status && !STATUSES.has(status)) {
    err(`${where} status "${status}" not in ${[...STATUSES].join(' | ')}`)
  }
  if (status && status !== 'current' && !includeReason) {
    err(`${where} status "${status}" requires an includeReason explaining why it is in the catalog`)
  }
  if (includeReason && (!status || status === 'current')) {
    err(`${where} includeReason is only for non-current releases — remove it or set status`)
  }

  const source = str(body, 'source')
  if (source === null) missingSource++
  else if (!/^https:\/\/\S+$/.test(source)) err(`${where} source must be an https URL, got "${source}"`)

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
// Every value audienceViews can select on must exist in the Audience union,
// and every Audience value must be reachable from at least one view — either
// direction breaking makes entries silently unfilterable.
const viewMatches = [...filtersSrc.matchAll(/matches: \[([^\]]*)\]/g)].flatMap((m) =>
  m[1].split(',').map((v) => v.trim().replace(/^'|'$/g, '')).filter(Boolean),
)
if (viewMatches.length === 0) {
  err('Parsed no audienceViews matches from filters.ts — the file shape may have changed.')
}
for (const v of new Set(viewMatches)) {
  if (!AUDIENCES.has(v)) err(`audienceViews matches "${v}", which is not in the Audience union`)
}
for (const a of AUDIENCES) {
  if (!viewMatches.includes(a)) {
    err(`audience "${a}" is not matched by any view in audienceViews — those entries are unreachable`)
  }
}

const usedAudiences = new Set(entries.map((e) => str(e.body, 'audience')).filter(Boolean))
for (const a of AUDIENCES) {
  if (!usedAudiences.has(a)) warn(`audience "${a}" is defined but no fragrance uses it`)
}

const usedFamilies = new Set(entries.flatMap((e) => list(e.body, 'family') ?? []))
for (const f of FAMILIES) {
  if (!usedFamilies.has(f)) {
    warn(`family "${f}" is offered as a filter but no fragrance uses it — filtering by it returns nothing`)
  }
}

// Note vocabulary. Search matches whole words, so a plural or re-cased variant
// of an existing note silently escapes both inclusion and exclusion: "-clove"
// does not remove a fragrance listing "Cloves". One spelling per note.
const noteIndex = new Map() // lowercased note -> representative spelling
for (const [key, spellings] of noteSpellings) {
  if (spellings.size > 1) {
    err(`note spelled ${[...spellings.keys()].map((s) => `"${s}"`).join(' and ')} — pick one ` +
      `(used by ${[...spellings.values()].join(', ')})`)
  }
  noteIndex.set(key, [...spellings.keys()][0])
}
for (const [key, spelling] of noteIndex) {
  for (const suffix of ['s', 'es']) {
    const plural = noteIndex.get(key + suffix)
    if (plural) {
      err(`notes "${spelling}" and "${plural}" are singular/plural variants — use "${spelling}" ` +
        `(plural used by ${[...noteSpellings.get(key + suffix).values()].join(', ')})`)
    }
  }
}

// Pyramids are being re-verified against their sources entry by entry, so a
// missing source is reported as one summary line rather than one per entry.
if (missingSource > 0) {
  warn(`${missingSource} of ${entries.length} fragrances have no source for their note pyramid yet`)
}

// Permanent ids. Once an id ships, Supabase rows (cabinet, wishlist, ratings,
// reactions) reference it, and nothing links a renamed id back to them — a
// rename silently orphans every user's data for that fragrance. So ids are
// append-only: fix a wrong `name`, never the id. `pnpm ids:record` adds new
// ids to the manifest; removing one requires an explicit, reasoned entry in
// "retired", which is the cue to migrate the stored rows first.
const manifestPath = resolve(root, 'lib/fragrances/published-ids.json')
const recording = process.argv.includes('--record-ids')
const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, 'utf8'))
  : { published: [], retired: {} }
if (!existsSync(manifestPath) && !recording) {
  err('lib/fragrances/published-ids.json is missing — run `pnpm ids:record` to create it')
}
const published = new Set(manifest.published)
const retired = manifest.retired ?? {}
const dataIds = new Set(entries.map((e) => e.id))

for (const id of published) {
  if (dataIds.has(id)) continue
  if (id in retired) continue
  err(`[${id}] was published but is no longer in data.ts. Stored user rows reference it. ` +
    'Restore it (fix `name`, keep the id), or retire it in published-ids.json with a reason after migrating stored rows.')
}
for (const [id, reason] of Object.entries(retired)) {
  if (!published.has(id)) err(`[${id}] is retired but was never published`)
  if (dataIds.has(id)) err(`[${id}] is retired but still in data.ts`)
  if (!reason || typeof reason !== 'string') err(`[${id}] retired without a reason`)
}
const unrecorded = [...dataIds].filter((id) => !published.has(id))
if (unrecorded.length > 0) {
  if (recording) {
    manifest.published = [...published, ...unrecorded].sort()
    manifest.retired = retired
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
    console.log(`Recorded ${unrecorded.length} new id(s) in published-ids.json.`)
  } else {
    err(`${unrecorded.length} id(s) not in published-ids.json (${unrecorded.slice(0, 5).join(', ')}` +
      `${unrecorded.length > 5 ? ', …' : ''}). Once the ids are final, run \`pnpm ids:record\`.`)
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
console.log(
  `  notes: ${noteIndex.size} distinct  |  status: ` +
    [...STATUSES]
      .map((s) => `${s} ${entries.filter((e) => (str(e.body, 'status') ?? 'current') === s).length}`)
      .join('  |  '),
)
console.log(`  ingredient labels: ${withIngredients} of ${entries.length}  |  published ids: ${published.size + (recording ? unrecorded.length : 0)}`)
console.log(
  '  audience: ' +
    [...AUDIENCES]
      .map((a) => `${a} ${entries.filter((e) => str(e.body, 'audience') === a).length}`)
      .join('  |  '),
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
