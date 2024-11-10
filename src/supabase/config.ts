import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default supabase;
