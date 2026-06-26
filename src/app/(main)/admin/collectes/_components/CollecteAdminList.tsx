"use client";

import { useState, useEffect, useTransition } from "react";
import { CheckSquare } from "@deemlol/next-icons";
import EmptyState from "@/src/components/ui/primitives/EmptyState";
import LoadingSpinner from "@/src/components/ui/primitives/LoadingSpinner";
import Pagination from "@/src/components/ui/primitives/Pagination";
import AdminStatsBar from "../../_components/AdminStatsBar";
import CollecteAdminCard from "./CollecteAdminCard";
import { getPendingCollects, type CollectAdminItem } from "../../actions";

const PAGE_SIZE = 10;

interface Props {
  commercantsCount: number;
  associationsCount: number;
}

export default function CollecteAdminList({
  commercantsCount,
  associationsCount,
}: Props) {
  const [collects, setCollects] = useState<CollectAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [, startTransition] = useTransition();

  const reload = () => {
    startTransition(async () => {
      const data = await getPendingCollects();
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
        icon={<CheckSquare size={32} className="text-sapin/30" />}
        title="Aucune collecte en attente"
        description="Les collectes à valider apparaîtront ici."
      />
    );
  }

  const totalPages = Math.ceil(collects.length / PAGE_SIZE);
  const paged = collects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-5">
      <AdminStatsBar
        total={collects.length}
        commercantsCount={commercantsCount}
        associationsCount={associationsCount}
        activeFilter="all"
        onFilterChange={() => { }}
      />
      {paged.map((c) => (
        <CollecteAdminCard key={c.id_collect} item={c} onValidated={reload} />
      ))}
      <Pagination
        page={page}
        totalPages={totalPages}
        goToPage={(p) => setPage(p)}
      />
    </div>
  );
}
