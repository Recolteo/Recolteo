import Input from "@/src/components/ui/primitives/Input";
import type { Merchant } from "./types";

interface Props {
  isAdmin: boolean;
  merchants: Merchant[];
  selectedMerchant: Merchant | null;
  onMerchantChange: (m: Merchant | null) => void;
  merchantId: number;
  merchantName: string;
  merchantAdresse: string;
}

export default function CommercantSection({
  isAdmin,
  merchants,
  selectedMerchant,
  onMerchantChange,
  merchantId,
  merchantName,
  merchantAdresse,
}: Props) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-bold text-sapin/40 uppercase tracking-widest">
        Informations entreprise
      </h2>

      {isAdmin && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="merchant_select" className="text-sm font-semibold text-sapin">
            Commerçant <span className="text-peach">*</span>
          </label>
          <select
            id="merchant_select"
            value={selectedMerchant?.id ?? ""}
            onChange={(e) =>
              onMerchantChange(
                merchants.find((m) => m.id === parseInt(e.target.value, 10)) ?? null,
              )
            }
            className="px-4 py-3 rounded-xl border-2 border-sapin/20 bg-white focus:border-sapin focus:outline-none transition-colors text-sm font-medium text-sapin"
          >
            {merchants.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            key={`name-${merchantId}`}
            id="name_entreprise"
            name="name_entreprise"
            label="Nom de l'entreprise"
            required
            defaultValue={merchantName}
            placeholder="Ma Boulangerie SAS"
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            key={`adresse-${merchantId}`}
            id="adresse"
            name="adresse"
            label="Adresse de l'entreprise"
            required
            defaultValue={merchantAdresse}
            placeholder="12 rue de la Paix, 75001 Paris"
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            id="adresse_recup"
            name="adresse_recup"
            label="Adresse de récupération du lot"
            required
            placeholder="12 rue de la Paix, 75001 Paris"
          />
        </div>
      </div>
    </section>
  );
}
