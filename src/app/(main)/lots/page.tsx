import { FileText } from "@deemlol/next-icons";
import Hero from "@/src/components/sections/Hero";
import CatalogueLots from "./_components/CatalogueLots";
import GestionLots from "@/src/components/sections/GestionLots";
import Leo from "@/src/components/ui/modals/Leo";
import CatalogueDecorations from "@/src/components/illustrations/CatalogueDecorations";
import Reveal from "@/src/components/animations/Reveal";
import EmptyState from "@/src/components/ui/primitives/EmptyState";
import { fetchLotsData } from "./_utils/fetchLots";

const LEO_STEPS_COMMERCANT = [
  { message: "Bienvenue sur votre espace lots ! Déclarez ici vos invendus du jour en quelques clics pour les mettre à disposition des associations partenaires." },
  { message: "Pensez à renseigner la date limite de consommation et les instructions de récupération pour faciliter la vie des associations." },
  { message: "Une fois votre lot publié, les associations de votre secteur sont notifiées et peuvent le réserver directement depuis la plateforme." },
];

const LEO_STEPS_ADMIN = [
  { message: "Bienvenue sur la vue administrateur. Vous avez accès à l'ensemble des lots actifs déposés par tous les commerçants de la plateforme." },
  { message: "Vous pouvez modifier ou supprimer n'importe quel lot, et déclarer des lots au nom d'un commerçant si nécessaire." },
  { message: "Gardez un œil sur les lots proches de leur DLC pour anticiper les situations d'urgence et contacter les commerçants concernés." },
];

const LEO_STEPS_ASSOCIATION = [
  { message: "Bienvenue sur le catalogue des lots disponibles ! Parcourez les invendus mis à disposition par les commerçants partenaires près de chez vous." },
  { message: "Utilisez les filtres de proximité et de date pour trouver rapidement les lots qui correspondent aux besoins de votre association." },
  { message: "Une fois votre panier constitué, finalisez votre réservation et convenez des modalités de récupération directement avec le commerçant." },
];

export default async function LotPage() {
  const data = await fetchLotsData();

  if (data.view === "docs-gate") {
    return (
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 overflow-hidden">
        <CatalogueDecorations />
        <Reveal>
          <EmptyState
            icon={<FileText size={32} className="text-sapin/40" />}
            title="Documents en attente de validation"
            description="Pour accéder aux lots, déposez et faites valider vos 3 documents dans votre profil."
            btnLabel="Mon profil"
            btnHref="/profil"
          />
        </Reveal>
      </section>
    );
  }

  if (data.view === "commercant") {
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
        <GestionLots lots={data.lots} />
        <Leo storageKey="leo-lots-commercant" steps={LEO_STEPS_COMMERCANT} />
      </main>
    );
  }

  if (data.view === "admin") {
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
        <GestionLots lots={data.lots} adminView />
        <Leo storageKey="leo-lots-admin" steps={LEO_STEPS_ADMIN} />
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
        secondaryButton="Contactez-nous"
        secondaryButtonHref="/contact"
      />
      <CatalogueLots
        lots={data.lots}
        showCartButton
        assoCoords={data.assoCoords}
        sectionTitle="Lots"
        sectionHighlight="disponibles"
        description="Découvrez les invendus et ressources mis à disposition par nos commerçants partenaires. Chaque lot est une opportunité de lutter contre le gaspillage et de soutenir votre activité associative."
        emptyTitle="Aucun lot disponible pour le moment"
        emptySubtitle="Revenez prochainement, de nouveaux lots sont ajoutés régulièrement."
        filterTitle="Affinez votre recherche"
        filterDescription="Les filtres sont à votre disposition : recherchez autour de vous, par date de parution, ou par catégorie de produits. Essayez différentes combinaisons pour trouver les lots qui correspondent le mieux à vos besoins."
        filterRadiusTitle="Par proximité"
        filterRadiusDescription="Filtrez les lots selon la distance autour de vous."
        filterDateTitle="Par date de parution"
        filterDateDescription="Affichez les lots publiés sur une période précise."
        filterEmptyTitle="Aucun lot ne correspond à vos filtres"
        filterEmptySubtitle="Essayez d'élargir le rayon ou de changer la période."
      />
      <Leo storageKey="leo-lots-association" steps={LEO_STEPS_ASSOCIATION} />
    </main>
  );
}
