import { Database } from "@/database.types";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabaseKey = process.env.SUPABASE_ANON_KEY || "public-anon-key";
const supabaseUrl = process.env.SUPABASE_URL || "http://localhost:3000";
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export function createBrowserClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
