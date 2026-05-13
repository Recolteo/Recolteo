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
    <div className="flex items-start gap-5 bg-white border border-sapin/8 rounded-2xl px-6 py-5 transition-transform duration-200 hover:translate-x-1.5 hover:-translate-y-1">
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
