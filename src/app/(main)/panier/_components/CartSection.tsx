import CatalogueDecorations from "@/src/components/illustrations/CatalogueDecorations";
import Reveal from "@/src/components/animations/Reveal";
import { type Lot } from "@/src/components/ui/cards/LotCard";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

interface CartSectionProps {
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  items: Lot[];
  totalPrice: number;
  onReserver: () => void;
  onRemove: (id: number) => void;
}

export default function CartSection({
  titlePrefix,
  titleHighlight,
  subtitle,
  items,
  totalPrice,
  onReserver,
  onRemove,
}: CartSectionProps) {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      <CatalogueDecorations />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Reveal delay={0.1}>
          <div className="mb-10">
            <h1 className="text-sapin font-black mb-2">
              {titlePrefix}{" "}
              <span className="relative italic whitespace-nowrap">
                <span
                  className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
                  aria-hidden="true"
                />
                <span className="relative">{titleHighlight}</span>
              </span>
            </h1>
            <p className="text-sapin/60 mt-3">{subtitle}</p>
          </div>
        </Reveal>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-80 shrink-0 lg:order-last">
            <Reveal delay={0.2}>
              <CartSummary
                itemCount={items.length}
                totalPrice={totalPrice}
                onReserver={onReserver}
              />
            </Reveal>
          </aside>

          <div className="flex-1 min-w-0 lg:order-first">
            <Reveal delay={0.3}>
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <CartItem key={item.id_lot} item={item} onRemove={onRemove} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
