import Hero from "@/src/components/sections/Hero";
import LotFormSection from "./_components/LotFormSection";
import { fetchDeclarerLotData } from "./_utils/fetchDeclarerLot";

export default async function DeclarerLotPage() {
  const formProps = await fetchDeclarerLotData();

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
