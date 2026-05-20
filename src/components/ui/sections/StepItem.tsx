import { ReactNode } from "react";

interface StepItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  isLast: boolean;
  accent: "sapin" | "peach";
}

export default function StepItem({ icon, title, description, isLast, accent }: StepItemProps) {
  const bubble = accent === "sapin" ? "bg-lime text-sapin border border-sapin shadow-[2px_2px_0_0_#06573F]" : "bg-peach text-white border border-[#d54a00] shadow-[2px_2px_0_0_#d54a00]";
  const dashed = accent === "sapin" ? "border-sapin/25" : "border-peach/30 ";

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bubble}`}>
          {icon}
        </div>
        {!isLast && (
          <div className={`flex-1 my-2 border-l border-dashed ${dashed}`} />
        )}
      </div>

      <div className={isLast ? "pb-0" : "pb-7"}>
        <p className="font-bold text-sm text-sapin mb-1 leading-snug">{title}</p>
        <p className="text-sm text-sapin/50 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
