"use client";

import { useState, useTransition } from "react";
import { Mail, Phone, MapPin, ShoppingBag, Users, X } from "@deemlol/next-icons";
import Button from "@/src/components/ui/primitives/Button";
import { validerCollectAdmin, type CollectAdminItem } from "../../actions";

interface Props {
  item: CollectAdminItem;
  onValidated: () => void;
  onClose?: () => void;
}

export default function CollecteAdminCard({ item, onValidated, onClose }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    if (code.length !== 8) {
      setError("Le code doit contenir 8 chiffres.");
      return;
    }
    startTransition(async () => {
      const result = await validerCollectAdmin(item.id_collect, code);
      if (result.success) onValidated();
      else setError(result.error);
    });
  };

  return (
    <article className="bg-white border-2 border-sapin/10 rounded-2xl shadow-[4px_4px_0_0_rgba(6,87,63,0.08)] overflow-hidden flex flex-col">
      <div className="flex items-start gap-3 p-5 border-b border-sapin/8 bg-sapin/2">
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-sapin leading-tight truncate">
            {item.lot?.nature ?? "Lot"}
          </h2>
          <p className="text-sm text-sapin/60 mt-0.5">
            volume : {item.lot?.quantity}kg
          </p>
          <p className="text-sm text-sapin/60 mt-1">
            {item.lot?.montant_chiffre} €
          </p>
          <time
            dateTime={item.creneau}
            className="text-sm text-sapin/80 mt-1 font-semibold block"
          >
            {new Date(item.creneau).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl border-2 border-sapin/15 text-sapin/50 hover:border-sapin/40 hover:text-sapin hover:bg-sapin/10 transition-all duration-200"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-sapin/8">
        <div className="p-5 flex flex-col gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-peach/10 text-peach border border-peach/20 self-start">
            <ShoppingBag size={12} />
            Commerçant
          </span>
          {item.commercant ? (
            <div className="flex flex-col gap-2">
              <p className="font-bold text-sapin text-xl">
                {item.commercant.name_entreprise}
              </p>
              <address className="not-italic flex flex-col gap-1.5">
                <span className="flex items-center gap-2 text-sapin/80 text-sm">
                  <Mail size={20} className="shrink-0 text-sapin/80" />
                  <span className="truncate">{item.commercant.email}</span>
                </span>
                {item.commercant.adresse && (
                  <span className="flex items-start gap-2 text-sapin/80 text-sm">
                    <MapPin
                      size={20}
                      className="shrink-0 text-sapin/80 mt-0.5"
                    />
                    <span>{item.commercant.adresse}</span>
                  </span>
                )}
              </address>
              {item.lot?.adresse_recup && (
                <dl className="bg-sapin/5 border border-sapin/8 rounded-xl px-3 py-2 mt-1">
                  <dt className="text-[10px] font-bold text-sapin/60 uppercase tracking-widest mb-0.5">
                    Adresse de récupération
                  </dt>
                  <dd className="text-sm text-sapin font-semibold">
                    {item.lot.adresse_recup}
                  </dd>
                </dl>
              )}
            </div>
          ) : (
            <p className="text-xl text-sapin/80 italic">
              Commerçant introuvable
            </p>
          )}
        </div>

        <div className="p-5 flex flex-col gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-lime/30 text-sapin border border-lime/50 self-start">
            <Users size={12} />
            Association
          </span>
          {item.association ? (
            <div className="flex flex-col gap-2">
              <p className="font-bold text-sapin text-xl">
                {item.association.name_entreprise}
              </p>
              <address className="not-italic flex flex-col gap-1.5">
                {item.association.email && (
                  <span className="flex items-center gap-2 text-sapin/80 text-sm">
                    <Mail size={20} className="shrink-0 text-sapin/80" />
                    <span className="truncate">{item.association.email}</span>
                  </span>
                )}
                {item.association.tel && (
                  <span className="flex items-center gap-2 text-sapin/80 text-sm">
                    <Phone size={20} className="shrink-0 text-sapin/80" />
                    <span>{item.association.tel}</span>
                  </span>
                )}
                {item.association.adresse && (
                  <span className="flex items-start gap-2 text-sapin/80 text-sm">
                    <MapPin
                      size={20}
                      className="shrink-0 text-sapin/80 mt-0.5"
                    />
                    <span>{item.association.adresse}</span>
                  </span>
                )}
              </address>
            </div>
          ) : (
            <p className="text-xl text-sapin/80 italic">
              Association introuvable
            </p>
          )}
        </div>
      </div>

      {!onClose && (
        <dl className="px-5 py-4 border-t border-sapin/8 bg-lime/5">
          <dt className="text-[10px] font-bold text-sapin/60 uppercase tracking-widest mb-1">
            Code de retrait (visible admin)
          </dt>
          <dd className="text-2xl font-black tracking-[0.4em] text-sapin">
            {item.code_retrait}
          </dd>
        </dl>
      )}

      {!onClose && (
      <form
        onSubmit={handleSubmit}
        className="p-5 border-t border-sapin/8 flex flex-col gap-3"
      >
        <label
          htmlFor={`code-${item.id_collect}`}
          className="text-xs font-semibold text-sapin/60 uppercase tracking-widest"
        >
          Saisir le code pour valider
        </label>
        <input
          id={`code-${item.id_collect}`}
          type="text"
          inputMode="numeric"
          maxLength={8}
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, "").slice(0, 8));
            setError(null);
          }}
          placeholder="• • • • • • • •"
          disabled={isPending}
          className="w-full px-4 py-3 rounded-xl border-2 border-sapin/20 bg-white focus:border-sapin focus:outline-none transition-colors text-center text-2xl font-black tracking-[0.4em] text-sapin placeholder:text-sapin/20 placeholder:text-sm placeholder:tracking-widest"
        />
        {error && (
          <p
            role="alert"
            className="text-xs text-peach font-semibold text-center -mt-1"
          >
            {error}
          </p>
        )}
        <Button
          label={isPending ? "Validation…" : "Confirmer et envoyer les mails"}
          type="submit"
          variant="sapin"
          showArrow={false}
          disabled={isPending || code.length !== 8}
          className="w-full justify-center"
        />
      </form>
      )}
    </article>
  );
}
