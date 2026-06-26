import Btn from "./Button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  btnLabel?: string;
  btnHref?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  btnLabel,
  btnHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-14 text-center">
      <div className="w-16 h-16 rounded-2xl bg-sapin/5 border border-dashed border-sapin/20 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="font-bold text-sapin/60">{title}</p>
        <p className="text-sapin/40 mt-1 max-w-sm">{description}</p>
      </div>
      {btnLabel && btnHref && (
        <Btn
          label={btnLabel}
          href={btnHref}
          variant="sapin"
          className="justify-center"
        />
      )}
    </div>
  );
}
