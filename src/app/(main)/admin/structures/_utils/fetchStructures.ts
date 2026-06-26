import { createAdminClient } from "@/src/lib/supabase/admin";
import { assertAdmin, VALID_FILTERS } from "../../_utils/fetchAdmin";
import { buildDocs, type RawDoc } from "./buildDocs";
import type { AdminFilter } from "../../_components/types";
import type { StructureCommercant, StructureAssociation } from "../_components/types";
export const STRUCTURES_PAGE_SIZE = 10;

export type StructuresData = {
  commercants: StructureCommercant[];
  commercantsTotal: number;
  associations: StructureAssociation[];
  associationsTotal: number;
  filter: AdminFilter;
  page: number;
  search: string;
};

export async function fetchStructuresData(
  searchParams: Promise<{ filter?: string; page?: string; search?: string }>,
): Promise<StructuresData> {
  await assertAdmin();
  const admin = createAdminClient();

  const params = await searchParams;
  const filter: AdminFilter = VALID_FILTERS.includes(
    params.filter as AdminFilter,
  )
    ? (params.filter as AdminFilter)
    : "all";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const search = params.search?.trim() ?? "";
  const from = (page - 1) * STRUCTURES_PAGE_SIZE;
  const to = from + STRUCTURES_PAGE_SIZE - 1;

  let commercantFullQ = admin
    .from("commercant")
    .select("id_commercant, name_entreprise, email, tel, type_activity, forme_juridique, adresse, siret, created_at", { count: "exact" })
    .eq("is_validated", true);
  if (search) commercantFullQ = commercantFullQ.ilike("name_entreprise", `%${search}%`);

  let commercantCountQ = admin
    .from("commercant")
    .select("id_commercant", { count: "exact", head: true })
    .eq("is_validated", true);
  if (search) commercantCountQ = commercantCountQ.ilike("name_entreprise", `%${search}%`);

  let associationFullQ = admin
    .from("association")
    .select("id_association, name_entreprise, email, tel, type_asso, adresse, rna, statut_abonnement, created_at, cagnotte_reset_at", { count: "exact" })
    .eq("is_validated", true);
  if (search) associationFullQ = associationFullQ.ilike("name_entreprise", `%${search}%`);

  let associationCountQ = admin
    .from("association")
    .select("id_association", { count: "exact", head: true })
    .eq("is_validated", true);
  if (search) associationCountQ = associationCountQ.ilike("name_entreprise", `%${search}%`);

  const [commercantsResult, associationsResult] = await Promise.all([
    filter !== "association"
      ? commercantFullQ.range(from, to).order("created_at", { ascending: false })
      : commercantCountQ,
    filter !== "commercant"
      ? associationFullQ.range(from, to).order("created_at", { ascending: false })
      : associationCountQ,
  ]);

  const commercantList =
    filter !== "association"
      ? ((commercantsResult.data ?? []) as Array<{ id_commercant: number }>)
      : [];
  const associationList =
    filter !== "commercant"
      ? ((associationsResult.data ?? []) as Array<{ id_association: number }>)
      : [];

  const commercantIds = commercantList.map((c) => c.id_commercant);
  const associationIds = associationList.map((a) => a.id_association);

  const [commercantDocsResult, associationDocsResult, assocCagnotteResult] = await Promise.all([
    commercantIds.length > 0
      ? admin
        .from("document")
        .select("id_entity, rib, kbis, piece_identite, rib_validated, kbis_validated, piece_identite_validated")
        .eq("type_entity", "commercant")
        .in("id_entity", commercantIds)
      : Promise.resolve({ data: [] as RawDoc[] }),
    associationIds.length > 0
      ? admin
        .from("document")
        .select("id_entity, rib, kbis, piece_identite, rib_validated, kbis_validated, piece_identite_validated")
        .eq("type_entity", "association")
        .in("id_entity", associationIds)
      : Promise.resolve({ data: [] as RawDoc[] }),
    associationIds.length > 0
      ? admin
        .from("collect")
        .select("id_association, code_valide_at, lot:id_lot(montant_chiffre)")
        .eq("statut", true)
        .in("id_association", associationIds)
      : Promise.resolve({ data: [] as { id_association: number; code_valide_at: string | null; lot: { montant_chiffre: number } | null }[] }),
  ]);

  const commercantDocMap = new Map<number, RawDoc>(
    (commercantDocsResult.data ?? []).map((d) => [d.id_entity, d as RawDoc]),
  );
  const associationDocMap = new Map<number, RawDoc>(
    (associationDocsResult.data ?? []).map((d) => [d.id_entity, d as RawDoc]),
  );

  const resetAtMap = new Map<number, string | null>(
    associationList.map((a) => [a.id_association, (a as { cagnotte_reset_at?: string | null }).cagnotte_reset_at ?? null]),
  );

  const cagnotteMap = new Map<number, number>();
  for (const row of (assocCagnotteResult.data ?? [])) {
    const resetAt = resetAtMap.get(row.id_association) ?? null;
    const validatedAt = (row as { code_valide_at?: string | null }).code_valide_at ?? null;
    if (resetAt && validatedAt && validatedAt <= resetAt) continue;
    const montant = (row.lot as { montant_chiffre: number } | null)?.montant_chiffre ?? 0;
    cagnotteMap.set(row.id_association, (cagnotteMap.get(row.id_association) ?? 0) + montant * 0.02);
  }

  const commercants: StructureCommercant[] = (
    commercantList as StructureCommercant[]
  ).map((c) => ({ ...c, docs: buildDocs(commercantDocMap.get(c.id_commercant)) }));

  const associations: StructureAssociation[] = (
    associationList as StructureAssociation[]
  ).map((a) => ({
    ...a,
    docs: buildDocs(associationDocMap.get(a.id_association)),
    cagnotte: cagnotteMap.get(a.id_association) ?? 0,
  }));

  return {
    commercants,
    commercantsTotal: commercantsResult.count ?? 0,
    associations,
    associationsTotal: associationsResult.count ?? 0,
    filter,
    page,
    search,
  };
}
