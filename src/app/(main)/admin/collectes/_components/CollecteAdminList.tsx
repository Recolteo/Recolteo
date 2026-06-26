"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare } from "@deemlol/next-icons";
import Reveal from "@/src/components/animations/Reveal";
import EmptyState from "@/src/components/ui/primitives/EmptyState";
import Pagination from "@/src/components/ui/primitives/Pagination";
import SearchSpotlight from "@/src/components/ui/parts/SearchSpotlight";
import CollecteAdminCard from "./CollecteAdminCard";
import type { CollectAdminItem } from "../../actions";

type FilterType = "all" | "commercant" | "association";

const PAGE_SIZE = 10;

interface Props {
  collects: CollectAdminItem[];
}

export default function CollecteAdminList({ collects }: Props) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [, startTransition] = useTransition();

  const reload = () => startTransition(() => router.refresh());

  if (!collects.length) {
    return (
      <EmptyState
        icon={<CheckSquare size={32} className="text-sapin/30" />}
        title="Aucune collecte en attente"
        description="Les collectes à valider apparaîtront ici."
      />
    );
  }

  const filtered = collects.filter((c) => {
    if (filter === "commercant" && !c.commercant) return false;
    if (filter === "association" && !c.association) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        (c.commercant?.name_entreprise.toLowerCase().includes(s) ?? false) ||
        (c.association?.name_entreprise.toLowerCase().includes(s) ?? false)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-5">
      <Reveal delay={0}>
        <SearchSpotlight
          filter={filter}
          total={collects.length}
          commercantsCount={collects.filter((c) => c.commercant !== null).length}
          associationsCount={collects.filter((c) => c.association !== null).length}
          onSearch={(s) => { setSearch(s); setPage(1); }}
          onFilterChange={(f) => { setFilter(f); setPage(1); }}
        />
      </Reveal>
      {filtered.length === 0 ? (
        <EmptyState
          icon={<CheckSquare size={32} className="text-sapin/30" />}
          title="Aucun résultat"
          description="Aucune collecte ne correspond à votre recherche."
        />
      ) : (
        paged.map((c, i) => (
          <Reveal key={c.id_collect} delay={0.2 + i * 0.08}>
            <CollecteAdminCard item={c} onValidated={reload} />
          </Reveal>
        ))
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        goToPage={(p) => setPage(p)}
      />
    </div>
  );
}
