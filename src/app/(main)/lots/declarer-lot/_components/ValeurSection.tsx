"use client";

import { useState } from "react";
import Input from "@/src/components/ui/primitives/Input";
import { LeafFull, Star } from "@/src/components/illustrations/assetsIllustrations";

export default function ValeurSection() {
  const [montant, setMontant] = useState<string>("");

  const parsed = parseFloat(montant);
  const savings = montant && parsed > 0 ? parsed / 2 : null;
  const savingsDisplay =
    savings !== null
      ? new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(savings) + " €"
      : null;

  return (
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
          />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-sapin border border-sapin shadow-[4px_4px_0_0_#04251c] px-5 py-4 flex items-center gap-4">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <LeafFull className="absolute top-5 left-[-40px] w-20 opacity-40" />
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
              <span className="font-black text-lime">
                {savingsDisplay}
              </span>
            ) : (
              <span className="font-black text-lime">
                50% de la valeur estimée
              </span>
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
        />
      </div>
    </section>
  );
}
