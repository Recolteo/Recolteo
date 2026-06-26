import CatalogueLotsFilter from "./CatalogueLotsFilter";
import CatalogueDecorations from "@/src/components/illustrations/CatalogueDecorations";
import Reveal from "@/src/components/animations/Reveal";
import { type Lot } from "@/src/components/ui/cards/LotCard";

export type { Lot };

interface Props {
  lots: Lot[];
  showCartButton?: boolean;
  assoCoords?: { lat: number; lng: number } | null;
  sectionTitle: string;
  sectionHighlight: string;
  description: string;
  emptyTitle: string;
  emptySubtitle: string;
  filterTitle: string;
  filterDescription: string;
  filterRadiusTitle: string;
  filterRadiusDescription: string;
  filterDateTitle: string;
  filterDateDescription: string;
  filterEmptyTitle: string;
  filterEmptySubtitle: string;
}

export default function CatalogueLots({
  lots,
  showCartButton,
  assoCoords,
  sectionTitle,
  sectionHighlight,
  description,
  emptyTitle,
  emptySubtitle,
  filterTitle,
  filterDescription,
  filterRadiusTitle,
  filterRadiusDescription,
  filterDateTitle,
  filterDateDescription,
  filterEmptyTitle,
  filterEmptySubtitle,
}: Props) {
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
              {sectionTitle}{" "}
              <span className="relative italic whitespace-nowrap">
                <span
                  className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
                  aria-hidden="true"
                />
                <span className="relative">{sectionHighlight}</span>
              </span>
            </h2>
            <p className="text-sapin max-w-2xl">{description}</p>
          </div>
        </Reveal>

        {lots.length === 0 ? (
          <Reveal delay={0.2}>
            <div className="text-center py-16 bg-white border-2 border-sapin/10 rounded-2xl shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_6%,transparent)]">
              <p className="text-sapin font-semibold mb-2">{emptyTitle}</p>
              <span className="block text-sm text-sapin/60">
                {emptySubtitle}
              </span>
            </div>
          </Reveal>
        ) : (
          <CatalogueLotsFilter
            lots={lots}
            assoCoords={assoCoords ?? null}
            showCartButton={showCartButton}
            title={filterTitle}
            description={filterDescription}
            radiusTitle={filterRadiusTitle}
            radiusDescription={filterRadiusDescription}
            dateTitle={filterDateTitle}
            dateDescription={filterDateDescription}
            emptyTitle={filterEmptyTitle}
            emptySubtitle={filterEmptySubtitle}
          />
        )}
      </div>
    </section>
  );
}
