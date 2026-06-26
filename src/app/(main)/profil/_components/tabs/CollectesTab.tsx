"use client";

import { useState, useEffect, useTransition } from "react";
import { Package } from "@deemlol/next-icons";
import EmptyState from "@/src/components/ui/primitives/EmptyState";
import Button from "@/src/components/ui/primitives/Button";
import LoadingSpinner from "@/src/components/ui/primitives/LoadingSpinner";
import LotDetailModal from "@/src/components/ui/modals/LotDetailModal";
import {
  getCommercantCollects,
  validerCollect,
  type CollectItem,
} from "../../actions";
import { toLot } from "../../utils";

function CollectCard({
  item,
  onValidated,
}: {
  item: CollectItem;
  onValidated: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const creneau = new Date(item.creneau).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (code.length !== 8) {
      setError("Le code doit contenir 8 chiffres.");
      return;
    }
    startTransition(async () => {
      const result = await validerCollect(item.id_lot, code);
      if (result.success) onValidated();
      else setError(result.error);
    });
  };

  return (
    <>
      <div className="border border-sapin/15 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setDetailOpen(true)}
          className="w-full flex items-start gap-3 p-4 border-b border-sapin/10 text-left hover:bg-sapin/3 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-lime border border-sapin shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0">
            <Package size={20} className="text-sapin" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-sapin leading-tight">
              {item.lot?.nature ?? "Lot"}
            </p>
            <p className="text-xs text-sapin/50 mt-0.5">
              {item.association?.name_entreprise}
            </p>
            <p className="text-xs text-sapin/40">{creneau}</p>
          </div>
        </button>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-sapin/50 uppercase tracking-widest">
            Code de retrait
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={8}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, "").slice(0, 8));
              setError(null);
            }}
            placeholder="• • • • • • • •"
            disabled={isPending}
            className="w-full px-4 py-3 rounded-xl border-2 border-sapin/20 bg-white focus:border-sapin focus:outline-none transition-colors text-center text-2xl font-black tracking-[0.4em] text-sapin placeholder:text-sapin/20 placeholder:text-sm placeholder:tracking-widest"
          />
          {error && (
            <p className="text-xs text-peach font-semibold text-center -mt-1">
              {error}
            </p>
          )}
          <Button
            label={isPending ? "Validation…" : "Valider la collecte"}
            type="submit"
            variant="sapin"
            showArrow={false}
            disabled={isPending || code.length !== 8}
            className="w-full justify-center"
          />
        </form>
      </div>

      {detailOpen && (
        <LotDetailModal
          lot={toLot(item)}
          showCartButton={false}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  );
}

export default function CollectesTab() {
  const [collects, setCollects] = useState<CollectItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () =>
    getCommercantCollects().then((data) => {
      setCollects(data);
      setLoading(false);
    });

  useEffect(() => {
    reload();
  }, []);

  const pending = collects.filter((c) => !c.statut);

  if (loading) return <LoadingSpinner />;

  if (!pending.length) {
    return (
      <EmptyState
        icon={<Package size={32} className="text-sapin/30" />}
        title="Aucune collecte en attente"
        description="Les collectes à valider apparaîtront ici."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-sapin/60">
        Demandez le code à l'association lors du passage et saisissez-le pour
        valider la collecte.
      </p>
      {pending.map((c) => (
        <CollectCard key={c.id_lot} item={c} onValidated={reload} />
      ))}
    </div>
  );
}
