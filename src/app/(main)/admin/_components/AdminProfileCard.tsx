import { Mail, Phone, Clock, Check, Trash2, FileText } from "@deemlol/next-icons";
import { validateProfile, rejectProfile, approveDocument } from "../actions";
import { DOC_LABELS } from "@/src/lib/supabase/documents-types";
import type { DocItem } from "./types";

interface Detail {
  label: string;
  value: string;
}

interface AdminProfileCardProps {
  type: "commercant" | "association";
  id: number;
  name: string;
  email: string;
  tel: string;
  details: Detail[];
  createdAt: string;
  showActions?: boolean;
  isValidated?: boolean;
  subscriptionActive?: boolean;
  docs?: DocItem[];
  extraFooter?: React.ReactNode;
}

export default function AdminProfileCard({
  type,
  id,
  name,
  email,
  tel,
  details,
  createdAt,
  showActions = true,
  isValidated,
  subscriptionActive,
  docs,
  extraFooter,
}: AdminProfileCardProps) {
  const isCommercant = type === "commercant";
  const date = new Date(createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative bg-white border-2 border-sapin/10 rounded-2xl overflow-hidden shadow-[4px_4px_0_0_rgba(6,87,63,0.08)] flex flex-col">
      <div className="p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${isCommercant
                    ? "bg-peach/10 text-peach border border-peach/20"
                    : "bg-lime/30 text-sapin border border-lime/50"
                  }`}
              >
                {isCommercant ? "Commerçant" : "Association"}
              </span>
              {isValidated !== undefined && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${isValidated
                      ? "bg-sapin/10 text-sapin border border-sapin/20"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                    }`}
                >
                  {isValidated ? "Validé" : "En attente"}
                </span>
              )}
              {subscriptionActive !== undefined && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${subscriptionActive
                      ? "bg-sapin/10 text-sapin border border-sapin/20"
                      : "bg-sapin/5 text-sapin/40 border border-sapin/10"
                    }`}
                >
                  {subscriptionActive ? "Abonnement actif" : "Abonnement inactif"}
                </span>
              )}
            </div>
            <h3 className="font-black text-sapin truncate">{name}</h3>
          </div>
          <div className="flex items-center gap-1.5 text-sapin/40 shrink-0">
            <Clock size={20} />
            <span className="text-sm">{date}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-sapin/60 min-w-0">
            <Mail size={20} className="shrink-0 text-sapin/40" />
            <span className="text-sm truncate">{email}</span>
          </div>
          <div className="flex items-center gap-2 text-sapin/60 shrink-0">
            <Phone size={20} className="shrink-0 text-sapin/40" />
            <span className="text-sm">{tel}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {details.map(({ label, value }) => (
            <div
              key={label}
              className="bg-sapin/5 border border-sapin/5 rounded-xl px-3 py-2.5"
            >
              <p className="text-[10px] font-bold text-sapin/40 uppercase tracking-widest mb-0.5">
                {label}
              </p>
              <p className="text-sm font-semibold text-sapin leading-snug">
                {value}
              </p>
            </div>
          ))}
        </div>

        {showActions ? (
          <div className="flex gap-3 pt-1 border-t border-sapin/8">
            <form action={validateProfile} className="flex-1">
              <input type="hidden" name="type" value={type} />
              <input type="hidden" name="id" value={id} />
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sapin text-cream text-sm font-bold border-2 border-sapin shadow-[3px_3px_0_0_#04251c] hover:bg-sapin/90 active:scale-[0.98] transition-all"
              >
                <Check size={20} />
                Valider
              </button>
            </form>
            <form action={rejectProfile}>
              <input type="hidden" name="type" value={type} />
              <input type="hidden" name="id" value={id} />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-peach/30 text-peach text-sm font-bold hover:bg-peach hover:text-cream hover:border-peach hover:shadow-[3px_3px_0_0_#d54a00] active:scale-[0.98] transition-all"
              >
                <Trash2 size={20} />
                Rejeter
              </button>
            </form>
          </div>
        ) : (
          <div className="pt-1 border-t border-sapin/8 flex flex-col gap-3">
            {docs && docs.length > 0 ? (
              <>
                <p className="text-xs font-bold text-sapin uppercase tracking-widest flex items-center gap-1.5">
                  <FileText size={12} />
                  Documents
                </p>
                <div className="flex flex-col gap-2">
                  {docs.map((doc) => (
                    <div key={doc.type} className="flex items-center gap-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sapin text-cream text-xs font-bold border-2 border-sapin shadow-[2px_2px_0_0_#04251c] hover:bg-sapin/90 active:scale-[0.98] transition-all"
                      >
                        <FileText size={12} />
                        {DOC_LABELS[doc.type]}
                      </a>
                      {doc.validated ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime border border-sapin/20 text-sapin text-xs font-bold">
                          <Check size={11} />
                          Approuvé
                        </span>
                      ) : (
                        <form action={approveDocument}>
                          <input type="hidden" name="entityType" value={type} />
                          <input type="hidden" name="entityId" value={id} />
                          <input type="hidden" name="docType" value={doc.type} />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border-2 border-sapin/20 text-sapin/60 text-xs font-bold hover:bg-sapin hover:text-cream hover:border-sapin active:scale-[0.98] transition-all"
                          >
                            Approuver
                          </button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-sapin italic">Aucun document déposé</p>
            )}
            {extraFooter}
          </div>
        )}
      </div>
    </div>
  );
}
