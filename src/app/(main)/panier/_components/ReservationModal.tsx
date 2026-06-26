"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle,
  Copy,
  Check,
  X,
} from "@deemlol/next-icons";
import Button from "@/src/components/ui/primitives/Button";
import Toggle from "@/src/components/ui/primitives/Toggle";
import { reserverLots, type MerchantCode } from "../actions";
import type { Lot, Horaire } from "@/src/components/ui/cards/LotCard";
import { parisDateStr, toParisISOString } from "@/src/lib/paris-time";

const JOURS_SEMAINE = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function getDayName(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return JOURS_SEMAINE[new Date(y, m - 1, d).getDay()];
}

function generate2hSlots(horaires: Horaire[], jourName: string) {
  const slots: { label: string; value: string }[] = [];
  for (const h of horaires) {
    if (h.jour !== jourName) continue;
    const [dh, dm] = h.debut.split(":").map(Number);
    const [fh, fm] = h.fin.split(":").map(Number);
    const startMin = dh * 60 + dm;
    const endMin = fh * 60 + fm;
    for (let t = startMin; t + 120 <= endMin; t += 120) {
      const h1 = Math.floor(t / 60);
      const h2 = Math.floor((t + 120) / 60);
      const pad = (n: number) => String(n).padStart(2, "0");
      slots.push({ label: `${h1}h00 - ${h2}h00`, value: `${pad(h1)}:00` });
    }
  }
  return slots;
}

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

interface MerchantGroup {
  id_commercant: number;
  name_entreprise: string;
  horaires: Horaire[];
  lots: Lot[];
}

