import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import PendingValidationModal from "@/src/components/ui/PendingValidationModal";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Admin → accès complet sans contrôle de validation
  const { data: adminRow } = await supabase
    .from("administrateur")
    .select("id_admin")
    .maybeSingle();

  if (adminRow) return <>{children}</>;

  // Vérification du statut de validation
  const { data: commercant } = await supabase
    .from("commercant")
    .select("is_validated, name_entreprise")
    .maybeSingle();

  const { data: association } = await supabase
    .from("association")
    .select("is_validated, name_entreprise")
    .maybeSingle();

  const entity = commercant ?? association;
  const isValidated = entity?.is_validated === true;

  if (!isValidated) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <PendingValidationModal />
      </main>
    );
  }

  return <>{children}</>;
}
