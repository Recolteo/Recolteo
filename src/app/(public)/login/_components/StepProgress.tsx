import { Fragment } from "react";

const LABELS = ["Votre compte", "Votre structure"] as const;

export function StepProgress({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2">
      {([1, 2] as const).map((n, i) => (
        <Fragment key={n}>
          <div
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              step === n
                ? "text-sapin"
                : step > n
                  ? "text-sapin/60"
                  : "text-sapin/25"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                step > n
                  ? "bg-sapin border-sapin text-cream"
                  : step === n
                    ? "border-sapin bg-sapin/10 text-sapin"
                    : "border-sapin/20 text-sapin/30"
              }`}
            >
              {step > n ? "✓" : n}
            </span>
            {LABELS[n - 1]}
          </div>
          {i === 0 && (
            <div
              className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
                step > 1 ? "bg-sapin/40" : "bg-sapin/10"
              }`}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
