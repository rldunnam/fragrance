# Fragrance Selector

An interactive web application for browsing, evaluating, and comparing fragrances.
Built on the Next.js App Router, with a quiz-driven recommendation engine and a
scrollytelling guide to fragrance vocabulary and subculture.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4 |
| Auth | Clerk |
| Data | Supabase (Postgres + RLS) |
| Charts | Recharts |
| Package manager | pnpm 11 (pinned via `packageManager`) |
| Runtime | Node.js 22 |
| Distribution | Multi-arch container images on GHCR (amd64 + arm64) |

## Running from a container

Images are published to the GitHub Container Registry.

```bash
docker pull ghcr.io/rldunnam/fragrance:latest
docker run -d --name fragrance --restart unless-stopped -p 3000:3000 \
  ghcr.io/rldunnam/fragrance:latest
```

### Available tags

| Tag | Meaning |
| --- | --- |
| `:latest` | The most recent build explicitly cut as a release. Use this. |
| `:test` | The most recent build from `main`. Moves on every commit. |
| `:test-<sha>` | A specific commit's build. Immutable; use to pin exactly. |

`:latest` only moves when a build is run with the release toggle enabled, so it
does not follow every commit to `main`. If you want the bleeding edge, use
`:test`. If you need reproducibility, use `:test-<sha>`.

Configuration is baked in at build time (see below), so the published image
already carries the client-side Clerk and Supabase values. No runtime
environment variables are required. `PORT` and `HOSTNAME` can be overridden.

## Local development

### Prerequisites

- Node.js 22 or newer — **required**, not merely recommended. pnpm 11 depends on
  the `node:sqlite` builtin, which does not exist before Node 22.
- pnpm 11, ideally via corepack rather than a global install:

```bash
corepack enable          # resolves pnpm from package.json's packageManager field
node -v                  # expect v22.x
pnpm -v                  # expect 11.15.1
```

If you use the provided dev container (`.devcontainer/devcontainer.json`), both
are pinned for you and dependencies install automatically.

### Setup

```bash
pnpm install
cp .env.example .env.local   # then fill in the values below
pnpm dev                     # http://localhost:3000
```

### Environment variables

All three are required. All three are `NEXT_PUBLIC_*`, meaning they are inlined
into the client bundle at **build time** — changing them requires a restart of
`pnpm dev` or a full image rebuild, not just a page refresh.

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API Keys (`pk_test_…` / `pk_live_…`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` `public` key |

These values are public by design. The Supabase `anon` key is safe to expose
because row-level security does the actual enforcement. Do **not** put the
Supabase `service_role` key in a `NEXT_PUBLIC_*` variable.

#### Three separate secret stores

The same three values must be kept in sync across three places that do **not**
talk to each other. Rotating a key means updating all three, and missing one
produces a failure in only that context:

| Store | Used by | Where |
| --- | --- | --- |
| Actions secrets | `main` builds and releases | Settings → Secrets and variables → Actions |
| Dependabot secrets | Dependabot pull request builds | Settings → Secrets and variables → Dependabot |
| Codespaces secrets | Local development | Settings → Codespaces → Secrets |

A Dependabot PR that fails at `next build` with a missing Clerk publishable key
almost always means the Dependabot copy was missed.

### Clerk JWT template — easy to miss

The collection layer authenticates to Supabase by passing a Clerk-issued JWT.
This requires a JWT template in Clerk named exactly **`supabase`**:

- Clerk dashboard → **JWT Templates** → New template → Supabase
- The template name must be `supabase`; `lib/collection-context.tsx` calls
  `getToken({ template: 'supabase' })` and will fail if it is missing.

Nothing in CI can detect a missing or renamed template. Symptoms are that the
app loads fine but saving to a collection silently fails for signed-in users.

### Production build

```bash
pnpm build
pnpm start
```

## Authentication and data access

Auth is entirely client-side. There are no API routes, no route handlers, no
server actions, and no server-side Clerk calls (`auth()`, `currentUser`,
`clerkClient` are all unused). `ClerkProvider` wraps the app, components read
session state through `useAuth`, and the browser talks to Supabase directly via
`createAuthClient(clerkToken)`.

**The security boundary is Supabase row-level security**, not Next.js. The
`anon` key ships in the client bundle by design; RLS policies keyed on the Clerk
JWT `sub` claim are what actually restrict access to `cabinet`, `wishlist`,
`ratings`, and `quiz_results`.

There is deliberately no `proxy.ts` (the Next.js 16 successor to
`middleware.ts`) and no `clerkMiddleware()`. Adding it would require
`CLERK_SECRET_KEY` as a **runtime** environment variable, which would end the
image's self-contained property, and would make every request depend on the
container reaching Clerk's API. Since no server-side code calls `auth()`, it
would add no data protection — only a redirect in place of the existing
signed-out prompt on `/collection`.

## Project structure

```
app/                    Routes: /, /collection, /quiz, /guide, /sign-in
components/             Feature components
components/scrollytelling/  The /guide experience
components/widgets/     Standalone guide widgets
lib/fragrances/         Quiz engine, similarity, taste profiles, accords, filters
scripts/                Catalog validation (pnpm validate)
lib/collection-context.tsx  Clerk + Supabase collection state
lib/supabase.ts         Supabase client factory
Dockerfile              Multi-stage build -> Next.js standalone output
```

## Linting

```bash
pnpm lint
```

## Catalog

Fragrance data lives in `lib/fragrances/data.ts` as build-time constants — it
carries no per-user state, so it is deliberately not in Supabase.

`pnpm validate` enforces the invariants TypeScript cannot express: `family`,
`occasion`, and `season` are typed `string[]`, so an unknown value compiles
cleanly while making the entry unreachable by filtering. The script checks every
entry against the vocabularies in `filters.ts`, verifies each family has an
accent colour, and catches duplicate ids and out-of-range ratings. It runs in CI
alongside lint and typecheck.

The catalog carries no bottle imagery; `pnpm validate` fails if an `imageUrl`
field reappears.

## Linting

Uses ESLint flat config (`eslint.config.mjs`) with `eslint-config-next`.
Expected result is zero errors and zero warnings. CI runs this alongside
`tsc --noEmit` in the `lint` job, and the container build will not start unless
both pass.

## CI/CD

`.github/workflows/deploy.yml` handles everything:

- **Pull requests** — lint and typecheck plus a Trivy filesystem scan (in
  parallel), then a build of both architectures with no push to GHCR.
- **Push to `main`** — the above, plus push-by-digest, Trivy image scan, a smoke
  test that boots the container and checks `/`, `/collection`, `/quiz`, and
  `/guide`, multi-arch manifest merge, and registry cleanup.
- **Cutting a release** — Actions → *Build and Publish Container* → *Run
  workflow* → tick **release**. Identical to a `main` build, but also tags
  `:latest`.

All actions are pinned to commit SHAs with the version in a trailing comment.
Dependabot maintains both. Do not replace a pin with a floating tag.

## Troubleshooting

**`Missing publishableKey` during build** — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
is not set in the build environment. In CI it comes from repository secrets; for
Dependabot pull requests it must additionally exist as a *Dependabot* secret,
which is a separate store.

**`No such built-in module: node:sqlite`** — you are on Node 20 or older. See
Prerequisites.

**Dependency issues** — `rm -rf node_modules && pnpm install`.

**Port conflicts** — `pnpm dev -- -p 3001`.

## Notes

Recommendation data and scoring can be tuned in
`components/scent-recommendation-engine.tsx` and `lib/fragrances/`.
