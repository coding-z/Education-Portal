import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://epgqcpscruzppsykzopi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwZ3FjcHNjcnV6cHBzeWt6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5MTc5OTAsImV4cCI6MjA0NTQ5Mzk5MH0.gOPcFnt3HEUNxZdXQUaFf6iZ3IgQSJUOhwakb_apAKU"
);

export default supabase;
