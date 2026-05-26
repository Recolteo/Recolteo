"use client";

import { useState, useEffect } from "react";
import { Package, Clock } from "@deemlol/next-icons";
import EmptyState from "@/src/components/ui/primitives/EmptyState";
import Pagination from "@/src/components/ui/primitives/Pagination";
import LoadingSpinner from "@/src/components/ui/primitives/LoadingSpinner";
import LotDetailModal from "@/src/components/ui/modals/LotDetailModal";
import { getAssociationCollects, type CollectItem } from "../actions";
import { toLot } from "../utils";

const PAGE_SIZE = 10;

function AssociationCollectCard({
  item,
  onOpenDetail,
}: {
  item: CollectItem;
  onOpenDetail: () => void;
}) {
  const date = new Date(item.date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <button
      onClick={onOpenDetail}
      className="w-full flex items-center gap-4 py-4 border-b border-sapin/8 last:border-0 text-left hover:bg-sapin/3 transition-colors rounded-xl px-1"
    >
      <div className="w-11 h-11 rounded-xl bg-lime border border-sapin shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0">
        <Package size={20} className="text-sapin" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-black text-sapin leading-tight truncate">
          {item.lot?.nature ?? "Lot"}
        </p>
        <p className="text-xs text-sapin/50 mt-0.5 truncate">
          {item.lot?.name_entreprise}
        </p>
        <p className="text-xs text-sapin/40">{date}</p>
      </div>

      <span
        className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
          item.statut
            ? "bg-lime/30 text-sapin border-lime/50"
            : "bg-sapin/8 text-sapin/50 border-sapin/15"
        }`}
      >
        {item.statut ? "Validée" : "En attente"}
      </span>
    </button>
  );
}

export default function HistoriqueAssociationTab() {
  const [collects, setCollects] = useState<CollectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CollectItem | null>(null);

  useEffect(() => {
    getAssociationCollects().then((data) => {
      setCollects(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!collects.length) {
    return (
      <EmptyState
        icon={<Clock size={32} className="text-sapin/30" />}
        title="Aucune réservation"
        description="Vos réservations de lots apparaîtront ici."
      />
    );
  }

  const totalPages = Math.ceil(collects.length / PAGE_SIZE);
  const paged = collects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div>
        {paged.map((c) => (
          <AssociationCollectCard
            key={c.id_lot}
            item={c}
            onOpenDetail={() => setSelected(c)}
          />
        ))}
      </div>

      <div className="mt-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          goToPage={(p) => {
            setPage(p);
            setSelected(null);
          }}
        />
      </div>

      {selected && (
        <LotDetailModal
          lot={toLot(selected)}
          showCartButton={false}
          codeRetrait={selected.statut ? null : selected.code_retrait}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
