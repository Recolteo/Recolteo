"use client";

import { useEffect, useState } from "react";
import { MapPin, Calendar, Tag, ChevronDown, Clock } from "@deemlol/next-icons";
import {
  readCookieConsent,
  openCookiePanel,
  onConsentChange,
  offConsentChange,
} from "@/src/lib/cookie-consent";
import RadiusSlider, {
  RADIUS_STEPS,
} from "@/src/components/ui/primitives/RadiusSlider";
import StepSlider from "@/src/components/ui/primitives/StepSlider";
import FilterPart from "@/src/components/ui/parts/FilterPart";
import CatalogueGrid from "@/src/components/sections/CatalogueGrid";
import type { Lot } from "@/src/components/ui/cards/LotCard";

type DateFilter = "all" | "today" | "week" | "month";

const DATE_STEPS = [
  "Toutes",
  "Aujourd'hui",
  "Cette semaine",
  "Ce mois",
] as const;
const DATE_FILTER_MAP: DateFilter[] = ["all", "today", "week", "month"];
const JOURS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
const JOURS_SHORT: Record<string, string> = {
  Lundi: "Lun",
  Mardi: "Mar",
  Mercredi: "Mer",
  Jeudi: "Jeu",
  Vendredi: "Ven",
  Samedi: "Sam",
  Dimanche: "Dim",
};

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isWithinDays(dateStr: string, days: number): boolean {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return new Date(dateStr) >= cutoff;
}

