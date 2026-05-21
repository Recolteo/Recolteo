import Input from "@/src/components/ui/primitives/Input";

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

interface Props {
  categoryValue: string;
  onCategoryChange: (value: string) => void;
}

export default function LotDetailsSection({ categoryValue, onCategoryChange }: Props) {
  const isAutre = categoryValue === "autre";

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-bold text-sapin/40 uppercase tracking-widest">
        Détails du lot
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className={isAutre ? "" : "sm:col-span-2"}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category_select" className="text-sm font-semibold text-sapin">
              Catégorie <span className="text-peach">*</span>
            </label>
            <select
              id="category_select"
              name="category_select"
              required
              value={categoryValue}
              onChange={(e) => onCategoryChange(e.target.value)}
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
          />
        </div>

        <div>
          <Input
            id="DLC"
            name="DLC"
            label="Date limite de consommation"
            type="date"
            placeholder=""
          />
        </div>
      </div>
    </section>
  );
}
