import "server-only";
import { cacheTag, cacheLife } from "next/cache";
import { createAdminClient } from "@/src/lib/supabase/admin";

export type UserProfile = {
  id_user: number;
  nom: string;
  role: "commercant" | "association";
  isValidated: boolean;
} | null;

export async function getUserProfile(authId: string): Promise<UserProfile> {
  "use cache";
  cacheTag(`user:${authId}`);
  cacheLife("hours");

  const admin = createAdminClient();

  const { data: userRow } = await admin
    .from("user")
    .select("id_user, nom")
    .eq("auth_id", authId)
    .maybeSingle();

  if (!userRow) return null;

  const [{ data: commercant }, { data: association }] = await Promise.all([
    admin
      .from("commercant")
      .select("name_entreprise, is_validated")
      .eq("id_user", userRow.id_user)
      .maybeSingle(),
    admin
      .from("association")
      .select("name_entreprise, is_validated")
      .eq("id_user", userRow.id_user)
      .maybeSingle(),
  ]);

  const entity = commercant ?? association;
  if (!entity) return null;

  return {
    id_user: userRow.id_user,
    nom: userRow.nom ?? entity.name_entreprise,
    role: commercant ? "commercant" : "association",
    isValidated: entity.is_validated === true,
  };
}
