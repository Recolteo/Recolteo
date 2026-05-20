"use client";

import { Fragment, useActionState, useState } from "react";
import { signUp, type ActionState } from "../actions";
import Input from "@/src/components/ui/primitives/Input";
import Button from "@/src/components/ui/primitives/Button";
import TabToggle from "@/src/components/ui/primitives/TabToggle";

type Role = "commercant" | "association";

const ROLE_TABS = [
  { value: "commercant", label: "Commerçant" },
  { value: "association", label: "Association" },
];

type Step1Data = {
  role: Role;
  nom: string;
  email: string;
  tel: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, {} as ActionState);
  const [step, setStep] = useState<1 | 2>(1);
  const [s1, setS1] = useState<Step1Data>({
    role: "commercant",
    nom: "",
    email: "",
    tel: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState<string>();

  function handleStep1(e: {
    preventDefault(): void;
    currentTarget: HTMLFormElement;
  }) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Step1Data = {
      role: s1.role,
      nom: fd.get("nom") as string,
      email: fd.get("email") as string,
      tel: fd.get("tel") as string,
      password: fd.get("password") as string,
      confirmPassword: fd.get("confirmPassword") as string,
    };
    if (data.password !== data.confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (data.password.length < 8) {
      setLocalError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLocalError(undefined);
    setS1(data);
    setStep(2);
  }

  const isAsso = s1.role === "association";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        {([1, 2] as const).map((n, i) => (
          <Fragment key={n}>
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                step === n
                  ? "text-sapin"
                  : step > n
                    ? "text-sapin/60"
                    : "text-sapin/25"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                  step > n
                    ? "bg-sapin border-sapin text-cream"
                    : step === n
                      ? "border-sapin bg-sapin/10 text-sapin"
                      : "border-sapin/20 text-sapin/30"
                }`}
              >
                {step > n ? "✓" : n}
              </span>
              {n === 1 ? "Votre compte" : "Votre structure"}
            </div>
            {i === 0 && (
              <div
                key="sep"
                className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
                  step > 1 ? "bg-sapin/40" : "bg-sapin/10"
                }`}
              />
            )}
          </Fragment>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleStep1} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-sapin">
              Type de compte <span className="text-peach">*</span>
            </p>
            <TabToggle
              tabs={ROLE_TABS}
              active={s1.role}
              onChange={(v) => setS1((p) => ({ ...p, role: v as Role }))}
              fullWidth
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                id="nom"
                name="nom"
                label="Nom complet"
                required
                placeholder="Jean Dupont"
                defaultValue={s1.nom}
              />
            </div>
            <Input
              id="email-up"
              name="email"
              label="Email"
              type="email"
              required
              placeholder="E-mail"
              defaultValue={s1.email}
            />
            <Input
              id="tel"
              name="tel"
              label="Téléphone"
              type="tel"
              required
              placeholder="06 00 00 00 00"
              defaultValue={s1.tel}
            />
            <Input
              id="pwd"
              name="password"
              label="Mot de passe"
              type="password"
              required
              placeholder="Min. 8 caractères"
              defaultValue={s1.password}
            />
            <Input
              id="cpwd"
              name="confirmPassword"
              label="Confirmer"
              type="password"
              required
              placeholder="••••••••"
              defaultValue={s1.confirmPassword}
            />
          </div>

          {localError && <ErrorMsg text={localError} />}

          <Button
            label="Continuer"
            type="submit"
            variant="sapin"
            className="mt-1 w-full justify-center"
          />
        </form>
      )}

      {step === 2 && (
        <form action={action} className="flex flex-col gap-4">
          {(Object.keys(s1) as (keyof Step1Data)[]).map((k) => (
            <input key={k} type="hidden" name={k} value={s1[k]} />
          ))}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                id="name_entreprise"
                name="name_entreprise"
                label={isAsso ? "Nom de l'association" : "Nom de l'entreprise"}
                required
                placeholder={
                  isAsso ? "Les Restos du Cœur" : "Ma Boulangerie SAS"
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                id="adresse"
                name="adresse"
                label="Adresse"
                required
                placeholder="12 rue de la Paix, 75001 Paris"
              />
            </div>

            {isAsso ? (
              <>
                <Input
                  id="rna"
                  name="rna"
                  label="Numéro RNA"
                  required
                  placeholder="W751000000"
                />
                <Input
                  id="type_asso"
                  name="type_asso"
                  label="Type d'association"
                  required
                  placeholder="Aide alimentaire…"
                />
                <div className="sm:col-span-2">
                  <Input
                    id="rayon_action"
                    name="rayon_action"
                    label="Rayon d'action (km)"
                    type="number"
                    required
                    min={1}
                    max={500}
                    placeholder="20"
                  />
                </div>
              </>
            ) : (
              <>
                <Input
                  id="siret"
                  name="siret"
                  label="SIRET"
                  required
                  placeholder="123 456 789 00012"
                />
                <Input
                  id="type_activity"
                  name="type_activity"
                  label="Type d'activité"
                  required
                  placeholder="Boulangerie…"
                />
                <div className="sm:col-span-2">
                  <Input
                    id="forme_juridique"
                    name="forme_juridique"
                    label="Forme juridique"
                    required
                    placeholder="SAS, SARL, EI…"
                  />
                </div>
              </>
            )}
          </div>

          {state.error && <ErrorMsg text={state.error} />}

          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-3.5 rounded-xl border-2 border-sapin/20 text-sapin text-sm font-semibold hover:border-sapin/50 transition-colors"
            >
              ← Retour
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
      )}
    </div>
  );
}

function ErrorMsg({ text }: { text: string }) {
  return (
    <p className="text-sm text-peach font-semibold bg-peach/8 border border-peach/20 rounded-xl px-4 py-3">
      {text}
    </p>
  );
}
