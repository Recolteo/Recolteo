import Hero from "@/src/components/sections/Hero";
import Categories from "@/src/components/sections/Categories";
import HowItWorks from "@/src/components/sections/HowItWorks";

export default function Home() {
  return (
    <main>
      <Hero
        title="Votre réseau"
        subtitle="qui échange"
        labelTitle="vraiment"
        spanTitle="proche"
        endTitle="de chez vous"
        description="Recolteo connecte commerçants et associations pour une solidarité simple et rapide. Une action où tout le monde y gagne."
        primaryButton="Explorer la plateforme"
        primaryButtonHref="./decouvrir-recolteo"
        secondaryButton="Profiter des offres"
        secondaryButtonHref="./dashboard"
      />
      <Categories />
      <HowItWorks />
    </main>
  );
}
