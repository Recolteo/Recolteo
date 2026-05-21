import Reveal from "@/src/components/animations/Reveal";
import LotForm from "./LotForm";
import type { LotFormProps } from "./types";

export default function LotFormSection(props: LotFormProps) {
  return (
    <Reveal delay={0.1}>
      <div className="bg-white border-2 border-sapin/10 rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_8%,transparent)]">
        <LotForm {...props} />
      </div>
    </Reveal>
  );
}
