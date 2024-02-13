import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabaseKey = process.env.SUPABASE_ANON_KEY || "public-anon-key";
const supabaseUrl = process.env.SUPABASE_URL || "http://localhost:3000";
export const supabase = createClient(supabaseUrl, supabaseKey);
