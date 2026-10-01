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
const screensSrc = readFileSync(resolve(root, 'lib/fragrances/screens.ts'), 'utf8')

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
// Screen ids that a manual screenFlags entry may name.
const SCREEN_IDS = new Set([...screensSrc.matchAll(/^\s*id: '([^']+)',/gm)].map((m) => m[1]))
let screenFlagged = 0

// Note spelling. Pyramids are copied from Fragrantica verbatim, with two
// documented exceptions that keep one spelling per note so whole-word search
// finds it: the Fragrantica spellings below are stored as their catalog form,
// and trademark symbols are dropped ("Ambermax™" is stored as "Ambermax").
// Add an alias here, with the catalog form already in use, rather than
// renaming a note ad hoc in a single entry.
const NOTE_ALIASES = new Map([
  ['Vanila', 'Vanilla'],
  ['Cloves', 'Clove'],
  ['Citruses', 'Citrus'],
  ['Ambrette (Musk Mallow)', 'Ambrette'],
])
const TRADEMARK_RE = /[™®©]/

// Ingredient label sources. Labels come from the house's US site, then a major
// US retailer. Decant shops and discounters re-type labels and drop items (a
// decant vial page was missing the last two items of a 39-item list), so they
// fail outright. Non-US sites and multi-product set pages are warnings: they
// are sometimes the only source (regional releases), but need a reason.
const RESELLER_HOST_RE =
  /(^|\.)(microperfumes|decanthouse|decantx|scentdecant|scentsplit|fragrancenet|fragrancex|jomashop|maxaroma|amazon|ebay|walmart)\.[a-z.]+$/
const NON_US_HOST_RE = /\.(co\.uk|uk|fr|de|it|es|nl|ca|in|ae|com\.au|com\.mx|com\.br)$/
// House sites whose bare domain is the global (non-US) storefront.
const GLOBAL_HOSTS = new Set(['parfums-de-marly.com', 'www.parfums-de-marly.com'])
// A house's own global site, allowed as an ingredientsSource for that house's
// entries only: where the house's US site prints a shortened label and its
// global site prints the full list, the global list is used (decided
// 2026-10-01, F-034/F-035; see docs/validator-prompt.md). Keyed by `house`, so
// one house's global site never clears another house's entry, and retailers
// (e.g. Sephora FR) are never listed here. Add a house only with a ledger row
// recording that its US site prints the short form.
const HOUSE_GLOBAL_HOSTS = {
  'Parfums de Marly': new Set(['parfums-de-marly.com', 'www.parfums-de-marly.com']),
}
// A country locale in the path, e.g. dior.com/en_id/ (Indonesia). US paths
// (en_us, /us/en_US/) pass.
const NON_US_LOCALE_PATH_RE = /\/[a-z]{2}[_-](?!us(?:\/|$))[a-z]{2}(?:\/|$)/i
const SET_PAGE_RE = /(sampler|gift-set|coffret|discovery-set|mini-set|-set-|-set$)/i
// Formula codes as printed with a label: L'Oréal's "F.I.L. B266362/1" or
// Dior's "#21664". A bare batch code (e.g. "8YB02-1") is not a formula code.
const FORMULA_CODE_RE = /^(F\.I\.L\. [A-Z0-9]+\/\d+|#\d+)$/

// The US-site test shared by ingredientsSource and formulaCodeSource.
function isNonUsSite(hostname, pathname) {
  return NON_US_HOST_RE.test(hostname) || GLOBAL_HOSTS.has(hostname) ||
    (/(^|\.)sephora\./.test(hostname) && hostname !== 'www.sephora.com') ||
    (hostname === 'www.sephora.com' && /^\/ca\//.test(pathname)) ||
    NON_US_LOCALE_PATH_RE.test(pathname)
}
function shownSite(hostname, pathname) {
  return hostname + (pathname.match(/^\/[^/]+/)?.[0] ?? '')
}

// Price basis: the bottle size each house most commonly sells. Every price
// refers to that size unless the entry sets priceSizeMl.
const priceBasisPath = resolve(root, 'lib/fragrances/price-basis.json')
const PRICE_BASIS = existsSync(priceBasisPath)
  ? JSON.parse(readFileSync(priceBasisPath, 'utf8')).houses ?? {}
  : {}
if (!existsSync(priceBasisPath)) err('lib/fragrances/price-basis.json is missing')
let noPriceBasis = 0
// lowercased ingredient -> entry ids using it, for the near-duplicate check
const ingredientSpellings = new Map()

// ---------------------------------------------------------------------------
// Split data.ts into entries
// ---------------------------------------------------------------------------
const entries = [...dataSrc.matchAll(/\{\s*id: '([^']+)'([\s\S]*?)\n {2}\}/g)].map(
  ([, id, body]) => ({ id, body }),
)

if (entries.length === 0) {
  err('Parsed zero entries from data.ts — the file shape may have changed.')
}

// A single- or double-quoted string literal, allowing backslash escapes such
// as 'L\'Homme'. Stopping at the first quote instead would read that value as
// "L\" and make every apostrophe name look the same.
const STRING = `'(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*"`
const unquote = (lit) => lit.slice(1, -1).replace(/\\(.)/g, '$1')

const list = (body, field) => {
  const m = body.match(new RegExp(`${field}: \\[((?:${STRING}|[^\\]'"])*)\\]`))
  if (!m) return null
  return [...m[1].matchAll(new RegExp(STRING, 'g'))].map((x) => unquote(x[0])).filter(Boolean)
}
// Values may be single- or double-quoted: entries containing an apostrophe
// (e.g. "Dior's signature") use double quotes or an escaped \'.
const str = (body, field) => {
  const m = body.match(new RegExp(`${field}: (${STRING})`))
  if (!m) return null
  return unquote(m[1])
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
      if (TRADEMARK_RE.test(note)) {
        err(`${where} note "${note}" carries a trademark symbol — store it without (${note.replace(TRADEMARK_RE, '')})`)
      }
      if (NOTE_ALIASES.has(note)) {
        err(`${where} note "${note}" is Fragrantica's spelling — the catalog stores it as "${NOTE_ALIASES.get(note)}"`)
      }
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
      if (!ingredientSpellings.has(k)) ingredientSpellings.set(k, [])
      ingredientSpellings.get(k).push(id)
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
  if (ingredientsSource && /^https:\/\/\S+$/.test(ingredientsSource)) {
    const { hostname, pathname } = new URL(ingredientsSource)
    const regional = str(body, 'status') === 'regional'
    const houseGlobal = HOUSE_GLOBAL_HOSTS[house]?.has(hostname) ?? false
    if (RESELLER_HOST_RE.test(hostname)) {
      err(`${where} ingredientsSource is a decant shop or discounter (${hostname}) — use the house's US site or a major US retailer`)
    } else if (!regional && !houseGlobal && isNonUsSite(hostname, pathname)) {
      warn(`${where} ingredientsSource is not a US site (${shownSite(hostname, pathname)}) — use the house's US site or a US retailer`)
    }
    if (SET_PAGE_RE.test(pathname)) {
      warn(`${where} ingredientsSource looks like a multi-product set page — use the fragrance's own product page`)
    }
  }
  // formulaCodeSource: a second US product page where the code was seen, for
  // labels whose ingredientsSource prints no code (decided 2026-10-01, F-083).
  // Same US-site test as ingredientsSource; the house-global exception does
  // not apply.
  const formulaCodeSource = str(body, 'formulaCodeSource')
  if (formulaCodeSource) {
    if (!formulaCode) err(`${where} formulaCodeSource without formulaCode`)
    if (!/^https:\/\/\S+$/.test(formulaCodeSource)) {
      err(`${where} formulaCodeSource must be an https URL, got "${formulaCodeSource}"`)
    } else {
      const { hostname, pathname } = new URL(formulaCodeSource)
      if (RESELLER_HOST_RE.test(hostname)) {
        err(`${where} formulaCodeSource is a decant shop or discounter (${hostname}) — use a US product page`)
      } else if (isNonUsSite(hostname, pathname)) {
        err(`${where} formulaCodeSource is not a US site (${shownSite(hostname, pathname)}) — it must be a US product page`)
      }
      if (SET_PAGE_RE.test(pathname)) {
        err(`${where} formulaCodeSource looks like a multi-product set page — use the fragrance's own product page`)
      }
      if (formulaCodeSource === ingredientsSource) {
        err(`${where} formulaCodeSource repeats ingredientsSource — omit it`)
      }
    }
  }
  if (formulaCode && !FORMULA_CODE_RE.test(formulaCode)) {
    err(`${where} formulaCode "${formulaCode}" should look like "F.I.L. B266362/1" or "#21664" (bare batch codes don't belong here)`)
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

  // --- manual screen flags --------------------------------------------------
  // Written on one line as screenFlags: { 'screen-id': 'reason' }. Each flag
  // must name a real screen and say why, since it overrides the note rule.
  const flagsBlock = body.match(/\n    screenFlags: \{([^\n]*)\},/)
  if (/\bscreenFlags:/.test(body) && !flagsBlock) {
    err(`${where} screenFlags must be written on one line as { 'screen-id': 'reason' }`)
  }
  if (flagsBlock) {
    const pairs = [...flagsBlock[1].matchAll(/'([^']+)':\s*(?:'([^']*)'|"([^"]*)")/g)]
    if (pairs.length === 0) err(`${where} screenFlags is empty — omit the field instead`)
    for (const [, screenId, r1, r2] of pairs) {
      if (!SCREEN_IDS.has(screenId)) err(`${where} screenFlags names unknown screen "${screenId}"`)
      if (!(r1 ?? r2)?.trim()) err(`${where} screenFlags["${screenId}"] needs a reason`)
    }
    screenFlagged++
  }

  const source = str(body, 'source')
  if (source === null) missingSource++
  else if (!/^https:\/\/\S+$/.test(source)) err(`${where} source must be an https URL, got "${source}"`)
  else if (!/^https:\/\/www\.fragrantica\.com\/perfume\/[^/]+\/[^/]+-\d+\.html$/.test(source)) {
    err(`${where} source must be the fragrance's own Fragrantica page, got "${source}"`)
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
  const priceSizeMl = num(body, 'priceSizeMl')
  const basis = house ? PRICE_BASIS[house] : undefined
  if (priceSizeMl !== null) {
    if (!Number.isInteger(priceSizeMl) || priceSizeMl < 1 || priceSizeMl > 1000) {
      err(`${where} priceSizeMl must be a whole number of ml, got ${priceSizeMl}`)
    } else if (basis === priceSizeMl) {
      warn(`${where} priceSizeMl ${priceSizeMl} equals the ${house} basis — omit it`)
    }
  } else if (basis === undefined) {
    noPriceBasis++
  }

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

// Ingredient spelling. Search matches ingredients exactly, so a retailer's
// misprint copied into one label (Ulta's "Alpha-Isometyl Ionone") silently
// escapes a search for the real name. Flag ingredient names that differ from
// another catalog spelling by one or two characters once separators are
// ignored. Separator style is kept from each source on purpose, so spaces,
// hyphens, slashes and parentheses don't count as differences.
{
  const norm = (k) => k.replace(/[\s\-/()]/g, '')
  const lev = (a, b) => {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i])
    for (let j = 1; j <= b.length; j++) d[0][j] = j
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    return d[a.length][b.length]
  }
  const keys = [...ingredientSpellings.keys()]
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const a = norm(keys[i]), b = norm(keys[j])
      if (a === b || Math.min(a.length, b.length) < 8 || Math.abs(a.length - b.length) > 2) continue
      if (lev(a, b) > 2) continue
      const [rare, common] = ingredientSpellings.get(keys[i]).length <= ingredientSpellings.get(keys[j]).length
        ? [keys[i], keys[j]] : [keys[j], keys[i]]
      warn(`ingredient "${rare}" (${ingredientSpellings.get(rare).join(', ')}) is a near-duplicate of "${common}" — ` +
        'check the source for a misprint; a documented fix belongs in a comment on the entry')
    }
  }
}

// Price basis houses must exist in the catalog, and entries whose house has no
// basis yet are reported as one summary line, like missing pyramid sources.
const usedHouses = new Set(entries.map((e) => str(e.body, 'house')).filter(Boolean))
for (const [h, ml] of Object.entries(PRICE_BASIS)) {
  if (!usedHouses.has(h)) err(`price-basis.json names house "${h}", which no fragrance uses`)
  if (!Number.isInteger(ml) || ml < 1) err(`price-basis.json: "${h}" must map to a whole number of ml`)
}
if (noPriceBasis > 0) {
  warn(`${noPriceBasis} of ${entries.length} fragrances have no price basis yet (house not in price-basis.json, no priceSizeMl)`)
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

// Findings ledger. docs/validation-findings.md records every validator finding
// and is updated by the patch that fixes it, so no finding is lost between
// runs. Rows must name a real entry (or a retired id, or — for catalog-wide
// items), and a closed row must say which patch closed it.
const ledgerPath = resolve(root, 'docs/validation-findings.md')
const ledger = { open: 0, done: 0, wontfix: 0 }
if (!existsSync(ledgerPath)) {
  err('docs/validation-findings.md is missing')
} else {
  const seenFindings = new Set()
  const rows = readFileSync(ledgerPath, 'utf8').split('\n').filter((l) => /^\|\s*F-\d+/.test(l))
  for (const row of rows) {
    const [fid, status, entry, , , , , closedIn] = row.split('|').slice(1, -1).map((c) => c.trim())
    const at = `ledger ${fid}`
    if (seenFindings.has(fid)) err(`${at} is listed twice`)
    seenFindings.add(fid)
    if (!(status in ledger)) { err(`${at} status "${status}" must be open, done or wontfix`); continue }
    ledger[status]++
    const ids = entry.replace(/`/g, '')
    if (ids !== '—' && !dataIds.has(ids) && !(ids in retired)) {
      err(`${at} names "${ids}", which is neither in data.ts nor retired`)
    }
    const closed = closedIn && closedIn !== '—'
    if (status === 'open' && closed) err(`${at} is open but has a closed-in value`)
    if (status !== 'open' && !closed) err(`${at} is ${status} but does not say which patch closed it`)
  }
  if (rows.length === 0) err('docs/validation-findings.md has no finding rows — the table shape may have changed')
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
console.log(`  ingredient labels: ${withIngredients} of ${entries.length}  |  screen flags: ${screenFlagged}  |  published ids: ${published.size + (recording ? unrecorded.length : 0)}`)
console.log(`  findings ledger: ${ledger.open} open  |  ${ledger.done} done  |  ${ledger.wontfix} wontfix`)
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
