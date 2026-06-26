"use client";

import { useEffect, useState } from "react";
import Reveal from "../animations/Reveal";
import CatalogueDecorations from "../illustrations/CatalogueDecorations";
import LotCardGestion from "../ui/cards/LotCardGestion";
import Pagination from "../ui/primitives/Pagination";
import type { Lot } from "../ui/cards/LotCard";

interface GestionLotsProps {
  lots: Lot[];
  adminView?: boolean;
}

export default function GestionLots({ lots, adminView = false }: GestionLotsProps) {
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => {
      setPageSize(mq.matches ? 20 : 10);
      setPage(1);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const totalPages = Math.ceil(lots.length / pageSize);
  const pageLots = lots.slice((page - 1) * pageSize, page * pageSize);

  const goToPage = (p: number) => {
    setPage(p);
    setTimeout(() => {
      document
        .getElementById("lots")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <section
      id="lots"
      aria-label="Gestion de vos lots"
      className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-28"
    >
      <CatalogueDecorations />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Reveal delay={0.1}>
          <div className="mb-12">
            <h2 className="text-sapin font-black mb-4">
              {adminView ? "Tous" : "Vos"}{" "}
              <span className="relative italic whitespace-nowrap">
                <span
                  className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
                  aria-hidden="true"
                />
                <span className="relative">les lots</span>
              </span>
              {adminView ? " de la plateforme" : " déclarés"}
            </h2>
            <p className="text-sapin/70 max-w-2xl">
              {adminView
                ? "Vue complète de tous les lots actifs. Modifiez ou supprimez n'importe quel lot."
                : "Retrouvez ici l'ensemble des lots que vous avez déclarés sur Récoltéo. Modifiez ou supprimez un lot en quelques clics."}
            </p>
          </div>
        </Reveal>

        {lots.length === 0 ? (
          <Reveal delay={0.2}>
            <div className="text-center py-16 bg-white border-2 border-sapin/10 rounded-2xl shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_6%,transparent)]">
              <p className="text-sapin/40 font-semibold mb-2">
                Aucun lot déclaré pour le moment
              </p>
              <span className="block text-sm text-sapin/30">
                Déclarez votre premier lot pour le mettre à disposition des associations.
              </span>
            </div>
          </Reveal>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {pageLots.map((lot) => (
                <LotCardGestion key={lot.id_lot} lot={lot} />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />
          </div>
        )}
      </div>
    </section>
  );
}
