import type { ReactNode } from "react";

type Props = {
  title: string;
  price: number;
  unit?: string;
  periodLabel?: string;
  description: ReactNode;
};

export default function SubscriptionPricingCard({
  title,
  price,
  unit = "€",
  periodLabel,
  description,
}: Props) {
  return (
    <div className="bg-lime/5 border-2 border-sapin rounded-2xl shadow-[4px_4px_0_0_#06573F] p-6 flex flex-col gap-3 mb-2">
      <h3 className="text-sm font-black text-sapin uppercase tracking-widest">
        {title}
      </h3>
      <p className="text-4xl font-black text-sapin tracking-tight">
        {price} {unit}
        {periodLabel && (
          <span className="text-base font-normal text-sapin/60">
            {" "}
            {periodLabel}
          </span>
        )}
      </p>
      <p className="text-sapin/80 text-sm leading-relaxed mt-1">
        {description}
      </p>
    </div>
  );
}
