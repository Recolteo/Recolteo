import Input from "@/src/components/ui/primitives/Input";
import Dropdown from "@/src/components/ui/primitives/Dropdown";

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
  "Autre",
];

const CATEGORY_DROPDOWN_OPTIONS = CATEGORY_OPTIONS.map((c) => ({
  value: c === "Autre" ? "autre" : c,
  label: c,
}));

interface Props {
  categoryValue: string;
  onCategoryChange: (value: string) => void;
}

export default function LotDetailsSection({
  categoryValue,
  onCategoryChange,
}: Props) {
  const isAutre = categoryValue === "autre";

  return (
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
              onChange={onCategoryChange}
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
