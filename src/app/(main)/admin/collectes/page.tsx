import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import AdminDecorations from "../_components/AdminDecorations";
import CollecteAdminList from "./_components/CollecteAdminList";
import Reveal from "@/src/components/animations/Reveal";

export default async function AdminCollectesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminRow } = await supabase
    .from("administrateur")
    .select("id_admin")
    .maybeSingle();
  if (!adminRow) redirect("/");

  const admin = createAdminClient();

  const [{ count: commercantsCount }, { count: associationsCount }] = await Promise.all([
    admin.from("collect").select("id_collect", { count: "exact", head: true }).eq("statut", false).not("id_lot", "is", null),
    admin.from("collect").select("id_collect", { count: "exact", head: true }).eq("statut", false).not("id_association", "is", null),
  ]);

  return (
    <main className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden">
      <AdminDecorations />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col gap-10">
          <Reveal delay={0}>
            <div>
              <h1 className="text-sapin font-black">Collectes en attente</h1>
              <p className="text-sapin mt-2">
                Validez une collecte si le commerçant ou l'association ne peut pas le faire.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <CollecteAdminList
              commercantsCount={commercantsCount ?? 0}
              associationsCount={associationsCount ?? 0}
            />
          </Reveal>
        </div>
      </div>
    </main>
  );
}
