# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**rldunnam/fragrance**: a personal fragrance discovery and rating web app built on a curated catalog. It uses Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Clerk, and Supabase, and ships as multi-arch container images on GHCR. Fragrance community shorthand (PDM, dupe, EDP/EDT/Extrait, etc.) is fine throughout.

## Toolchain and commands

**Node 24** (Active LTS; not Node 26) and **pnpm 11.15.1** via `corepack enable`. Node 24 is pinned in five places that must move together, plus the README: `.devcontainer/devcontainer.json`, both `FROM` lines in `Dockerfile`, the setup-node step in `.github/workflows/deploy.yml`, `engines` in `package.json`, and the `@types/node` ceiling in `.github/dependabot.yml`.

```bash
pnpm install --frozen-lockfile
pnpm dev                  # http://localhost:3000; needs .env.local (copy .env.example)
pnpm build && pnpm start  # production, standalone output
pnpm ids:record           # record new catalog ids once final (see Catalog)
```

**Verification chain**: everything must pass before a commit is proposed. The first four are exactly what CI's `lint` job runs:

```bash
pnpm check:public && pnpm validate && pnpm exec tsc --noEmit && pnpm lint && pnpm build
```

- `pnpm lint` must finish with zero errors **and** zero warnings.
- `pnpm build` needs the three `NEXT_PUBLIC_*` vars set (see Env vars below).
- In a sandbox with no network, `next/font/google` can't reach Google Fonts. There, build with `NEXT_FONT_GOOGLE_MOCKED_RESPONSES=<mock file> NEXT_TELEMETRY_DISABLED=1 pnpm exec next build --webpack`. The mock file is not in the repo; a normal networked machine doesn't need this.
- There is no unit test framework. The checks are `pnpm validate` plus the container smoke test (`scripts/smoke-test.sh`), which boots the image and checks `/`, `/collection`, `/quiz`, and `/guide`. CI runs it on PRs and on `main`.

## Git and PR workflow

- Start from a clean, up-to-date `main`, with one branch per change.
- Security fixes go in their own isolated PRs, never mixed with feature or dependency work.
- Rick handles pushes, PRs and merges. Do not `git push`, open PRs, or merge unless asked in the session. The `main` ruleset requires the `changes`, `lint`, `trivy-fs`, and `build-status` checks with no approvals. `build-status` stands in for the build matrix, because a skipped matrix job never reports its per-platform check names. Skipped jobs count as passing, so docs-only PRs still merge. Merge with `gh pr merge --auto --squash --delete-branch`, which waits for the checks; `--admin` is only for emergencies.

## Architecture

Routes: `/` (selector), `/quiz`, `/collection`, `/guide` (scrollytelling), `/sign-in`.

### Everything runs client-side; Supabase RLS is the security boundary
- There are no API routes, route handlers, server actions, or server-side Clerk calls. `ClerkProvider` and `CollectionProvider` wrap the app in `app/layout.tsx`.
- `lib/collection-context.tsx` owns all per-user state: cabinet, wishlist, ratings, quiz profile, and reactions. It gets a Clerk JWT via `getToken({ template: 'supabase' })` and calls Supabase from the browser via `createAuthClient` (`lib/supabase.ts`). The Clerk JWT template **must be named `supabase`**. If it's missing, saves fail silently for signed-in users and nothing in CI catches it.
- RLS policies keyed on the JWT `sub` claim protect `cabinet`, `wishlist`, `ratings`, `quiz_results`, and `reactions`. `supabase/reactions.sql` defines `reactions`; apply SQL in the Supabase editor before shipping code that depends on it.
- **Do not add `proxy.ts` / `middleware.ts` / `clerkMiddleware()`.** That would need `CLERK_SECRET_KEY` at runtime and break the self-contained image, and it would add no data protection.
- `lib/supabase.ts` deliberately has no module-scope client. Env vars are validated inside `createAuthClient` so a missing var doesn't fail the build.
- The Supabase free tier can pause from inactivity. Anonymous visits and CI runs generate no DB traffic, so they don't keep it awake.