function PillButton({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold transition-all duration-150 ${
        checked
          ? "bg-sapin text-lime border-sapin"
          : "bg-lime/20 text-sapin/60 border-sapin/20 hover:border-sapin/50 hover:text-sapin hover:bg-lime/40"
      }`}
    >
      <span
        className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-lime border-lime" : "border-current opacity-50"}`}
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="w-2 h-2">
            <path
              d="M1 4l3 3 5-6"
              stroke="#06573F"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

interface Props {
  lots: Lot[];
  assoCoords: { lat: number; lng: number } | null;
  showCartButton?: boolean;
  title: string;
  description: string;
  radiusTitle: string;
  radiusDescription: string;
  dateTitle: string;
  dateDescription: string;
  emptyTitle: string;
  emptySubtitle: string;
}

export default function CatalogueLotsFilter({
  lots,
  assoCoords,
  showCartButton,
  title,
  description,
  radiusTitle,
  radiusDescription,
  dateTitle,
  dateDescription,
  emptyTitle,
  emptySubtitle,
}: Props) {
  const [open, setOpen] = useState(false);
  const [geoEnabled, setGeoEnabled] = useState(false);
  const [radiusIndex, setRadiusIndex] = useState(0);
  const [dateIndex, setDateIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    const update = () => setGeoEnabled(readCookieConsent().geolocalisation);
    update();
    onConsentChange(update);
    return () => offConsentChange(update);
  }, []);

  const categories = Array.from(new Set(lots.map((l) => l.category))).sort();
  const canUseRadius = geoEnabled && assoCoords !== null;
  const applyRadius = canUseRadius && radiusIndex > 0;
  const radiusKm = applyRadius ? RADIUS_STEPS[radiusIndex - 1] : null;
  const dateFilter = DATE_FILTER_MAP[dateIndex];
  const isDateFiltered = dateIndex > 0;
  const isCategoryFiltered = selectedCategories.size > 0;
  const isDayFiltered = selectedDays.size > 0;

  const filtered = lots.filter((lot) => {
    if (dateFilter === "today" && !isWithinDays(lot.created_at, 1))
      return false;
    if (dateFilter === "week" && !isWithinDays(lot.created_at, 7)) return false;
    if (dateFilter === "month" && !isWithinDays(lot.created_at, 30))
      return false;
    if (applyRadius && radiusKm !== null) {
      if (lot.lat == null || lot.lng == null) return false;
      if (
        haversineKm(assoCoords!.lat, assoCoords!.lng, lot.lat, lot.lng) >
        radiusKm
      )
        return false;
    }
    if (isCategoryFiltered && !selectedCategories.has(lot.category))
      return false;
    if (isDayFiltered && !lot.horaires.some((h) => selectedDays.has(h.jour)))
      return false;
    return true;
  });

  const activeCount =
    (applyRadius ? 1 : 0) +
    (isDateFiltered ? 1 : 0) +
    (isCategoryFiltered ? 1 : 0) +
    (isDayFiltered ? 1 : 0);

  function toggle(
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string,
  ) {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-12 sm:gap-20">
      <div className="bg-lime/5 border border-sapin rounded-2xl shadow-[4px_4px_0_0_#06573F] overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-sapin/3 transition-colors"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-black text-sapin leading-tight">{title}</h3>
            {activeCount > 0 && (
              <span className="px-2.5 py-1 bg-sapin text-lime text-xs font-bold rounded-full leading-none">
                {activeCount} filtre{activeCount > 1 ? "s" : ""} actif
                {activeCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <ChevronDown
            size={32}
            className={`shrink-0 text-sapin transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <p className="sm:text-lg text-base px-6 pb-6 text-sapin leading-relaxed">
          {description}
        </p>

        <div
          className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <div className="overflow-hidden">
            <div className="px-6 pb-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                <div className="relative">
                  <FilterPart
                    icon={<MapPin size={20} />}
                    title={radiusTitle}
                    subtitle={radiusDescription}
                    isActive={applyRadius}
                  >
                    <RadiusSlider
                      value={radiusIndex}
                      onChange={setRadiusIndex}
                      withOff
                      disabled={!canUseRadius}
                    />
                    {!geoEnabled && (
                      <p className="text-xs text-sapin/50 mt-1">
                        <button
                          type="button"
                          onClick={openCookiePanel}
                          className="underline hover:text-sapin transition-colors"
                        >
                          Activez les cookies de géolocalisation
                        </button>{" "}
                        pour utiliser ce filtre.
                      </p>
                    )}
                  </FilterPart>
                </div>
                <FilterPart
                  icon={<Calendar size={20} />}
                  title={dateTitle}
                  subtitle={dateDescription}
                  isActive={isDateFiltered}
                >
                  <StepSlider
                    steps={DATE_STEPS}
                    value={dateIndex}
                    onChange={setDateIndex}
                    label="Période de parution"
                  />
                </FilterPart>
              </div>

              <div className="h-px bg-sapin/10" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                {categories.length > 0 && (
                  <FilterPart
                    icon={<Tag size={20} />}
                    title="Par catégorie"
                    subtitle="Sélectionnez un ou plusieurs types de lots."
                    isActive={isCategoryFiltered}
                  >
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <PillButton
                          key={cat}
                          label={cat}
                          checked={selectedCategories.has(cat)}
                          onClick={() => toggle(setSelectedCategories, cat)}
                        />
                      ))}
                    </div>
                  </FilterPart>
                )}
                <FilterPart
                  icon={<Clock size={20} />}
                  title="Par jour de récupération"
                  subtitle="Affichez les lots disponibles certains jours de la semaine."
                  isActive={isDayFiltered}
                >
                  <div className="flex flex-wrap gap-2">
                    {JOURS.map((jour) => (
                      <PillButton
                        key={jour}
                        label={JOURS_SHORT[jour]}
                        checked={selectedDays.has(jour)}
                        onClick={() => toggle(setSelectedDays, jour)}
                      />
                    ))}
                  </div>
                </FilterPart>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border-2 border-sapin/10 rounded-2xl shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_6%,transparent)]">
          <p className="text-sapin font-semibold mb-2">{emptyTitle}</p>
          <span className="block text-sm text-sapin/60">{emptySubtitle}</span>
        </div>
      ) : (
        <CatalogueGrid lots={filtered} showCartButton={showCartButton} />
      )}
    </div>
  );
}
