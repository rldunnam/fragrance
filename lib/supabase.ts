import { createClient } from '@supabase/supabase-js'

// No non-null assertion: these genuinely may be undefined, and asserting
// otherwise hides that from the type checker. Narrowing happens in the guard
// inside createAuthClient below.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// NOTE: there is deliberately no eagerly-constructed client exported here.
// A module-scope `createClient(supabaseUrl, supabaseAnonKey)` runs on import,
// which means an unset NEXT_PUBLIC_SUPABASE_URL throws during the build rather
// than at the point of use. Nothing consumed it, so it's gone.
//
// Authenticated client — call this with the Clerk session token so
// Supabase RLS policies can verify the user_id from the JWT sub claim.
export function createAuthClient(clerkToken: string) {
  // Validate here rather than at module scope. Throwing at module scope would
  // run on import and fail the build; throwing here fails only when the
  // collection layer is actually exercised, with a message that says what to fix.
  if (!supabaseUrl || !supabaseAnonKey) {
    const missing = [
      !supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL',
      !supabaseAnonKey && 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ]
      .filter(Boolean)
      .join(', ')

    throw new Error(
      `Supabase client cannot be created: missing ${missing}. ` +
        'These are NEXT_PUBLIC_* vars, so they are inlined at build time, not read at runtime — ' +
        'rebuilding is required after setting them. Local dev: add them to .env.local. ' +
        'Container builds: pass them as --build-arg (see the builder stage in the Dockerfile). ' +
        'CI: set them as repository secrets consumed by the build-args block in deploy.yml.'
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  })
}
