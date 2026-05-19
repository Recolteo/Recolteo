"use client";

import { useState } from "react";
import TabToggle from "@/src/components/ui/TabToggle";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const TABS = [
  { value: "connexion", label: "Connexion" },
  { value: "inscription", label: "Inscription" },
];

export default function LoginForm() {
  const [tab, setTab] = useState<"connexion" | "inscription">("connexion");

  return (
    <div className="w-full max-w-lg bg-cream border-2 border-sapin/20 rounded-2xl shadow-[6px_6px_0_0_#04251c] p-6 sm:p-8 flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-sapin text-4xl font-black tracking-tight">
          Récoltéo
        </h1>
        <p className="text-sapin/60 mt-2">
          Plateforme de mise en relation solidaire
        </p>
      </div>

      <TabToggle
        tabs={TABS}
        active={tab}
        onChange={(v) => setTab(v as typeof tab)}
        fullWidth
      />

      {tab === "connexion" ? <SignInForm /> : <SignUpForm />}
    </div>
  );
}
