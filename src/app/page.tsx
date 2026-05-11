import Hero from "../components/sections/Hero";
import Btns from "../components/ui/Button";

export default function Home() {
  return (
    <div>
      <main>
        <Hero
          title="Votre réseau"
          subtitle="qui échange"
          labelTitle="vraiment"
          spanTitle="proche"
          endTitle="de chez vous"
          description="Recolteo connecte commerçants et associations pour une solidarité simple et gratuite. Une action où tout le monde y gagne."
          primaryButton="Explorer la plateforme →"
          secondaryButton="Voir une démo en 90s"
        />
      </main>
    </div>
  );
}
