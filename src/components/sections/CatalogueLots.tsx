import CatalogueHeader from "./CatalogueHeader";
import CatalogueEmptyState from "./CatalogueEmptyState";
import CatalogueGrid from "./CatalogueGrid";
import CatalogueDecorations from "../illustrations/CatalogueDecorations";
import { type Lot } from "../ui/cards/LotCard";

export type { Lot };

export default function CatalogueLots({ lots }: { lots: Lot[] }) {
  return (
    <section
      id="lots"
      aria-label="Catalogue des lots disponibles"
      className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-28"
    >
      <CatalogueDecorations />

      <div className="relative z-10 max-w-7xl mx-auto">
        <CatalogueHeader />
        {lots.length === 0 ? (
          <CatalogueEmptyState />
        ) : (
          <CatalogueGrid lots={lots} />
        )}
      </div>
    </section>
  );
}
