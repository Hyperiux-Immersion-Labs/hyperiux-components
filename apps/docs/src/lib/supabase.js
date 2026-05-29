import { createClient } from "@supabase/supabase-js";

// Service role client — only used server-side (API routes, Server Components).
// Never import this in client components.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
