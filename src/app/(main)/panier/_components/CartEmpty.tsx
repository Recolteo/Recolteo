import { ShoppingBag } from "@deemlol/next-icons";
import CatalogueDecorations from "@/src/components/illustrations/CatalogueDecorations";
import Reveal from "@/src/components/animations/Reveal";
import EmptyState from "@/src/components/ui/primitives/EmptyState";

interface CartEmptyProps {
  title: string;
  description: string;
  btnLabel: string;
  btnHref: string;
}

export default function CartEmpty({
  title,
  description,
  btnLabel,
  btnHref,
}: CartEmptyProps) {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 overflow-hidden">
      <CatalogueDecorations />
      <Reveal>
        <EmptyState
          icon={<ShoppingBag size={32} className="text-sapin/40" />}
          title={title}
          description={description}
          btnLabel={btnLabel}
          btnHref={btnHref}
        />
      </Reveal>
    </section>
  );
}
