"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Reveal from "@/src/components/animations/Reveal";
import AdminProfileCard from "./AdminProfileCard";
import AdminEmptyState from "./AdminEmptyState";
import Pagination from "@/src/components/ui/primitives/Pagination";
import SearchSpotlight from "@/src/components/ui/parts/SearchSpotlight";
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
  search,
}: AdminFiltreProps) {
  const router = useRouter();
  const pathname = usePathname();

  const total = commercantsTotal + associationsTotal;
  const showCommercants = filter !== "association" && commercants.length > 0;
  const showAssociations = filter !== "commercant" && associations.length > 0;
  const isEmpty = commercants.length === 0 && associations.length === 0;

  const go = (newFilter: AdminFilter, newPage: number, newSearch?: string, replace?: boolean) =>
    adminNavigate(router, pathname, newFilter, newPage, newSearch ?? search, replace);

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
          <p className="text-sapin/80 mt-2">
            Validez ou refusez les nouvelles inscriptions.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <SearchSpotlight
          defaultSearch={search}
          filter={filter}
          total={total}
          commercantsCount={commercantsTotal}
          associationsCount={associationsTotal}
          onSearch={(s) => go(filter, 1, s, true)}
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
            transition={{ duration: 0.25, ease: "easeOut", delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-sapin font-black">Commerçants</h2>
              <span className="px-2.5 py-0.5 bg-peach/10 border border-peach/20 text-peach text-sm font-bold rounded-full">
                {commercantsTotal}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {commercants.map((c, i) => (
                <Reveal key={c.id_commercant} delay={i * 0.08}>
                  <AdminProfileCard
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
                </Reveal>
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
            transition={{ duration: 0.25, ease: "easeOut", delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-sapin font-black">Associations</h2>
              <span className="px-2.5 py-0.5 bg-lime/30 border border-lime/50 text-sapin text-sm font-bold rounded-full">
                {associationsTotal}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {associations.map((a, i) => (
                <Reveal key={a.id_association} delay={i * 0.08}>
                  <AdminProfileCard
                    type="association"
                    id={a.id_association}
                    name={a.name_entreprise}
                    email={a.email}
                    tel={a.tel}
                    details={[
                      { label: "RNA", value: a.rna },
                      { label: "Type", value: a.type_asso },
                      { label: "Adresse", value: a.adresse },
                    ]}
                    createdAt={a.created_at}
                  />
                </Reveal>
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
    </div>
  );
}
