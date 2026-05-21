"use client";

import Button from "@/src/components/ui/primitives/Button";
import { useCart } from "@/src/lib/cart-context";

export interface Lot {
  id_lot: number;
  name_entreprise: string;
  adresse: string;
  adresse_recup: string;
  instructions: string | null;
  category: string;
  nature: string;
  quantity: number;
  dlc: string | null;
  montant_chiffre: number;
  montant_lettre: string;
  created_at: string;
}

export default function LotCard({
  lot,
  showCartButton,
}: {
  lot: Lot;
  showCartButton?: boolean;
}) {
  const { addToCart, items } = useCart();
  const inCart = items.some((i) => i.id_lot === lot.id_lot);
  const dlc = lot.dlc
    ? new Date(lot.dlc).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <article className="relative bg-white border-2 border-sapin/10 rounded-2xl overflow-hidden shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_8%,transparent)] flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_8px_0_0_color-mix(in_srgb,var(--color-sapin)_12%,transparent)] hover:border-sapin/20 cursor-pointer">
      <div className="h-1.5 w-full bg-lime" />

      <div className="p-4 lg:p-5 flex flex-col gap-3 lg:gap-4 flex-1">
        <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-lime/30 text-sapin border border-lime/50 leading-tight">
          {lot.category}
        </span>

        <div className="flex items-start justify-between gap-2">
          <h3 className="font-black text-sapin text-sm lg:text-base truncate flex-1 min-w-0">
            {lot.name_entreprise}
          </h3>
          <div className="shrink-0 text-right">
            <span className="block text-sm lg:text-xl font-black text-peach leading-none whitespace-nowrap">
              {lot.montant_chiffre.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </span>
            <span className="block text-[9px] text-sapin/40 font-medium mt-0.5">
              {lot.montant_lettre}
            </span>
          </div>
        </div>

        <p className="text-xs lg:text-sm text-sapin/70 leading-relaxed">
          {lot.nature}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div className="bg-sapin/4 border border-sapin/6 rounded-xl px-3 py-2.5">
            <span className="block text-[10px] font-bold text-sapin/40 uppercase tracking-widest mb-0.5">
              Volume
            </span>
            <span className="block text-sm font-semibold text-sapin">
              {lot.quantity} kg
            </span>
          </div>

          {dlc ? (
            <div className="bg-peach/4 border border-peach/8 rounded-xl px-3 py-2.5">
              <span className="block text-[10px] font-bold text-peach/60 uppercase tracking-widest mb-0.5">
                DLC
              </span>
              <span className="block text-sm font-semibold text-peach whitespace-nowrap">
                {dlc}
              </span>
            </div>
          ) : (
            <div className="bg-sapin/4 border border-sapin/6 rounded-xl px-3 py-2.5">
              <span className="block text-[10px] font-bold text-sapin/40 uppercase tracking-widest mb-0.5">
                Récup.
              </span>
              <span className="block text-sm font-semibold text-sapin truncate">
                {lot.adresse_recup}
              </span>
            </div>
          )}
        </div>

        {showCartButton && (
          <Button
            type="button"
            label={inCart ? "Déjà dans le panier" : "Ajouter au panier"}
            variant={inCart ? "lime" : "sapin"}
            size="sm"
            showArrow={false}
            disabled={inCart}
            onClick={() => addToCart(lot)}
            className="mt-1 w-full justify-center"
          />
        )}
      </div>
    </article>
  );
}
