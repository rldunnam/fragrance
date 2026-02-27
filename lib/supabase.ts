import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Basic client for server-side or unauthenticated reads (if ever needed)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authenticated client — call this with the Clerk session token so
// Supabase RLS policies can verify the user_id from the JWT sub claim.
export function createAuthClient(clerkToken: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  })
}
