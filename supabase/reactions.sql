-- Reaction log: one row per user per fragrance, recording how it was tolerated
-- when sampled. Read and written by lib/collection-context.tsx.
--
-- Apply once in the Supabase SQL editor before deploying the app code that
-- uses it. Until then the app still loads; reaction reads and writes fail and
-- are logged to the console.
--
-- Access follows the same model as cabinet, wishlist and ratings: rows are
-- keyed on the Clerk user id (the JWT `sub` claim) and row-level security is
-- the only boundary. If your existing tables use a different policy
-- expression, mirror theirs here rather than this one.

create table if not exists public.reactions (
  user_id      text        not null,
  fragrance_id text        not null,
  severity     text        not null check (severity in ('none', 'mild', 'harsh')),
  updated_at   timestamptz not null default now(),
  primary key (user_id, fragrance_id)
);

alter table public.reactions enable row level security;

create policy "reactions: select own" on public.reactions
  for select using ((select auth.jwt() ->> 'sub') = user_id);

create policy "reactions: insert own" on public.reactions
  for insert with check ((select auth.jwt() ->> 'sub') = user_id);

create policy "reactions: update own" on public.reactions
  for update using ((select auth.jwt() ->> 'sub') = user_id)
  with check ((select auth.jwt() ->> 'sub') = user_id);

create policy "reactions: delete own" on public.reactions
  for delete using ((select auth.jwt() ->> 'sub') = user_id);