### Env vars are build-time
`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are inlined at build time, so changing them means restarting `pnpm dev` or rebuilding the image. They live in three separate secret stores: Actions (main builds), Dependabot (Dependabot PR builds), and Codespaces. A Dependabot PR failing with `Missing publishableKey` means the Dependabot copy is missing.

### Catalog and recommendation pipeline (`lib/fragrances/`)
- `data.ts` is the whole catalog as build-time constants (not in Supabase). `types.ts` documents each `Fragrance` field's sourcing rules in detail. Read it before editing entries.
- `filters.ts` defines the valid `family`/`occasion`/`season` vocabularies and `audienceViews`. "For Him" = Masculine+Unisex and "For Her" = Feminine+Unisex; the raw `Audience` values are never exposed.
- Quiz flow: `components/fragrance-quiz.tsx` calls `runQuiz` in `quiz-engine.ts`, which scores answers onto five axes and picks an archetype. `encodeFiltersToParams` turns the result into URL params, and `components/scent-recommendation-engine.tsx` reads them with `useSearchParams`. It ranks the catalog, blending in the user's ratings via `taste-profile.ts` (`buildTasteProfile`/`blendScore`/`quizBoostScore`).
- `similarity.ts` (family > notes > season overlap) powers "similar" lists on cards and the "resembles something you reacted to" warnings in the collection context.
- `screens.ts` provides opt-in content screens (e.g. cinnamon/balsam). They match the **note pyramid**, not the ingredient label, plus per-entry `screenFlags`. A logged `'none'` reaction overrides a screen; `'mild'`/`'harsh'` always hides.

### Static assets
Everything in `public/` ships in the image. `pnpm check:public` fails on `eval`, `new Function`, string timers, `innerHTML`, `document.write`, and self-referential `postMessage` origin checks.

## Catalog data rules

`docs/validator-prompt.md` is the authoritative spec for sourcing, pricing, and status. The rules below summarize it; when they disagree, the validator prompt wins.

### Quality and process
- Never invent data. Hold back an entry whose note pyramid can't be verified rather than ship plausible-sounding data.
- Every catalog patch is independently checked against `docs/validator-prompt.md` before merge. Findings go in `docs/validation-findings.md`, which is append-only: never delete rows. A fix patch closes its rows (`done`/`wontfix`, with the patch named in `Closed in`). `pnpm validate` checks this file, and `|` is not allowed in cells.
- Re-verification runs in small batches, risk-first: houses with amber/spicy/gourmand entries and known reactions first, fresh-leaning houses last.
- `scripts/catalog/` holds the Python batch tooling (stdlib only, run from the repo root). `catalog_edit.py` edits entries, side files and ledger rows while keeping the CRLF working copies intact. Run `checks.py` before every catalog commit: it catches alias-key notes, unescaped apostrophes, note case conflicts and mixed newlines, which would otherwise fail only in CI. `unsourced.py` lists entries without a pyramid source by house. Write batch scripts to files, not shell heredocs, which strip backslashes.

### Invariants enforced by `pnpm validate`
- **Published ids are permanent.** Supabase user rows reference them, so fix `name`, never `id`. `published-ids.json` is append-only (`pnpm ids:record` for new ids). To remove an id, migrate stored rows first, then list it under `retired` with a reason.
- `family`/`occasion`/`season` values must come from `filters.ts`. They're typed `string[]`, so TypeScript won't catch a bad value. Every family needs an accent colour in `accent-color.ts`.
- A non-`current` `status` requires an `includeReason`, and `current` forbids one. An `imageUrl` field is not allowed (the catalog carries no bottle imagery).
- An `ingredientsSource` host must be in `US_SOURCE_HOSTS` in the validator script. Add a new retailer there in the same patch that first cites it.
- The validator parses source files with regexes rather than importing them. Keep the shapes it matches: `export const X = [` … `\n]` and `id: '...'`.

### Names
- Keep concentration words in `name` when they're part of the marketed product identity; drop bare descriptors that `concentration` already carries. `line` groups a concentration ladder.
- Check the line for existing entries before any concentration change.

### Sources
- Note pyramids come from the fragrance's own Fragrantica page. Audience comes from the house's own classification, with Fragrantica's as the tiebreak only where the house doesn't gender the release (`types.ts`, `Audience`). If the source gives no tiers, set `notesFlat: true` and put all notes in `heartNotes` rather than inventing a split.
- Ingredient labels come from the house US site, then Sephora / Ulta / Nordstrom / another major retailer. Ulta truncates long lists, so confirm the last item elsewhere; where neither Sephora nor the house prints a list, a visibly complete Ulta list (ends with a period or a printed code in its product data) is accepted (D28). Where neither the house, Sephora nor Ulta prints one, a CVS list is accepted if it starts with the alcohol, isn't alphabetical throughout and doesn't end on a separator; when CVS prints conflicting versions, Walgreens must confirm one (D29). Store labels verbatim in label order, in title case (acronyms such as BHT and CI numbers stay upper case). Where a page prints a different label per size SKU, use the SKU at the entry's priced size and cite its URL (D27). Store a printed formula/F.I.L. code as `formulaCode`, including the code Chanel US prints as a label's last item (D16). Labels are stored as printed except six printing defects (D12): a separator splitting one name, a missing separator between two names, a missing abbreviation period, an item printed twice in a row, a truncated name whose full form is printed elsewhere, and a note on the alcohol's origin or strength. Each correction goes in a comment on the entry and in the ledger; anything else is stored as printed, and a validator flags any other difference. Ingredients are searchable but stay out of the note breakdown.

### Loading source pages
Fragrantica and some house sites (dior.com confirmed) block plain fetching with HTTP 403. For those, use Claude in Chrome. For any page that loads without it, use plain fetching. Try a plain fetch first on sites not yet checked. Plain fetching returns a model's summary of the page, not the page itself, so it can only answer whether a page exists and what it is about. Read any value that gets recorded (price, size, notes, label) from the page itself in Chrome. Leave cookie banners alone or decline them; never accept.

### Inclusion and status
- The default inclusion rule is currently produced and broadly sold in the US. Regional exclusives and discontinued releases are generally excluded; exceptions need a hype/US-popularity justification in `includeReason` (e.g. Stronger With You Sandalwood). Status shows as a badge in the UI.
- `discontinued`: the house sells it nowhere. The entry keeps its last US price, priced size, label, and sources.
- `regional`: gone from the US but still sold by the house elsewhere. It takes a US grey-market price, and a non-US label source is allowed.

### Pricing
- US entries are priced from the house US site, falling back to Sephora or Ulta, **at the size the product page presents by default**. If that differs from the house's size in `price-basis.json` (or the house isn't listed there), set `priceSizeMl`. Versace US preselects no size, so Versace is priced on its 100 ml page. Carolina Herrera US preselects inconsistent sizes, so it is priced at 3.4 oz / 100 ml, or the nearest size offered (D15). Ralph Lauren US preselects nothing, so it is priced at 4.2 oz / 125 ml or the nearest size, using the listed price even when that size shows unavailable (D17). Dolce & Gabbana US preselects nothing either, so it is priced at 100 ml or the nearest size, the larger on a tie, again using the listed price when that size is unavailable (D18). A sale price shown on the page is the price, not the struck-through regular price, and a product the house lists as sold out keeps its listed price and stays `current` (D19). Prices are stored in whole dollars; round any price with cents (D11).
- Regional entries use the first in-stock listing in this order: FragFlex → Triple Traders → FragranceNet → MaxAroma → FragranceX → Perfume.com → Jomashop. Fall back to a sold-out held price only if nothing is in stock. FragranceNet uses its "our price", not the coupon price. A listing counts as in stock if any boxed size is (D9): price at that size (the house size if it's one of several in stock), set `priceSizeMl` when it isn't the house size, and round to whole dollars.

## Dependencies and CI

- **pnpm only.** Never commit a `package-lock.json`; a stale one caused Trivy false failures. `pnpm-workspace.yaml` holds `overrides` and `allowBuilds` and must stay. `refresh-lockfile.yml` (manual) regenerates `pnpm-lock.yaml` on a PR branch.
- `.github/workflows/deploy.yml`: PRs run lint/typecheck/validate/check:public and a Trivy fs scan, then build both architectures without pushing; the amd64 image is loaded locally for a Trivy image scan and the smoke test. Pushes to `main` also push by digest, run a Trivy image scan and the smoke test, merge the multi-arch manifest, tag `:test` and `:test-<sha>`, and clean up the registry. `:latest` moves only on a manual run with **release** ticked.
- Cross-job image digest references use uploaded artifacts, not matrix `outputs:`.
- SHA-pin all GitHub Actions, with the version in a trailing comment, and never replace a pin with a floating tag. `aquasecurity/trivy-action` has a confirmed tag force-push history. Both workflows are fully pinned and Dependabot watches the `github-actions` ecosystem. Open TODO: consider pinact/step-security for ongoing maintenance.
- Dependabot merge order: GitHub Actions PRs first, then Docker/devcontainer, then npm PRs one at a time with rebase settle time between each. When reviewing grouped Dependabot PRs, give a clear verdict and a merge sequence, and flag what is most likely to break CI or change behavior.
- Scanner severity is not exploitability. Check the vendor advisory and whether the code path is reachable before prioritizing.
