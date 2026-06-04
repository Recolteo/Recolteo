"use client";

import Hero from "@/src/components/sections/Hero";
import Categories from "@/src/components/sections/Categories";
import HowItWorks from "@/src/components/sections/HowItWorks";
import Leo from "../../components/ui/modals/Leo";

const LEO_STEPS = [
  { message: "Bienvenue sur Récoltéo ! Ici, commerçants et associations de votre région échangent simplement." },
  { message: "Explorez les catégories disponibles : alimentaire, bien-être, culture…" },
  { message: "3 étapes simples pour profiter des offres près de chez vous." },
];

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
        secondaryButtonHref="./lots"
      />
      <Categories />
      <HowItWorks />
      <Leo storageKey="leo-home" steps={LEO_STEPS} />

    </main>
  );
}
