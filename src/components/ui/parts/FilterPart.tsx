import type { ReactNode } from "react";

interface FilterPartProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  isActive?: boolean;
  children: ReactNode;
}

export default function FilterPart({
  icon,
  title,
  subtitle,
  isActive = false,
  children,
}: FilterPartProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 border rounded-xl shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0 transition-colors ${isActive
              ? "bg-lime border-sapin text-sapin"
              : "bg-lime/40 border-sapin/40 text-sapin/50"
            }`}
        >
          {icon}
        </div>
        <div>
          <p className="font-bold text-sapin leading-tight">{title}</p>
          <p className="text-sapin/60 text-sm leading-snug mt-0.5">{subtitle}</p>
        </div>
      </div>

      {children}
    </div>
  );
}
