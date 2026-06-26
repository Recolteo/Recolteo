import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let adminInstance: SupabaseClient | null = null;

export function createAdminClient(): SupabaseClient {
  if (!adminInstance) {
    adminInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return adminInstance;
}
