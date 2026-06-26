"use client";

import { useState } from "react";
import { useActionState } from "react";
import { notifyBreach, type BreachState } from "@/src/lib/breach-notification";
import Input from "@/src/components/ui/primitives/Input";
import Select from "@/src/components/ui/primitives/Select";
import Checkbox from "@/src/components/ui/primitives/Checkbox";
import Button from "@/src/components/ui/primitives/Button";

const INITIAL: BreachState = {};

const SEVERITY_OPTIONS = [
  { value: "low", label: "Faible — risque limité, documentation interne" },
  { value: "high", label: "Élevée — notification CNIL requise" },
  { value: "critical", label: "Critique — notification CNIL + utilisateurs obligatoire" },
];

export default function BreachTab() {
  const [state, action, pending] = useActionState(notifyBreach, INITIAL);
  const [notifyUsers, setNotifyUsers] = useState(false);

  return (
    <div className="flex flex-col gap-5 pt-2">
      <div className="rounded-xl bg-peach/10 border border-peach/25 px-4 py-3">
        <p className="text-sm font-semibold text-peach">Procédure d'incident RGPD — Art. 33 &amp; 34</p>
        <p className="text-xs text-peach/70 mt-0.5 leading-relaxed">
          Toute violation de données doit être notifiée à la CNIL dans les <strong>72 heures</strong>.
          Ce formulaire déclenche les notifications automatiques et constitue une trace horodatée.
        </p>
      </div>

      {state.success && (
        <div className="rounded-xl bg-lime border border-sapin/20 px-4 py-3">
          <p className="font-semibold text-sapin text-sm">Notifications envoyées.</p>
          <p className="text-sapin/60 text-xs mt-0.5">
            Incident enregistré le {state.detectedAt?.slice(0, 19).replace("T", " ")} UTC
          </p>
          <a
            href="https://notifications.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sapin underline text-xs mt-1 inline-block"
          >
            → Déclarer maintenant à la CNIL
          </a>
        </div>
      )}

      {state.error && (
        <p className="text-sm text-peach font-semibold">{state.error}</p>
      )}

      <form action={action} className="flex flex-col gap-4">
        <Select
          id="severity"
          name="severity"
          label="Sévérité"
          options={SEVERITY_OPTIONS}
          required
        />

        <Input
          id="affected_data"
          name="affected_data"
          label="Données concernées"
          required
          placeholder="Ex : adresses email, noms, numéros de téléphone…"
        />

        <Input
          id="description"
          name="description"
          label="Description de l'incident"
          required
          rows={5}
          placeholder="Nature de la violation, circonstances, périmètre estimé, mesures déjà prises…"
        />

        <input type="hidden" name="notify_users" value={notifyUsers ? "on" : ""} />
        <Checkbox
          id="notify_users"
          label="Notifier tous les utilisateurs par email"
          description="Uniquement activé pour sévérité haute ou critique (Art. 34)"
          checked={notifyUsers}
          onChange={setNotifyUsers}
        />

        <Button
          type="submit"
          label={pending ? "Envoi en cours…" : "Déclarer et envoyer les notifications"}
          variant="sapin"
          showArrow={false}
          disabled={pending}
          className="w-full justify-center"
        />
      </form>
    </div>
  );
}
