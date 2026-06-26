"use client";

import { useActionState, useState } from "react";
import { modifierLot, type LotEditState } from "../actions";
import Input from "@/src/components/ui/primitives/Input";
import Button from "@/src/components/ui/primitives/Button";
import HorairesSection from "@/src/app/(main)/lots/declarer-lot/_components/HorairesSection";
import type { Horaire } from "@/src/components/ui/cards/LotCard";

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
              <label
                htmlFor="category_select"
                className="text-sm font-semibold text-sapin"
              >
                Catégorie <span className="text-peach">*</span>
              </label>
              <select
                id="category_select"
                name="category_select"
                required
                value={categoryValue}
                onChange={(e) => setCategoryValue(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-sapin/20 bg-white focus:border-sapin focus:outline-none transition-colors text-sm font-medium text-sapin"
              >
                <option value="" disabled>
                  Choisir une catégorie
                </option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="autre">Autre</option>
              </select>
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
              defaultValue={lot.montant_chiffre}
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
          <div className="sm:col-span-2">
            <Input
              id="instructions"
              name="instructions"
              label="Instructions (optionnel)"
              rows={3}
              placeholder="Contacter avant 18h, sonner au 2e…"
              defaultValue={lot.instructions ?? ""}
            />
          </div>
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
