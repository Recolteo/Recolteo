"use client";

import { useActionState } from "react";
import { signIn, type ActionState } from "../actions";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";

export default function SignInForm() {
  const [state, action, pending] = useActionState(signIn, {} as ActionState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Input
        id="email-in"
        name="email"
        label="Adresse email"
        type="email"
        required
        placeholder="E-mail"
      />
      <Input
        id="password-in"
        name="password"
        label="Mot de passe"
        type="password"
        required
        placeholder="••••••••"
      />

      {state.error && (
        <p className="text-sm text-peach font-semibold bg-peach/8 border border-peach/20 rounded-xl px-4 py-3">
          {state.error}
        </p>
      )}

      <Button
        label={pending ? "Connexion…" : "Se connecter"}
        type="submit"
        disabled={pending}
        variant="sapin"
        className="mt-2 w-full justify-center"
      />
    </form>
  );
}
