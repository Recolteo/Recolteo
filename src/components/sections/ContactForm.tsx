"use client";

import { useActionState } from "react";
import {
  sendContactEmail,
  type ContactState,
} from "@/src/app/(public)/contact/actions";
import { Check } from "@deemlol/next-icons";
import Input from "@/src/components/ui/primitives/Input";
import Select from "@/src/components/ui/primitives/Select";
import Button from "@/src/components/ui/primitives/Button";
import Reveal from "@/src/components/animations/Reveal";

export default function ContactForm() {
  const [state, action, pending] = useActionState(
    sendContactEmail,
    {} as ContactState,
  );

  if (state.success) {
    return (
      <Reveal>
        <div className="max-w-xl mx-auto text-center px-4 py-16">
          <div className="w-16 h-16 rounded-full bg-lime border border-sapin shadow-[4px_4px_0_0_#06573F] flex items-center justify-center mx-auto mb-6 text-sapin">
            <Check size={28} />
          </div>
          <h2 className="text-2xl font-black text-sapin mb-3">
            Message envoyé !
          </h2>
          <p className="text-sapin/70">
            Nous avons bien reçu votre message et vous répondrons dans les plus
            brefs délais.
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
      <Reveal>
        <div className="max-w-xl mx-auto">
          <form action={action} className="flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                id="nom"
                name="nom"
                label="Nom complet"
                required
                placeholder="Jean Dupont"
              />
              <Input
                id="email"
                name="email"
                label="Email"
                type="email"
                required
                placeholder="E-mail"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                id="entreprise"
                name="entreprise"
                label="Nom de l'entreprise"
                placeholder="Acme SARL"
              />
              <Input
                id="telephone"
                name="telephone"
                label="Téléphone"
                type="tel"
                placeholder="+33 6 00 00 00 00"
              />
            </div>

            <Select
              id="type_demande"
              name="type_demande"
              label="Type de demande"
              required
              placeholder="Sélectionnez un type…"
              options={[
                { value: "technique", label: "Problème technique" },
                { value: "facturation", label: "Facturation" },
                { value: "compte", label: "Mon compte" },
                { value: "partenariat", label: "Partenariat" },
                { value: "autre", label: "Autre" },
              ]}
            />

            <Input
              id="sujet"
              name="sujet"
              label="Sujet"
              placeholder="Votre sujet…"
            />

            <Input
              id="message"
              name="message"
              label="Message"
              required
              placeholder="Décrivez votre demande…"
              rows={6}
            />

            {state.error && (
              <p className="text-sm text-peach font-semibold bg-peach/8 border border-peach/20 rounded-xl px-4 py-3">
                {state.error}
              </p>
            )}

            <Button
              label={pending ? "Envoi en cours…" : "Envoyer le message"}
              type="submit"
              variant="sapin"
              disabled={pending}
              className="w-full justify-center mt-1"
            />
          </form>
        </div>
      </Reveal>
    </section>
  );
}
