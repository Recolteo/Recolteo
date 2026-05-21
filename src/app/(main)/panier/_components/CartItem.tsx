"use client";

import { Trash } from "@deemlol/next-icons";
import { type Lot } from "@/src/components/ui/cards/LotCard";

interface CartItemProps {
  item: Lot;
  onRemove: (id: number) => void;
}

function Meta({
  label,
  value,
  peach,
}: {
  label: string;
  value: string;
  peach?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={`text-xs font-bold uppercase tracking-widest ${peach ? "text-peach/60" : "text-sapin/50"}`}
      >
        {label}
      </span>
      <span
        className={`text-base leading-snug ${peach ? "font-semibold text-peach" : "text-sapin/80"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  const dlc = item.dlc
    ? new Date(item.dlc).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <article className="bg-white border border-sapin/15 rounded-2xl shadow-[0_2px_12px_color-mix(in_srgb,var(--color-sapin)_8%,transparent)]">
      <div className="px-5 pt-5 pb-4 sm:px-6 sm:pt-6 flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-lime/30 text-sapin border border-lime/50 leading-tight mb-3">
            {item.category}
          </span>
          <h3 className="font-black text-sapin text-xl leading-tight">
            {item.name_entreprise}
          </h3>
          <p className="text-base text-sapin/60 mt-1 leading-snug">
            {item.nature}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="block font-black text-peach text-2xl leading-none">
            {item.montant_chiffre.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </span>
        </div>
      </div>

      <div className="mx-5 sm:mx-6 border-t border-sapin/10" />

      <div className="px-5 py-4 sm:px-6 grid grid-cols-2 gap-x-6 gap-y-4">
        <Meta label="Retrait" value={item.adresse_recup} />
        <Meta label="Volume" value={`${item.quantity} kg`} />
        {dlc && <Meta label="DLC" value={dlc} peach />}
        {item.instructions && (
          <div className="col-span-2">
            <Meta label="Instructions" value={item.instructions} />
          </div>
        )}
      </div>

      <div className="mx-5 sm:mx-6 border-t border-sapin/8" />

      <div className="px-5 py-3 sm:px-6 flex justify-end">
        <button
          onClick={() => onRemove(item.id_lot)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sapin/35 hover:text-sapin/70 transition-colors duration-150"
        >
          <Trash size={13} />
          Retirer du panier
        </button>
      </div>
    </article>
  );
}
