"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Reveal from "@/src/components/animations/Reveal";
import AdminStatsBar from "../../_components/AdminStatsBar";
import AdminProfileCard from "../../_components/AdminProfileCard";
import Pagination from "@/src/components/ui/primitives/Pagination";
import Button from "@/src/components/ui/primitives/Button";
import ConfirmResetCagnotteModal from "@/src/components/ui/modals/ConfirmResetCagnotteModal";
import { structuresNavigate } from "./structuresNavigate";
import { resetCagnotte } from "../../actions";
import type { StructureFilter, StructuresFiltreProps } from "./types";

export default function StructuresFiltre({
  commercants,
  commercantsTotal,
  associations,
  associationsTotal,
  filter,
  page,
  pageSize,
}: StructuresFiltreProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [resetTarget, setResetTarget] = useState<{ id: number; name: string } | null>(null);

  const total = commercantsTotal + associationsTotal;
  const showCommercants = filter !== "association" && commercants.length > 0;
  const showAssociations = filter !== "commercant" && associations.length > 0;
  const isEmpty = commercants.length === 0 && associations.length === 0;

  const go = (newFilter: StructureFilter, newPage: number) =>
    structuresNavigate(router, pathname, newFilter, newPage);

  const handleConfirmReset = async () => {
    if (!resetTarget) return;
    const fd = new FormData();
    fd.set("id", String(resetTarget.id));
    await resetCagnotte(fd);
    setResetTarget(null);
  };

  return (
    <div className="flex flex-col gap-10">
      <Reveal delay={0}>
        <div>
          <h1 className="text-sapin font-black">Toutes les structures</h1>
          <p className="text-sapin mt-4">
            {total} structure{total > 1 ? "s" : ""} inscrite{total > 1 ? "s" : ""}.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <AdminStatsBar
          total={total}
          commercantsCount={commercantsTotal}
          associationsCount={associationsTotal}
          activeFilter={filter}
          onFilterChange={(f) => go(f, 1)}
        />
      </Reveal>

      {isEmpty && (
        <Reveal delay={0.2}>
          <div className="text-center py-16 text-sapin/40 font-semibold">
            Aucune structure pour ce filtre.
          </div>
        </Reveal>
      )}

      <AnimatePresence>
        {showCommercants && (
          <motion.section
            key="commercants"
            className="flex flex-col gap-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-sapin font-black">Commerçants</h2>
              <span className="px-2.5 py-0.5 bg-peach/10 border border-peach/20 text-peach text-sm font-bold rounded-full">
                {commercantsTotal}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {commercants.map((c) => (
                <AdminProfileCard
                  key={c.id_commercant}
                  type="commercant"
                  id={c.id_commercant}
                  name={c.name_entreprise}
                  email={c.email}
                  tel={c.tel}
                  details={[
                    { label: "SIRET", value: c.siret },
                    { label: "Activité", value: c.type_activity },
                    { label: "Forme juridique", value: c.forme_juridique },
                    { label: "Adresse", value: c.adresse },
                  ]}
                  createdAt={c.created_at}
                  showActions={false}
                  subscriptionActive={c.statut_abonnement}
                  docs={c.docs}
                />
              ))}
            </div>
            {filter === "commercant" && (
              <Pagination
                page={page}
                totalPages={Math.ceil(commercantsTotal / pageSize)}
                goToPage={(p) => go("commercant", p)}
              />
            )}
          </motion.section>
        )}

        {showAssociations && (
          <motion.section
            key="associations"
            className="flex flex-col gap-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-sapin font-black">Associations</h2>
              <span className="px-2.5 py-0.5 bg-lime/30 border border-lime/50 text-sapin text-sm font-bold rounded-full">
                {associationsTotal}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {associations.map((a) => (
                <AdminProfileCard
                  key={a.id_association}
                  type="association"
                  id={a.id_association}
                  name={a.name_entreprise}
                  email={a.email}
                  tel={a.tel}
                  details={[
                    { label: "RNA", value: a.rna },
                    { label: "Type", value: a.type_asso },
                    { label: "Adresse", value: a.adresse },
                    { label: "Cagnotte", value: a.cagnotte.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }) },
                  ]}
                  createdAt={a.created_at}
                  showActions={false}
                  subscriptionActive={a.statut_abonnement}
                  docs={a.docs}
                  extraFooter={
                    <Button
                      label="Réinitialiser la cagnotte"
                      onClick={() => setResetTarget({ id: a.id_association, name: a.name_entreprise })}
                      variant="peach-outline"
                      size="sm"
                      showArrow={false}
                      className="w-full justify-center"
                    />
                  }
                />
              ))}
            </div>
            {filter === "association" && (
              <Pagination
                page={page}
                totalPages={Math.ceil(associationsTotal / pageSize)}
                goToPage={(p) => go("association", p)}
              />
            )}
          </motion.section>
        )}

        {filter === "all" && (showCommercants || showAssociations) && (
          <motion.div
            key="pagination-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Pagination
              page={page}
              totalPages={Math.ceil(Math.max(commercantsTotal, associationsTotal) / pageSize)}
              goToPage={(p) => go("all", p)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {resetTarget && (
        <ConfirmResetCagnotteModal
          associationName={resetTarget.name}
          onConfirm={handleConfirmReset}
          onCancel={() => setResetTarget(null)}
        />
      )}
    </div>
  );
}
