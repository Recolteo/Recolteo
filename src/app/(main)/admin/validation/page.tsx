import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import AdminDecorations from "../_components/AdminDecorations";
import AdminFiltre from "../_components/AdminFiltre";
import type { AdminFilter, Commercant, Association } from "../_components/types";

const VALID_FILTERS: AdminFilter[] = ["all", "commercant", "association"];

export default async function AdminValidationPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
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

  const params = await searchParams;
  const filter: AdminFilter = VALID_FILTERS.includes(
    params.filter as AdminFilter,
  )
    ? (params.filter as AdminFilter)
    : "all";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const from = (page - 1) * 10;
  const to = from + 10 - 1;

  const [commercantsResult, associationsResult] = await Promise.all([
    filter !== "association"
      ? supabase
        .from("commercant")
        .select(
          "id_commercant, name_entreprise, email, tel, type_activity, forme_juridique, adresse, siret, created_at",
          { count: "exact" },
        )
        .eq("is_validated", false)
        .range(from, to)
        .order("created_at", { ascending: true })
      : supabase
        .from("commercant")
        .select("id_commercant", { count: "exact", head: true })
        .eq("is_validated", false),
    filter !== "commercant"
      ? supabase
        .from("association")
        .select(
          "id_association, name_entreprise, email, tel, type_asso, adresse, rna, created_at",
          { count: "exact" },
        )
        .eq("is_validated", false)
        .range(from, to)
        .order("created_at", { ascending: true })
      : supabase
        .from("association")
        .select("id_association", { count: "exact", head: true })
        .eq("is_validated", false),
  ]);

  return (
    <main className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden">
      <AdminDecorations />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <AdminFiltre
          commercants={(commercantsResult.data as Commercant[] | null) ?? []}
          commercantsTotal={commercantsResult.count ?? 0}
          associations={(associationsResult.data as Association[] | null) ?? []}
          associationsTotal={associationsResult.count ?? 0}
          filter={filter}
          page={page}
          pageSize={10}
          adminPrenom={adminRow.prenom}
          adminNom={adminRow.nom}
        />
      </div>
    </main>
  );
}
