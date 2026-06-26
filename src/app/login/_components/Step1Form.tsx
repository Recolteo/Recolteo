import Input from "@/src/components/ui/primitives/Input";
import Button from "@/src/components/ui/primitives/Button";
import TabToggle from "@/src/components/ui/primitives/TabToggle";
import { formatTel, ROLE_TABS, type Step1Data } from "./useSignUpForm";

type Props = {
  s1: Step1Data;
  setS1: React.Dispatch<React.SetStateAction<Step1Data>>;
  telDisplay: string;
  setTelDisplay: (v: string) => void;
  localError?: string;
  onSubmit: (e: { preventDefault(): void; currentTarget: HTMLFormElement }) => void;
};

export function Step1Form({ s1, setS1, telDisplay, setTelDisplay, localError, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-sapin">
          Type de compte <span className="text-peach">*</span>
        </p>
        <TabToggle
          tabs={ROLE_TABS}
          active={s1.role}
          onChange={(v) => setS1((p) => ({ ...p, role: v as Step1Data["role"] }))}
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
          value={telDisplay}
          onChange={(v) => setTelDisplay(formatTel(v))}
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
  );
}

function ErrorMsg({ text }: { text: string }) {
  return (
    <p className="text-sm text-peach font-semibold bg-peach/8 border border-peach/20 rounded-xl px-4 py-3">
      {text}
    </p>
  );
}
