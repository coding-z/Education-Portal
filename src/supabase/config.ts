import { createClient } from "@supabase/supabase-js";
import config from "../../env.json";

const supabase = createClient(
  // process.env.SUPABASE_URL,
  // process.env.SUPABASE_KEY
  config.SUPABASE_URL,
  config.SUPABASE_KEY
);

export default supabase;
