import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getUserProfile } from "@/src/lib/user-profile";
import PendingValidationModal from "@/src/components/ui/modals/PendingValidationModal";

async function AuthGate({ children }: { children: React.ReactNode }) {
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

  const profile = await getUserProfile(user.id);

  if (!profile || !profile.isValidated) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <PendingValidationModal />
      </main>
    );
  }

  return <>{children}</>;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <AuthGate>{children}</AuthGate>
    </Suspense>
  );
}
