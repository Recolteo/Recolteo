"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import LotCard, { type Lot } from "../ui/cards/LotCard";
import Pagination from "../ui/primitives/Pagination";

export default function CatalogueGrid({
  lots,
  showCartButton,
}: {
  lots: Lot[];
  showCartButton?: boolean;
}) {
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
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {pageLots.map((lot, i) => (
          <motion.div
            key={`p${page}-${lot.id_lot}`}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: i * 0.1, ease: "easeOut", duration: 0.4 }}
          >
            <LotCard lot={lot} showCartButton={showCartButton} />
          </motion.div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />
    </div>
  );
}
