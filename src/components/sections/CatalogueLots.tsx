import CatalogueGrid from "./CatalogueGrid";
import CatalogueDecorations from "../illustrations/CatalogueDecorations";
import Reveal from "../animations/Reveal";
import { type Lot } from "../ui/cards/LotCard";

export type { Lot };

export default function CatalogueLots({
  lots,
  showCartButton,
}: {
  lots: Lot[];
  showCartButton?: boolean;
}) {
  return (
    <section
      id="lots"
      aria-label="Catalogue des lots disponibles"
      className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-28"
    >
      <CatalogueDecorations />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Reveal delay={0.1}>
          <div className="mb-12">
            <h2 className="text-sapin font-black mb-4">
              Lots{" "}
              <span className="relative italic whitespace-nowrap">
                <span
                  className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
                  aria-hidden="true"
                />
                <span className="relative">disponibles</span>
              </span>
            </h2>
            <p className="text-sapin/70 max-w-2xl">
              Découvrez les invendus et ressources mis à disposition par nos
              commerçants partenaires. Chaque lot est une opportunité de lutter
              contre le gaspillage et de soutenir votre activité associative.
            </p>
          </div>
        </Reveal>

        {lots.length === 0 ? (
          <Reveal delay={0.2}>
            <div className="text-center py-16 bg-white border-2 border-sapin/10 rounded-2xl shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_6%,transparent)]">
              <p className="text-sapin/40 font-semibold mb-2">
                Aucun lot disponible pour le moment
              </p>
              <span className="block text-sm text-sapin/30">
                Revenez prochainement, de nouveaux lots sont ajoutés
                régulièrement.
              </span>
            </div>
          </Reveal>
        ) : (
          <CatalogueGrid lots={lots} showCartButton={showCartButton} />
        )}
      </div>
    </section>
  );
}
