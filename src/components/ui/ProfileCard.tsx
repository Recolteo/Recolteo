import {
  Gift,
  Users,
  FileText,
  MapPin,
  Send,
  CheckCircle,
} from "@deemlol/next-icons";
import StepItem from "./StepItem";
import Btn from "./Button";
import type { ProfileDef, IconName } from "../../lib/data/how-it-works";
import { ReactNode } from "react";

const iconMap: Record<IconName, ReactNode> = {
  Gift: <Gift size={20} />,
  Users: <Users size={20} />,
  FileText: <FileText size={20} />,
  MapPin: <MapPin size={20} />,
  Send: <Send size={20} />,
  CheckCircle: <CheckCircle size={20} />,
};

export default function ProfileCard({
  role,
  subtitle,
  accent,
  cta,
  steps,
}: ProfileDef) {
  const isSapin = accent === "sapin";
  const headerBg = isSapin ? "bg-sapin" : "bg-peach";
  const btnVariant = isSapin ? "sapin-outline" : "peach-outline";
  return (
    <div className="rounded-2xl overflow-hidden shadow-md flex flex-col">
      <div className={`${headerBg} px-6 pt-6 pb-8 sm:px-8 sm:pt-7`}>
        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold tracking-wide mb-4 bg-cream/15 text-cream">
          {role}
        </span>
        <p className="font-bold text-cream leading-snug">{subtitle}</p>
      </div>

      <div className="bg-lime/5 flex flex-col flex-1">
        <div className="px-6 pt-6 sm:px-8 flex-1">
          {steps.map((step, i) => (
            <StepItem
              key={step.title}
              icon={iconMap[step.icon]}
              title={step.title}
              description={step.description}
              isLast={i === steps.length - 1}
              accent={accent}
            />
          ))}
        </div>

        <div className="px-6 sm:px-8 py-5">
          <Btn
            label={cta.label}
            href="./dashboard"
            variant={btnVariant}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
