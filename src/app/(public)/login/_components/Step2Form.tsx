import React from "react";
import Input from "@/src/components/ui/primitives/Input";
import Button from "@/src/components/ui/primitives/Button";
import Checkbox from "@/src/components/ui/primitives/Checkbox";
import Select from "@/src/components/ui/primitives/Select";
import CguCard from "@/src/components/ui/cards/CguCard";
import {
  ASSO_CATEGORIES,
  ASSO_TYPE_MAP,
  ASSO_TYPE_LABELS,
} from "@/src/lib/data/association-types";
import {
  type Step1Data,
  type Step2Data,
  type BanSuggestion,
} from "./useSignUpForm";
import { type ActionState } from "../actions";

type Props = {
  s1: Step1Data;
  s2: Step2Data;
  setS2: React.Dispatch<React.SetStateAction<Step2Data>>;
  isAsso: boolean;
  step2FormRef: React.RefObject<HTMLFormElement | null>;
  suggestionsRef: React.RefObject<HTMLDivElement | null>;
  banSuggestions: BanSuggestion[];
  handleRueChange: (v: string) => void;
  handleSelectSuggestion: (s: BanSuggestion) => void;
  acceptsCgu: boolean;
  setAcceptsCgu: (v: boolean) => void;
  localError?: string;
  state: ActionState;
  isTelError: boolean;
  pending: boolean;
  onSubmit: (e: {
    preventDefault(): void;
    currentTarget: HTMLFormElement;
  }) => void;
  onBack: () => void;
};

