import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qrojakihkjlyexyoqkiy.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyb2pha2loa2pseWV4eW9xa2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTc4NTgsImV4cCI6MjA3ODk3Mzg1OH0.CjmDJcIz5fzjupAcRZWe6p4qNAgy2xkXSkHPrqfk9X8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
