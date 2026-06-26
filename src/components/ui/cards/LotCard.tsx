"use client";

import { useState } from "react";
import Button from "@/src/components/ui/primitives/Button";
import LotDetailModal from "@/src/components/ui/modals/LotDetailModal";
import { useCart } from "@/src/lib/cart-context";

export interface Horaire {
  jour: string;
  debut: string;
  fin: string;
}

export interface Lot {
  id_lot: number;
  id_commercant: number;
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
  horaires: Horaire[];
  lat?: number | null;
  lng?: number | null;
}

export default function LotCard({
  lot,
  showCartButton,
}: {
  lot: Lot;
  showCartButton?: boolean;
}) {
  const { addToCart, items } = useCart();
  const [open, setOpen] = useState(false);
  const inCart = items.some((i) => i.id_lot === lot.id_lot);

  const price = lot.montant_chiffre.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div>
      <article
        onClick={() => setOpen(true)}
        className="relative bg-lime/5 border-2 border-sapin/10 rounded-2xl overflow-hidden shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_8%,transparent)] flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#06573F] hover:border-sapin cursor-pointer group"
      >
        <div className="flex sm:hidden">
          <div className="w-20 shrink-0 bg-sapin/6 border-r border-sapin/8 flex flex-col items-center justify-center gap-2 py-3 px-1.5">
            <span className="text-center text-[7.5px] font-black text-sapin/50 uppercase leading-tight tracking-wide line-clamp-4 wrap-break-word w-full">
              {lot.category}
            </span>
            <div className="w-4 h-px bg-sapin/20 rounded-full" />
            <span className="text-xs font-black text-sapin">
              {lot.quantity} kg
            </span>
          </div>

          <div className="flex-1 min-w-0 p-3 flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-black text-sapin text-sm leading-tight flex-1 min-w-0 truncate">
                {lot.name_entreprise}
              </h3>
              <span className="shrink-0 text-sm font-black text-peach leading-none whitespace-nowrap">
                {price}
              </span>
            </div>

            <p className="text-xs text-sapin/50 truncate">{lot.nature}</p>

            <p className="text-[10px] text-sapin/40 font-medium truncate">
              {lot.adresse_recup}
            </p>

            {showCartButton && (
              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  type="button"
                  label={inCart ? "✓ Panier" : "Ajouter"}
                  variant={inCart ? "lime" : "sapin"}
                  size="sm"
                  showArrow={false}
                  disabled={inCart}
                  onClick={() => addToCart(lot)}
                  className="w-full justify-center text-xs py-1.5"
                />
              </div>
            )}
          </div>
        </div>

        <div className="hidden sm:flex sm:flex-col flex-1">
          {inCart && (
            <div className="absolute top-2.5 right-2.5 z-10 bg-lime text-sapin text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-lime/60">
              Dans le panier
            </div>
          )}

          <div className="p-4 flex flex-col gap-3 flex-1">
            <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-lime/30 text-sapin border border-lime/50 leading-tight line-clamp-1">
              {lot.category}
            </span>

            <div className="flex items-start justify-between gap-2">
              <h3 className="font-black text-sapin text-sm leading-tight flex-1 min-w-0 line-clamp-2">
                {lot.name_entreprise}
              </h3>
              <span className="shrink-0 text-base font-black text-peach leading-none whitespace-nowrap">
                {price}
              </span>
            </div>

            <p className="text-xs text-sapin/60 leading-relaxed line-clamp-2">
              {lot.nature}
            </p>

            <div className="mt-auto space-y-2">
              <div className="bg-sapin/4 border border-sapin/6 rounded-xl px-3 py-2">
                <span className="block text-[9px] font-bold text-sapin/40 uppercase tracking-widest mb-0.5">
                  Volume
                </span>
                <span className="block text-sm font-bold text-sapin">
                  {lot.quantity} kg
                </span>
              </div>

              <div className="bg-sapin/4 border border-sapin/6 rounded-xl px-3 py-2">
                <span className="block text-[9px] font-bold text-sapin/40 uppercase tracking-widest mb-0.5">
                  Récupération
                </span>
                <span className="block text-xs font-semibold text-sapin leading-snug">
                  {lot.adresse_recup}
                </span>
              </div>
            </div>

            {showCartButton && (
              <div onClick={(e) => e.stopPropagation()}>
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
              </div>
            )}
          </div>
        </div>
      </article>

      {open && (
        <LotDetailModal
          lot={lot}
          showCartButton={showCartButton}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
