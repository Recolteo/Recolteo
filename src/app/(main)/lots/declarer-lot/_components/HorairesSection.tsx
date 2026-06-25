"use client";

import { useState } from "react";
import { Plus, Trash2 } from "@deemlol/next-icons";
import Dropdown from "@/src/components/ui/primitives/Dropdown";
import Input from "@/src/components/ui/primitives/Input";
import type { Horaire } from "@/src/components/ui/cards/LotCard";

const JOURS_OPTIONS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
].map((j) => ({ value: j, label: j }));

export default function HorairesSection({
  defaultValue = [],
}: {
  defaultValue?: Horaire[];
}) {
  const [horaires, setHoraires] = useState<Horaire[]>(defaultValue);

  function add() {
    setHoraires((prev) => [
      ...prev,
      { jour: "Lundi", debut: "08:00", fin: "18:00" },
    ]);
  }

  function remove(index: number) {
    setHoraires((prev) => prev.filter((_, i) => i !== index));
  }

  function update(index: number, field: keyof Horaire, value: string) {
    setHoraires((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-sapin/40 uppercase tracking-widest">
          Disponibilités
        </h2>
        <button
          type="button"
          onClick={add}
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
            className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end bg-sapin/3 border border-sapin/8 rounded-xl px-4 py-3"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-sapin">Jour</label>
              <Dropdown
                value={h.jour}
                options={JOURS_OPTIONS}
                onChange={(v) => update(i, "jour", v)}
              />
            </div>
            <Input
              id={`horaire_debut_${i}`}
              name={`horaire_debut_${i}`}
              label="De"
              type="time"
              value={h.debut}
              onChange={(v) => update(i, "debut", v)}
            />
            <Input
              id={`horaire_fin_${i}`}
              name={`horaire_fin_${i}`}
              label="À"
              type="time"
              value={h.fin}
              onChange={(v) => update(i, "fin", v)}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="mb-0.5 p-2 rounded-xl text-peach/60 hover:text-peach hover:bg-peach/8 transition-colors self-end"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <input type="hidden" name="horaires" value={JSON.stringify(horaires)} />
    </div>
  );
}
