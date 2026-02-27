# =============================================================================
# STAGE 1: base
# =============================================================================
# Establishes the common foundation for the deps and builder stages.
# Using Alpine (lightweight Linux ~5MB) instead of the full Debian node image
# (~300MB) to keep all intermediate layers small.
# Both deps and builder inherit from this so corepack is only enabled once.
# =============================================================================
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# =============================================================================
# STAGE 2: deps
# =============================================================================
# Installs ALL node_modules (including devDependencies) needed for the build.
# We copy ONLY package.json and pnpm-lock.yaml first — not the rest of the
# source code. This is intentional: Docker caches each RUN layer separately.
# If only your source code changes (not your dependencies), Docker will reuse
# this cached layer and skip re-running pnpm install entirely, saving 30-120s
# on every build.
# =============================================================================
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# =============================================================================
# STAGE 3: builder
# =============================================================================
# Compiles the Next.js application into production-ready output.
#
# Because next.config.js now has `output: 'standalone'`, Next.js performs
# a dependency trace during the build. It analyses every import in your app
# and determines exactly which files from node_modules are needed at runtime.
# The result is written to .next/standalone — a self-contained directory with
# a built-in Node.js HTTP server (server.js) and a minimal node_modules copy.
#
# What .next/standalone contains after build:
#   .next/standalone/
#     server.js              <- replaces `next start`, no pnpm needed
#     node_modules/          <- only runtime deps (not dev tools, types, etc.)
#     .next/                 <- compiled server components and pages
#
# What is NOT included (and therefore not in our final image):
#   - TypeScript compiler
#   - ESLint and all plugins
#   - PostCSS / Tailwind build tools
#   - @types/* packages
#   - pnpm itself
#   - Source maps (unless you configure them)
#   - Any package only used during `next build`
# =============================================================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* vars must be present at build time (baked into client bundle).
# Pass via fly.toml [build.args] or: fly deploy --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_placeholder_for_build
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
RUN pnpm build

# =============================================================================
# STAGE 4: runner (final image)
# =============================================================================
# This is the only stage that ships. Stages 1-3 are discarded by Docker after
# the build — none of their layers appear in the pushed image.
#
# We start fresh from node:20-alpine (not from base or builder) so we don't
# inherit corepack, the full node_modules, or any build-stage files.
#
# Three COPY commands replace what used to be five in the old Dockerfile:
#
#   OLD approach (copies everything):
#     COPY .next/          -> includes build cache, dev manifests
#     COPY public/         -> still needed
#     COPY package.json    -> only needed because CMD used `pnpm start`
#     COPY node_modules/   -> full install, ~600MB-1GB
#     COPY next.config.js  -> only needed by `next start`
#
#   NEW approach (copies only what server.js needs to run):
#     COPY .next/standalone/   -> server.js + traced node_modules (~50-150MB)
#     COPY .next/static/       -> JS/CSS bundles served as static assets
#     COPY public/             -> images, fonts, favicons
#
# The CMD changes from `pnpm start` (which invokes Next.js CLI) to
# `node server.js` (which runs the pre-built server directly). This means
# pnpm, next, and the CLI machinery are not needed at runtime at all.
# =============================================================================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user to run the application.
# If the container is compromised, the attacker only has the permissions of
# this unprivileged user rather than full root access.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy files as root (KICS best practice: executables owned by root, not the
# running user). The appuser will have execute permissions via file mode bits
# but root retains ownership, limiting what a compromised process can modify.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Grant appuser read+execute access to the app directory.
RUN chown -R root:root /app && chmod -R 755 /app

# Switch to non-root user for runtime.
USER appuser

EXPOSE 3000

# server.js is the standalone entrypoint generated by Next.js at build time.
# It's a plain Node.js HTTP server — no pnpm, no next CLI required.
# PORT and HOSTNAME can be overridden at runtime via environment variables.
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Verify the server is responding. Start period gives Next.js time to
# initialise before health checks begin counting failures.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
#CMD ["pnpm", "start"]
