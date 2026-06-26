"use client";

import Hero from "@/src/components/sections/Hero";
import About from "@/src/components/sections/About";
import VideoDemo from "@/src/components/sections/VideoDemo";
import Faq from "@/src/components/sections/Faq";
import Leo from "../../../components/ui/modals/Leo";

const LEO_STEPS = [
  { message: "Ici, tout ce qu'il faut savoir sur Récoltéo : mission, valeurs, et pourquoi on fait ça !" },
  { message: "Cette section vous explique qui nous sommes. Récoltéo, c'est avant tout une histoire de proximité." },
  { message: "Regardez la démo pour voir Récoltéo en action en moins de 2 minutes." },
  { message: "Des questions ? La FAQ rassemble toutes les réponses. Jetez-y un œil !" },
];

export default function DecouvrirRecolteo() {
  return (
    <main>
      <Hero
        title="Tout savoir sur"
        subtitle=""
        labelTitle="Récoltéo"
        spanTitle="objectifs,"
        endTitle="usage et FAQ"
        description="Découvrez comment Récoltéo fonctionne, à quel prix, et trouvez les réponses à vos questions dans notre FAQ."
        primaryButton="Voir la démo"
        primaryButtonHref="#videodemo"
        secondaryButton="Consulter la FAQ"
        secondaryButtonHref="#faq"
      />
      <About />
      <VideoDemo />
      <Faq />
      <Leo storageKey="leo-decouvrir" steps={LEO_STEPS} />
    </main>
  );
}
