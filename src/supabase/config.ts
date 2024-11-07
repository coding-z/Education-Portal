import { createClient } from "@supabase/supabase-js";
import config from "../../env.json";

const supabase = createClient(
  config.SUPABASE_URL ?? process.env.SUPABASE_URL,
  config.SUPABASE_KEY ?? process.env.SUPABASE_KEY
);

export default supabase;
