import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import type { AdminFilter, Commercant, Association } from "../_components/types";

export async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminRow } = await supabase
    .from("administrateur")
    .select("id_admin, nom, prenom")
    .maybeSingle();
  if (!adminRow) redirect("/");

  return { adminRow };
}

export const VALID_FILTERS: AdminFilter[] = ["all", "commercant", "association"];

export const VALIDATION_PAGE_SIZE = 10;

export type ValidationData = {
  commercants: Commercant[];
  commercantsTotal: number;
  associations: Association[];
  associationsTotal: number;
  filter: AdminFilter;
  page: number;
  search: string;
  adminPrenom: string;
  adminNom: string;
};

export async function getValidationData(
  searchParams: Promise<{ filter?: string; page?: string; search?: string }>,
): Promise<ValidationData> {
  const { adminRow } = await assertAdmin();
  const admin = createAdminClient();

  const params = await searchParams;
  const filter: AdminFilter = VALID_FILTERS.includes(params.filter as AdminFilter)
    ? (params.filter as AdminFilter)
    : "all";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const search = params.search?.trim() ?? "";
  const from = (page - 1) * VALIDATION_PAGE_SIZE;
  const to = from + VALIDATION_PAGE_SIZE - 1;

  let cFullQ = admin
    .from("commercant")
    .select("id_commercant, name_entreprise, email, tel, type_activity, forme_juridique, adresse, siret, created_at", { count: "exact" })
    .eq("is_validated", false);
  if (search) cFullQ = cFullQ.ilike("name_entreprise", `%${search}%`);

  let cCountQ = admin
    .from("commercant")
    .select("id_commercant", { count: "exact", head: true })
    .eq("is_validated", false);
  if (search) cCountQ = cCountQ.ilike("name_entreprise", `%${search}%`);

  let aFullQ = admin
    .from("association")
    .select("id_association, name_entreprise, email, tel, type_asso, adresse, rna, created_at", { count: "exact" })
    .eq("is_validated", false);
  if (search) aFullQ = aFullQ.ilike("name_entreprise", `%${search}%`);

  let aCountQ = admin
    .from("association")
    .select("id_association", { count: "exact", head: true })
    .eq("is_validated", false);
  if (search) aCountQ = aCountQ.ilike("name_entreprise", `%${search}%`);

  const [cResult, aResult] = await Promise.all([
    filter !== "association"
      ? cFullQ.range(from, to).order("created_at", { ascending: true })
      : cCountQ,
    filter !== "commercant"
      ? aFullQ.range(from, to).order("created_at", { ascending: true })
      : aCountQ,
  ]);

  return {
    commercants: (cResult.data as Commercant[] | null) ?? [],
    commercantsTotal: cResult.count ?? 0,
    associations: (aResult.data as Association[] | null) ?? [],
    associationsTotal: aResult.count ?? 0,
    filter,
    page,
    search,
    adminPrenom: adminRow.prenom,
    adminNom: adminRow.nom,
  };
}

