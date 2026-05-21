import Input from "@/src/components/ui/primitives/Input";

export default function ValeurSection() {
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
        <div className="sm:col-span-2">
          <Input
            id="instructions"
            name="instructions"
            label="Instructions (optionnel)"
            rows={3}
            placeholder="Contacter avant 18h, sonner au 2e…"
          />
        </div>
      </div>
    </section>
  );
}
