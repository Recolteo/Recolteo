"use client";

import { useActionState, useState } from "react";
import { declarerLot, type LotActionState } from "../actions";
import Button from "@/src/components/ui/primitives/Button";
import CommercantSection from "./CommercantSection";
import LotDetailsSection from "./LotDetailsSection";
import ValeurSection from "./ValeurSection";
import HorairesSection from "./HorairesSection";
import type { LotFormProps, Merchant } from "./types";

export default function LotForm(props: LotFormProps) {
  const [state, action, pending] = useActionState(
    declarerLot,
    {} as LotActionState,
  );

  const isAdmin = props.mode === "admin";
  const initialMerchant = isAdmin
    ? ((props as { mode: "admin"; merchants: Merchant[] }).merchants[0] ?? null)
    : null;
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    initialMerchant,
  );
  const [categoryValue, setCategoryValue] = useState("");

  const merchantId = isAdmin
    ? (selectedMerchant?.id ?? 0)
    : (props as { mode: "commercant"; id: number }).id;
  const merchantName = isAdmin
    ? (selectedMerchant?.name ?? "")
    : (props as { mode: "commercant"; name: string }).name;
  const merchantAdresse = isAdmin
    ? (selectedMerchant?.adresse ?? "")
    : (props as { mode: "commercant"; adresse: string }).adresse;

  return (
    <form action={action} className="flex flex-col gap-8">
      <input type="hidden" name="id_commercant" value={merchantId} />

      <CommercantSection
        isAdmin={isAdmin}
        merchants={
          isAdmin
            ? (props as { mode: "admin"; merchants: Merchant[] }).merchants
            : []
        }
        selectedMerchant={selectedMerchant}
        onMerchantChange={setSelectedMerchant}
        merchantId={merchantId}
        merchantName={merchantName}
        merchantAdresse={merchantAdresse}
      />

      <div className="h-px bg-sapin/8" />

      <LotDetailsSection
        categoryValue={categoryValue}
        onCategoryChange={setCategoryValue}
      />

      <div className="h-px bg-sapin/8" />

      <ValeurSection />

      <div className="h-px bg-sapin/8" />

      <HorairesSection />

      {state.error && (
        <p className="text-sm text-peach font-semibold bg-peach/8 border border-peach/20 rounded-xl px-4 py-3">
          {state.error}
        </p>
      )}

      <Button
        label={pending ? "Envoi en cours…" : "Déclarer le lot"}
        type="submit"
        disabled={pending}
        variant="sapin"
        showArrow={!pending}
        className="w-full justify-center"
      />
    </form>
  );
}
