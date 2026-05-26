import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import Hero from "@/src/components/sections/Hero";
import LotFormSection from "./_components/LotFormSection";
import type { LotFormProps } from "./_components/types";

export default async function DeclarerLotPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRow } = await supabase
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();

  const [adminResult, commercantResult] = await Promise.all([
    supabase.from("administrateur").select("id_admin").maybeSingle(),
    userRow
      ? supabase
          .from("commercant")
          .select("id_commercant, name_entreprise, adresse")
          .eq("id_user", userRow.id_user)
          .eq("is_validated", true)
          .maybeSingle()
      : Promise.resolve({ data: null }),
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
    formProps = {
      mode: "commercant",
      id: id_commercant,
      name: name_entreprise,
      adresse,
    };
  }

  return (
    <main>
      <Hero
        title="Déclarez"
        subtitle="rapidement"
        labelTitle="un lot"
        spanTitle="en quelques clics"
        endTitle=""
        description="Remplissez le formulaire ci-dessous pour proposer vos invendus aux associations partenaires de Récoltéo."
        primaryButton="Retour sur mes lots"
        primaryButtonHref="/lots"
        secondaryButton="Accéder au formulaire"
        secondaryButtonHref="#form"
      />
      <section
        id="form"
        className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden"
      >
        <LotFormSection
          form={formProps}
          sectionTitle="Déposez vos"
          sectionTitleAccent="invendus"
          sectionDescription="En donnant une seconde vie à vos invendus, vous contribuez à réduire le gaspillage et à soutenir les associations qui en ont besoin."
        />
      </section>
    </main>
  );
}
