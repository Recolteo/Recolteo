import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import Hero from "@/src/components/sections/Hero";
import LotFormSection from "./_components/LotFormSection";
import type { LotFormProps } from "./_components/types";

export const metadata: Metadata = {
  title: "Déclarer un lot — Récoltéo",
  description:
    "Déclarez vos invendus alimentaires, matériaux et ressources en quelques clics pour les mettre à disposition des associations partenaires de Récoltéo.",
};

export default async function DeclarerLotPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [adminResult, commercantResult] = await Promise.all([
    supabase.from("administrateur").select("id_admin").maybeSingle(),
    supabase
      .from("commercant")
      .select("id_commercant, name_entreprise, adresse")
      .eq("is_validated", true)
      .maybeSingle(),
  ]);

  if (!adminResult.data && !commercantResult.data) redirect("/");

  let formProps: LotFormProps;

  if (adminResult.data) {
    const { data: merchants } = await supabase
      .from("commercant")
      .select("id_commercant, name_entreprise, adresse")
      .eq("is_validated", true)
      .order("name_entreprise");

    formProps = {
      mode: "admin",
      merchants: (merchants ?? []).map((m) => ({
        id: m.id_commercant,
        name: m.name_entreprise,
        adresse: m.adresse,
      })),
    };
  } else {
    const { id_commercant, name_entreprise, adresse } = commercantResult.data!;
    formProps = { mode: "commercant", id: id_commercant, name: name_entreprise, adresse };
  }

  return (
    <main>
      <Hero
        title="Déclarez"
        subtitle=""
        labelTitle="un lot"
        spanTitle="simplement"
        endTitle="et rapidement"
        description="Renseignez les informations de votre lot pour le mettre à disposition des associations partenaires de Récoltéo."
        primaryButton="Voir les lots"
        primaryButtonHref="#lots"
        secondaryButton="Retour au tableau de bord"
        secondaryButtonHref="/dashboard"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <LotFormSection {...formProps} />
      </div>
    </main>
  );
}
