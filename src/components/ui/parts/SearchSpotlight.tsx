"use client";

import { useRef, useState } from "react";
import { Search, X } from "@deemlol/next-icons";
import Button from "@/src/components/ui/primitives/Button";

type SearchFilter = "all" | "commercant" | "association";

interface SearchSpotlightProps {
  defaultSearch?: string;
  filter?: SearchFilter;
  total?: number;
  commercantsCount?: number;
  associationsCount?: number;
  onSearch: (value: string) => void;
  onFilterChange?: (filter: SearchFilter) => void;
  showFilters?: boolean;
}

export default function SearchSpotlight({
  defaultSearch = "",
  filter = "all",
  total = 0,
  commercantsCount = 0,
  associationsCount = 0,
  onSearch,
  onFilterChange,
  showFilters = true,
}: SearchSpotlightProps) {
  const [value, setValue] = useState(defaultSearch);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleChange = (v: string) => {
    setValue(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(v), 400);
  };

  const clear = () => {
    setValue("");
    if (timerRef.current) clearTimeout(timerRef.current);
    onSearch("");
  };

  const filterOptions: { value: SearchFilter; label: string; count: number }[] =
    [
      { value: "all", label: "Tous", count: total },
      { value: "commercant", label: "Commerçants", count: commercantsCount },
      { value: "association", label: "Associations", count: associationsCount },
    ];

  const displayCount =
    filterOptions.find((f) => f.value === filter)?.count ?? total;

  return (
    <div className="bg-white border-2 border-sapin/20 rounded-2xl shadow-[4px_4px_0_0_rgba(6,87,63,0.10)] overflow-hidden">
      <div className="flex items-center gap-4 px-5 py-4">
        <Search size={20} className="text-sapin/60 shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Rechercher par nom d'entreprise ou d'association..."
          className="flex-1 bg-transparent text-sapin font-medium placeholder:text-sapin/40 focus:outline-none text-base"
        />
        {value && (
          <button
            onClick={clear}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-sapin/50 hover:text-sapin hover:bg-sapin/10 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="flex items-center gap-2 px-4 py-3 border-t-2 border-sapin/10 bg-sapin/5 flex-wrap">
          {filterOptions.map(({ value: val, label, count }) => (
            <Button
              key={val}
              label={`${label} ${count}`}
              onClick={() =>
                onFilterChange?.(filter === val && val !== "all" ? "all" : val)
              }
              variant={filter === val ? "sapin" : "sapin-outline"}
              size="sm"
              showArrow={false}
            />
          ))}
          <span className="ml-auto text-sapin/80 text-sm font-bold tabular-nums">
            {displayCount} résultat{displayCount > 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
