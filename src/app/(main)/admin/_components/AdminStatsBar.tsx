"use client";

import { Users, ShoppingBag, Clock } from "@deemlol/next-icons";
import type { AdminFilter } from "./types";

interface AdminStatsBarProps {
  total: number;
  commercantsCount: number;
  associationsCount: number;
  activeFilter: AdminFilter;
  onFilterChange: (filter: AdminFilter) => void;
}

export default function AdminStatsBar({
  total,
  commercantsCount,
  associationsCount,
  activeFilter,
  onFilterChange,
}: AdminStatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <button
        onClick={() => onFilterChange(activeFilter === "all" ? "all" : "all")}
        className={`text-left bg-white rounded-2xl p-4 flex flex-col gap-2 border-2 transition-all active:scale-[0.97] ${
          activeFilter === "all"
            ? "border-sapin shadow-[4px_4px_0_0_#06573F]"
            : "border-sapin/10 shadow-[3px_3px_0_0_rgba(6,87,63,0.06)] hover:border-sapin/30"
        }`}
      >
        <div className={`flex items-center gap-2 ${activeFilter === "all" ? "text-sapin" : "text-sapin/50"}`}>
          <Clock size={20} />
          <span className="text-sm font-semibold uppercase tracking-wide">Total</span>
        </div>
        <p className={`font-black text-2xl sm:text-3xl leading-none ${activeFilter === "all" ? "text-sapin" : "text-sapin/70"}`}>
          {total}
        </p>
      </button>

      <button
        onClick={() => onFilterChange(activeFilter === "commercant" ? "all" : "commercant")}
        className={`text-left bg-white rounded-2xl p-4 flex flex-col gap-2 border-2 transition-all active:scale-[0.97] ${
          activeFilter === "commercant"
            ? "border-peach shadow-[4px_4px_0_0_#f16012]"
            : "border-peach/20 shadow-[3px_3px_0_0_rgba(241,96,18,0.08)] hover:border-peach/50"
        }`}
      >
        <div className={`flex items-center gap-2 ${activeFilter === "commercant" ? "text-peach" : "text-peach/70"}`}>
          <ShoppingBag size={20} />
          <span className="text-[10px] font-semibold uppercase tracking-wide -translate-x-3.5 lg:translate-x-1 sm:text-sm">Commerçants</span>
        </div>
        <p className={`font-black text-2xl sm:text-3xl leading-none ${activeFilter === "commercant" ? "text-peach" : "text-peach/70"}`}>
          {commercantsCount}
        </p>
      </button>

      <button
        onClick={() => onFilterChange(activeFilter === "association" ? "all" : "association")}
        className={`text-left bg-white rounded-2xl p-4 flex flex-col gap-2 border-2 transition-all active:scale-[0.97] ${
          activeFilter === "association"
            ? "border-sapin shadow-[4px_4px_0_0_#06573F]"
            : "border-lime/40 shadow-[3px_3px_0_0_rgba(201,242,66,0.2)] hover:border-lime/70"
        }`}
      >
        <div className={`flex items-center gap-2 ${activeFilter === "association" ? "text-sapin" : "text-sapin/60"}`}>
          <Users size={20} />
          <span className="text-[10px] font-semibold uppercase tracking-wide -translate-x-3 lg:translate-x-1 sm:text-sm">Associations</span>
        </div>
        <p className={`font-black text-2xl sm:text-3xl leading-none ${activeFilter === "association" ? "text-sapin" : "text-sapin/70"}`}>
          {associationsCount}
        </p>
      </button>
    </div>
  );
}