export function Step2Form({
  s1,
  s2,
  setS2,
  isAsso,
  step2FormRef,
  suggestionsRef,
  banSuggestions,
  handleRueChange,
  handleSelectSuggestion,
  acceptsCgu,
  setAcceptsCgu,
  localError,
  state,
  isTelError,
  pending,
  onSubmit,
  onBack,
}: Props) {
  return (
    <form
      ref={step2FormRef}
      onSubmit={onSubmit}
      className="flex flex-col gap-4"
    >
      {(Object.keys(s1) as (keyof Step1Data)[])
        .filter((k) => k !== "password" && k !== "confirmPassword")
        .map((k) => (
          <input key={k} type="hidden" name={k} value={s1[k]} />
        ))}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            id="name_entreprise"
            name="name_entreprise"
            label={isAsso ? "Nom de l'association" : "Nom de l'entreprise"}
            required
            placeholder={isAsso ? "Les Restos du Cœur" : "Ma Boulangerie SAS"}
            defaultValue={s2.name_entreprise}
          />
        </div>

        <div className="relative" ref={suggestionsRef}>
          <Input
            id="rue"
            name="rue"
            label="Rue"
            required
            placeholder="12 rue de la Paix"
            value={s2.rue}
            onChange={handleRueChange}
          />
          {banSuggestions.length > 0 && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-sapin/20 rounded-xl shadow-lg overflow-hidden">
              {banSuggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-full text-left px-4 py-2.5 text-sm text-sapin hover:bg-sapin/5 transition-colors border-b border-sapin/8 last:border-0"
                  onMouseDown={() => handleSelectSuggestion(s)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Input
          id="code_postal"
          name="code_postal"
          label="Code postal"
          required
          placeholder="75001"
          value={s2.code_postal}
          onChange={(v) => setS2((p) => ({ ...p, code_postal: v }))}
        />
        <div className="sm:col-span-2">
          <Input
            id="ville"
            name="ville"
            label="Ville"
            required
            placeholder="Paris"
            value={s2.ville}
            onChange={(v) => setS2((p) => ({ ...p, ville: v }))}
          />
        </div>

        {isAsso ? (
          <AssoFields s2={s2} setS2={setS2} />
        ) : (
          <CommercantFields s2={s2} />
        )}
      </div>

      <CguCard checked={acceptsCgu} onChange={setAcceptsCgu} />

      {(localError || (state.error && !isTelError)) && (
        <ErrorMsg text={localError ?? state.error!} />
      )}

      <div className="flex gap-3 mt-1">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3.5 rounded-xl border-2 border-sapin/20 text-sapin text-sm font-semibold hover:border-sapin/50 hover:bg-sapin/10 transition-colors duration-200"
        >
          Retour
        </button>
        <Button
          label={pending ? "Création…" : "Créer mon compte"}
          type="submit"
          disabled={pending}
          variant="sapin"
          className="flex-1 justify-center"
        />
      </div>
    </form>
  );
}

function AssoFields({
  s2,
  setS2,
}: {
  s2: Step2Data;
  setS2: React.Dispatch<React.SetStateAction<Step2Data>>;
}) {
  return (
    <>
      <div className="sm:col-span-2">
        <Input
          id="rna"
          name="rna"
          label="Numéro RNA"
          required
          placeholder="W751000000"
          defaultValue={s2.rna}
        />
      </div>

      <div className="sm:col-span-2 flex items-center gap-3">
        <span className="text-xs font-bold text-sapin/40 uppercase tracking-wider whitespace-nowrap">
          Statut juridique
        </span>
        <div className="flex-1 h-px bg-sapin/10" />
      </div>

      <div className="sm:col-span-2">
        <Select
          id="type_asso_cat"
          name="type_asso_cat"
          label="Catégorie"
          required
          placeholder="Sélectionnez une catégorie…"
          options={ASSO_CATEGORIES}
          value={s2.type_asso_cat}
          onChange={(v) =>
            setS2((p) => ({
              ...p,
              type_asso_cat: v,
              type_asso: "",
              date_reconnaissance: "",
              date_jo: "",
              date_agrement: "",
            }))
          }
        />
      </div>

      {s2.type_asso_cat && (
        <div className="sm:col-span-2">
          <Select
            id="type_asso"
            name="type_asso"
            label="Type d'association"
            required
            placeholder="Sélectionnez un type…"
            options={ASSO_TYPE_MAP[s2.type_asso_cat] ?? []}
            value={s2.type_asso}
            onChange={(v) =>
              setS2((p) => ({
                ...p,
                type_asso: v,
                date_reconnaissance: "",
                date_jo: "",
                date_agrement: "",
              }))
            }
          />
        </div>
      )}

      {s2.type_asso === "utilite_publique" && (
        <>
          <Input
            id="date_reconnaissance"
            name="date_reconnaissance"
            label="Date de la reconnaissance"
            type="date"
            required
            defaultValue={s2.date_reconnaissance}
          />
          <Input
            id="date_jo"
            name="date_jo"
            label="Date de publication au Journal Officiel"
            type="date"
            required
            defaultValue={s2.date_jo}
          />
        </>
      )}

      {(s2.type_asso === "agree_budget" || s2.type_asso === "patrimoine") && (
        <div className="sm:col-span-2">
          <Input
            id="date_agrement"
            name="date_agrement"
            label="Date d'agrément"
            type="date"
            required
            defaultValue={s2.date_agrement}
          />
        </div>
      )}

      <input
        type="hidden"
        name="type_asso_label"
        value={ASSO_TYPE_LABELS[s2.type_asso] ?? ""}
      />

      <div className="sm:col-span-2">
        <Checkbox
          id="accept_geolocation"
          name="accept_geolocation"
          label="Autoriser la géolocalisation de mon adresse"
          description="Votre adresse sera géocodée pour vous permettre de filtrer les lots par proximité. Modifiable à tout moment dans vos préférences cookies."
          checked={s2.accept_geolocation}
          onChange={(v) => setS2((p) => ({ ...p, accept_geolocation: v }))}
        />
      </div>
    </>
  );
}

function CommercantFields({ s2 }: { s2: Step2Data }) {
  return (
    <>
      <Input
        id="siret"
        name="siret"
        label="SIRET"
        required
        placeholder="123 456 789 00012"
        defaultValue={s2.siret}
      />
      <Input
        id="type_activity"
        name="type_activity"
        label="Type d'activité"
        required
        placeholder="Boulangerie…"
        defaultValue={s2.type_activity}
      />
      <div className="sm:col-span-2">
        <Input
          id="forme_juridique"
          name="forme_juridique"
          label="Forme juridique"
          required
          placeholder="SAS, SARL, EI…"
          defaultValue={s2.forme_juridique}
        />
      </div>
    </>
  );
}

function ErrorMsg({ text }: { text: string }) {
  return (
    <p className="text-sm text-peach font-semibold bg-peach/8 border border-peach/20 rounded-xl px-4 py-3">
      {text}
    </p>
  );
}
