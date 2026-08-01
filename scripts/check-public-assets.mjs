#!/usr/bin/env node
/**
 * Guards the public/ directory.
 *
 * Everything in public/ is served verbatim at the site root and copied into the
 * container image. That makes it the one directory where a file nobody reads
 * still reaches production.
 *
 * This exists because of public/editor-bootstrap.js — a v0 scaffolding artifact
 * that called eval() on a postMessage payload. Its origin check compared
 * event.origin against a value read from the page's own query string, so an
 * embedding attacker supplied both sides of the comparison. It was never
 * referenced by the app, so it was inert, but it shipped in every image and
 * would have become live the moment anyone added a script tag for it.
 *
 * Two classes of problem are checked:
 *   1. Dynamic code execution in served JavaScript (ERROR)
 *   2. Scaffolding leftovers and unreferenced assets (WARN)
 *
 * Run: pnpm check:public
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, relative, extname } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = resolve(root, 'public')

const errors = []
const warnings = []

// ---------------------------------------------------------------------------
// Walk public/
// ---------------------------------------------------------------------------
const walk = (dir) => {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = resolve(dir, name)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

let files = []
try {
  files = walk(publicDir)
} catch {
  console.log('No public/ directory — nothing to check.')
  process.exit(0)
}

// ---------------------------------------------------------------------------
// 1. Dynamic code execution in served JS
// ---------------------------------------------------------------------------
// Deliberately blunt. public/ holds static assets; none of them has a
// legitimate reason to build and run code at runtime. A false positive here
// means someone is doing something in public/ that warrants a conversation.
const DANGEROUS = [
  // Bare identifier, not `eval\s*\(`. The artifact that motivated this script
  // used INDIRECT eval — `var executeGlobal = eval; executeGlobal(code)` — which
  // a paren-anchored pattern misses entirely. Indirect eval is the more
  // dangerous form, since it runs in global scope.
  [/\beval\b/, 'a reference to eval (direct or indirect)'],
  [/\bnew\s+Function\s*\(/, 'new Function()'],
  [/\bFunction\s*\(\s*['"`]/, 'Function() called with a string body'],
  [/\bsetTimeout\s*\(\s*['"`]/, 'setTimeout() with a string body'],
  [/\bsetInterval\s*\(\s*['"`]/, 'setInterval() with a string body'],
  [/\.innerHTML\s*=/, 'innerHTML assignment'],
  [/document\.write\s*\(/, 'document.write()'],
]

// A postMessage listener that trusts an origin taken from the page URL is the
// specific defect that motivated this script; flag the shape, not just eval.
const SELF_REFERENTIAL_ORIGIN =
  /URLSearchParams[\s\S]{0,400}?(?:parentOrigin|expectedOrigin|allowedOrigin)/i

for (const file of files) {
  const rel = relative(root, file)
  if (!['.js', '.mjs', '.cjs'].includes(extname(file))) continue

  const src = readFileSync(file, 'utf8')
  for (const [re, label] of DANGEROUS) {
    if (re.test(src)) {
      errors.push(`${rel}: contains ${label} — public/ is served verbatim and must not execute dynamic code`)
    }
  }
  if (SELF_REFERENTIAL_ORIGIN.test(src) && /addEventListener\s*\(\s*['"]message['"]/.test(src)) {
    errors.push(`${rel}: validates a postMessage origin against a value read from the page URL — the caller controls both sides of that comparison`)
  }
}

// ---------------------------------------------------------------------------
// 2. Scaffolding leftovers
// ---------------------------------------------------------------------------
for (const file of files) {
  const rel = relative(root, file)
  const base = rel.split('/').pop()

  if (base.endsWith('.duplicate') || /\.[a-f0-9]{32,}\./.test(base)) {
    warnings.push(`${rel}: looks like a build or scaffolding artifact`)
  }
  if (/^placeholder/.test(base)) {
    warnings.push(`${rel}: placeholder asset — remove if unused`)
  }
}

// ---------------------------------------------------------------------------
// 3. Unreferenced assets
// ---------------------------------------------------------------------------
// Cheap textual scan of the source tree. Only warns: an asset may legitimately
// be referenced from a CSS url(), a manifest, or an external link.
const SOURCE_EXT = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md']
const sourceDirs = ['app', 'components', 'lib', 'hooks', 'scripts']
let haystack = ''
for (const d of sourceDirs) {
  try {
    for (const f of walk(resolve(root, d))) {
      if (SOURCE_EXT.includes(extname(f))) haystack += readFileSync(f, 'utf8')
    }
  } catch {
    /* directory may not exist */
  }
}
for (const cfg of ['next.config.js', 'package.json']) {
  try {
    haystack += readFileSync(resolve(root, cfg), 'utf8')
  } catch {
    /* optional */
  }
}

for (const file of files) {
  const rel = relative(root, file)
  const base = rel.split('/').pop()
  if (!haystack.includes(base)) {
    warnings.push(`${rel}: not referenced anywhere in source — ships in the image regardless`)
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
console.log(`Checked ${files.length} file(s) in public/.`)

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
