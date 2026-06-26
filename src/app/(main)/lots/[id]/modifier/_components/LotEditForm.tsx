"use client";

import { useActionState, useState } from "react";
import { modifierLot, type LotEditState } from "../actions";
import Input from "@/src/components/ui/primitives/Input";
import Dropdown from "@/src/components/ui/primitives/Dropdown";
import Button from "@/src/components/ui/primitives/Button";
import HorairesSection from "@/src/app/(main)/lots/declarer-lot/_components/HorairesSection";
import type { Horaire } from "@/src/components/ui/cards/LotCard";
import { LeafFull, Star } from "@/src/components/illustrations/assetsIllustrations";

const CATEGORY_OPTIONS = [
  "Invendus alimentaires",
  "Produits frais",
  "Matières premières",
  "Matériel de bureau",
  "Équipements",
  "Livres & Jouets",
  "Dons de vêtements",
  "Mobilier",
  "Autres ressources",
];

const CATEGORY_DROPDOWN_OPTIONS = [
  ...CATEGORY_OPTIONS.map((c) => ({ value: c, label: c })),
  { value: "autre", label: "Autre" },
];

export interface LotEditData {
  id_lot: number;
  adresse_recup: string;
  category: string;
  nature: string;
  quantity: number;
  dlc: string | null;
  montant_chiffre: number;
  montant_lettre: string;
  instructions: string | null;
  horaires: Horaire[];
}

export default function LotEditForm({ lot }: { lot: LotEditData }) {
  const modifierLotWithId = modifierLot.bind(null, lot.id_lot);
  const [state, action, pending] = useActionState(
    modifierLotWithId,
    {} as LotEditState,
  );

  const knownCategory = CATEGORY_OPTIONS.includes(lot.category);
  const [categoryValue, setCategoryValue] = useState(
    knownCategory ? lot.category : "autre",
  );
  const [montant, setMontant] = useState(String(lot.montant_chiffre ?? ""));
  const parsed = parseFloat(montant);
  const savings = montant && parsed > 0 ? parsed / 2 : null;
  const savingsDisplay =
    savings !== null
      ? new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(savings) + " €"
      : null;

  const isAutre = categoryValue === "autre";

  return (
    <form action={action} className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold text-sapin/40 uppercase tracking-widest">
          Détails du lot
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className={isAutre ? "" : "sm:col-span-2"}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-sapin">
                Catégorie <span className="text-peach">*</span>
              </label>
              <input type="hidden" name="category_select" value={categoryValue} />
              <Dropdown
                value={categoryValue}
                placeholder="Choisir une catégorie"
                options={CATEGORY_DROPDOWN_OPTIONS}
                onChange={setCategoryValue}
              />
            </div>
          </div>

          {isAutre && (
            <div>
              <Input
                id="category_custom"
                name="category_custom"
                label="Précisez la catégorie"
                required
                placeholder="Ma catégorie…"
                defaultValue={!knownCategory ? lot.category : ""}
              />
            </div>
          )}

          <div className="sm:col-span-2">
            <Input
              id="nature"
              name="nature"
              label="Nature du lot"
              required
              placeholder="Pains et viennoiseries du jour…"
              defaultValue={lot.nature}
            />
          </div>

          <div>
            <Input
              id="quantity"
              name="quantity"
              label="Volume (kg)"
              type="number"
              required
              min={0.01}
              step="0.01"
              placeholder="10"
              defaultValue={lot.quantity}
            />
          </div>

          <div>
            <Input
              id="DLC"
              name="DLC"
              label="Date limite de consommation"
              type="date"
              placeholder=""
              defaultValue={lot.dlc ?? ""}
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              id="adresse_recup"
              name="adresse_recup"
              label="Adresse de récupération du lot"
              required
              placeholder="12 rue de la Paix, 75001 Paris"
              defaultValue={lot.adresse_recup}
            />
          </div>
        </div>
      </section>

      <div className="h-px bg-sapin/8" />

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold text-sapin/40 uppercase tracking-widest">
          Valeur et logistique
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Input
              id="montant_chiffre"
              name="montant_chiffre"
              label="Valeur estimée (€)"
              type="number"
              required
              min={0}
              step="0.01"
              placeholder="150"
              value={montant}
              onChange={setMontant}
            />
          </div>
          <div>
            <Input
              id="montant_lettre"
              name="montant_lettre"
              label="Valeur en lettres"
              required
              placeholder="cent cinquante euros"
              defaultValue={lot.montant_lettre}
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-sapin border border-sapin shadow-[4px_4px_0_0_#04251c] px-5 py-4 flex items-center gap-4">
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            <LeafFull className="absolute top-5 -left-10 w-20 opacity-40" />
            <div className="absolute top-2.5 right-5 w-3.5 opacity-80">
              <Star color="#f16012" />
            </div>
            <div className="absolute bottom-2.5 right-16 w-2.5 opacity-80">
              <Star color="#c9f242" />
            </div>
          </div>
          <div className="relative z-10 flex-1 min-w-0">
            <p className="text-lg font-black text-lime tracking-widest mb-0.5">
              Grâce à Récoltéo
            </p>
            <p className="text-sm text-cream leading-snug">
              {"Économisez jusqu'à "}
              {savingsDisplay !== null ? (
                <span className="font-black text-lime">{savingsDisplay}</span>
              ) : (
                <span className="font-black text-lime">50% de la valeur estimée</span>
              )}
              {" sur vos impôts"}
            </p>
          </div>
        </div>

        <div>
          <Input
            id="instructions"
            name="instructions"
            label="Instructions (optionnel)"
            rows={3}
            placeholder="Contacter avant 18h, sonner au 2e…"
            defaultValue={lot.instructions ?? ""}
          />
        </div>
      </section>

      <div className="h-px bg-sapin/8" />

      <HorairesSection defaultValue={lot.horaires} />

      {state.error && (
        <p className="text-sm text-peach font-semibold bg-peach/8 border border-peach/20 rounded-xl px-4 py-3">
          {state.error}
        </p>
      )}

      <Button
        label={pending ? "Enregistrement…" : "Enregistrer les modifications"}
        type="submit"
        disabled={pending}
        variant="sapin"
        showArrow={!pending}
        className="w-full justify-center"
      />
    </form>
  );
}
