import { Download, X, Upload } from "@deemlol/next-icons";

const SQUARE =
  "w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 disabled:opacity-40";

const Spinner = () => (
  <div className="w-3.5 h-3.5 rounded-full border-2 border-current/30 border-t-current animate-spin" />
);

export function DownloadAction({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Voir le document"
      className={`${SQUARE} border-2 border-sapin/20 text-sapin hover:bg-sapin hover:text-cream hover:border-sapin`}
    >
      <Download size={14} />
    </a>
  );
}

export function DeleteAction({
  onDelete,
  loading = false,
}: {
  onDelete: () => void;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onDelete}
      disabled={loading}
      title="Retirer le document"
      className={`${SQUARE} border-2 border-peach/25 text-peach hover:bg-peach hover:text-cream hover:border-peach`}
    >
      {loading ? <Spinner /> : <X size={14} />}
    </button>
  );
}

export function UploadAction({
  onClick,
  loading = false,
}: {
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sapin text-cream text-xs font-bold hover:bg-sapin/80 transition-all shadow-[3px_3px_0_0_#04251c] disabled:opacity-50"
    >
      {loading ? <Spinner /> : <Upload size={20} />}
      {loading ? "Envoi…" : "Déposer"}
    </button>
  );
}
