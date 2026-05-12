import Hero from "../../components/sections/Hero";

export default function DecouvrirRecolteo() {
  return (
    <div>
      <main>
        <Hero
          title="Tout savoir sur"
          subtitle=""
          labelTitle="Récoltéo"
          spanTitle="objectifs,"
          endTitle="tarifs et FAQ"
          description="Découvrez comment Récoltéo fonctionne, à quel prix, et trouvez les réponses à vos questions dans notre FAQ."
          primaryButton="Voir les tarifs"
          primaryButtonHref="#tarifs"
          secondaryButton="Consulter la FAQ"
          secondaryButtonHref="#faq"
        />
      </main>
    </div>
  );
}
