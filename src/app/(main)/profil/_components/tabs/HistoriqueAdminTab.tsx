"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Package, Clock } from "@deemlol/next-icons";
import EmptyState from "@/src/components/ui/primitives/EmptyState";
import Pagination from "@/src/components/ui/primitives/Pagination";
import LoadingSpinner from "@/src/components/ui/primitives/LoadingSpinner";
import SlideIn from "@/src/components/animations/SlideIn";
import CollecteAdminCard from "@/src/app/(main)/admin/collectes/_components/CollecteAdminCard";
import { getAllCollectsAdmin, type CollectAdminItem } from "@/src/app/(main)/admin/actions";

const PAGE_SIZE = 10;

function HistoriqueAdminCard({
  item,
  index,
  onOpen,
}: {
  item: CollectAdminItem;
  index: number;
  onOpen: () => void;
}) {
  const date = new Date(item.creneau).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <SlideIn delay={index * 0.1}>
      <button
        onClick={onOpen}
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
            {item.commercant?.name_entreprise} → {item.association?.name_entreprise}
          </p>
          <p className="text-xs text-sapin/40">{date}</p>
        </div>

        <span
          className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${item.statut
            ? "bg-lime/30 text-sapin border-lime/50"
            : "bg-sapin/8 text-sapin/50 border-sapin/15"
            }`}
        >
          {item.statut ? "Validée" : "En attente"}
        </span>
      </button>
    </SlideIn>
  );
}

export default function HistoriqueAdminTab() {
  const [collects, setCollects] = useState<CollectAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CollectAdminItem | null>(null);

  const reload = () => {
    getAllCollectsAdmin().then((data) => {
      setCollects(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    reload();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!collects.length) {
    return (
      <EmptyState
        icon={<Clock size={32} className="text-sapin/30" />}
        title="Bientôt disponible"
        description="L'historique de vos activités sera disponible dans une prochaine version."
      />
    );
  }

  const totalPages = Math.ceil(collects.length / PAGE_SIZE);
  const paged = collects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div>
        {paged.map((c, i) => (
          <HistoriqueAdminCard
            key={c.id_collect}
            item={c}
            index={i}
            onOpen={() => setSelected(c)}
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

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-cream/60 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="pointer-events-auto w-full max-w-5xl mx-auto max-h-[90vh] overflow-y-auto bg-cream/90 backdrop-blur-sm border-2 border-sapin/10 rounded-2xl shadow-sm">
                <CollecteAdminCard
                  item={selected}
                  onValidated={() => {
                    reload();
                    setSelected(null);
                  }}
                  onClose={() => setSelected(null)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
