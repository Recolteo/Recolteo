import Hero from "../../components/sections/Hero";
import About from "@/src/components/sections/About";
import VideoDemo from "@/src/components/sections/VideoDemo";
import Faq from "@/src/components/sections/Faq";

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
    </main>
  );
}
