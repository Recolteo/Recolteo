import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import PendingValidationModal from "@/src/components/ui/modals/PendingValidationModal";

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

  const { data: adminRow } = await supabase
    .from("administrateur")
    .select("id_admin")
    .maybeSingle();

  if (adminRow) return <>{children}</>;

  const { data: userRow } = await supabase
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();

  if (!userRow) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <PendingValidationModal />
      </main>
    );
  }

  const { data: commercant } = await supabase
    .from("commercant")
    .select("is_validated")
    .eq("id_user", userRow.id_user)
    .maybeSingle();

  const { data: association } = await supabase
    .from("association")
    .select("is_validated")
    .eq("id_user", userRow.id_user)
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
