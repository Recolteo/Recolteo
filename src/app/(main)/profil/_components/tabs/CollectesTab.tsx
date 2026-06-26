"use client";

import { useState, useEffect, useTransition } from "react";
import { Package } from "@deemlol/next-icons";
import EmptyState from "@/src/components/ui/primitives/EmptyState";
import Button from "@/src/components/ui/primitives/Button";
import LoadingSpinner from "@/src/components/ui/primitives/LoadingSpinner";
import LotDetailModal from "@/src/components/ui/modals/LotDetailModal";
import {
  getCommercantCollects,
  validerCollectsParCode,
  type CollectItem,
} from "../../actions";
import { toLot } from "../../utils";

type CollectGroup = {
  code: string;
  creneau: string;
  associationName: string;
  items: CollectItem[];
};

function groupByCode(collects: CollectItem[]): CollectGroup[] {
  const map = new Map<string, CollectGroup>();
  for (const item of collects) {
    const key = item.code_retrait ?? `no-code-${item.id_lot}`;
    if (!map.has(key)) {
      map.set(key, {
        code: key,
        creneau: item.creneau,
        associationName: item.association?.name_entreprise ?? "",
        items: [],
      });
    }
    map.get(key)!.items.push(item);
  }
  return Array.from(map.values());
}

function CollectGroupCard({
  group,
  onValidated,
}: {
  group: CollectGroup;
  onValidated: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState<CollectItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const creneau = new Date(group.creneau).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    if (code.length !== 8) { setError("Le code doit contenir 8 chiffres."); return; }
    startTransition(async () => {
      const result = await validerCollectsParCode(code);
      if (result.success) onValidated();
      else setError(result.error);
    });
  };

  return (
    <>
      <div className="border border-sapin/15 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-sapin/10 bg-sapin/2 flex flex-col gap-1">
          <p className="font-black text-sapin leading-tight">{group.associationName}</p>
          <time className="text-xs text-sapin/40">{creneau}</time>
        </div>

        <div className="divide-y divide-sapin/8">
          {group.items.map((item) => (
            <button
              key={item.id_lot}
              type="button"
              onClick={() => setDetailOpen(item)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-sapin/3 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-lime border border-sapin shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0">
                <Package size={16} className="text-sapin" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-sapin truncate">{item.lot?.nature ?? "Lot"}</p>
                <p className="text-xs text-sapin/50">{item.lot?.montant_chiffre} €</p>
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3 border-t border-sapin/10">
          <p className="text-xs font-semibold text-sapin/50 uppercase tracking-widest">Code de retrait</p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={8}
            value={code}
            onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 8)); setError(null); }}
            placeholder="• • • • • • • •"
            disabled={isPending}
            className="w-full px-4 py-3 rounded-xl border-2 border-sapin/20 bg-white focus:border-sapin focus:outline-none transition-colors text-center text-2xl font-black tracking-[0.4em] text-sapin placeholder:text-sapin/20 placeholder:text-sm placeholder:tracking-widest"
          />
          {error && <p className="text-xs text-peach font-semibold text-center -mt-1">{error}</p>}
          <Button
            label={isPending ? "Validation…" : `Valider ${group.items.length > 1 ? `les ${group.items.length} lots` : "le lot"}`}
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
          lot={toLot(detailOpen)}
          showCartButton={false}
          onClose={() => setDetailOpen(null)}
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

  useEffect(() => { reload(); }, []);

  const pending = collects.filter((c) => !c.statut);
  const groups = groupByCode(pending);

  if (loading) return <LoadingSpinner />;

  if (!groups.length) {
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
        Demandez le code à l'association lors du passage et saisissez-le pour valider la collecte.
      </p>
      {groups.map((g) => (
        <CollectGroupCard key={g.code} group={g} onValidated={reload} />
      ))}
    </div>
  );
}
