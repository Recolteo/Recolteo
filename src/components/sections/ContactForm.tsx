"use client";

import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { ArrowRight } from "@deemlol/next-icons";
import Input from "../ui/Input";

const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export default function ContactForm() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<null | { type: "success" | "error"; text: string }>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!serviceId || !templateId || !publicKey) {
      setStatus({ type: "error", text: "La configuration EmailJS n'est pas définie. Merci de vérifier les variables d'environnement." });
      return;
    }

    setIsSending(true);
    setStatus(null);

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          company,
          from_email: email,
          message,
          to_email: "lorys3006@gmail.com",
          reply_to: email,
          subject: `Contact Recolteo - ${company || email}`,
        },
        publicKey,
      );

      setCompany("");
      setEmail("");
      setMessage("");
      setStatus({ type: "success", text: "Votre message a bien été envoyé !" });

      window.setTimeout(() => {
        setStatus(null);
      }, 5000);
    } catch (error) {
      console.error("EmailJS send error", error);
      setStatus({ type: "error", text: "Une erreur est survenue lors de l'envoi. Merci de réessayer plus tard." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="px-6 py-10 sm:px-10 lg:px-0">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-sapin/10 bg-white/90 p-8 shadow-[0_24px_60px_rgba(6,87,63,0.12)] backdrop-blur-xl sm:p-12">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-sapin/70">Contactez-nous</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">Envoyez-nous un message</h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm leading-7 text-sapin/80">
            Remplissez le formulaire ci-dessous pour nous contacter. Nous vous répondrons rapidement.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="company" className="mb-2 block text-sm font-semibold text-sapin">
                Nom de l'entreprise
              </label>
              <Input
                type="text"
                name="company"
                placeholder="Ex. Recolteo"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-sapin">
                Adresse e-mail
              </label>
              <Input
                type="email"
                name="email"
                placeholder="exemple@domaine.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-semibold text-sapin">
              Message
            </label>
            <Input
              type="textarea"
              name="message"
              placeholder="Écrivez votre message ici..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="group inline-flex items-center justify-center gap-2 self-start rounded-xl bg-sapin px-9 py-3.5 text-sm font-semibold text-cream transition hover:bg-sapin/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? "Envoi en cours..." : "Envoyer"}
            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {status && (
            <p
              className={`rounded-2xl border px-5 py-4 text-sm ${
                status.type === "success"
                  ? "border-lime/40 bg-lime/10 text-sapin"
                  : "border-peach/40 bg-peach/10 text-peach"
              }`}
              role="status"
              aria-live="polite"
            >
              {status.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

