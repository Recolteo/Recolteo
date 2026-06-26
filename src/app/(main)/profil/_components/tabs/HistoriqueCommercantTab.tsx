"use client";

import { useState, useEffect } from "react";
import { FileText, Clock } from "@deemlol/next-icons";
import EmptyState from "@/src/components/ui/primitives/EmptyState";
import Pagination from "@/src/components/ui/primitives/Pagination";
import LoadingSpinner from "@/src/components/ui/primitives/LoadingSpinner";
import { DownloadAction } from "@/src/components/ui/docs/DocAction";
import LotDetailModal from "@/src/components/ui/modals/LotDetailModal";
import { getCommercantCollects, type CollectItem } from "../../actions";
import { toLot } from "../../utils";

const PAGE_SIZE = 10;

function HistoriqueCard({
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
    <div className="flex items-center gap-4 py-4 border-b border-sapin/8 last:border-0">
      <button
        onClick={onOpenDetail}
        className="w-11 h-11 rounded-xl bg-lime border border-sapin shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0 hover:bg-lime/70 transition-colors"
      >
        <FileText size={20} className="text-sapin" />
      </button>

      <button onClick={onOpenDetail} className="flex-1 min-w-0 text-left">
        <p className="font-black text-sapin leading-tight truncate">
          {item.lot?.nature ?? "Lot"}
        </p>
        <p className="text-xs text-sapin/50 mt-0.5 truncate">
          {item.association?.name_entreprise}
        </p>
        <p className="text-xs text-sapin/40">{date}</p>
      </button>

      <DownloadAction href={`/api/cerfa/${item.id_lot}`} />
    </div>
  );
}

export default function HistoriqueCommercantTab() {
  const [collects, setCollects] = useState<CollectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CollectItem | null>(null);

  useEffect(() => {
    getCommercantCollects().then((data) => {
      setCollects(data.filter((c) => c.statut));
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!collects.length) {
    return (
      <EmptyState
        icon={<Clock size={32} className="text-sapin/30" />}
        title="Aucune collecte terminée"
        description="Vos collectes validées et leurs CERFA apparaîtront ici."
      />
    );
  }

  const totalPages = Math.ceil(collects.length / PAGE_SIZE);
  const paged = collects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div>
        {paged.map((c) => (
          <HistoriqueCard
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
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
