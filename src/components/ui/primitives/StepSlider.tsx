"use client";

interface StepSliderProps {
  steps: readonly string[];
  value: number;
  onChange: (index: number) => void;
  label: string;
  disabled?: boolean;
}

export default function StepSlider({ steps, value, onChange, label, disabled }: StepSliderProps) {
  const max = steps.length - 1;
  const percent = (value / max) * 100;
  const isOff = value === 0;

  return (
    <div className={`flex flex-col gap-2 w-full transition-opacity ${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-sapin">{label}</span>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-colors ${isOff
            ? "text-sapin/50 bg-sapin/8 border-sapin/20"
            : "text-sapin bg-lime/60"
            }`}
        >
          {steps[value]}
        </span>
      </div>

      <div className="relative h-10 flex items-center select-none">
        <div className="absolute w-full h-1.5 bg-sapin/10 rounded-full" />
        <div
          className={`absolute h-1.5 rounded-full transition-all duration-150 ${isOff ? "bg-sapin/20" : "bg-sapin"}`}
          style={{ width: `${percent}%` }}
        />
        <div
          className={`absolute w-5 h-5 rounded-full border-2 border-cream shadow-md -translate-x-1/2 transition-all duration-150 pointer-events-none ${isOff ? "bg-sapin/30" : "bg-sapin"
            }`}
          style={{ left: `${percent}%` }}
        />
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="absolute w-full h-10 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label={`${label} : ${steps[value]}`}
        />
      </div>

      <div className="flex justify-between">
        {steps.map((step, i) => (
          <span
            key={i}
            className={`text-sm font-bold leading-none transition-colors ${value === i ? "text-sapin font-bold" : "text-sapin/40"
              }`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
