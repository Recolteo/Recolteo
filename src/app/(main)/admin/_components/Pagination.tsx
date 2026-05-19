"use client";

import { ChevronLeft, ChevronRight } from "@deemlol/next-icons";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({ page, total, pageSize, onPrev, onNext }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-sapin/10">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-sapin/15 text-sapin font-bold disabled:opacity-30 hover:bg-sapin hover:text-cream hover:border-sapin transition-all"
      >
        <ChevronLeft size={16} />
        Précédent
      </button>
      <span className="text-sapin/50 font-semibold text-[13px]">
        Page {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-sapin/15 text-sapin font-bold disabled:opacity-30 hover:bg-sapin hover:text-cream hover:border-sapin transition-all"
      >
        Suivant
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
