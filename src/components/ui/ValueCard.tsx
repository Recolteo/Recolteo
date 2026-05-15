import { type ReactNode } from "react";

interface ValueCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function ValueCard({
  icon,
  title,
  description,
}: ValueCardProps) {
  return (
    <div className="flex items-start gap-5 bg-lime/5 border border-sapin rounded-2xl shadow-[4px_4px_0_0_#06573F] px-6 py-5 transition-all duration-200 hover:-translate-y-2">
      <div className="w-10 h-10 bg-lime rounded-xl flex items-center justify-center shrink-0 text-sapin mt-0.5">
        {icon}
      </div>
      <div>
        <h3 className="text-sapin font-bold text-base mb-1">{title}</h3>
        <p className="text-sapin/60 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
