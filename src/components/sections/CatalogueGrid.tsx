"use client";

import { useState } from "react";
import { motion } from "motion/react";
import LotCard, { type Lot } from "../ui/cards/LotCard";
import Pagination from "../ui/primitives/Pagination";

const PAGE_SIZE = 20;

export default function CatalogueGrid({ lots }: { lots: Lot[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(lots.length / PAGE_SIZE);
  const pageLots = lots.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {pageLots.map((lot, i) => (
          <motion.div
            key={`p${page}-${lot.id_lot}`}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: i * 0.1, ease: "easeOut", duration: 0.4 }}
          >
            <LotCard lot={lot} />
          </motion.div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />
    </div>
  );
}
