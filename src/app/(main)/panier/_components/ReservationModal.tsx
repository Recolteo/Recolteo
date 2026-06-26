"use client";

import { useState, useTransition } from "react";
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
import { reserverLots, type MerchantCode } from "../actions";
import type { Lot, Horaire } from "@/src/components/ui/cards/LotCard";

const JOURS_SEMAINE = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

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
      slots.push({
        label: `${h1}h00 - ${h2}h00`,
        value: `${pad(h1)}:00`,
      });
    }
  }
  return slots;
}

interface MerchantGroup {
  id_commercant: number;
  name_entreprise: string;
  horaires: Horaire[];
  lots: Lot[];
}

interface ReservationModalProps {
  items: Lot[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReservationModal({
  items,
  onClose,
  onSuccess,
}: ReservationModalProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState("");
  const [slotsByMerchant, setSlotsByMerchant] = useState<
    Record<number, string>
  >({});
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    merchantCodes: MerchantCode[];
    emailErrors?: string[];
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const today = new Date();
  const minStr = today.toISOString().split("T")[0];
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 14);
  const maxStr = maxDate.toISOString().split("T")[0];

  const merchantGroups: MerchantGroup[] = [];
  for (const lot of items) {
    const existing = merchantGroups.find(
      (g) => g.id_commercant === lot.id_commercant,
    );
    if (existing) {
      existing.lots.push(lot);
      for (const h of lot.horaires ?? []) {
        const alreadyHas = existing.horaires.some(
          (eh) =>
            eh.jour === h.jour && eh.debut === h.debut && eh.fin === h.fin,
        );
        if (!alreadyHas) existing.horaires.push(h);
      }
    } else {
      merchantGroups.push({
        id_commercant: lot.id_commercant,
        name_entreprise: lot.name_entreprise,
        horaires: [...(lot.horaires ?? [])],
        lots: [lot],
      });
    }
  }

  const jourName = selectedDate ? getDayName(selectedDate) : "";

  function selectSlot(id_commercant: number, value: string) {
    setSlotsByMerchant((prev) => ({ ...prev, [id_commercant]: value }));
  }

  const allSlotsChosen =
    selectedDate &&
    merchantGroups.every((g) => slotsByMerchant[g.id_commercant]);

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  function handleSubmit() {
    if (!selectedDate) {
      setError("Veuillez sélectionner une date.");
      return;
    }
    if (!allSlotsChosen) {
      setError("Veuillez choisir un créneau pour chaque commerçant.");
      return;
    }
    setError("");
    const creneaux: Record<number, string> = {};
    for (const g of merchantGroups) {
      creneaux[g.id_commercant] =
        `${selectedDate}T${slotsByMerchant[g.id_commercant]}:00`;
    }
    startTransition(async () => {
      const res = await reserverLots(
        items.map((i) => i.id_lot),
        creneaux,
      );
      if (res.success) {
        setResult({
          merchantCodes: res.merchantCodes,
          emailErrors: res.emailErrors,
        });
      } else {
        setError(res.error);
      }
    });
  }

  if (result) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onSuccess}
      >
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
                <h3 className="font-black text-sapin text-sm">
                  Réservation confirmée !
                </h3>
                <p className="text-sapin/50 text-xs mt-0.5">
                  {result.emailErrors?.length
                    ? "Réservation enregistrée : problème d'envoi email"
                    : "Emails de confirmation envoyés aux deux parties"}
                </p>
              </div>
            </div>
            <button
              onClick={onSuccess}
              className="p-1 rounded-lg text-sapin/40 hover:text-sapin hover:bg-sapin/6 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-5 flex-1 flex flex-col gap-4">
            {result.merchantCodes.map((mc) => (
              <div
                key={mc.id_commercant}
                className="border border-sapin/10 rounded-xl p-4 flex flex-col gap-3"
              >
                <div>
                  <p className="font-semibold text-sapin text-sm">
                    {mc.name_entreprise}
                  </p>
                  <p className="text-sapin/50 text-xs mt-0.5">
                    {mc.adresse_recup}
                  </p>
                  <p className="text-sapin/40 text-xs mt-1">{mc.creneau}</p>
                </div>
                <div className="text-xs text-sapin/60">
                  {mc.lots.map((l) => (
                    <span key={l.id_lot} className="inline-block mr-2">
                      · {l.nature}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-sapin rounded-xl px-4 py-3">
                    <p className="text-[10px] font-bold text-lime/60 uppercase tracking-widest mb-1">
                      Code de retrait
                    </p>
                    <p className="font-black text-lime text-2xl tracking-[0.3em] text-center">
                      {mc.code}
                    </p>
                  </div>
                  <button
                    onClick={() => copyCode(mc.code)}
                    className="p-2.5 rounded-xl border border-sapin/15 text-sapin/50 hover:text-sapin hover:bg-sapin/6 transition-colors shrink-0"
                  >
                    {copiedCode === mc.code ? (
                      <Check size={20} className="text-lime" />
                    ) : (
                      <Copy size={20} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {result.emailErrors?.length ? (
              <div className="bg-sapin/4 border border-sapin/10 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-sapin/70 mb-1">
                  Email de confirmation non reçu ?
                </p>
                <p className="text-xs text-sapin/60 leading-relaxed">
                  Votre réservation est bien enregistrée et vos codes de retrait
                  sont valides. Conservez-les précieusement.
                </p>
                <p className="text-xs text-sapin/50 mt-2">
                  Un problème ?{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-sapin underline underline-offset-2 hover:text-sapin/70 transition-colors"
                  >
                    Contactez un administrateur
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <p className="text-xs text-sapin/40 text-center leading-relaxed">
                Un email de confirmation vous a été envoyé avec tous vos codes.
                <br />
                Présentez-les au commerçant lors du retrait.
              </p>
            )}
          </div>

          <div className="px-6 pb-5 shrink-0">
            <Button
              label="Fermer"
              onClick={onSuccess}
              variant="sapin"
              showArrow={false}
              className="w-full justify-center"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={isPending ? undefined : onClose}
    >
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
              <h3 className="font-black text-sapin text-sm">
                Planifier la récupération
              </h3>
              <p className="text-sapin/50 text-xs mt-0.5">
                {items.length} lot{items.length > 1 ? "s" : ""} ·{" "}
                {merchantGroups.length} commerçant
                {merchantGroups.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1 rounded-lg text-sapin/40 hover:text-sapin hover:bg-sapin/6 transition-colors disabled:opacity-30"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-sapin/50 uppercase tracking-widest mb-2">
              <Calendar size={12} />
              Date de récupération
            </label>
            <input
              type="date"
              min={minStr}
              max={maxStr}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSlotsByMerchant({});
              }}
              disabled={isPending}
              className="w-full border border-sapin/15 rounded-xl px-4 py-3 text-sm text-sapin font-medium focus:outline-none focus:border-sapin/40 focus:ring-2 focus:ring-sapin/10 disabled:opacity-50"
            />
            <p className="text-xs text-sapin/35 mt-1.5">
              Disponible jusqu'à 14 jours à l'avance
            </p>
          </div>

          {selectedDate &&
            merchantGroups.map((group) => {
              const slots = generate2hSlots(group.horaires, jourName);
              const chosen = slotsByMerchant[group.id_commercant];
              return (
                <div key={group.id_commercant}>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-sapin/50 uppercase tracking-widest mb-2">
                    <Clock size={12} />
                    {merchantGroups.length > 1
                      ? group.name_entreprise
                      : "Créneau horaire"}
                  </label>
                  {slots.length === 0 ? (
                    <p className="text-xs text-sapin/40 italic">
                      Aucune disponibilité ce jour-là pour{" "}
                      {group.name_entreprise}.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {slots.map((slot) => (
                        <button
                          key={slot.value}
                          type="button"
                          disabled={isPending}
                          onClick={() =>
                            selectSlot(group.id_commercant, slot.value)
                          }
                          className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                            chosen === slot.value
                              ? "bg-sapin text-cream border-sapin shadow-[2px_2px_0_0_#04251c]"
                              : "border-sapin/15 text-sapin hover:bg-sapin/6 hover:border-sapin/30"
                          } disabled:opacity-50`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

          {error && (
            <p className="text-xs text-peach font-medium bg-peach/8 border border-peach/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3 shrink-0">
          <Button
            label="Annuler"
            onClick={onClose}
            disabled={isPending}
            variant="sapin-outline"
            size="sm"
            showArrow={false}
            className="flex-1 justify-center"
          />
          <Button
            label={isPending ? "Réservation…" : "Confirmer"}
            onClick={handleSubmit}
            disabled={isPending || !allSlotsChosen}
            variant="sapin"
            size="sm"
            showArrow={false}
            className="flex-1 justify-center"
          />
        </div>
      </div>
    </div>
  );
}
