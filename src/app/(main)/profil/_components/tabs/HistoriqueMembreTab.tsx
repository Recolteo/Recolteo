"use client";

import { useState, useEffect } from "react";
import { FileText, Package, Clock } from "@deemlol/next-icons";
import EmptyState from "@/src/components/ui/primitives/EmptyState";
import Pagination from "@/src/components/ui/primitives/Pagination";
import LoadingSpinner from "@/src/components/ui/primitives/LoadingSpinner";
import Button from "@/src/components/ui/primitives/Button";
import { DownloadAction } from "@/src/components/ui/docs/DocAction";
import LotDetailModal from "@/src/components/ui/modals/LotDetailModal";
import {
  getCommercantCollects,
  getAssociationCollects,
  type CollectItem,
} from "../../actions";
import { toLot } from "../../utils";

const PAGE_SIZE = 10;

const CONFIG = {
  commercant: {
    Icon: FileText,
    subtitle: (item: CollectItem) => item.association?.name_entreprise ?? "",
    emptyTitle: "Aucune collecte terminée",
    emptyDescription: "Vos collectes validées et leurs CERFA apparaîtront ici.",
  },
  association: {
    Icon: Package,
    subtitle: (item: CollectItem) => item.lot?.name_entreprise ?? "",
    emptyTitle: "Aucune réservation",
    emptyDescription: "Vos réservations de lots apparaîtront ici.",
  },
} as const;

function CollectCard({
  item,
  role,
  onOpenDetail,
}: {
  item: CollectItem;
  role: "commercant" | "association";
  onOpenDetail: () => void;
}) {
  const { Icon, subtitle } = CONFIG[role];
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
        <Icon size={20} className="text-sapin" />
      </button>

      <button onClick={onOpenDetail} className="flex-1 min-w-0 text-left">
        <p className="font-black text-sapin leading-tight truncate">
          {item.lot?.nature ?? "Lot"}
        </p>
        <p className="text-xs text-sapin/50 mt-0.5 truncate">
          {subtitle(item)}
        </p>
        <p className="text-xs text-sapin/40">{date}</p>
      </button>

      {item.statut ? (
        <DownloadAction href={`/api/collect-bundle/${item.id_lot}`} />
      ) : (
        <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border bg-sapin/8 text-sapin/50 border-sapin/15">
          En attente
        </span>
      )}
    </div>
  );
}

export default function HistoriqueMembreTab({
  role,
}: {
  role: "commercant" | "association";
}) {
  const [collects, setCollects] = useState<CollectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CollectItem | null>(null);

  useEffect(() => {
    const fetch =
      role === "commercant" ? getCommercantCollects : getAssociationCollects;
    fetch().then((data) => {
      setCollects(role === "commercant" ? data.filter((c) => c.statut) : data);
      setLoading(false);
    });
  }, [role]);

  if (loading) return <LoadingSpinner />;

  const { emptyTitle, emptyDescription } = CONFIG[role];

  if (!collects.length) {
    return (
      <EmptyState
        icon={<Clock size={32} className="text-sapin/30" />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  const hasValidated = collects.some((c) => c.statut);
  const totalPages = Math.ceil(collects.length / PAGE_SIZE);
  const paged = collects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      {hasValidated && (
        <div className="mb-4">
          <Button
            label="Télécharger tout mon historique"
            variant="sapin-outline"
            showArrow={false}
            className="w-full"
            onClick={() => {
              const a = document.createElement("a");
              a.href = "/api/tableau-recap-dons";
              document.body.appendChild(a);
              a.click();
              a.remove();
            }}
          />
        </div>
      )}

      <div>
        {paged.map((c) => (
          <CollectCard
            key={c.id_lot}
            item={c}
            role={role}
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
          codeRetrait={
            role === "association" && !selected.statut
              ? selected.code_retrait
              : null
          }
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
