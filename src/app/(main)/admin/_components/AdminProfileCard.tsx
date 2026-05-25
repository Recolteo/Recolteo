import { Mail, Phone, Clock, Check, Trash2 } from "@deemlol/next-icons";
import { validateProfile, rejectProfile } from "../actions";

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
}

export default function AdminProfileCard({
  type,
  id,
  name,
  email,
  tel,
  details,
  createdAt,
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
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${
                  isCommercant
                    ? "bg-peach/10 text-peach border border-peach/20"
                    : "bg-lime/30 text-sapin border border-lime/50"
                }`}
              >
                {isCommercant ? "Commerçant" : "Association"}
              </span>
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
      </div>
    </div>
  );
}
