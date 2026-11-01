import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

/**
 * Service-role admin client for Kreato.
 * STRICT SECURITY BOUNDARY:
 * This client bypasses Row Level Security (RLS).
 * It must ONLY be used for public Deal Memo token lookups (/memo/[token])
 * where an unauthenticated brand representative views or signs an agreed memo.
 * Never expose this client to general creator endpoints or client components.
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }

  if (!serviceRoleKey || serviceRoleKey === "your-supabase-service-role-key") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Please add your service_role secret key to .env.local."
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

