"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Reveal from "@/src/components/animations/Reveal";
import AdminStatsBar from "./AdminStatsBar";
import AdminProfileCard from "./AdminProfileCard";
import AdminEmptyState from "./AdminEmptyState";
import Pagination from "./Pagination";
import { adminNavigate } from "./adminNavigate";
import type { AdminFilter, AdminFiltreProps } from "./types";

export default function AdminFiltre({
  commercants,
  commercantsTotal,
  associations,
  associationsTotal,
  filter,
  page,
  pageSize,
  adminPrenom,
  adminNom,
}: AdminFiltreProps) {
  const router = useRouter();
  const pathname = usePathname();

  const total = commercantsTotal + associationsTotal;
  const showCommercants = filter !== "association" && commercants.length > 0;
  const showAssociations = filter !== "commercant" && associations.length > 0;
  const isEmpty = commercants.length === 0 && associations.length === 0;

  const go = (newFilter: AdminFilter, newPage: number) =>
    adminNavigate(router, pathname, newFilter, newPage);

  return (
    <div className="flex flex-col gap-10">
      <Reveal delay={0}>
        <div>
          <h1 className="text-sapin font-black">
            Bonjour{" "}
            <span className="relative italic whitespace-nowrap ml-4">
              <span
                className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
                aria-hidden="true"
              />
              <span className="relative">
                {adminPrenom} {adminNom}
              </span>
            </span>
          </h1>
          <p className="text-sapin mt-8">
            {total > 0
              ? `${total} profil${total > 1 ? "s" : ""} en attente de validation.`
              : "Tout est validé, rien à faire pour l'instant."}
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
          <AdminEmptyState />
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
                />
              ))}
            </div>
            {filter === "commercant" && (
              <Pagination
                page={page}
                total={commercantsTotal}
                pageSize={pageSize}
                onPrev={() => go("commercant", page - 1)}
                onNext={() => go("commercant", page + 1)}
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
                    { label: "Rayon d'action", value: `${a.rayon_action} km` },
                    { label: "Adresse", value: a.adresse },
                  ]}
                  createdAt={a.created_at}
                />
              ))}
            </div>
            {filter === "association" && (
              <Pagination
                page={page}
                total={associationsTotal}
                pageSize={pageSize}
                onPrev={() => go("association", page - 1)}
                onNext={() => go("association", page + 1)}
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
              total={Math.max(commercantsTotal, associationsTotal)}
              pageSize={pageSize}
              onPrev={() => go("all", page - 1)}
              onNext={() => go("all", page + 1)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