function AvailabilityCalendar({
  merchantGroups,
  minDate,
  maxDate,
  value,
  onChange,
  disabled,
}: {
  merchantGroups: MerchantGroup[];
  minDate: string;
  maxDate: string;
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
}) {
  function parseLocalDate(s: string) {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  const initDate = parseLocalDate(minDate);
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());

  const availableDates = useMemo(() => {
    const set = new Set<string>();
    const cur = parseLocalDate(minDate);
    const max = parseLocalDate(maxDate);
    while (cur <= max) {
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, "0");
      const d = String(cur.getDate()).padStart(2, "0");
      const ds = `${y}-${m}-${d}`;
      const dayName = getDayName(ds);
      if (merchantGroups.some((g) => generate2hSlots(g.horaires, dayName).length > 0)) {
        set.add(ds);
      }
      cur.setDate(cur.getDate() + 1);
    }
    return set;
  }, [merchantGroups, minDate, maxDate]);

  const minParsed = parseLocalDate(minDate);
  const maxParsed = parseLocalDate(maxDate);
  const minMonthVal = minParsed.getFullYear() * 12 + minParsed.getMonth();
  const maxMonthVal = maxParsed.getFullYear() * 12 + maxParsed.getMonth();
  const curMonthVal = viewYear * 12 + viewMonth;

  function prevMonth() {
    if (curMonthVal <= minMonthVal) return;
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (curMonthVal >= maxMonthVal) return;
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayFr = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  function toDateStr(d: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  const cells: (number | null)[] = [
    ...Array(firstDayFr).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="border border-sapin/15 rounded-xl p-3 bg-white select-none">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={prevMonth}
          disabled={curMonthVal <= minMonthVal || disabled}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-sapin/50 hover:text-sapin hover:bg-sapin/8 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-xs font-bold text-sapin">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button
          type="button"
          onClick={nextMonth}
          disabled={curMonthVal >= maxMonthVal || disabled}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-sapin/50 hover:text-sapin hover:bg-sapin/8 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-sapin/30 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const ds = toDateStr(day);
          const inRange = ds >= minDate && ds <= maxDate;
          const available = availableDates.has(ds);
          const selected = value === ds;
          const clickable = inRange && available && !disabled;
          return (
            <button
              key={idx}
              type="button"
              disabled={!clickable}
              onClick={() => onChange(ds)}
              title={inRange && !available ? "Aucun créneau disponible ce jour" : undefined}
              className={`mx-auto w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all ${
                selected
                  ? "bg-sapin text-cream font-bold shadow-[2px_2px_0_0_#04251c]"
                  : clickable
                    ? "text-sapin hover:bg-sapin/10 cursor-pointer"
                    : inRange
                      ? "text-sapin/20 cursor-not-allowed line-through decoration-sapin/15"
                      : "text-sapin/12 cursor-not-allowed"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {availableDates.size === 0 && (
        <p className="text-center text-[10px] text-sapin/40 italic mt-2">
          Aucun créneau disponible dans les 14 prochains jours.
        </p>
      )}
    </div>
  );
}

interface ReservationModalProps {
  items: Lot[];
  onClose: () => void;
  onSuccess: (confirmedLotIds: number[]) => void;
}

export default function ReservationModal({ items, onClose, onSuccess }: ReservationModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [groupedByMerchant, setGroupedByMerchant] = useState<Record<number, boolean>>({});
  const [groupSlots, setGroupSlots] = useState<Record<number, string>>({});
  const [lotSlots, setLotSlots] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    merchantCodes: MerchantCode[];
    emailErrors?: string[];
    confirmedLotIds: number[];
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [{ minStr, maxStr }] = useState(() => {
    const today = new Date();
    const min = parisDateStr(today);
    const max = new Date(today);
    max.setDate(max.getDate() + 14);
    return { minStr: min, maxStr: parisDateStr(max) };
  });

  const merchantGroups = useMemo<MerchantGroup[]>(() => {
    const groups: MerchantGroup[] = [];
    for (const lot of items) {
      const existing = groups.find((g) => g.id_commercant === lot.id_commercant);
      if (existing) {
        existing.lots.push(lot);
        for (const h of lot.horaires ?? []) {
          const has = existing.horaires.some(
            (eh) => eh.jour === h.jour && eh.debut === h.debut && eh.fin === h.fin,
          );
          if (!has) existing.horaires.push(h);
        }
      } else {
        groups.push({
          id_commercant: lot.id_commercant,
          name_entreprise: lot.name_entreprise,
          horaires: [...(lot.horaires ?? [])],
          lots: [lot],
        });
      }
    }
    return groups;
  }, [items]);

  const jourName = selectedDate ? getDayName(selectedDate) : "";

  function isGrouped(id_commercant: number) {
    return groupedByMerchant[id_commercant] !== false;
  }

  function toggleGrouped(id_commercant: number, value: boolean) {
    setGroupedByMerchant((prev) => ({ ...prev, [id_commercant]: value }));
    if (value) {
      const group = merchantGroups.find((g) => g.id_commercant === id_commercant);
      if (group) {
        setLotSlots((prev) => {
          const next = { ...prev };
          for (const lot of group.lots) delete next[lot.id_lot];
          return next;
        });
      }
    } else {
      setGroupSlots((prev) => {
        const next = { ...prev };
        delete next[id_commercant];
        return next;
      });
    }
  }

  function buildCreneaux(): { lotIds: number[]; creneaux: Record<number, string> } {
    const lotIds: number[] = [];
    const creneaux: Record<number, string> = {};
    if (!selectedDate) return { lotIds, creneaux };
    for (const group of merchantGroups) {
      if (isGrouped(group.id_commercant)) {
        const slot = groupSlots[group.id_commercant];
        if (!slot) continue;
        for (const lot of group.lots) {
          creneaux[lot.id_lot] = toParisISOString(selectedDate, slot);
          lotIds.push(lot.id_lot);
        }
      } else {
        for (const lot of group.lots) {
          const slot = lotSlots[lot.id_lot];
          if (!slot) continue;
          creneaux[lot.id_lot] = toParisISOString(selectedDate, slot);
          lotIds.push(lot.id_lot);
        }
      }
    }
    return { lotIds, creneaux };
  }

  const { lotIds: toConfirmIds, creneaux: toConfirmCreneaux } = buildCreneaux();
  const canConfirm = toConfirmIds.length > 0 && !isPending;

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  async function handleConfirm() {
    if (!canConfirm) return;
    setError("");
    setIsPending(true);
    const res = await reserverLots(toConfirmIds, toConfirmCreneaux);
    setIsPending(false);
    if (res.success) {
      setResult({ merchantCodes: res.merchantCodes, emailErrors: res.emailErrors, confirmedLotIds: toConfirmIds });
    } else {
      setError(res.error);
    }
  }

  if (result) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => onSuccess(result.confirmedLotIds)}>
        <div className="absolute inset-0 bg-cream/90 backdrop-blur-sm" />
        <div
          className="relative z-10 w-full max-w-lg bg-white rounded-2xl border-2 border-sapin/10 shadow-[8px_8px_0_0_color-mix(in_srgb,var(--color-sapin)_15%,transparent)] overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-lime/30 border-b border-lime/40 px-6 py-5 flex items-start justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-lime border border-lime/50 flex items-center justify-center shrink-0">
                <CheckCircle size={20} className="text-sapin" />
              </div>
              <div>
                <h3 className="font-black text-sapin text-sm">Réservation confirmée !</h3>
                <p className="text-sapin/50 text-xs mt-0.5">
                  {result.emailErrors?.length
                    ? "Réservation enregistrée : problème d'envoi email"
                    : "Emails de confirmation envoyés aux deux parties"}
                </p>
              </div>
            </div>
            <button onClick={() => onSuccess(result.confirmedLotIds)} className="p-1 rounded-lg text-sapin/40 hover:text-sapin hover:bg-sapin/6 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-5 flex-1 flex flex-col gap-4">
            {result.merchantCodes.map((mc) => (
              <div key={`${mc.id_commercant}-${mc.code}`} className="border border-sapin/10 rounded-xl p-4 flex flex-col gap-3">
                <div>
                  <p className="font-semibold text-sapin text-sm">{mc.name_entreprise}</p>
                  <p className="text-sapin/50 text-xs mt-0.5">{mc.adresse_recup}</p>
                  <p className="text-sapin/40 text-xs mt-1">{mc.creneau}</p>
                </div>
                <div className="text-xs text-sapin/60">
                  {mc.lots.map((l) => (
                    <span key={l.id_lot} className="inline-block mr-2">· {l.nature}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-sapin rounded-xl px-4 py-3">
                    <p className="text-[10px] font-bold text-lime/60 uppercase tracking-widest mb-1">Code de retrait</p>
                    <p className="font-black text-lime text-2xl tracking-[0.3em] text-center">{mc.code}</p>
                  </div>
                  <button
                    onClick={() => copyCode(mc.code)}
                    className="p-2.5 rounded-xl border border-sapin/15 text-sapin/50 hover:text-sapin hover:bg-sapin/6 transition-colors shrink-0"
                  >
                    {copiedCode === mc.code ? <Check size={20} className="text-lime" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            ))}

            {result.emailErrors?.length ? (
              <div className="bg-sapin/4 border border-sapin/10 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-sapin/70 mb-1">Email de confirmation non reçu ?</p>
                <p className="text-xs text-sapin/60 leading-relaxed">
                  Votre réservation est bien enregistrée et vos codes de retrait sont valides. Conservez-les précieusement.
                </p>
                <p className="text-xs text-sapin/50 mt-2">
                  Un problème ?{" "}
                  <Link href="/contact" className="font-semibold text-sapin underline underline-offset-2 hover:text-sapin/70 transition-colors">
                    Contactez un administrateur
                  </Link>.
                </p>
              </div>
            ) : (
              <p className="text-xs text-sapin/40 text-center leading-relaxed">
                Un email de confirmation vous a été envoyé avec tous vos codes.<br />
                Présentez-les au commerçant lors du retrait.
              </p>
            )}
          </div>

          <div className="px-6 pb-5 shrink-0">
            <Button label="Fermer" onClick={() => onSuccess(result.confirmedLotIds)} variant="sapin" showArrow={false} className="w-full justify-center" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={isPending ? undefined : onClose}>
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-2xl border-2 border-sapin/10 shadow-[8px_8px_0_0_color-mix(in_srgb,var(--color-sapin)_15%,transparent)] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-sapin/4 border-b border-sapin/8 px-6 py-5 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-lime border border-lime/50 flex items-center justify-center shrink-0">
              <Calendar size={20} className="text-sapin" />
            </div>
            <div>
              <h3 className="font-black text-sapin text-sm">Planifier la récupération</h3>
              <p className="text-sapin/50 text-xs mt-0.5">
                {items.length} lot{items.length > 1 ? "s" : ""} · {merchantGroups.length} commerçant{merchantGroups.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button onClick={onClose} disabled={isPending} className="p-1 rounded-lg text-sapin/40 hover:text-sapin hover:bg-sapin/6 transition-colors disabled:opacity-30">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-sapin/50 uppercase tracking-widest mb-2">
              <Calendar size={12} />
              Date de récupération
            </label>
            <AvailabilityCalendar
              merchantGroups={merchantGroups}
              minDate={minStr}
              maxDate={maxStr}
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setGroupSlots({});
                setLotSlots({});
              }}
              disabled={isPending}
            />
            <p className="text-xs text-sapin/35 mt-1.5">Disponible jusqu'à 14 jours à l'avance</p>
          </div>

          {selectedDate && merchantGroups.map((group) => {
            const slots = generate2hSlots(group.horaires, jourName);
            const grouped = isGrouped(group.id_commercant);
            const hasMultipleLots = group.lots.length > 1;

            return (
              <div key={group.id_commercant} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-sapin/50 uppercase tracking-widest">
                    <Clock size={12} />
                    {merchantGroups.length > 1 ? group.name_entreprise : "Créneau horaire"}
                  </label>
                  {hasMultipleLots && (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-medium text-sapin/40">Lots groupés</span>
                      <Toggle
                        id={`toggle-${group.id_commercant}`}
                        checked={grouped}
                        onChange={(v) => toggleGrouped(group.id_commercant, v)}
                        disabled={isPending}
                      />
                    </div>
                  )}
                </div>

                {slots.length === 0 ? (
                  <p className="text-xs text-sapin/40 italic">Aucune disponibilité ce jour-là pour {group.name_entreprise}.</p>
                ) : grouped ? (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {slots.map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        disabled={isPending}
                        onClick={() => setGroupSlots((prev) => ({ ...prev, [group.id_commercant]: slot.value }))}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50 ${
                          groupSlots[group.id_commercant] === slot.value
                            ? "bg-sapin text-cream border-sapin shadow-[2px_2px_0_0_#04251c]"
                            : "border-sapin/15 text-sapin hover:bg-sapin/6 hover:border-sapin/30"
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {group.lots.map((lot) => (
                      <div key={lot.id_lot}>
                        <p className="text-[10px] font-semibold text-sapin/50 uppercase tracking-wide mb-1.5">{lot.nature}</p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {slots.map((slot) => (
                            <button
                              key={slot.value}
                              type="button"
                              disabled={isPending}
                              onClick={() => setLotSlots((prev) => ({ ...prev, [lot.id_lot]: slot.value }))}
                              className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50 ${
                                lotSlots[lot.id_lot] === slot.value
                                  ? "bg-sapin text-cream border-sapin shadow-[2px_2px_0_0_#04251c]"
                                  : "border-sapin/15 text-sapin hover:bg-sapin/6 hover:border-sapin/30"
                              }`}
                            >
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

        </div>

        <div className="px-6 pb-6 flex flex-col gap-3 shrink-0">
          {error && (
            <p className="text-xs text-peach font-medium bg-peach/8 border border-peach/20 rounded-xl px-4 py-2.5">{error}</p>
          )}
          <div className="flex gap-3">
          <Button label="Annuler" onClick={onClose} disabled={isPending} variant="sapin-outline" size="sm" showArrow={false} className="flex-1 justify-center" />
          <Button
            label={isPending ? "Réservation…" : "Confirmer"}
            onClick={handleConfirm}
            disabled={!canConfirm}
            variant="sapin"
            size="sm"
            showArrow={false}
            className="flex-1 justify-center"
          />
          </div>
        </div>
      </div>
    </div>
  );
}