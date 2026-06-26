"use client";

import { useEffect, useState } from "react";
import { MapPin, Calendar, Tag, ChevronDown, Clock, Plus, Trash2 } from "@deemlol/next-icons";
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
import Input from "@/src/components/ui/primitives/Input";
import FilterPart from "@/src/components/ui/parts/FilterPart";
import CatalogueGrid from "@/src/components/sections/CatalogueGrid";
import type { Lot, Horaire } from "@/src/components/ui/cards/LotCard";
import HorairesSection from "../declarer-lot/_components/HorairesSection";

type DateFilter = "all" | "today" | "week" | "month";

const DATE_STEPS = [
  "Toutes",
  "Aujourd'hui",
  "Cette semaine",
  "Ce mois",
] as const;
const DATE_FILTER_MAP: DateFilter[] = ["all", "today", "week", "month"];

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
  const [horaires, setHoraires] = useState<Horaire[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );

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
  const isAvailabilityFiltered = horaires.length > 0;
  const isCategoryFiltered = selectedCategories.size > 0;

  function addHoraire() {
    setHoraires((prev) => [
      ...prev,
      { jour: "Lundi", debut: "08:00", fin: "18:00" },
    ]);
  }

  function removeHoraire(index: number) {
    setHoraires((prev) => prev.filter((_, i) => i !== index));
  }

  function updateHoraire(index: number, field: keyof Horaire, value: string) {
    setHoraires((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  }

  function timeToMinutes(t: string) {
    const [hh, mm] = t.split(":").map(Number);
    return hh * 60 + mm;
  }

  function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
    const a0 = timeToMinutes(aStart);
    const a1 = timeToMinutes(aEnd);
    const b0 = timeToMinutes(bStart);
    const b1 = timeToMinutes(bEnd);
    return Math.max(a0, b0) < Math.min(a1, b1);
  }

  const filtered = lots.filter((lot) => {
    if (dateFilter === "today" && !isWithinDays(lot.created_at, 1))
      return false;
    if (dateFilter === "week" && !isWithinDays(lot.created_at, 7)) return false;
    if (dateFilter === "month" && !isWithinDays(lot.created_at, 30))
      return false;

    if (applyRadius && radiusKm !== null) {
      if (lot.lat == null || lot.lng == null) return false;
      const dist = haversineKm(
        assoCoords!.lat,
        assoCoords!.lng,
        lot.lat,
        lot.lng,
      );
      if (dist > radiusKm) return false;
    }

    if (isAvailabilityFiltered) {
      const matches = (lot.horaires || []).some((lotH) =>
        horaires.some((h) => rangesOverlap(h.debut, h.fin, lotH.debut, lotH.fin)),
      );
      if (!matches) return false;
    }

    if (isCategoryFiltered && !selectedCategories.has(lot.category))
      return false;

    return true;
  });

  const activeCount =
    (applyRadius ? 1 : 0) +
    (isDateFiltered ? 1 : 0) +
    (isAvailabilityFiltered ? 1 : 0) +
    (isCategoryFiltered ? 1 : 0);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
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

        <p className="sm:text-lg text-base px-6 pb-6 text-sapin leading-relaxed">{description}</p>

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

              <div className="grid grid-cols-1 gap-6">
                <FilterPart
                  icon={<Clock size={20} />}
                  title="Disponibilités"
                  subtitle="Ajoutez les créneaux horaires disponibles pour la récupération."
                  isActive={isAvailabilityFiltered}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-bold text-sapin/40 uppercase tracking-widest">
                        Disponibilités
                      </h2>
                      <button
                        type="button"
                        onClick={addHoraire}
                        className="flex items-center gap-1.5 text-xs font-semibold text-sapin border border-sapin/20 rounded-xl px-3 py-1.5 hover:bg-sapin/6 transition-colors"
                      >
                        <Plus size={16} />
                        Ajouter un créneau
                      </button>
                    </div>

                    {horaires.length === 0 && (
                      <p className="text-xs text-sapin/40 italic px-1">
                        Aucun créneau défini. Ajoutez vos disponibilités pour que les
                        associations puissent choisir un horaire adapté.
                      </p>
                    )}

                    <div className="flex flex-col gap-3">
                      {horaires.map((h, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end bg-sapin/3 border border-sapin/8 rounded-xl px-4 py-3"
                        >
                          <Input
                            id={`horaire_debut_${i}`}
                            name={`horaire_debut_${i}`}
                            label="De"
                            type="time"
                            value={h.debut}
                            onChange={(v) => updateHoraire(i, "debut", v)}
                          />
                          <Input
                            id={`horaire_fin_${i}`}
                            name={`horaire_fin_${i}`}
                            label="À"
                            type="time"
                            value={h.fin}
                            onChange={(v) => updateHoraire(i, "fin", v)}
                          />
                          <button
                            type="button"
                            onClick={() => removeHoraire(i)}
                            aria-label="Supprimer le créneau"
                            className="mb-0.5 p-2 rounded-xl text-peach/60 hover:text-peach hover:bg-peach/8 transition-colors self-end"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <input type="hidden" name="horaires_filter" value={JSON.stringify(horaires)} />
                  </div>
                </FilterPart>
                
              </div>

              {categories.length > 0 && (
                <>
                  <div className="h-px bg-sapin/10" />
                  <FilterPart
                    icon={<Tag size={20} />}
                    title="Par catégorie"
                    subtitle="Sélectionnez un ou plusieurs types de lots."
                    isActive={isCategoryFiltered}
                  >
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => {
                        const checked = selectedCategories.has(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold transition-all duration-150 ${checked
                              ? "bg-sapin text-lime border-sapin"
                              : "bg-lime/20 text-sapin/60 border-sapin/20 hover:border-sapin/50 hover:text-sapin hover:bg-lime/40"
                              }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors ${checked
                                ? "bg-lime border-lime"
                                : "border-current opacity-50"
                                }`}
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
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </FilterPart>
                </>
              )}
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
