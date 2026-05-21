import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import Hero from "@/src/components/sections/Hero";
import CatalogueLots, {
  type Lot,
} from "@/src/components/sections/CatalogueLots";
import GestionLots from "@/src/components/sections/GestionLots";

export const metadata: Metadata = {
  title: "Lots — Récoltéo",
  description:
    "Gérez vos lots d'invendus ou parcourez les ressources disponibles près de chez vous sur Récoltéo, la plateforme solidaire qui connecte commerçants et associations.",
};

const LOT_FIELDS =
  "id_lot, name_entreprise, adresse, adresse_recup, instructions, category, nature, quantity, dlc, montant_chiffre, montant_lettre, created_at";

export default async function LotPage() {
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
          .select("id_commercant")
          .eq("id_user", userRow.id_user)
          .eq("is_validated", true)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const isAdmin = !!adminResult.data;
  const isCommercant = !!commercantResult.data;

  if (isCommercant && !isAdmin) {
    const { data: lotsData } = await supabase
      .from("lot")
      .select(LOT_FIELDS)
      .eq("statut", true)
      .eq("id_commercant", commercantResult.data!.id_commercant)
      .order("created_at", { ascending: false });

    return (
      <main>
        <Hero
          title=""
          subtitle="Gérez"
          labelTitle="vos lots"
          spanTitle="facilement"
          endTitle="sur Récoltéo"
          description="Déclarez vos invendus et mettez-les à disposition des associations partenaires en quelques clics."
          primaryButton="Déclarer un lot"
          primaryButtonHref="/lots/declarer-lot"
          secondaryButton="Mon profil"
          secondaryButtonHref="/profil"
        />
        <GestionLots lots={(lotsData ?? []) as Lot[]} />
      </main>
    );
  }

  const { data: lotsData } = await supabase
    .from("lot")
    .select(LOT_FIELDS)
    .eq("statut", true)
    .order("created_at", { ascending: false });

  const lots = (lotsData ?? []) as Lot[];

  if (isAdmin) {
    return (
      <main>
        <Hero
          title=""
          subtitle="Gérez"
          labelTitle="tous les lots"
          spanTitle="facilement"
          endTitle="sur Récoltéo"
          description="Vue complète de tous les lots actifs de la plateforme. Déclarez, modifiez ou supprimez n'importe quel lot."
          primaryButton="Déclarer un lot"
          primaryButtonHref="/lots/declarer-lot"
          secondaryButton="Contactez-nous"
          secondaryButtonHref="/contact"
        />
        <GestionLots lots={lots} adminView />
      </main>
    );
  }

  return (
    <main>
      <Hero
        title=""
        subtitle="Découvrez"
        labelTitle="les lots"
        spanTitle="disponibles"
        endTitle="près de chez vous"
        description="Parcourez les lots mis à disposition par nos commerçants partenaires et réservez ceux dont votre association a besoin."
        primaryButton="Voir les lots disponibles"
        primaryButtonHref="#lots"
        secondaryButton="En savoir plus"
        secondaryButtonHref="/decouvrir-recolteo"
      />
      <CatalogueLots lots={lots} showCartButton />
    </main>
  );
}
